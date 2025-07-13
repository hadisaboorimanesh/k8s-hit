# Jaeger Tracing - All In One

## Introduction

The Jaeger tracing all-in-one service enables jaeger for development purposes, check out:
- https://www.jaegertracing.io/docs/1.18/getting-started/

## Installing the Chart

To install the chart with the release name `jaeger-all-in-one` run:

```bash
$ helm repo add jaeger-all-in-one https://raw.githubusercontent.com/hansehe/jaeger-all-in-one/master/helm/charts
$ helm install jaeger-all-in-one jaeger-all-in-one/jaeger-all-in-one
```

Alternatively, a YAML file that specifies the values for the parameters can be provided while installing the chart. For example,

```bash
$ helm install jaeger-all-in-one -f values.yaml jaeger-all-in-one/jaeger-all-in-one
```

## Configuration

Find all possible configuration values here:
- https://github.com/hansehe/jaeger-all-in-one/blob/master/helm/jaeger-all-in-one/values.yaml



### add agent to container section :

        - name: jaeger-agent
          image: docker-proxy.hasti.co/jaegertracing/jaeger-agent:latest
          imagePullPolicy: IfNotPresent
          ports:
            - containerPort: 5775
              name: zk-compact-trft
              protocol: UDP
            - containerPort: 5778
              name: config-rest
              protocol: TCP
            - containerPort: 6831
              name: jg-compact-trft
              protocol: UDP
            - containerPort: 6832
              name: jg-binary-trft
              protocol: UDP
            - containerPort: 14271
              name: admin-http
              protocol: TCP
          args:
            - --reporter.grpc.host-port=dns:///jaeger-jaeger-all-in-one.jaeger.svc.cluster.local:14250
            - --reporter.type=grpc