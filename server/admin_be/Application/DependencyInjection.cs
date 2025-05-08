using Application.Behaviors;
using Microsoft.Extensions.DependencyInjection;
using MediatR;
using WebApi.DBHelper;
using FluentValidation;
using Application.Common.Interfaces;
using Application.Auth;
using Application.TokenData;
using Application.Common.Mapping;

namespace Application
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApplicationService(this IServiceCollection service)
        {
            service.AddScoped<IAuthService, AuthService>();
            service.AddScoped<ITokenData, TokenData.TokenData>();
            service.AddAutoMapper(typeof(MapperProfile).Assembly);

            service.AddMediatR(cfg =>
            {
                cfg.RegisterServicesFromAssembly(typeof(DependencyInjection).Assembly);
                cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));
            });

            service.AddValidatorsFromAssembly(typeof(DependencyInjection).Assembly);
            service.AddAutoMapper(typeof(DependencyInjection).Assembly);


            return service;
        }
    }
}
