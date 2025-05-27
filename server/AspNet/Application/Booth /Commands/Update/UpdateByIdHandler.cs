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
        public string booth_id { get; set; } = null!;
        public string booth_name { get; set; } = null!;
        public string booth_description { get; set; } = null!;
        public string booth_avatar { get; set; } = null!;
        public bool is_active { get; set; } 
        public bool is_banned { get; set; } 
    }
    public class UpdateByIdHandler(IApplicationDbContext context, IMapper mapper) : IRequestHandler<UpdateBoothCommand, BoothDto>
    {
        public async Task<BoothDto> Handle(UpdateBoothCommand request, CancellationToken cancellationToken)
        {
            var findBooth = await context.Booths.FindAsync(request.booth_id);
            if (findBooth == null)
            {
                throw new NotFoundException("Booth not found");
            }

            var updateBooth = mapper.Map<BoothEntity>(request);
            var data = context.Booths.Update(updateBooth);
            return mapper.Map<BoothDto>(data);
        }
    }
}