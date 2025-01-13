using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos;
using Dapper;
using MediatR;

namespace Application.SaleBill.Commands.UpdateStatus
{
    public class UpdateStatusBillCommand : IRequest<SaleBillDto>
    {
        public string bill_id { get; set; } = null!;
        public int status { get; set; }
    }
    public class UpdateStatusBillHandler(IDbConnection dbConnection) : IRequestHandler<UpdateStatusBillCommand, SaleBillDto>
    {
        public async Task<SaleBillDto> Handle(UpdateStatusBillCommand request, CancellationToken cancellationToken)
        {
            var billData = await dbConnection.QuerySingleOrDefaultAsync
            (
                "sp_update_status_sale_bill",
                new
                {
                    bill_id = request.bill_id,
                    status = request.status
                },
                commandType: CommandType.StoredProcedure
            );

            return billData;
        }
    }
}