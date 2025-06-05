using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Domain.Exceptions;

namespace Application.Booth .Commands.InActive
{
     public class InActiveBoothCommand : IRequest<BoothDto>
    {
        public string booth_id { get; set; } = null!;
    }
    public class InActiveBoothCommandValidator : AbstractValidator<InActiveBoothCommand>
    {
        public InActiveBoothCommandValidator()
        {
            RuleFor(x => x.booth_id).NotEmpty().WithMessage("Booth ID is required.");
        }
    }
    public class InActiveBoothHandler(IApplicationDbContext context, IMapper mapper) : IRequestHandler<InActiveBoothCommand, BoothDto>
    {
        public async Task<BoothDto> Handle(InActiveBoothCommand request, CancellationToken cancellationToken)
        {
            var findBooth = await context.Booths.FindAsync(request.booth_id);
            if (findBooth == null)
            {
                throw new NotFoundException("Booth not found");
            }

            findBooth.is_active = false;
            var data = context.Booths.Update(findBooth);
            await context.SaveChangesAsync(cancellationToken);
            return mapper.Map<BoothDto>(data.Entity);
        }
    }
}