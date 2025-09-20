1. add requirement file from storage to directory
```bash
s3cmd get s3://models/nsfw/roberta-clasification.pt ./parsdetoxer/
```

2. build
```bash
docker build --build-arg PORT=9050 -t nsfw:latest .
```

3. run

```bash
docker run -e PORT=9050 --name=nsfw -p 9050:9050 nsfw:latest
```
