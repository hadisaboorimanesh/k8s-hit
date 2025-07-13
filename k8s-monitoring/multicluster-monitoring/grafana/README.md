# <br>Grafan Helm chart<br>
for install Grafana dashbord , change this parts in the **value.yaml** file:
#### <br>**1-Datasource**:
scecify the datasource of grafana dashbord:
for instance set querier as datasource http://querier.dc.afranet.prod/ 
:
```
datasources: 
 datasources.yaml:
   apiVersion: 1
   datasources:
   - name: Prometheus
     type: prometheus
     url: http://querier.dc.afranet.prod/
     access: proxy
     isDefault: true
```
#### **2-DashboardProviders**
In this configuration dashbords will be stored in */var/lib/grafana/dashboards/default* path in grafana pod.
```
dashboardProviders: 
 dashboardproviders.yaml:
   apiVersion: 1
   providers:
   - name: 'default'
     orgId: 1
     folder: ''
     type: file
     disableDeletion: false
     editable: true
     options:
       path: /var/lib/grafana/dashboards/default
```
#### **3-Dashbords**
Specify the mehtod of persistenting dashbords in  grafana pod , dashbords can pass as Raw_JSON , Files or directly form git repository. 
for instance you can put **dashbords.json** files in /dashbords directory and address them in custom-dashbord section. 
```
dashboards: 
   default:
  #   some-dashboard:
  #     json: |
  #       $RAW_JSON
    custom-dashboard_1:
       file: dashboards/node-dashbord.json
    custom-dashboard_2:
       file: dashboards/kube-state-metric.json
    custom-dashboard_3:
       file: dashboards/kube-pod-metric.json
  #   prometheus-stats:
  #     gnetId: 2
  #     revision: 2
  #     datasource: Prometheus
  #   local-dashboard:
  #     url: https://example.com/repository/test.json
  #     token: ''
  #   local-dashboard-base64:
  #     url: https://example.com/repository/test-b64.json
  #     token: ''
  #     b64content: true
  #   local-dashboard-gitlab:
  #     url: https://example.com/repository/test-gitlab.json
  #     gitlabToken: ''
  #   local-dashboard-bitbucket:
  #     url: https://example.com/repository/test-bitbucket.json
  #     bearerToken: ''
  #   local-dashboard-azure:
  #     url: https://example.com/repository/test-azure.json
  #     basic: ''
  #     acceptHeader: '*/*'
```

