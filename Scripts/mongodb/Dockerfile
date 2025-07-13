# Filename: Dockerfile
# Use a lightweight base image like ubuntu:20.04 or debian:bullseye
FROM docker.hasti.co/mongodb/mongodb-community-server:latest

# Avoid interactive prompts during package install
ENV DEBIAN_FRONTEND=noninteractive

COPY  mc  /usr/bin/mc
#RUN chmod +x /usr/bin/mc

# 4. Create a working directory

# 5. Copy any custom scripts (if you have them) into the container
# COPY backup.sh /usr/local/bin/backup.sh
# RUN chmod +x /usr/local/bin/backup.sh

# 6. Set entrypoint or command (this is optional; you can also define in CronJob)
#CMD [ "bash" ]
