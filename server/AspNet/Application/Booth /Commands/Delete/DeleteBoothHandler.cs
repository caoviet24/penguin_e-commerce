using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos;
using Application.Common.Interfaces;
using Domain.Exceptions;
using MediatR;


namespace Application.MyBooth .Commands.DeleteBooth
{
    public class DeleteBoothCommand : IRequest<BoothDto>
    {
        public string booth_id { get; set; } = null!;
    }
    public class DeleteBoothHandler(IApplicationDbContext context, IMapper mapper) : IRequestHandler<DeleteBoothCommand,BoothDto>
    {
        public async Task<BoothDto> Handle(DeleteBoothCommand request, CancellationToken cancellationToken)
        {
            var findBooth = await context.Booths.FindAsync(request.booth_id);
            if (findBooth == null)
            {
                throw new NotFoundException("Booth not found");
            }

            findBooth.is_deleted = true;
            var data = context.Booths.Update(findBooth);
            return mapper.Map<BoothDto>(data.Entity);
        }
    }
}