# Penguin E-Commerce ASP.NET API

This is the backend API for the Penguin E-Commerce platform, built with ASP.NET Core using Clean Architecture principles.

## Features

- Clean Architecture implementation
- RESTful API endpoints
- CQRS pattern with MediatR
- Entity Framework Core for data access
- JWT authentication and authorization
- Role-based access control
- Swagger documentation
- Validation using FluentValidation
- Error handling middleware
- Repository pattern

## Architecture

The project follows Clean Architecture principles with the following layers:

- **Domain**: Contains entities, enums, exceptions, interfaces, and domain logic
- **Application**: Contains business logic, commands/queries (CQRS), DTOs, and interfaces
- **Infrastructure**: Contains data access implementations, external service implementations
- **WebApi**: Contains controllers, middleware, and API configurations

## Technology Stack

- **Framework**: ASP.NET Core 8.0
- **ORM**: Entity Framework Core
- **Database**: Microsoft SQL Server
- **Authentication**: JWT Bearer tokens
- **Documentation**: Swagger/OpenAPI
- **Validation**: FluentValidation
- **Mapping**: AutoMapper
- **CQRS**: MediatR

## Prerequisites

- .NET 8 SDK
- SQL Server (or SQL Server Express)
- Visual Studio 2022 or Visual Studio Code

## Getting Started

### Database Setup

The application uses Entity Framework Core for database operations. To set up the database:

1. Update the connection string in `appsettings.json` or use the environment variable
2. Run the following commands from the WebApi project directory:

```bash
dotnet ef migrations add InitialCreate
dotnet ef database update
```

### Running the Application

1. Clone the repository
2. Navigate to the WebApi directory
3. Run the application:

```bash
dotnet run
```

The API will be available at [https://localhost:5001](https://localhost:5001) (HTTPS) or [http://localhost:5000](http://localhost:5000) (HTTP).

## API Documentation

The API documentation is available through Swagger UI at `/swagger` endpoint when the application is running.

## Environment Variables

The following environment variables can be set to configure the application:

- `ASPNETCORE_ENVIRONMENT`: Development, Staging, or Production
- `ConnectionStrings__DefaultConnection`: Database connection string
- `JwtSettings__SecretKey`: Secret key for JWT token generation
- `JwtSettings__Issuer`: JWT issuer
- `JwtSettings__Audience`: JWT audience
- `JwtSettings__ExpiryMinutes`: JWT token expiry in minutes

## Docker

The API can be built and run using Docker:

```bash
docker build -t penguin-aspnet-api .
docker run -p 5000:80 penguin-aspnet-api
```

Or using Docker Compose:

```bash
docker-compose up aspnet-api
```

## Project Structure

- `/Application`: Application layer with business logic
- `/Domain`: Domain layer with entities and business rules
- `/Infrastructure`: Infrastructure layer with data access
- `/WebApi`: API layer with controllers and configuration

## Testing

To run the tests:

```bash
dotnet test
```

## Contributing

1. Create a branch for your feature
2. Make your changes
3. Submit a pull request

## License

[MIT License](LICENSE)