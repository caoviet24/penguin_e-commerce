using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos;
using Application.Dtos.Account;
using Application.Common.Interfaces;
using AutoMapper;
using BCrypt.Net;
using Dapper;
using Domain.Entities;
using Domain.enums;
using Domain.Exceptions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Runtime.InteropServices.Marshalling;

namespace Application.Identities.Commands.SignUp
{
    public class CreateSignUpCommand : IRequest<AccountDto>
    {
        public string username { get; set; } = null!;
        public string password { get; set; } = null!;
    }
    public class CreateSignUpHandler(IApplicationDbContext context, IMapper mapper) : IRequestHandler<CreateSignUpCommand, AccountDto>
    {

        public async Task<AccountDto> Handle(CreateSignUpCommand request, CancellationToken cancellationToken)
        {
            var checkExitAccount = await context.Accounts.FirstOrDefaultAsync(a => a.username == request.username, cancellationToken);
            if (checkExitAccount?.Id != null)
            {
                throw new BadRequestException("username is already exist");
            }

            var newAccount = new AccountEntity
            {
                Id = Guid.NewGuid().ToString(),
                password = BCrypt.Net.BCrypt.HashPassword(request.password),
                role = Role.User.ToString(),
                username = request.username,
                is_banned = false,
                is_deleted = false,
                created_at = DateTime.UtcNow,
                updated_at = DateTime.UtcNow
            };
         

            var data = await context.Accounts.AddAsync(newAccount, cancellationToken);

            return mapper.Map<AccountDto>(data.Entity);


        }
    }
}