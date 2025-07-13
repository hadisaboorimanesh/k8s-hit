
### please Install and  configuration  vault

```
cd vault
helm install vault . -n vault --create-namespace

```
### How to  unseal vault

```
kubectl exec vault-0 -- vault operator init -key-shares=1 -key-threshold=1 -format=json > vault-cluster-keys.json

cat vault-cluster-keys.json

kubectl exec vault-0 -- vault operator unseal bplXOIv6WJns88plzwcFgUDKP9edHLLlT2pzy1h4QTQ=

```
### How to  create and pull Kv 

### You  can  create and pull Kv using UI

```
kubectl exec vault-0  -- vault login  $TOKEN      #### s.FrMQR553OR3rTJPGGn1Vm98p ####
kubectl exec vault-0 -- vault secrets enable  kv-v2
kubectl exec vault-0  -- vault kv enable-versioning kv-v2
vault kv put kv-v2/mysql username=UserName

vault kv  get   kv-v2/MySQL

```

### Requirments for  Argo Vault Plugin 

```
cd argocd 
vi  secret.yaml

##  For Vault Token Authentication, these are the required parameters:

VAULT_ADDR: Your HashiCorp Vault Address
VAULT_TOKEN: Your Vault token
AVP_TYPE: vault
AVP_AUTH_TYPE: token


###  So let's create a Kubernetes secret named vault-configuration using the following:

apiVersion: v1
kind: Secret
metadata:
  name: vault-configuration
  namespace: argocd
data:
  VAULT_ADDR: aHR0cDovL3ZhdWx0LnZhdWx0OjgyMDA=
  VAULT_TOKEN: cy5CajZEZGdObE9xNHRscjdnUkxPVDdQU3g=
  AVP_TYPE: dmF1bHQ=
  AVP_AUTH_TYPE: dG9rZW4=
type: Opaque


### kubectl apply -f secret.yaml -n argocd
### kubectl apply -f cmp-plugin.yaml -n argocd

```
### How to  install argcd  and install  vault plugin 

```
cd k8s-argocd
helm  upgrade  argocd . -f  values-vault.yaml -n argocd

```
### Similarly, let’s say we want to create a secret in GitOps way, then we can use the path to secret as annotation in secret and get a username and password like this:

```
apiVersion: v1
kind: Secret
metadata:
  name: mysecret
  annotations:
    avp.kubernetes.io/path: "kv-v2/data/argocd"                   #Fomat should be like this with key 
type: Opaque
stringData:
  TOKEN: <password>           					  #Fomat should be like this with key 

```
###  After this, we can create an application CRD to deploy the application. As we have installed the plugin using sidecar we will not use the plugin name. And we can use the path to a secret like this.
```

apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: argocd-vault-plugin
  namespace: argocd
spec:
  destination:
    namespace: test
    server: https://kubernetes.default.svc
  project: default
  source:
    path: .
    repoURL: https://github.com/hadisaboorimanesh/mysql.git
    targetRevision: HEAD
    plugin:
      name: argocd-vault-plugin
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
      - CreateNamespace=true

```





