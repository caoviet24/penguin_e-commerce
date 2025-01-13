using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos;
using Application.Common.Dtos.ResponData;
using Dapper;
using MediatR;

namespace Application.SaleBill.Queries.Buyer.GetByStatus
{
    public class GetBillByStatusAndBuyerIdQuery : IRequest<ResponDataDto>
    {
        public string buyer_id { get; set; } = null!;
        public int status { get; set; }
        public int page_number { get; set; }
        public int page_size { get; set; }
    }
    public class GetBillByStatusAndBuyerIdHandler(IDbConnection dbConnection) : IRequestHandler<GetBillByStatusAndBuyerIdQuery, ResponDataDto>
    {

        public async Task<ResponDataDto> Handle(GetBillByStatusAndBuyerIdQuery request, CancellationToken cancellationToken)
        {
            var billData = await dbConnection.QueryMultipleAsync
            (
                "sp_get_bills_by_status_and_buyer_id",
                new
                {
                    buyer_id = request.buyer_id,
                    status = request.status,
                    page_number = request.page_number,
                    page_size = request.page_size
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

            return new ResponDataDto
            {
                total_record = billDic.Count,
                page_number = request.page_number,
                page_size = request.page_size,
                data = billDic.Values
            };
        }

    }
}