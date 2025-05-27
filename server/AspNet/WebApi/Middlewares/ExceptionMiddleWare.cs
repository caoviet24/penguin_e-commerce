

using Domain.Exceptions;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Middleware
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        public ExceptionMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext httpContext)
        {
            try
            {
                await _next(httpContext);
                if (httpContext.Response.StatusCode == StatusCodes.Status403Forbidden)
                     throw new ForbiddenAccessException();
                if (httpContext.Response.StatusCode == StatusCodes.Status401Unauthorized)
                    throw new Domain.Exceptions.UnauthorizedAccessException();
            }
            catch (BadRequestException e)
            {
                httpContext.Response.StatusCode =
                StatusCodes.Status400BadRequest;
                await httpContext.Response.WriteAsJsonAsync(new { success = false, error = e.Message });
            }
            catch (Domain.Exceptions.UnauthorizedAccessException e)
            {
                httpContext.Response.StatusCode =
                StatusCodes.Status401Unauthorized;
                await httpContext.Response.WriteAsJsonAsync(new { success = false, error = e.Message });
            }
            catch(NotFoundException e) 
            {
                httpContext.Response.StatusCode =
                StatusCodes.Status404NotFound;
                await httpContext.Response.WriteAsJsonAsync(new { success = false, error = e.Message });
            }
            catch(InvalidOperationException e) 
            {
                httpContext.Response.StatusCode =
                StatusCodes.Status400BadRequest;
                await httpContext.Response.WriteAsJsonAsync(new { success = false, error = e.Message });
            }
            catch (Exception e)
            {
                httpContext.Response.StatusCode =
                StatusCodes.Status500InternalServerError;
                await httpContext.Response.WriteAsJsonAsync(new { success = false, error = e.Message });
            }
        }
    }
}