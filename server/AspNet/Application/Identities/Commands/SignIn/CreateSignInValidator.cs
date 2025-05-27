using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;
using FluentValidation;

namespace Application.Identities.Commands.SignIn
{
    public class CreateSignInValidator : AbstractValidator<CreateSignInCommand>
    {
        public CreateSignInValidator()
        {
            RuleFor(x => x.username)
                .NotEmpty().WithMessage("Username is required")
                .NotNull().WithMessage("Username not null");

            RuleFor(x => x.password)
                .NotEmpty().WithMessage("Password is required")
                .NotNull().WithMessage("Password not null");
        }
    }
}