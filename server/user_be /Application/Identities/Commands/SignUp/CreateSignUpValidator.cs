using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using FluentValidation;

namespace Application.Identities.Commands.SignUp
{
    public class CreateSignUpCommandValidator : AbstractValidator<CreateSignUpCommand>
    {
        public CreateSignUpCommandValidator()
        {
            RuleFor(x => x.username)
                .NotEmpty().WithMessage("Username is required");

            RuleFor(x => x.password)
                .NotEmpty().WithMessage("Password is required");
        }
    }
}