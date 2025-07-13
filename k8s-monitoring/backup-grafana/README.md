# Grafana Backup & Restore Solution

This repository contains Kubernetes manifests for backing up and restoring Grafana dashboards.

## Supported components
Folder
Folder Permissions
Library Elements (doesn't work with Grafana 8.0.0 but 8.4.3)
Dashboard (contains Alert)
Datasource
Alert Channel
Alert Rules (Supported in version 9.4.0 of grafana and up.)
Teams

## Prerequisites

- Kubernetes cluster with access to the `monitoring` namespace
- `grafana-backup-tool` ConfigMap with S3 credentials and configuration
- kubectl configured with cluster access

## Usage


### Scheduled Backups

The backup CronJob runs daily at 4 AM UTC to create backups in S3.

**To deploy:**
```bash
kubectl apply -f grafana-backup-cronjob.yaml
```

### Manually Restore

The restore Job runs manually by Specify your backup file name in  [grafana-backup-tool](./grafana-restore-k8s-job.yaml) spec.containers.env.name.ARCHIVE_FILE then apply the job in cluster. 

**To deploy restore:**
```bash
kubectl apply -f grafana-restore-k8s-job.yaml
```

tips: for the next restores you can edit this job env ARCHIVE_FILE and re-run it.

enjoy it :)