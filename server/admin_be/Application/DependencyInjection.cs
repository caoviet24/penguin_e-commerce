using Application.Behaviors;
using Microsoft.Extensions.DependencyInjection;
using MediatR;
using WebApi.DBHelper;
using FluentValidation;

namespace Application
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApplicationService(this IServiceCollection service)
        {

            service.AddMediatR(cfg =>
            {
                cfg.RegisterServicesFromAssembly(typeof(DependencyInjection).Assembly);
                cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));
            });

            service.AddValidatorsFromAssembly(typeof(DependencyInjection).Assembly);


            return service;
        }
    }
}
