using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos;
using MediatR;
using WebApi.DBHelper;

namespace Application.Voucher.Commands.Restore
{
    public class RestoreVoucherCommand : IRequest<VoucherDto>
    {
        public string Id { get; set; } = null!;
    }
    public class RestoreVoucherHandler(IDbHelper dbHelper) : IRequestHandler<RestoreVoucherCommand, VoucherDto>
    {
        public async Task<VoucherDto> Handle(RestoreVoucherCommand request, CancellationToken cancellationToken)
        {
            var data = await dbHelper.QueryProceduceSingleDataAsync<VoucherDto>(
                "sp_restore_voucher_by_id",
                new
                {
                    voucher_id = request.Id
                }
            );

            return data;
        }
    }
}