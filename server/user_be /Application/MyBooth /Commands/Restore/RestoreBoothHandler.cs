using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos;
using MediatR;
using WebApi.DBHelper;

namespace Application.MyBooth.Commands.Restore
{
    public class RestoreBoothCommand : IRequest<BoothDto>
    {
        public string booth_id { get; set; } = null!;
    }
    public class RestoreBoothHandler(IDbHelper dbHelper) : IRequestHandler<RestoreBoothCommand, BoothDto>
    {
        public async Task<BoothDto> Handle(RestoreBoothCommand request, CancellationToken cancellationToken)
        {
            var data = await dbHelper.QueryProceduceSingleDataAsync<BoothDto>
            (
                "sp_restore_booth_by_id",
                new
                {
                    booth_id = request.booth_id
                }
            );
            return data;
        }
    }
}