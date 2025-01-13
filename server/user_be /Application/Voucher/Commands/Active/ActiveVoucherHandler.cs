using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos;
using MediatR;
using WebApi.DBHelper;

namespace Application.Voucher.Commands.Active
{
    public class ActiveVoucherCommand : IRequest<VoucherDto>
    {
        public string Id { get; set; } = null!;
    }
    public class ActiveVoucherHandler(IDbHelper dbHelper) : IRequestHandler<ActiveVoucherCommand, VoucherDto>
    {
        public async Task<VoucherDto> Handle(ActiveVoucherCommand request, CancellationToken cancellationToken)
        {
            var data = await dbHelper.QueryProceduceSingleDataAsync<VoucherDto>(
                "sp_active_voucher_by_id",
                new
                {
                    voucher_id = request.Id
                }
            );

            return data;
        }
    }
}