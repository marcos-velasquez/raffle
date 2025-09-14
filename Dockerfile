FROM alpine:latest

# Install ca-certificates and libc6-compat for binary compatibility
RUN apk --no-cache add ca-certificates libc6-compat

# Create app directory
WORKDIR /app

# Copy PocketBase binary
COPY pocketbase/pocketbase .

# Copy hooks and migrations if they exist
COPY pocketbase/pb_hooks ./pb_hooks
COPY pocketbase/pb_migrations ./pb_migrations

# Make PocketBase executable
RUN chmod +x pocketbase

# Create pb_data directory
RUN mkdir -p pb_data

# Expose port
EXPOSE 8080

# Start PocketBase with proper flags
CMD ["./pocketbase", "serve", "--http=0.0.0.0:8080", "--dir=/app/pb_data"]
