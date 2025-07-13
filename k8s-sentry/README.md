# Introduction 
Implementation Sentry on Kubernetes cluster using helm. 

# Installation

1.	Apply a secret for sentry-admin-password 

```
kubectl apply -f ./sentry-admin-password.yaml 
```

2. Apply a secret for sentry-mail-password (using to invite the users to projects)

```
kubectl apply -f ./mail-password.yaml
```
3.	Install the sentry with your own values file

```
helm install sentry ./sentry -n sentry -f ./values.yaml --wait --timeout=1000s
```