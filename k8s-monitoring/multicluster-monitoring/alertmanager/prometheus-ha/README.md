

### https://www.metricfire.com/blog/remote-prometheus-monitoring-using-thanos/
------------------------------------------------------------
# Kubernetes Monitoring using Prometheus and Thanos

We are monitoring multiple clusters (prod, staging etc) from a single Ops Cluster. However, at the same time the monitoring set-up in each cluster is very robust and complete and we can view those metrics separately as well should the need arise.


## Deploy Prometheus-ha to monitor cluster 

```
helm install prometheus-ha prometheus-ha/ 
```

## HA Kubernetes Monitoring using Prometheus and Thanos

### 1. Configuration
```text
- Create kubernetes secret using the S3 Bucket credentials, `kubectl apply -f thanos-s3-credentials.yaml` This secret name is also set in values.yaml
- Update alertmanager configuraton at `configs/alertmanager-config.yaml` with appropriate alert delivery endpoints
- Make sure you set prometheus cluster name in the `values.yaml`
```   

###  2. Deployment:
```commandline
Helm Install helm upgrade --install <RELEASE_NAME> prometheus-ha/
```

###  3. Grafana Dashboard:
```text
- Access grafana at `grafana.dc.afranet.lab`
- If ingress disabled, `kubectl -n monitoring port-forward service/grafna 3000` , now go to `http://localhost:3000`
- All your dashboards will be present.
```
###  4. Thanos Dashboards
```text
- Thanos-query with de-deuplicated data at thanos-query.dc.afranet.lab
- Thanos-ruler at thanos-ruler.dc.afranet.lab
- Alermanager at alertmanager.dc.afranet.lab
```

### Note:

**.** Whenever prometheus config map is updated thanos automatically reloads all prometheus servers so no manual update needed.

**.** Some basic alerting rules are defined in the prometheus rules file which can be updated before deploying. You can also add more rules under the same groups or create new ones.

**.** Please update alertmanager config map with appropriate alert delivery endpoints.

**.** Instead of GCS as long term storage you can also use S3. Refer Thanos docs for the config change.


## To monitor another kubernetes cluster in the same pane do the following:
  
### Now, in order to monitor another kubernetes cluster in the same pane do the following:
Deploy all the components except for Grafana in your second cluster. 

1. Make sure you update the cluster name in the values.yaml at prometheus.clusterName.

2. Expose Thanos querier on port 10901 of the second cluster to be accessible from the first cluster. update values.yaml
of second cluster to enable scrape service for thanso-query. 

```yaml
query:
    ...
    scrape:
      enabled: enable
      type: LoadBalancer
```

3. Update the Querier deployment in the first cluster to query metrics from the second cluster.  
This can be done by adding the Thanos-Query endpoint[thanos-query-scrape service] (alternatively Store endpoint can also be used) 
to Querier deployment of the first cluster.
This parameter can be set in the values.yaml as thanos.query.extraArgs.

```yaml
# Update the querier container's argument and add the following
 query:
    ...
    # Other Query or Store Endpoints which need to be stacked should be specified here.
    extraArgs: {
    # store: EXTERNAL_IP_ADDRESS_OF_THANOS_QUERY_SCRAPE_SERVICE:<PORT>               
      store: 172.24.8.120:10901
    }
```
#### Alternative solution to expose thans-query-scrape service with ClusterIP type.

After changing thanos-query-scrape service-type to ClusterIP in step 2 of previous section, We have to deploy  
an IngressRoutTCP to expose query service and set workers node ip address instead of external-ip-address in step 3 
of previous section.
```yaml
---
apiVersion: traefik.containo.us/v1alpha1
kind: IngressRouteTCP
metadata:
  name: thanos-query-ingress
  namespace: monitoring
  labels:
    app: thanos-querier
spec:
  entryPoints:
  - tcpep
  routes:
  - match: HostSNI(`*`)
    services:
    - name: thanos-querier-scrape
      port: 10901
```

### Check Endpoints Availability 

Once the querier deployment is updated the new store gateway should appear under Stores tab on the thanos-query-Dashboard.

You should be able to access thanos querier at thanos-querier.dc.afranet.lab

All the available stores should appear on the Thanos Query dashboard. 

## Add or import new dashboards to Grafana
In order to import new dashboards to Grafana, you have to observe prometheus-thanos multi clustering dashboard pattern 
policies.
1. First import new dashboard to Grafana via UI and check to being useful and user-friendly
2. Then add .json file to configs/ directory and modify it to support multi clustering monitoring (you can get idea from
other dashboard .json files)
3. After that you have to add your .json file's name to templates/grafana-dash-configmap.yaml
4. Now it's time to upgrade prometheus-ha helm chart via this command. 
```shell
helm upgrade prometheus-ha prometheus-ha/ 
```
5. The changes being affected after restarting the grafana-0 pod.

 
# Conclusion

Integrating Thanos with Prometheus allows you to scale Prometheus horizontally. Since Thanos Querier can pull metrics from other querier instances, you can pull metrics across clusters and visualize them in Grafana dashboards. Thanos lets us archive metric data in an object store that provides infinite storage for our monitoring system. It also serves metrics from the object storage itself. A major operating cost for this setup can be attributed to the object storage (S3 or GCS). This can be reduced if we apply appropriate retention policies to them. 
