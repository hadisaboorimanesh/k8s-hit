# Use the official Kibana 8.16.4 image as the base
FROM docker-proxy.hasti.co/library/kibana:8.17.3

# Switch to root user to install dependencies
USER root

# Install xz-utils (required to extract .tar.xz files)
RUN apt-get update && \
    apt-get install -y xz-utils curl && \
    rm -rf /var/lib/apt/lists/*

# Install Node.js (if missing)
RUN mkdir -p /usr/share/kibana/node && \
    curl -sL https://nodejs.org/dist/v16.20.2/node-v16.20.2-linux-x64.tar.xz | tar -xJ -C /usr/share/kibana/node --strip-components=1 && \
    ln -s /usr/share/kibana/node/bin/node /usr/local/bin/node && \
    ln -s /usr/share/kibana/node/bin/npm /usr/local/bin/npm

# Verify Node.js installation
RUN node -v && npm -v

# Switch back to the kibana user
USER kibana

# Set the working directory
WORKDIR /usr/share/kibana

# Expose the default Kibana port
EXPOSE 5601

# Start Kibana
CMD ["/usr/local/bin/kibana-docker"]

