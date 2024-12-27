using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos;
using Application.Interface;
using MediatR;
using WebApi.DBHelper;

namespace Application.MyBooth .Commands.UpdateBooth
{
    public class ActiveBoothCommand : IRequest<BoothDto>
    {
        public string booth_id { get; set; } = null!;
    }
    public class ActiveBoothHandler(IDbHelper dbHelper) : IRequestHandler<ActiveBoothCommand, BoothDto>
    {
        public async Task<BoothDto> Handle(ActiveBoothCommand request, CancellationToken cancellationToken)
        {
            var data = await dbHelper.QueryProceduceByUserAsync<BoothDto>
            (
                "sp_active_booth_by_id",
                new
                {
                    booth_id = request.booth_id,
                }
            );

            return data;
        }
    }
}