# Use a modern, compatible Python version
FROM python:3.11-slim-bullseye

# Set environment variables for Python
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set the working directory inside the container
WORKDIR /app

# Install system dependencies needed for building Python packages
RUN apt-get update && apt-get install -y gcc libpq-dev

# Copy and install Python dependencies
COPY ./requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire backend application code into the container
COPY . /app/

# Copy the entrypoint script into the container
COPY ./entrypoint.sh /app/

# Make the entrypoint script executable
RUN chmod +x /app/entrypoint.sh

# Set the entrypoint script as the command to run when the container starts
ENTRYPOINT ["/app/entrypoint.sh"]