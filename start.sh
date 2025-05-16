#!/bin/bash

# Start server/admin_be/WebApi
echo "Starting server/admin_be/WebApi..."
gnome-terminal --tab --title="Admin Backend" -- bash -c "cd server/admin_be/WebApi && dotnet run; exec bash"

# Start client
echo "Starting client..."
gnome-terminal --tab --title="Client" -- bash -c "cd client && npm start; exec bash"

# Start admin
echo "Starting admin..."
gnome-terminal --tab --title="Admin" -- bash -c "cd admin && npm start; exec bash"

# Start server/uploads
echo "Starting server/uploads..."
gnome-terminal --tab --title="Uploads Server" -- bash -c "cd server/uploads && npm run dev; exec bash"

echo "All services started successfully!"