# To Get Pod Resource usage from metric server
----------------------------------------------------

TOKEN=$(cat /var/run/secrets/kubernetes.io/serviceaccount/token)

specific pod:
---------------
curl -sk -H "Authorization: Bearer $TOKEN" https://kubernetes.default.svc/apis/metrics.k8s.io/v1beta1/namespaces/<NAMESPACE_NAME>/pods/<POD-NAME>


allpods in namespace:
--------------------
curl -sk -H "Authorization: Bearer $TOKEN" https://kubernetes.default.svc/apis/metrics.k8s.io/v1beta1/namespaces/<NAMESPACE_NAME>/pods


get pod detail:
--------------------
curl -sk -H "Authorization: Bearer $TOKEN" https://kubernetes.default.svc/api/v1/namespaces/<NAMESPACE_NAME>/pods/<POD-NAME>