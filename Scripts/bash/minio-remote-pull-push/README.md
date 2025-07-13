# Minio Remote Buckets Pull and Push

This project is a simple tool to pull from one remote Minio bucket and push to another remote Minio bucket.

## Usage

Step 1: Clone the repository

```bash
git clone https://hig-devops.gig.services/HIT/DevOps/_git/Scripts
```

Step 2: add you minio images file path to the `images.txt` file (one line one path like pull-push-sample-images.txt)

Step 3: ensure to run the script in minio-client container that has access to both source and target buckets.

Step 4: run the script

```bash
bash minio_remote_pull_push.sh
```

enjoy it!