using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Domain.Exceptions;

namespace Application.Booth.Commands.Close
{
    public class CloseBoothCommand : IRequest<BoothDto>
    {
        public string booth_id { get; set; } = null!;
    }

    public class CloseBoothHandler(IApplicationDbContext context, IMapper mapper) : IRequestHandler<CloseBoothCommand, BoothDto>
    {
        public async Task<BoothDto> Handle(CloseBoothCommand request, CancellationToken cancellationToken)
        {
            var findBooth = await context.Booths.FindAsync(request.booth_id);
            if (findBooth == null)
            {
                throw new NotFoundException("Booth not found");
            }

            findBooth.is_closed = true;

            var result = context.Booths.Update(findBooth);
            await context.SaveChangesAsync(cancellationToken);

            return mapper.Map<BoothDto>(result.Entity);
        }
    }
}