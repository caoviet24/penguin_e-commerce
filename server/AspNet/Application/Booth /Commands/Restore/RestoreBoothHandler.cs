using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos;
using Application.Common.Interfaces;
using Domain.Exceptions;
using MediatR;


namespace Application.MyBooth.Commands.Restore
{
    public class RestoreBoothCommand : IRequest<BoothDto>
    {
        public string booth_id { get; set; } = null!;
    }
    public class RestoreBoothHandler(IApplicationDbContext context, IMapper mapper) : IRequestHandler<RestoreBoothCommand, BoothDto>
    {
        public async Task<BoothDto> Handle(RestoreBoothCommand request, CancellationToken cancellationToken)
        {
            var findBooth = await context.Booths.FindAsync(request.booth_id);
            if (findBooth == null)
            {
                throw new NotFoundException("Booth not found");
            }

            findBooth.is_deleted = false;
            var data = context.Booths.Update(findBooth);
            await context.SaveChangesAsync(cancellationToken);

            return mapper.Map<BoothDto>(data.Entity);
        }
    }
}