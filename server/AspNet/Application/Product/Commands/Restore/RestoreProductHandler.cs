using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos;
using Application.Common.Interfaces;
using Domain.Exceptions;
using MediatR;
using Microsoft.EntityFrameworkCore;


namespace Application.Product.Commands.Restore
{

    public class RestoreProductCommand : IRequest<ProductDto>
    {
        public string Id { get; set; } = null!;
    }
    public class RestoreProductHandler(IApplicationDbContext context, IMapper mapper) : IRequestHandler<RestoreProductCommand, ProductDto>
    {
        public async Task<ProductDto> Handle(RestoreProductCommand request, CancellationToken cancellationToken)
        {
            var checkProduct = await context.Products.FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);
            if (checkProduct == null)
            {
                throw new NotFoundException("Product not found.");
            }

            checkProduct.is_deleted = false;
            return mapper.Map<ProductDto>(checkProduct);
        }
    }
}