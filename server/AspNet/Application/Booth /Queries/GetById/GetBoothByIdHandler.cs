using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos;
using Application.Common.Interfaces;
using Domain.Exceptions;
using MediatR;


namespace Application.MyBooth.Queries.GetBoothById
{
    public class GetBoothByIdQuery : IRequest<BoothDto>
    {
        public string booth_id { get; set; } = null!;
    }
    public class GetBoothByIdHandler(IApplicationDbContext context, IMapper mapper) : IRequestHandler<GetBoothByIdQuery, BoothDto>
    {
        public async Task<BoothDto> Handle(GetBoothByIdQuery request, CancellationToken cancellationToken)
        {
            var findBooth = await context.Booths.FindAsync(request.booth_id);
            if (findBooth == null)
            {
                throw new NotFoundException("Booth not found");
            }

            return mapper.Map<BoothDto>(findBooth);
        }
    }
}