using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos;
using Application.Common.Interfaces;
using Domain.Exceptions;
using MediatR;

namespace Application.MyBooth.Commands.Active
{
    public class ActiveBoothCommand : IRequest<BoothDto>
    {
        public string booth_id { get; set; } = null!;
    }
    public class ActiveBoothCommandValidator : AbstractValidator<ActiveBoothCommand>
    {
        public ActiveBoothCommandValidator()
        {
            RuleFor(x => x.booth_id).NotEmpty().WithMessage("Booth ID is required.");
        }
    }
    public class ActiveBoothHandler(IApplicationDbContext context, IMapper mapper) : IRequestHandler<ActiveBoothCommand, BoothDto>
    {
        public async Task<BoothDto> Handle(ActiveBoothCommand request, CancellationToken cancellationToken)
        {
            var findBooth = await context.Booths.FindAsync(request.booth_id);
            if (findBooth == null)
            {
                throw new NotFoundException("Booth not found");
            }

            findBooth.is_active = true;
            var data = context.Booths.Update(findBooth);
            await context.SaveChangesAsync(cancellationToken);
            return mapper.Map<BoothDto>(data.Entity);
        }
    }
}