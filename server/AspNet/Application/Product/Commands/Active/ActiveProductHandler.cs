using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos;
using Application.Common.Interfaces;
using Domain.Enums.status;
using Domain.Exceptions;
using MediatR;
using Microsoft.EntityFrameworkCore;


namespace Application.Product.Commands.Active
{
    public class ActiveProductCommand : IRequest<ProductDto>
    {
        public string Id { get; set; } = null!;
    }
    public class ActiveProductHandler(IApplicationDbContext context, IMapper mapper) : IRequestHandler<ActiveProductCommand, ProductDto>
    {
        public async Task<ProductDto> Handle(ActiveProductCommand request, CancellationToken cancellationToken)
        {
            var checkProduct = await context.Products.FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);
            if (checkProduct == null)
            {
                throw new NotFoundException("Product not found.");
            }

            checkProduct.is_active = true;

            var result = context.Products.Update(checkProduct);
            await context.SaveChangesAsync(cancellationToken);
            return mapper.Map<ProductDto>(result.Entity);
        }
    }
}