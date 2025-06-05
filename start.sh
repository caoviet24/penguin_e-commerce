#!/bin/bash

# Start server/admin_be/WebApi
echo "Starting server/AspNet/WebApi..."
gnome-terminal --tab --title="Admin Backend" -- bash -c "cd server/AspNet/WebApi && dotnet run; exec bash"

# Start client
echo "Starting client..."
gnome-terminal --tab --title="Client" -- bash -c "cd client && npm run dev; exec bash"


# Start server/expressjs_sv
echo "Starting server/expressjs_sv..."
gnome-terminal --tab --title="expressjs_sv Server" -- bash -c "cd server/expressjs_sv && npm run dev; exec bash"

echo "All services started successfully!"