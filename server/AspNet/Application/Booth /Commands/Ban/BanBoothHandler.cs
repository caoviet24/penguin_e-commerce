using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos;
using Application.Common.Interfaces;
using Domain.Exceptions;
using MediatR;


namespace Application.MyBooth.Commands.Ban
{
    public class BanBoothCommand : IRequest<BoothDto>
    {
        public string booth_id { get; set; } = null!;
    }
    public class BanBoothHandler(IApplicationDbContext context, IMapper mapper) : IRequestHandler<BanBoothCommand, BoothDto>
    {
        public async Task<BoothDto> Handle(BanBoothCommand request, CancellationToken cancellationToken)
        {
            var findBooth = await context.Booths.FindAsync(request.booth_id);
            if (findBooth == null)
            {
                throw new NotFoundException("Booth not found");
            }

            findBooth.is_banned = true;
            var data = context.Booths.Update(findBooth);
            return mapper.Map<BoothDto>(data.Entity);
        }
    }
}