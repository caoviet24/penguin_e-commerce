# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0-alpine AS build

WORKDIR /src

# Copy solution and project files first for better layer caching
COPY ["AspNet.sln", "./"]
COPY ["Domain/Domain.csproj", "Domain/"]
COPY ["Application/Application.csproj", "Application/"]
COPY ["Infrastructure/Infrastructure.csproj", "Infrastructure/"]
COPY ["WebApi/WebApi.csproj", "WebApi/"]

# Clear NuGet cache and restore dependencies
RUN dotnet nuget locals all --clear
RUN dotnet restore "AspNet.sln" --verbosity normal --no-cache --force

# Copy the rest of the source code
COPY . .

# Build and publish the application
WORKDIR "/src/WebApi"
# Run restore again to ensure all packages are available for publish
RUN dotnet restore "WebApi.csproj" --verbosity normal --force
RUN dotnet publish "WebApi.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0-alpine AS final

# Install curl for health checks, timezone data, and ICU libraries for globalization support
RUN apk add --no-cache curl tzdata icu-libs

# Set timezone to Vietnam
ENV TZ=Asia/Ho_Chi_Minh

WORKDIR /app

# Create non-root user for security
RUN addgroup -g 1001 -S appgroup && \
    adduser -S appuser -u 1001 -G appgroup

# Copy published files from build stage
COPY --from=build /app/publish .

# Set ownership of app directory
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Environment variables based on appsettings.json
ENV ASPNETCORE_ENVIRONMENT=Production \
    ASPNETCORE_URLS=http://+:5000 \
    DOTNET_RUNNING_IN_CONTAINER=true \
    DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=false \
    LC_ALL=en_US.UTF-8 \
    LANG=en_US.UTF-8

# Expose port 5000 (default ASP.NET Core port)
EXPOSE 5000

# Health check endpoint
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:5000/ || exit 1

# Entry point
ENTRYPOINT ["dotnet", "WebApi.dll"]