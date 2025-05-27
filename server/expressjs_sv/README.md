# Penguin E-Commerce Express.js File Server

This is a specialized file server for the Penguin E-Commerce platform, built with Express.js. It handles file uploads, serving media files, and provides real-time notifications using Socket.io.

## Features

- File upload handling for various types (images, videos, documents)
- Secure file storage
- Real-time notifications with Socket.io
- CORS support for cross-origin requests
- Environment-based configuration
- Error handling middleware

## Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **File Handling**: Multer
- **Real-time Communication**: Socket.io
- **Environment Variables**: dotenv
- **Cross-Origin Support**: CORS

## Prerequisites

- Node.js 18.x or higher
- npm or yarn

## Installation

1. Clone the repository
2. Navigate to the expressjs_sv directory
3. Install dependencies:

```bash
npm install
# or
yarn install
```

## Environment Variables

Create a `.env` file in the expressjs_sv directory with the following variables:

```
PORT=8000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
MAX_FILE_SIZE=10485760  # 10MB in bytes
```

## Development

To run the development server:

```bash
npm run dev
# or
yarn dev
```

The server will be available at [http://localhost:8000](http://localhost:8000).

## Production

To run the server in production:

```bash
npm start
# or
yarn start
```

## Docker

The server can be built and run using Docker:

```bash
docker build -t penguin-express-server .
docker run -p 8000:8000 penguin-express-server
```

Or using Docker Compose:

```bash
docker-compose up express-api
```

## API Endpoints

### File Upload

- `POST /api/upload/image`: Upload image files
- `POST /api/upload/video`: Upload video files
- `POST /api/upload/document`: Upload document files

### File Retrieval

- `GET /uploads/:filename`: Get a specific file

## Socket.io Events

- `connection`: Client connection event
- `disconnect`: Client disconnection event
- `notification`: Send notification to clients
- `typing`: User typing event

## Project Structure

- `/config`: Configuration files
- `/controllers`: Route controllers
- `/middlewares`: Custom middleware functions
- `/routes`: API route definitions
- `/socket`: Socket.io event handlers
- `/uploads`: Uploaded files storage
- `/utils`: Utility functions
- `server.js`: Main application entry point

## Contributing

1. Create a branch for your feature
2. Make your changes
3. Submit a pull request

## License

[MIT License](LICENSE)