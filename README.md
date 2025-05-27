# Penguin E-Commerce Platform

A comprehensive e-commerce platform built with modern technologies, offering a seamless shopping experience for users and powerful management tools for sellers and administrators.

## Project Overview

Penguin E-Commerce is a full-stack application that includes:

- Next.js client application for user interface
- ASP.NET Core API for business logic and data management
- Express.js file server for media handling
- SQL Server database for data storage
- Docker containerization for easy deployment

## Architecture

The project follows a microservices architecture with the following components:

- **Client**: Next.js front-end application with React and Redux
- **ASP.NET API**: Core business logic and data management following Clean Architecture
- **Express.js Server**: File upload and media handling service
- **Database**: SQL Server for persistent data storage

## Features

- User authentication and authorization
- Product browsing and searching
- Shopping cart management
- Order processing and tracking
- Payment integration
- User profile management
- Seller dashboard for product management
- Admin dashboard for system management
- Real-time notifications
- Reviews and ratings
- Voucher system

## Technology Stack

### Client
- Next.js 15
- TypeScript
- Redux Toolkit
- Tailwind CSS
- Radix UI
- Socket.io Client

### ASP.NET API
- ASP.NET Core 8
- Entity Framework Core
- CQRS with MediatR
- JWT Authentication
- Clean Architecture

### Express.js File Server
- Node.js
- Express.js
- Multer for file uploads
- Socket.io for real-time communication

### Database
- Microsoft SQL Server

### DevOps
- Docker
- Docker Compose

## Getting Started

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for local development)
- .NET 8 SDK (for local development)
- SQL Server (for local development)

### Running with Docker

The easiest way to run the entire application is using Docker Compose:

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

After starting the services, you can access:
- Client application: http://localhost:3000
- ASP.NET API: http://localhost:5000
- Express.js File Server: http://localhost:8000

### Local Development

For local development, you can run each component separately:

#### Client
```bash
cd client
npm install
npm run dev
```

#### ASP.NET API
```bash
cd server/AspNet
dotnet restore
dotnet run --project WebApi
```

#### Express.js File Server
```bash
cd server/expressjs_sv
npm install
npm run dev
```

## Project Structure

```
penguin_e-commerce/
├── client/                 # Next.js client application
├── server/                 # Backend services
│   ├── AspNet/             # ASP.NET Core API
│   └── expressjs_sv/       # Express.js file server
├── docker-compose.yml      # Docker Compose configuration
└── README.md               # This file
```

For more detailed information about each component, please refer to their respective README files:
- [Client README](client/README.md)
- [ASP.NET API README](server/AspNet/README.md)
- [Express.js File Server README](server/expressjs_sv/README.md)

## Deployment

The application is containerized using Docker, making it easy to deploy to various environments:

- Local development
- Development server
- Staging environment
- Production environment

For production deployment, consider using:
- Kubernetes for orchestration
- CI/CD pipelines for automated deployment
- Load balancer for traffic distribution
- CDN for static assets

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

[MIT License](LICENSE)