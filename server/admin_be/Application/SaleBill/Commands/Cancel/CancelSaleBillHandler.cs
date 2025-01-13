using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos;
using Dapper;
using MediatR;

namespace Application.SaleBill.Commands.Cancel
{
    public class CancelSaleBillCommand : IRequest<SaleBillDto>
    {
        public string bill_id { get; set; } = null!;
    }
    public class CancelSaleBillHandler(IDbConnection dbConnection) : IRequestHandler<CancelSaleBillCommand, SaleBillDto>
    {
        public async Task<SaleBillDto> Handle(CancelSaleBillCommand request, CancellationToken cancellationToken)
        {
            var billData = await dbConnection.QueryMultipleAsync
            (
                "sp_update_status_sale_bill",
                new
                {
                    bill_id = request.bill_id,
                    status = 4
                },
                commandType: CommandType.StoredProcedure
            );


            Dictionary<string, SaleBillDto> billDic = new Dictionary<string, SaleBillDto>();

            billData.Read<BoothDto, SaleBillDto, SaleBillDetailDto, ProductDetailDto, SaleBillDto>
            (
                (booth, bill, detail, product) =>
                {
                    if (booth.Id != null)
                    {
                        bill.Booth = booth;
                    }

                    if (!billDic.TryGetValue(bill.Id, out var billEntry))
                    {
                        billEntry = bill;
                        billDic.Add(billEntry.Id, billEntry);
                    }


                    if (detail.product_detail_id != null)
                    {
                        detail.product_detail = product;
                        billEntry.list_sale_bill_detail.Add(detail);
                    }

                    return billEntry;
                },
                splitOn: "seller_id, sale_bill_id, Id"
            );

            return billDic.Values.FirstOrDefault();
        }
    }

}