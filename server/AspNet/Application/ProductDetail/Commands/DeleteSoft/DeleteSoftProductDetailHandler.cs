using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos;
using Application.Common.Interfaces;
using Domain.Exceptions;
using MediatR;
using Microsoft.EntityFrameworkCore;


namespace Application.ProductDetail.Commands.DeleteSoft
{
    public class DeleteSoftProductDetailCommand : IRequest<ProductDetailDto>
    {
        public string Id { get; set; } = null!;
    }
    public class DeleteSoftProductDetailHandler(IApplicationDbContext context, IMapper mapper) : IRequestHandler<DeleteSoftProductDetailCommand, ProductDetailDto>
    {
        public async Task<ProductDetailDto> Handle(DeleteSoftProductDetailCommand request, CancellationToken cancellationToken)
        {

            var checkExitProductDetail = await context.ProductDetails.FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);
            if (checkExitProductDetail == null)
            {
                throw new NotFoundException("ProductDetail not found.");
            }
            checkExitProductDetail.is_deleted = true;
            context.ProductDetails.Update(checkExitProductDetail);
            return mapper.Map<ProductDetailDto>(checkExitProductDetail);
        }
    }

}