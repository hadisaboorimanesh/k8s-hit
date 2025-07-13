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
    LOCAL_PATH=$(echo "$IMAGE_URL" | sed "s|https://assets.tapsi.shop/||")
    MINIO_PATH=$(echo "$IMAGE_URL" | sed "s|https://assets.tapsi.shop|$MINIO_SOURCE_ALIAS/$MINIO_SOURCE_BUCKET|")
    IMAGE=$(echo "$MINIO_PATH" | awk -F'/' '{print $5}')
    MINIO_PATH=$(echo "$MINIO_PATH" | sed "s|$IMAGE||")
    
    echo $LOCAL_PATH
    echo $MINIO_PATH

    mc cp "$LOCAL_PATH" "$MINIO_PATH" 2>>"$ERROR_LOG"

  fi
done < "$IMAGE_LIST"

echo "Process complete. Errors (if any) are logged in $ERROR_LOG."