using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos;
using Application.Interface;
using Dapper;
using MediatR;
using WebApi.DBHelper;

namespace Application.MyBooth .Commands.UpdateBooth
{

     public class UpdateBoothCommand : IRequest<BoothDto>
    {
        public string booth_id { get; set; } = null!;
        public string booth_name { get; set; } = null!;
        public string booth_description { get; set; } = null!;
        public string booth_avatar { get; set; } = null!;
        public bool is_active { get; set; } 
        public bool is_banned { get; set; } 
    }
    public class UpdateByIdHandler(IDbHelper dbHelper, IUser user) : IRequestHandler<UpdateBoothCommand, BoothDto>
    {
        public async Task<BoothDto> Handle(UpdateBoothCommand request, CancellationToken cancellationToken)
        {
            var data = await dbHelper.QueryProceduceSingleDataAsync<BoothDto>
                (
                    "sp_update_booth_by_id",
                    new 
                    {
                        booth_id = request.booth_id,
                        booth_name = request.booth_name,
                        booth_description = request.booth_description,
                        avatar = request.booth_avatar,
                        is_active = request.is_active,
                        is_banned = request.is_banned,
                        last_updated = DateTime.UtcNow,
                        updated_by = user.getCurrentUser()
                    }
                );

            return data;
        }
    }
}