#!/bin/bash

# External file containing the list of image paths (one per line)
IMAGE_LIST_FILE="./pull-push-sample-images.txt"  # Replace with the path to your image list file

# MinIO alias and bucket details for source and destination
SOURCE_MINIO_ALIAS="myminio"  # Replace with your source MinIO alias
SOURCE_BUCKET_NAME="stage"  # Replace with your source bucket name

DEST_MINIO_ALIAS="arvans3"  # Replace with your destination MinIO alias
DEST_BUCKET_NAME="arvan-stage"  # Replace with your destination bucket name

# Check if the image list file exists
if [[ ! -f "$IMAGE_LIST_FILE" ]]; then
    echo "Error: Image list file not found at $IMAGE_LIST_FILE"
    exit 1
fi

# Copy images from source MinIO bucket to destination MinIO bucket
while IFS= read -r IMAGE_PATH; do
    if [[ -n "$IMAGE_PATH" ]]; then  # Skip empty lines
        echo "Copying $IMAGE_PATH from $SOURCE_MINIO_ALIAS/$SOURCE_BUCKET_NAME to $DEST_MINIO_ALIAS/$DEST_BUCKET_NAME..."

        # Use `mc cp` to copy the file while preserving the path
        mc cp "$SOURCE_MINIO_ALIAS/$SOURCE_BUCKET_NAME$IMAGE_PATH" "$DEST_MINIO_ALIAS/$DEST_BUCKET_NAME$IMAGE_PATH"
        if [[ $? -eq 0 ]]; then
            echo "Successfully copied $IMAGE_PATH."
        else
            echo "Failed to copy $IMAGE_PATH."
        fi
    fi
done < "$IMAGE_LIST_FILE"

echo "All images copied."