FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

COPY ./sale_management.sln .
COPY ./Application ./Application
COPY ./Domain ./Domain
COPY ./Infrastructure ./Infrastructure
COPY ./WebApi ./WebApi

RUN dotnet restore ./WebApi/WebApi.csproj
RUN dotnet publish ./WebApi/WebApi.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .

EXPOSE 80
ENTRYPOINT ["dotnet", "WebApi.dll"]