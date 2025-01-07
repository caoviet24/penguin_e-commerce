using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos;
using Application.Interface;
using MediatR;
using WebApi.DBHelper;

namespace Application.MyBooth.Commands.UpdateBooth
{
    public class BanBoothCommand : IRequest<BoothDto>
    {
        public string booth_id { get; set; } = null!;
    }
    public class BanBoothHandler(IDbHelper dbHelper) : IRequestHandler<BanBoothCommand, BoothDto>
    {
        public async Task<BoothDto> Handle(BanBoothCommand request, CancellationToken cancellationToken)
        {
            var data = await dbHelper.ExecuteUpdateProduceByUserAsync<BoothDto>
            (
                "sp_ban_booth_by_id",
                new
                {
                    booth_id = request.booth_id,
                }
            );

            return data;
        }
    }
}