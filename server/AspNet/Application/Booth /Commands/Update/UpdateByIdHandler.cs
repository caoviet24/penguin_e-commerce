using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos;
using Application.Common.Interfaces;

using Dapper;
using Domain.Entities;
using Domain.Exceptions;
using MediatR;


namespace Application.MyBooth .Commands.UpdateBooth
{

     public class UpdateBoothCommand : IRequest<BoothDto>
    {
        public string id { get; set; } = null!;
        public string name { get; set; } = null!;
        public string description { get; set; } = null!;
        public string avatar { get; set; } = null!;
    }
    public class UpdateByIdHandler(IApplicationDbContext context, IMapper mapper) : IRequestHandler<UpdateBoothCommand, BoothDto>
    {
        public async Task<BoothDto> Handle(UpdateBoothCommand request, CancellationToken cancellationToken)
        {
            var findBooth = await context.Booths.FindAsync(request.id);
            if (findBooth == null)
            {
                throw new NotFoundException("Booth not found");
            }

            var updateBooth = mapper.Map<BoothEntity>(request);
            var data = context.Booths.Update(updateBooth);
            await context.SaveChangesAsync(cancellationToken);

            return mapper.Map<BoothDto>(data);
        }
    }
}