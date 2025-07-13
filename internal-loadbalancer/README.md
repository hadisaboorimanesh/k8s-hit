# Kubernetes HAProxy Load Balancer Setup

This repository contains configuration files for a high-availability HAProxy setup using Keepalived to load balance internal traffic to a Kubernetes cluster.

## Overview

The setup consists of:

- **Two HAProxy servers** (`vm1` and `vm2`) configured with Keepalived to provide a highly available virtual IP (VIP).
- **HAProxy** handles TCP-level load balancing to Kubernetes worker nodes.
- **Kubernetes Ingress** in the cluster further routes requests to internal services/applications.

### Architecture Diagram
                             +--------------------+
                             |  Application Users |
                             +--------------------+
                                       |
                                       v
                          +-----------------------------+
                          |   Virtual IP (Keepalived)   |
                          |     (Shared between VMs)    |
                          +-----------------------------+
                                       |
                    +------------------+------------------+
                    |                                     |
          +---------------------+             +---------------------+
          | HAProxy - vm1       |             | HAProxy - vm2       |
          | (Active / Master)   |             | (Passive / Backup)  |
          +---------------------+             +---------------------+
                    |                                     |
                    +------------------+------------------+
                                       |
                                       v
                        +-----------------------------+
                        |  Kubernetes Worker Nodes    |
                        |  (Backend for HAProxy)      |
                        +-----------------------------+
                                       |
                                       v
                       +-------------------------------+
                       | Kubernetes Ingress Controller |
                       |       (INGRESS-NGINX)         |
                       +-------------------------------+
                                       |
                                       v
                        +-----------------------------+
                        |     Internal Applications   |
                        |  (Services running in K8s)  |
                        +-----------------------------+

## Files

- `haproxy.cfg`: Configuration for HAProxy used by both `vm1` and `vm2`. It defines the backend Kubernetes worker nodes and frontend listener on the VIP.
- `keepalived-vm1`: Keepalived configuration for **master node** (`vm1`). This manages the VIP and handles failover.
- `keepalived-vm2`: Keepalived configuration for **backup node** (`vm2`). This takes over if `vm1` becomes unavailable.

## High Availability with Keepalived

Keepalived uses VRRP (Virtual Router Redundancy Protocol) to manage the floating IP. One node is active at a time (the master), and the other is on standby (backup). If the master node (`vm1`) fails, the backup node (`vm2`) automatically takes over the VIP.

## Load Balancing with HAProxy

HAProxy is configured to load balance incoming traffic from the VIP to the Kubernetes worker nodes. It operates at Layer 4 (TCP), forwarding traffic to the Kubernetes API or Ingress as defined.

### Sample Traffic Flow

1. Request hits the **VIP**.
2. VIP is bound to the current active HAProxy node.
3. HAProxy forwards the request to a **Kubernetes worker node**.
4. Kubernetes Ingress receives the request and routes it to the correct service.

## How to Use

1. Place `haproxy.cfg` in the appropriate directory on both `vm1` and `vm2` (typically `/etc/haproxy/haproxy.cfg`).
2. Install and configure HAProxy and Keepalived on both VMs.
3. Place the `keepalived-vm1` and `keepalived-vm2` files in `/etc/keepalived/keepalived.conf` on each respective VM.
4. Enable and start both `haproxy` and `keepalived` services:
   ```bash
   sudo systemctl enable haproxy keepalived
   sudo systemctl start haproxy keepalived


Enjoy it :)