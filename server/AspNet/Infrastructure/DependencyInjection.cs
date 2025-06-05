using System;
using System.Data;
using Application.Common.Interfaces;
using Application.Identities;
using Infrastructure.data.Interceptor;
using Infrastructure.ExternalService;
using Infrastructure.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http;
using Npgsql;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Infrastructure.Service;


namespace Infrastructure;

public static class Infrastructure
{
    public static IServiceCollection AddInfrastructureService(this IServiceCollection service, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("DefaultConnection");


        service.AddScoped<ISaveChangesInterceptor, AuditableEntityInterceptor>();
        service.AddScoped<IApplicationDbContext, ApplicationDbContext>();
        service.AddDbContext<ApplicationDbContext>((sp, options) =>
        {
            options.AddInterceptors(sp.GetServices<ISaveChangesInterceptor>());
            options.UseNpgsql(connectionString);
        });

        service.Configure<Configurations.VnPayConfigration>(configuration.GetSection("Vnpay"));
        service.Configure<Configurations.PaymentConfiguration>(configuration.GetSection("PayOS"));
        service.Configure<Configurations.JwtConfiguration>(configuration.GetSection("Jwt"));
        service.Configure<Configurations.EmailConfiguration>(configuration.GetSection("Email"));
        service.Configure<Configurations.EnvConfiguration>(configuration.GetSection("Env"));



        service.AddAuthentication(opt =>
        {
            opt.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            opt.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(opt =>
        {
            opt.SaveToken = true;
            opt.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = configuration["Jwt:Issuer"],
                ValidAudience = configuration["Jwt:Audience"],
                IssuerSigningKey = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(configuration["Jwt:AccessKey"] ?? throw new InvalidOperationException("JWT Access Key is not configured")))
            };
        });

        service.AddScoped<IJwtService, JwtService>();
        service.AddScoped<IVnPayService, VnPayService>();
        service.AddScoped<IEmailService, EmailService>();
        service.AddScoped<IPaymentService, PaymentService>();
        service.AddScoped<IDbConnection>(provider =>
        {
            var connectionString = configuration.GetConnectionString("DefaultConnection");
            return new NpgsqlConnection(connectionString);
        });

        service.AddScoped<HttpContextAccessor>();


        return service;
    }
}

