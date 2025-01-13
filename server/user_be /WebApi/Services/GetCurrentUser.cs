using System;
using System.Security.Claims;
using Application.Interface;

namespace WebApi.Services
{
    public class GetCurrentUser : IUser
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        public GetCurrentUser(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public string getCurrentUser()
        {
            return _httpContextAccessor.HttpContext?.User?.Claims?.FirstOrDefault(c => c.Type == "acc_id")?.Value ?? string.Empty;
        }
    }
}