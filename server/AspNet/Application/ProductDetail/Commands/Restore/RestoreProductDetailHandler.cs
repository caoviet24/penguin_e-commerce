using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos;
using Application.Common.Interfaces;
using Domain.Exceptions;
using MediatR;
using Microsoft.EntityFrameworkCore;


namespace Application.ProductDetail.Commands.Restore
{

    public class RestoreProductDetailCommand : IRequest<ProductDetailDto>
    {
        public string Id { get; set; } = null!;
    }
    public class RestoreProductDetailHandler(IApplicationDbContext context, IMapper mapper) : IRequestHandler<RestoreProductDetailCommand, ProductDetailDto>
    {
        public async Task<ProductDetailDto> Handle(RestoreProductDetailCommand request, CancellationToken cancellationToken)
        {
            var checkExitProductDetail = await context.ProductDetails.FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);
            if (checkExitProductDetail == null)
            {
                throw new NotFoundException("ProductDetail not found.");
            }
            checkExitProductDetail.is_deleted = false;
            var result = context.ProductDetails.Update(checkExitProductDetail);
            await context.SaveChangesAsync(cancellationToken);
            return mapper.Map<ProductDetailDto>(result.Entity);
        }
    }
}