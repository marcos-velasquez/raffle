FROM alpine:latest

# Install ca-certificates for HTTPS
RUN apk --no-cache add ca-certificates

# Create app directory
WORKDIR /app

# Copy PocketBase binary
COPY pocketbase/pocketbase .

# Copy hooks and migrations
COPY pocketbase/pb_hooks ./pb_hooks
COPY pocketbase/pb_migrations ./pb_migrations

# Make PocketBase executable
RUN chmod +x pocketbase

# Expose port
EXPOSE 8080

# Start PocketBase
CMD ["./pocketbase", "serve", "--http=0.0.0.0:8080"]
