using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos;
using MediatR;
using WebApi.DBHelper;

namespace Application.Voucher.Commands.DeleteSoft
{
    public class DeleteSoftVoucherCommand : IRequest<VoucherDto>
    {
        public string Id { get; set; } = null!;
    }
    public class DeleteSoftVoucherHandler(IDbHelper dbHelper) : IRequestHandler<DeleteSoftVoucherCommand, VoucherDto>
    {
        public async Task<VoucherDto> Handle(DeleteSoftVoucherCommand request, CancellationToken cancellationToken)
        {
            var data = await dbHelper.QueryProceduceSingleDataAsync<VoucherDto>(
                "sp_delete_soft_voucher_by_id",
                new
                {
                    voucher_id = request.Id
                }
            );

            return data;
        }
    }
}