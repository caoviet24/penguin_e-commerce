using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos;
using MediatR;
using WebApi.DBHelper;

namespace Application.Voucher.Commands.InActive
{
    public class InActiveVoucherCommand : IRequest<VoucherDto>
    {
        public string Id { get; set; } = null!;
    }
    public class InActiveVoucherHandler(IDbHelper dbHelper) : IRequestHandler<InActiveVoucherCommand, VoucherDto>
    {
        public async Task<VoucherDto> Handle(InActiveVoucherCommand request, CancellationToken cancellationToken)
        {
            var data = await dbHelper.QueryProceduceSingleDataAsync<VoucherDto>(
                "sp_inactive_voucher_by_id",
                new
                {
                    voucher_id = request.Id
                }
            );

            return data;
        }
    }
}