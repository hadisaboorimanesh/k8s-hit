From registry.access.redhat.com/ubi8

WORKDIR /tmp

COPY . .
RUN  mkdir -p  /custom-tools && mv /tmp/argocd-vault-plugin /custom-tools/ && chmod +x  /custom-tools/argocd-vault-plugin

# Optionally, you can move it to a directory in your PATH
# Verify the installation
