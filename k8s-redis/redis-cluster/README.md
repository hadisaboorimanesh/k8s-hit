NAME: redis
LAST DEPLOYED: Wed Jul 24 17:16:37 2024
NAMESPACE: redis-cls-develop
STATUS: deployed
REVISION: 1
TEST SUITE: None
NOTES:
CHART NAME: redis-cluster
CHART VERSION: 9.5.2
APP VERSION: 7.2.4** Please be patient while the chart is being deployed **


To get your password run:
    export REDIS_PASSWORD=$(kubectl get secret --namespace "redis-cls-develop" redis-redis-cluster -o jsonpath="{.data.redis-password}" | base64 -d)

You have deployed a Redis&reg; Cluster accessible only from within you Kubernetes Cluster.INFO: The Job to create the cluster will be created.To connect to your Redis&reg; cluster:

1. Run a Redis&reg; pod that you can use as a client:
kubectl run --namespace redis-cls-develop redis-redis-cluster-client --rm --tty -i --restart='Never' \
 --env REDIS_PASSWORD=$REDIS_PASSWORD \
--image docker-proxy.hasti.co/bitnami/redis-cluster:7.2.4-debian-11-r5 -- bash

2. Connect using the Redis&reg; CLI:

redis-cli -c -h redis-redis-cluster -a $REDIS_PASSWORD


password = FMC9IjuQfN