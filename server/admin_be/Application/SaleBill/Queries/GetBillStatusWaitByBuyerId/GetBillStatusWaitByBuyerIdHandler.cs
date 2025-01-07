using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos;
using Application.Common.Dtos.ResponData;
using Dapper;
using MediatR;

namespace Application.SaleBill.Queries.GetBillStatusWaitByBuyerId
{
    public class GetBillStatusWaitByBuyerIdQuery : IRequest<ResponDataDto>
    {
        public string buyer_id { get; set; } = null!;
        public int page_number { get; set; }
        public int page_size { get; set; }
    }
    public class GetBillStatusWaitByBuyerIdHandler(IDbConnection dbConnection) : IRequestHandler<GetBillStatusWaitByBuyerIdQuery, ResponDataDto>
    {
        public async Task<ResponDataDto> Handle(GetBillStatusWaitByBuyerIdQuery request, CancellationToken cancellationToken)
        {
            var billData = await dbConnection.QueryMultipleAsync
            (
                "sp_get_bill_status_wait_by_buyer_id",
                new
                {
                    Id = request.buyer_id,
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
                        detail.ProductDetail = product;
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