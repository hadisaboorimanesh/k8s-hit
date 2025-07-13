#!/bin/bash

# Define paths
IMAGE_LIST="Removed-images.txt"
MINIO_SOURCE_ALIAS="minio"
MINIO_SOURCE_BUCKET="stage"
MINIO_DEST_ALIAS="./recovered/"
ERROR_LOG="errors.log"

# Clear the error log
> "$ERROR_LOG"

# Read the file line by line and process each URL
while IFS= read -r IMAGE_URL; do
  if [[ -n "$IMAGE_URL" ]]; then  # Check if the line is not empty
    # Replace "https://assets.tapsi.shop" with the MinIO source path
    MINIO_PATH=$(echo "$IMAGE_URL" | sed "s|https://assets.tapsi.shop|$MINIO_SOURCE_ALIAS/$MINIO_SOURCE_BUCKET|")
    DATE=$(echo "$MINIO_PATH" | awk -F'/' '{print $4}')
    # Check if the file exists at the source path
    echo "Checking if $MINIO_PATH exists..."
    if [ -z "$(mc ls "$MINIO_PATH" 2>/dev/null)" ]; then
      echo "File does not exist at $MINIO_PATH. Skipping." >> $ERROR_LOG
    else
      echo "File exists. Copying $MINIO_PATH to $MINIO_DEST_ALIAS..."
      mkdir -p $MINIO_DEST_ALIAS/uploads/$DATE
      mc cp "$MINIO_PATH" "$MINIO_DEST_ALIAS/uploads/$DATE/" 2>>"$ERROR_LOG"
    fi
  fi
done < "$IMAGE_LIST"

echo "Process complete. Errors (if any) are logged in $ERROR_LOG."