using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Interface;
using WebApi.Services;

namespace WebApi
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddWebApiService(this IServiceCollection service)
        {
            service.AddHttpContextAccessor();
            service.AddScoped<IUser, GetCurrentUser>();
            return service;
        }
    }
}