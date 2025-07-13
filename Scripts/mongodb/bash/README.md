
### How to take a full backup of a Mongo database
```
 /mongo/mongo-backup/mongo-backup.sh  full &   

```
### How to take a Incremantal  backup of a Mongo database

```
/mongo/mongo-backup/mongo-backup.sh incremental
```
### How to restore a full backup 
```
MINIO_URL="https://minio-k8s-api.hasti.co"
MINIO_ACCESS_KEY=""
MINIO_SECRET_KEY=""
BUCKET_NAME="mongodb-backups"

mc alias set myminio "$MINIO_URL" "$MINIO_ACCESS_KEY" "$MINIO_SECRET_KEY"

mc cp "myminio/${BUCKET_NAME}/full/mongo_backup_20250504_151833.gz" "./mongo_backup_20250504_151833.gz"
mongorestore --uri="$MONGODB_URI" --gzip --archive=mongo_backup_20250504_151833.gz --oplogReplay
```
### How to restore the OP log?

```

MINIO_URL="https://minio-k8s-api.hasti.co"
MINIO_ACCESS_KEY=""
MINIO_SECRET_KEY=""
BUCKET_NAME="mongodb-backups"

mc alias set myminio "$MINIO_URL" "$MINIO_ACCESS_KEY" "$MINIO_SECRET_KEY"

mc cp --recursive  "myminio/${BUCKET_NAME}/oplog/oplog_20250506_160742" "./"
mkdir dump
mongorestore --uri="$MONGODB_URI" --oplogReplay --oplogFile=oplog_20250506_160742/local/oplog.rs.bson.gz  --gzip  --dir dump

```
