import os
from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from fastapi.responses import JSONResponse
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field
import secrets
import uvicorn
import logging
import aiohttp
import asyncio
from typing import Dict, Any, List
from minio_sync import minio_maintenance

# Setup logging
logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class Settings(BaseSettings):
    app_name: str = Field(default="MinIO Sync Webhook", env="APP_NAME")
    admin_username: str = Field(default="admin", env="ADMIN_USERNAME")
    admin_password: str = Field(default="admin", env="ADMIN_PASSWORD")
    port: int = Field(default=5000, env="PORT")
    mattermost_webhook_url: str = Field(default="https://chat.tapsi.shop/hooks/8kmkp7s5cirz9b3qdfhioaudqe", env="MATTERMOST_WEBHOOK_URL")

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

settings = Settings()
app = FastAPI(title=settings.app_name)
security = HTTPBasic()

async def send_mattermost_notification(message: str):
    if settings.mattermost_webhook_url:
        async with aiohttp.ClientSession() as session:
            try:
                await session.post(settings.mattermost_webhook_url, json={"text": message})
            except Exception as e:
                logger.error(f"Failed to send Mattermost notification: {e}")
    else:
        logger.warning("Mattermost webhook URL not set. Skipping notification.")

def format_notifications(notifications: List[Dict[str, str]]) -> str:
    formatted_message = "### MinIO Sync Report\n\n"
    
    summary = next((n for n in notifications if n['type'] == 'summary'), None)
    if summary:
        formatted_message += f"**{summary['message']}**\n\n"
    
    for notification in notifications:
        if notification['type'] == 'summary':
            continue  # We've already added the summary at the top
        
        icon = "✅" if notification["type"] == "success" else "❌" if notification["type"] == "error" else "ℹ️"
        formatted_message += f"{icon} {notification['message']}\n"
    
    return formatted_message

def authenticate(credentials: HTTPBasicCredentials = Depends(security)) -> str:
    is_correct_username = secrets.compare_digest(credentials.username, settings.admin_username)
    is_correct_password = secrets.compare_digest(credentials.password, settings.admin_password)
    if not (is_correct_username and is_correct_password):
        asyncio.create_task(send_mattermost_notification("❌ Failed authentication attempt for MinIO sync"))
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return credentials.username

@app.post("/minio/sync")
async def minio_sync(request: Request, username: str = Depends(authenticate)) -> JSONResponse:
    client_host = request.client.host
    logger.info(f"Received sync request from {username} at {client_host}")
    try:
        result = await minio_maintenance()
        logger.info(f"MinIO sync completed for {username}")
        
        # Format and send a single notification
        formatted_message = format_notifications(result["notifications"])
        await send_mattermost_notification(formatted_message)
        
        return JSONResponse(content={
            "status": "success",
            "message": "MinIO sync completed",
            "result": result
        })
    except Exception as e:
        error_message = f"MinIO sync failed for {username}: {str(e)}"
        logger.error(error_message)
        await send_mattermost_notification(f"❌ {error_message}")
        return JSONResponse(
            content={"status": "error", "message": "MinIO sync failed", "error": str(e)},
            status_code=500
        )

@app.get("/health")
async def health_check() -> Dict[str, str]:
    return {"status": "healthy"}

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    error_message = f"Unhandled exception: {str(exc)}"
    logger.error(error_message)
    await send_mattermost_notification(f"❌ {error_message}")
    return JSONResponse(
        status_code=500,
        content={"message": "An unexpected error occurred."}
    )

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=settings.port, reload=False)