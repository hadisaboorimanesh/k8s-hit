#!/bin/bash

# Configuration
MONGODB_URI="mongodb://hasti:Ika43NatY4kp7MCgn4B9QRuU38zMT9PD@172.31.52.41:27017,172.31.52.43:27017,172.31.52.44:27017,172.31.52.45:27017/?replicaSet=rs0&readPreference=secondary&connectTimeoutMS=10000&authSource=admin"
MINIO_URL="https://minio-k8s-api.hasti.co"
MINIO_ACCESS_KEY="Sy2mOvLBUu0ntZtQ"
MINIO_SECRET_KEY="ZTgqduIXcXweh7MHdAxm7zpmgXJ4oWsZ"
BUCKET_NAME="mongodb-backups"
BACKUP_DIR="/mongo/mongo-backup"
LOG_DIR="/mongo/mongo-backup/logs"
BACKUP_LOG="${LOG_DIR}/backup_$(date +%Y%m%d).log"
MATTERMOST_WEBHOOK_URL="YOUR_MATTERMOST_WEBHOOK_URL"

#mc alias set myminio http://minio:9000 iaAPXCzmawhggho6 0nAre5k2mzpxZWckFnGtUbEyQ9PG5YUi;


mkdir -p "$LOG_DIR"


log() {
    local message="$1"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo "[$timestamp] $message" | tee -a "$BACKUP_LOG"
}

send_mattermost_notification() {
    local message="$1"
    local payload="{\"channel_id\": \"nwd7o4szw3gtpdcsj35c43kzxy\", \"message\": \"$message\"}"

    curl -i -X POST -H 'Content-Type: application/json' \
              -d "$payload"  \
              -H 'Authorization: Bearer zocdyfq7xtfzzn5f78snbgxhir' https://chat.tapsi.shop/api/v4/posts
}

if ! mc alias set myminio "$MINIO_URL" "$MINIO_ACCESS_KEY" "$MINIO_SECRET_KEY" 2>&1 | tee -a "$BACKUP_LOG"; then
    log  "Cannot connect to MinIO server"
    send_mattermost_notification "❌ MongoDB Backup Error: Cannot connect to MinIO server"
    exit 1
fi


# Function for full backup
perform_full_backup() {
    local start_time=$(date '+%Y-%m-%d %H:%M:%S')
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    BACKUP_NAME="mongo_backup_${TIMESTAMP}.gz"
    log  "Starting full backup process..."
    #send_mattermost_notification "🔄 Starting MongoDB Full Backup - ${TIMESTAMP}"
    echo "Starting full backup process..."

    # Save the current oplog position
    OPLOG_START=$(mongosh "$MONGODB_URI" --quiet --eval 'db.getSiblingDB("local").oplog.rs.find({}, {ts:1}).sort({$natural:-1}).limit(1).next().ts')
    log  "Getting current oplog position..."
    # Step 2: Perform regular backup without --oplog
    mongodump --uri="$MONGODB_URI" --archive="$BACKUP_DIR/$BACKUP_NAME" --gzip --oplog  2>&1 | tee -a "$BACKUP_LOG"

    # Step 3: Get ending oplog position
    OPLOG_END=$(mongosh "$MONGODB_URI" --quiet --eval 'db.getSiblingDB("local").oplog.rs.find({}, {ts:1}).sort({$natural:-1}).limit(1).next().ts')
    echo "$OPLOG_END" > "$BACKUP_DIR/oplog_position.txt"

    # Upload to MinIO
    #mc alias set myminio "$MINIO_URL" "$MINIO_ACCESS_KEY" "$MINIO_SECRET_KEY"
    log "INFO" "Uploading backup to MinIO..."
    mc cp "$BACKUP_DIR/$BACKUP_NAME" "myminio/${BUCKET_NAME}/full/" 2>&1 | tee -a "$BACKUP_LOG"
    mc ilm rule add "myminio/${BUCKET_NAME}/full/$BACKUP_NAME" --expire-days "14"
    mc cp "$BACKUP_DIR/oplog_position.txt" "myminio/${BUCKET_NAME}/full/" 2>&1 | tee -a "$BACKUP_LOG"

    # Cleanup
    rm -f "$BACKUP_DIR/$BACKUP_NAME"
    rm -f "$BACKUP_DIR/oplog_${TIMESTAMP}.gz"
    local end_time=$(date '+%Y-%m-%d %H:%M:%S')
    local duration=$(( $(date -d "$end_time" +%s) - $(date -d "$start_time" +%s) ))

    log  "Full backup completed successfully. Duration: ${duration} seconds"
    echo "Full backup process completed"
}

