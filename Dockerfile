FROM alpine:latest

# Install dependencies
RUN apk --no-cache add ca-certificates wget unzip

# Create app directory
WORKDIR /app

# Download PocketBase for Linux x64
RUN wget https://github.com/pocketbase/pocketbase/releases/download/v0.22.21/pocketbase_0.22.21_linux_amd64.zip \
    && unzip pocketbase_0.22.21_linux_amd64.zip \
    && rm pocketbase_0.22.21_linux_amd64.zip

# Copy hooks only (skip migrations for clean start)
COPY pocketbase/pb_hooks ./pb_hooks

# Make PocketBase executable
RUN chmod +x pocketbase

# Create pb_data directory
RUN mkdir -p pb_data

# Expose port
EXPOSE 8080

# Start PocketBase with proper flags
CMD ["./pocketbase", "serve", "--http=0.0.0.0:8080", "--dir=/app/pb_data"]
