##### 
```
 https://github.com/dsayan154/thanos-receiver-demo/blob/master/manifests/prometheus-tenant-a.yaml
https://github.com/observatorium/thanos-receive-controller/tree/main?tab=readme-ov-file
https://github.com/kvendingoldo/thanos-receiver-helm/blob/main/thanos-receiver/templates/deployment.yaml

```


# Installing Multicluster Monitoring using Thanos

## Cluster Configuration
1. Tenant A: Prometheus-Thanos Implementation on Tenant-A that is our primary monitoring cluster
2. Tenant B: Prometheus Configure to remote-write metrics to thanos-receiver in tenant-a

In this documentation we have 2 k8s cluster that include one primary(tenant-a) and secondary(tenant-b). Whatever to
to monitor Afranet infrastructure you should to configure 4 tenants, you can check it in hashring.json.
No matter how much tenant we have to monitor, We always have a one tenant as a primary to configure thanos and other 
tenants just writing metrics or logs to primary tenent(tenant-a)

```json
[
     {
        "hashring": "tenant-a",
        "endpoints": [
            "receiver-store-1.monitoring.svc.cluster.local:10907"
        ],
        "tenants": ["a"]
     },
     {
        "hashring": "tenant-b",
        "endpoints": [
            "receiver-store-2.monitoring.svc.cluster.local:10907"
        ],
        "tenants": ["b"]
     },
     {
        "hashring": "tenant-c",
        "endpoints": [
            "receiver-store-3.monitoring.svc.cluster.local:10907"
        ],
        "tenants": ["c"]
     },
     {
        "hashring": "tenant-d",
        "endpoints": [
            "receiver-store-4.monitoring.svc.cluster.local:10907"
        ],
        "tenants": ["d"]
     }
   ]
```
## Primary cluster configuration (Prod-management k8s cluster = Tenant-A)
### Step 0
- Create an k8s secret to connect to S3 bucket, thanos/objectstore.yaml.
```commandline
kubectl apply -f thanos/objectstore.yaml
```
### Step 1 - Tenant A(Primary cluster)
- Apply step by step in primary cluster(Tenant-a) in our case is prod-management cluster.
- Apply receivers/hashring.yaml, receivers/receiver-write-service.yaml.
```commandline
kubectl apply -f receivers/hashring.yaml -n monitoring
kubectl apply -f receivers/receiver-write-service.yaml -n monitoring
```
- Apply receiver tenant-a.
```commandline
kubectl apply -f receivers/receiver-1 -n monitoring
```
- Apply all thanos components include(querier,store and compactor) 
```commandline
kubectl apply -f thanos/ -n monitoring
```
- Configure Prometheus remote-write to write metrics to this endpoint(remote-write.dc.afranet.prod)

Set key-value custom headers to split metrics per tenant and clusters while arrangement it in hashring thanos-receiver.
helm-prometheus/prod-management/values.yaml:

```yaml
remoteWrite:
  - url: "http://remote-write.dc.afranet.prod/api/v1/receive"
    headers:
      THANOS-TENANT: a
      cluster: prod-management
```
- Install Prometheus service: 
```commandline
helm install prometheus helm-prometheus/ -f helm-prometheus/prod-management/values.yaml -n monitoring
```

### Important Note:
```text
Now The Prometheus and Thanos services are installed and configured in the primary cluster(prod-management). To monitor
the other k8s cluster we only need to install Prometheus and configure it to remote-write the metrics to Thanos-receiver-
write-service that is available via this endpoint: http://remote-write.dc.afranet.prod/api/v1/receive
```

## Join a secondary cluster to primary (Production k8s cluster = Tenant-B)

### Step1- Apply this configuration on Primary cluster Tenant-A (Prod-management) 
- Apply receiver tenant-b in primary-cluster (prod-management).
```commandline
kubectl apply -f receivers/receiver-2 -n monitoring
```
- Edit and Redeploy thanos querier deployment in primary-cluster to add receiver-store-2 endpoint (prod-management)
Open the file thanos/1-querier-deployment.yaml and add ``` --endpoint=dnssrv+receiver-store-2:10907 ``` to end of the 
query args.
```yaml
      containers:
        - name: querier
          image: docker.dc.afranet.co/bitnami/thanos:0.32.0
          args:
            - query
            - --log.level=info
            - --endpoint.info-timeout=10m
            - --grpc-address=0.0.0.0:10901
            - --http-address=0.0.0.0:10902
            - --query.replica-label=prometheus_replica
            - --endpoint=dnssrv+_grpc._tcp.storegateway
            - --endpoint=dnssrv+receiver-store-1:10907
            - --endpoint=dnssrv+receiver-store-2:10907   
```
### Step2- Apply this configuration on Secondary cluster Tenant-B (Production k8s cluster) 
- Install and configure Prometheus in Production cluster Tenant-B

Configure Prometheus in Secondary-cluster remote-write to write metrics to this endpoint(remote-write.dc.afranet.prod)
Set key-value custom headers to split metrics per tenant and clusters while arrangement it in hashring thanos-receiver.

helm-prometheus/production/values.yaml:

```yaml
remoteWrite:
  - url: "http://remote-write.dc.afranet.prod/api/v1/receive"
    headers:
      THANOS-TENANT: b
      cluster: production
```
- Install Prometheus service: 
```commandline
helm install prometheus helm-prometheus/ -f helm-prometheus/production/values.yaml -n monitoring
```

## Install Grafana
Apply the Grafana helm chart directory.

## Result
Now we can access to our grafana dashboards and monitor all k8s clusters via one central grafana datasource(Thanos).
To see this monitoring architecture design click here: https://documents.dc.afranet.co/pages/viewpage.action?spaceKey=ADI&title=New+Monitoring+Topology
