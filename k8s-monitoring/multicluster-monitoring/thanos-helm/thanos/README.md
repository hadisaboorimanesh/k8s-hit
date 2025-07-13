Thanos Helm Chart

This Helm chart installs the Thanos monitoring system in a Kubernetes cluster.
Prerequisites

    Kubernetes 1.16+
    Helm 3.0+

Installing the Chart

To install the chart with the default configuration, run:

helm install thanos ./thanos

The command deploys Thanos on the Kubernetes cluster in the default configuration. The configuration section lists the parameters that can be configured during installation.
Uninstalling the Chart

To uninstall/delete the thanos deployment:

helm uninstall thanos


Configuration

The following table lists the configurable parameters of the Thanos chart and their default values.
Parameter	                            Description	                                            Default

image.repository	                   Thanos image repository	                       docker.io/thanos

image.tag	                           Thanos image tag	                                    v0.22.0

image.pullPolicy	                   Thanos image pull policy	                       IfNotPresent

image.pullSecrets	                   Thanos image pull secrets	                       [](does not add image pull secrets to deployed pods)

querier.replicas	                   Number of querier replicas	                               1

querier.resources	                   Querier resource requests and limits	               {} (no resource requests or limits)

storegateway.replicas	                   Number of storegateway replicas	                       1

storegateway.resources	                   Storegateway resource requests and limits	       {} (no resource requests or limits)

compactor.replicas	                   Number of compactor replicas	                               1

compactor.resources	                   Compactor resource requests and limits	       {} (no resource requests or limits)

objstore.config                            Object store configuration	                       {} (empty config)

sidecar.resources	                   Sidecar resource requests and limits                {} (no resource requests or limits)

sidecar.extraArgs	                   Sidecar extra arguments	                       {} (empty map)

sidecar.extraEnv	                   Sidecar extra environment variables                 {} (empty map)

sidecar.extraVolumes	                   Sidecar extra volumes	                       [] (empty list)

sidecar.extraVolumeMounts	           Sidecar extra volume mounts	                       [] (empty list)

sidecar.image.repository	           Sidecar image repository	                       docker.io/thanos

sidecar.image.tag	                   Sidecar image tag	                                    v0.22.0

sidecar.image.pullPolicy	           Sidecar image pull policy	                       IfNotPresent

sidecar.image.pullSecrets                  Sidecar image pull secrets	                      [] (does not add image pull secrets to deployed pods)

ingress.enabled	                           Enable Ingress resource	                             false

ingress.annotations	                   Ingress annotations	                              {} (empty map)

ingress.hosts	                           Ingress hosts	                              [] (empty list)

ingress.tls	                           Ingress TLS configuration	                      [] (empty list)

service.type	                           Service type	                                      ClusterIP
