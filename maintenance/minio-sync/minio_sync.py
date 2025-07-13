import subprocess
import re
import logging
import asyncio
import os
from typing import Dict, Any

logger = logging.getLogger(__name__)

async def run_command(cmd):
    process = await asyncio.create_subprocess_shell(
        cmd,
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE
    )
    stdout, stderr = await process.communicate()
    if process.returncode != 0:
        raise subprocess.CalledProcessError(process.returncode, cmd, stdout, stderr)
    return stdout.decode().strip()

async def get_docker_logs():
    cmd = "docker logs data-mc-1 2>&1 | grep -i error || true"
    try:
        result = await run_command(cmd)
        return result.splitlines()
    except subprocess.CalledProcessError as e:
        logger.error(f"Error getting docker logs: {e}")
        return []

def extract_paths(error_line):
    source_match = re.search(r'`http://minio:9000/(.+?)`', error_line)
    dest_match = re.search(r'"https://s3\.ir-thr-at1\.arvanstorage\.ir/(.+?)"', error_line)
    if source_match and dest_match:
        source = f"myminio/{source_match.group(1)}"
        dest = f"arvans3/{dest_match.group(1)}"
        return source, dest
    return None, None

async def copy_file(source, dest):
    cmd = f"docker exec data-mc-1 mc cp {source} {dest}"
    await run_command(cmd)

async def restart_container():
    docker_compose_path = "/data/docker-compose.yml"
    if not os.path.exists(docker_compose_path):
        raise FileNotFoundError(f"Docker Compose file not found at {docker_compose_path}")
    
    stop_cmd = "docker stop data-mc-1"
    rm_cmd = "docker rm data-mc-1"
    up_cmd = f"docker-compose -f {docker_compose_path} up -d"
    
    try:
        await run_command(stop_cmd)
        logger.info("Container stopped successfully")
    except subprocess.CalledProcessError as e:
        logger.warning(f"Error stopping container: {e}")
    
    try:
        await run_command(rm_cmd)
        logger.info("Container removed successfully")
    except subprocess.CalledProcessError as e:
        logger.warning(f"Error removing container: {e}")
    
    await run_command(up_cmd)
    logger.info("Container restarted successfully")

async def minio_maintenance() -> Dict[str, Any]:
    logger.info("Starting MinIO maintenance...")
    notifications = []
    error_logs = await get_docker_logs()
    copied_files = []
    errors = []

    if not error_logs:
        notifications.append({"type": "info", "message": "No errors found in Docker logs. No files to sync."})

    for line in error_logs:
        source, dest = extract_paths(line)
        if source and dest:
            try:
                await copy_file(source, dest)
                success_msg = f"Successfully copied {source} to {dest}"
                logger.info(success_msg)
                copied_files.append(f"{source} to {dest}")
                notifications.append({"type": "success", "message": success_msg})
            except subprocess.CalledProcessError as e:
                error_msg = f"Error copying {source} to {dest}: {e}"
                logger.error(error_msg)
                errors.append(error_msg)
                notifications.append({"type": "error", "message": error_msg})
        else:
            error_msg = f"Failed to extract paths from error log: {line}"
            logger.error(error_msg)
            errors.append(error_msg)
            notifications.append({"type": "error", "message": error_msg})

    try:
        await restart_container()
        restart_msg = "Container restarted successfully"
        logger.info(restart_msg)
        notifications.append({"type": "info", "message": restart_msg})
    except Exception as e:
        error_msg = f"Error restarting container: {e}"
        logger.error(error_msg)
        errors.append(error_msg)
        notifications.append({"type": "error", "message": error_msg})

    summary = f"MinIO maintenance completed. Files synced: {len(copied_files)}, Errors: {len(errors)}"
    notifications.append({"type": "summary", "message": summary})

    return {
        "copied_files": copied_files,
        "errors": errors,
        "container_restarted": "Container restarted successfully" if not errors else "Failed to restart container",
        "notifications": notifications
    }

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO,
                        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    result = asyncio.run(minio_maintenance())
    print(result)