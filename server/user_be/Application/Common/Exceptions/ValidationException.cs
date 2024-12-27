

using Domain.Exceptions;

namespace Application.Exceptions
{
    public class ValidationException : BadRequestException
    {
       public ValidationException(Dictionary<string, string[]> errors) : base("Validation error message") => Errors = errors;
       public Dictionary<string, string[]> Errors { get; }
       
    }
}