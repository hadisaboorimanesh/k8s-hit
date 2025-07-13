# Build  kibana

# Due to the problem of the node module not being available in Kiana in higher versions, the node module was installed using a Docker file and rebuilt with version 8.17.1.


```
    docker build . -t docker.hasti.co/library/kibana:8.17.1
```

