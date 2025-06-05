using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos;
using Application.Common.Interfaces;
using Domain.Exceptions;
using MediatR;

namespace Application.MyBooth .Commands.UnBan
{
    public class UnBanBoothCommand : IRequest<BoothDto>
    {
        public string booth_id { get; set; } = null!;
    }
    public class UnBanBoothHandler(IApplicationDbContext context, IMapper mapper) : IRequestHandler<UnBanBoothCommand, BoothDto>
    {
        public async Task<BoothDto> Handle(UnBanBoothCommand request, CancellationToken cancellationToken)
        {
            var findBooth = await context.Booths.FindAsync(request.booth_id);
            if (findBooth == null)
            {
                throw new NotFoundException("Booth not found");
            }

            findBooth.is_banned = false;
            var data = context.Booths.Update(findBooth);
            await context.SaveChangesAsync(cancellationToken);

            return mapper.Map<BoothDto>(data.Entity);
        }
    }
}