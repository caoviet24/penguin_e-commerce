using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos;
using Application.Common.Dtos.ResponData;
using Dapper;
using Domain.Exceptions;
using MediatR;
using WebApi.DBHelper;

namespace Application.MyBooth.Queries.GetByAccId
{
    public class GetBoothByAccIdQuery : IRequest<BoothDto>
    {
        public string acc_id { get; set; } = null!;
    }
    public class GetBoothByAccIdHandler(IDbConnection dbConnection) : IRequestHandler<GetBoothByAccIdQuery, BoothDto>
    {
        public async Task<BoothDto> Handle(GetBoothByAccIdQuery request, CancellationToken cancellationToken)
        {
            var boothData = await dbConnection.QueryAsync<BoothDto>
            (
                "sp_get_booth_by_acc_id",
                new
                {
                    acc_id = request.acc_id
                },
                commandType: CommandType.StoredProcedure
            );
            if(boothData == null)
            {
                throw new NotFoundException("Gian hàng không tồn tại!");
            }

            return boothData.First();    
        }
    }
}