# Function for incremental backup
perform_incremental_backup() {
    local start_time=$(date '+%Y-%m-%d %H:%M:%S')
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    log  "Starting incremental backup process..."
    echo "Starting incremental backup process..."
    # Get current oplog position
    log  "Getting current oplog position..."
    CURRENT_OPLOG=$(mongosh "$MONGODB_URI" --quiet --eval 'db.getSiblingDB("local").oplog.rs.find({}, {ts:1}).sort({$natural:-1}).limit(1).next().ts')
    echo "$CURRENT_OPLOG" > "$BACKUP_DIR/oplog_position.txt"
    echo "CURRENT_OPLOG" $CURRENT_OPLOG


    if ! mc cp "myminio/${BUCKET_NAME}/oplog/oplog_position.txt" "/tmp/oplog_position.txt" 2>&1 | tee -a "$BACKUP_LOG"; then
        log  "No previous oplog position found. This might be the first run."
        echo "$CURRENT_OPLOG" > "/tmp/oplog_position.txt"
        mc cp "$BACKUP_DIR/oplog_position.txt" "myminio/${BUCKET_NAME}/oplog/"
        log  "Saved initial oplog position. Next run will perform incremental backup."
    fi

    LAST_OPLOG_TS=$(cat /tmp/oplog_position.txt)
    echo "Backing up oplog from $LAST_OPLOG_TS to $CURRENT_OPLOG"
    echo $LAST_OPLOG_TS

    if [ -z "$LAST_OPLOG_TS" ]; then
        log  "Invalid last oplog timestamp"
        send_mattermost_notification "❌ MongoDB Incremental Backup Failed - Invalid oplog timestamp"
        return 1
    fi

    # Extract timestamp components
    T_VALUE=$(echo "$LAST_OPLOG_TS" | grep -oP '(?<=t: )\d+')
    I_VALUE=$(echo "$LAST_OPLOG_TS" | grep -oP '(?<=i: )\d+')
    LAST_OPLOG_TS_EXTENDED_JSON="{"ts": {"$gt":{\"\$timestamp\":{\"t\": $T_VALUE, \"i\": $I_VALUE}}"
    echo "LAST_OPLOG_TS_EXTENDED_JSON is  "   $LAST_OPLOG_TS_EXTENDED_JSON
    log  "Performing incremental backup from $LAST_OPLOG_TS to $CURRENT_OPLOG"
    cat > /tmp/query.js << EOF
      {"ts": {"\$gt": {"\$timestamp": {"t": $T_VALUE,"i": $I_VALUE}}}}
EOF

    cat /tmp/query.js
    mongodump --uri="$MONGODB_URI" --gzip  --db=local --collection=oplog.rs --queryFile=/tmp/query.js  --out="/$BACKUP_DIR/oplog_${TIMESTAMP}"   2>&1 | tee -a "$BACKUP_LOG"


    if [ $? -ne 0 ]; then
       log  "Incremental backup failed"
       send_mattermost_notification "❌ MongoDB Incremental Backup Failed - ${TIMESTAMP}"
      return 1
    fi

    # Upload to MinIO
    mc cp --recursive  "/$BACKUP_DIR/oplog_${TIMESTAMP}" "myminio/${BUCKET_NAME}/oplog/" 2>&1 | tee -a "$BACKUP_LOG"
    mc ilm rule add "myminio/${BUCKET_NAME}/oplog/oplog_${TIMESTAMP}" --expire-days "14"
    mc cp "/$BACKUP_DIR/oplog_position.txt" "myminio/${BUCKET_NAME}/oplog/"

    # Cleanup
    rm -rf "/$BACKUP_DIR/oplog_${TIMESTAMP}"
    local end_time=$(date '+%Y-%m-%d %H:%M:%S')
    local duration=$(( $(date -d "$end_time" +%s) - $(date -d "$start_time" +%s) ))

    log  "Incremental backup completed successfully. Duration: ${duration} seconds"
    echo "Incremental backup process completed"
}

# Check command line arguments
case "$1" in
    "full")
        perform_full_backup
        ;;
    "incremental")
        perform_incremental_backup
        ;;
    *)
        echo "Usage: $0 {full|incremental}"
        exit 1
        ;;
esac



############  Restore command ##################


#mongorestore --uri="$MONGODB_URI" --gzip --archive=your_full_backup.gz --oplogReplay
# Replay oplog(s)
#mongorestore --uri="$MONGODB_URI" --oplogReplay --oplogFile=oplog_20250506_160742/local/oplog.rs.bson.gz  --gzip  --dir dump
