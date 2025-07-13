#!/bin/bash

# URL of your NGINX server
NGINX_URL="http://localhost:8080"  # Replace with your actual NGINX URL

# Number of requests to send concurrently
CONCURRENT_REQUESTS=1000

# Function to send HTTP requests in the background
send_requests() {
  while true; do
    curl -s $NGINX_URL > /dev/null
  done
}

# Start multiple background jobs to send requests
for i in $(seq 1 $CONCURRENT_REQUESTS); do
  send_requests &
done

echo "Started $CONCURRENT_REQUESTS concurrent requests to $NGINX_URL"

# Keep the script running
wait

