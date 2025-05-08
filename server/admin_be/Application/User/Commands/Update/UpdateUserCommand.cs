using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos;
using Application.Common.Interfaces;
using AutoMapper;
using Domain.Entities;
using MediatR;

namespace Application.User.Commands.Update
{

    public class UpdateUserCommand : IRequest<UserDto>
    {
        public string Id { get; set; } = null!;
        public string full_name { get; set; } = null!;
        public string nick_name { get; set; } = null!;
        public string gender { get; set; } = null!;
        public DateTime birth { get; set; }
        public string avatar { get; set; } = null!;
        public string address { get; set; } = null!;
        public string phone { get; set; } = null!;
    }

    public class UpdateUserCommandHandler(IApplicationDbContext context, IMapper mapper) : IRequestHandler<UpdateUserCommand, UserDto>
    {
        public async Task<UserDto> Handle(UpdateUserCommand request, CancellationToken cancellationToken)
        {
            var user = context.Users.FirstOrDefault(x => x.Id == request.Id);
            if (user == null)
            {
                throw new Exception("User not found");
            }

            var newUserInfo = mapper.Map<UserEntity>(request);

            var updateUser = context.Users.Update(newUserInfo);
            await context.SaveChangesAsync(cancellationToken);

            return mapper.Map<UserDto>(updateUser.Entity);
            
        }
    }
}