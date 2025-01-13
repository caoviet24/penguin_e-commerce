using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos;
using Dapper;
using MediatR;

namespace Application.Voucher.Commands.UpdateQuantity
{
    public class UpdateQuantityVoucherCommand : IRequest<VoucherDto>
    {
        public string Id { get; set; } = null!;
        public int quantity_remain { get; set; }
        public int quantity_used { get; set; }   
    }
    public class UpdateQuantityVoucherHandler(IDbConnection dbConnection) : IRequestHandler<UpdateQuantityVoucherCommand, VoucherDto>
    {
        public async Task<VoucherDto> Handle(UpdateQuantityVoucherCommand request, CancellationToken cancellationToken)
        {
            var data = await dbConnection.QuerySingleAsync<VoucherDto>(
                "sp_update_quantity_voucher_by_id",
                new
                {
                    voucher_id = request.Id,
                    quantity_remain = request.quantity_remain,
                    quantity_used = request.quantity_used
                },
                commandType: CommandType.StoredProcedure
            );

            return data;
        }
    }
}