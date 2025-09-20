# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Set the working directory to /app
WORKDIR /app

# Copy the requirements file into the container
COPY src/requirements.txt /app



ENV http_proxy=http://172.31.58.242:1081
ENV https_proxy=http://172.31.58.242:1081


RUN pip config --user set global.index-url https://nexus.frox.ir/repository/pypi/simple && \
    pip config --user set global.no-cache-dir false && \
    pip install -U pip && \
    pip install -r requirements.txt


# Install any needed packages specified in requirements.txt
#RUN pip install --trusted-host pypi.python.org -r requirements.txt

# Copy the current directory contents into the container at /app
COPY src/ /app

# Make port 5000 available to the world outside this container
EXPOSE 5000

# Define environment variable
ENV FLASK_APP app.py

# Run app.py when the container launches
CMD ["flask", "run", "--host", "0.0.0.0", "--port", "5000"]
