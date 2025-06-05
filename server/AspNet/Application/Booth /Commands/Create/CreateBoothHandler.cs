using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos;
using Application.Common.Interfaces;

using Domain.Entities;
using Domain.Exceptions;
using MediatR;
using Microsoft.EntityFrameworkCore;


namespace Application.MyBooth.Commands.CreateBooth
{
    public class CreateBoothCommand : IRequest<BoothDto>
    {
        public string name { get; set; } = null!;
        public string description { get; set; } = null!;
        public string avatar { get; set; } = null!;
    }
    public class CreateBoothHandler(IApplicationDbContext context, IMapper mapper) : IRequestHandler<CreateBoothCommand, BoothDto>
    {
        public async Task<BoothDto> Handle(CreateBoothCommand request, CancellationToken cancellationToken)
        {
            var checkBoothExited = await context.Booths.FirstOrDefaultAsync(b => b.name == request.name, cancellationToken);

            if (checkBoothExited != null)
            {
                throw new BadRequestException("Booth is already exist");
            }

            var newBooth = mapper.Map<BoothEntity>(request);
            newBooth.Id = Guid.NewGuid().ToString();
            var data = await context.Booths.AddAsync(newBooth);
            await context.SaveChangesAsync(cancellationToken);

            return mapper.Map<BoothDto>(data.Entity);
        }
    }
}