using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos;
using MediatR;
using WebApi.DBHelper;

namespace Application.MyBooth .Commands.DeleteBooth
{
    public class DeleteBoothCommand : IRequest<BoothDto>
    {
        public string booth_id { get; set; } = null!;
    }
    public class DeleteBoothHandler(IDbHelper dbHelper) : IRequestHandler<DeleteBoothCommand,BoothDto>
    {
        public async Task<BoothDto> Handle(DeleteBoothCommand request, CancellationToken cancellationToken)
        {
            var data = await dbHelper.QueryProceduceSingleDataAsync<BoothDto>
            (
                "sp_delete_booth_by_id",
                new
                {
                    booth_id = request.booth_id,
                }
            );
            return data;
        }
    }
}