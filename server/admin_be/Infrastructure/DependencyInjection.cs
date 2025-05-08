using System;
using System.Data;
using Application.Common.Interfaces;
using Application.Identities;
using Infrastructure.data.Interceptor;
using Infrastructure.ExternalService;
using Infrastructure.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using WebApi.DBHelper;

namespace Infrastructure;

public static class Infrastructure
{
    public static IServiceCollection AddInfrastructureService(this IServiceCollection service, IConfiguration configuration)
    {
        service.AddDbContext<ApplicationDbContext>(options =>
        {
            var connectionString = configuration.GetConnectionString("DefaultConnection");
            options.UseSqlServer(connectionString);
        });

        // Configure VnPay
        service.Configure<Configration.VnPayConfigration>(configuration.GetSection("Vnpay"));
        
        // Configure PayOS
        service.Configure<Configurations.PaymentConfiguration>(configuration.GetSection("PayOS"));


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
                IssuerSigningKey = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(configuration["Jwt:AccessKey"]))
            };
        });

        service.AddScoped<IJwtService, JwtService>();
        service.AddScoped<IVnPayService, VnPayService>();
        service.AddScoped<IPaymentService, PaymentService>();
        service.AddScoped<ISaveChangesInterceptor, EntityInterceptor>();
        service.AddScoped<IApplicationDbContext, ApplicationDbContext>();
        service.AddScoped<IDbHelper, DbHepler>();
        service.AddScoped<IDbConnection>(provider =>
        {
            var connectionString = configuration.GetConnectionString("DefaultConnection");
            return new SqlConnection(connectionString);
        });

        service.AddScoped<HttpContextAccessor>();


        return service;
    }
}

