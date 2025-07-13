Prerequisites

    MinIO Client (mc): Ensure the MinIO client (mc) is installed and properly configured with the required aliases and access credentials.
    Required Files:
        Removed-images.txt: A text file containing the list of image URLs to process.
        Example content of Removed-images.txt:

    https://assets.tapsi.shop/uploads/202501/1330911811404349440.jpg
    https://assets.tapsi.shop/uploads/202501/1330912144405790720.jpg

Permissions: Ensure the script has execute permissions:

    chmod +x script.sh

How It Works

    Reads the Removed-images.txt file line by line.
    Converts each image URL from https://assets.tapsi.shop to the corresponding MinIO source path.
    Extracts the date segment (e.g., 202501) from the path for organizational purposes.
    Checks if the file exists in the MinIO bucket:
        If the file exists, it is copied to the local destination in a folder structured by date (e.g., ./recovered/uploads/202501/).
        If the file does not exist, the error is logged in errors.log.
    Logs any errors encountered during the process in the errors.log file.

Configuration

Edit the following variables in the script to match your environment:

    IMAGE_LIST: Path to the text file containing the list of image URLs.
    MINIO_SOURCE_ALIAS: MinIO client alias for the source server/bucket.
    MINIO_SOURCE_BUCKET: MinIO bucket name where the images are stored.
    MINIO_DEST_ALIAS: Local destination directory for recovered files.
    ERROR_LOG: Path to the log file where errors will be recorded.

Script Execution

    Run the script:

    ./script.sh

    After execution:
        Successfully recovered files will be saved in the local directory defined in MINIO_DEST_ALIAS, organized by date.
        Any errors encountered (e.g., missing files) will be logged in errors.log.

Example
Input (Removed-images.txt):

https://assets.tapsi.shop/uploads/202501/1330911811404349440.jpg
https://assets.tapsi.shop/uploads/202501/1330912144405790720.jpg
https://assets.tapsi.shop/uploads/202501/1330911752322379776.jpg

Output Directory:

./recovered/
└── uploads/
    └── 202501/
        ├── 1330911811404349440.jpg
        ├── 1330912144405790720.jpg

Error Log (errors.log):

File does not exist at minio/stage/uploads/202501/1330911752322379776.jpg. Skipping.

Notes

    Ensure the mc alias is configured correctly for accessing the MinIO server:

mc alias set minio https://minio-server-url ACCESS_KEY SECRET_KEY

The script skips empty lines in the Removed-images.txt file.
Errors (e.g., file not found or permission issues) are logged for debugging purposes.