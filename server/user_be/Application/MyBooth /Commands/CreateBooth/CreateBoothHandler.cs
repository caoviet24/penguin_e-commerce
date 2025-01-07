using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos;
using Application.Interface;
using Domain.Exceptions;
using MediatR;
using WebApi.DBHelper;

namespace Application.MyBooth.Commands.CreateBooth
{
    public class CreateBoothCommand : IRequest<BoothDto>
    {
        public string booth_name { get; set; } = null!;
        public string booth_description { get; set; } = null!;
        public string avatar { get; set; } = null!;
    }
    public class CreateBoothHandler(IDbHelper dbHelper) : IRequestHandler<CreateBoothCommand, BoothDto>
    {
        public async Task<BoothDto> Handle(CreateBoothCommand request, CancellationToken cancellationToken)
        {
            var checkBoothExited = await dbHelper.QueryProceduceSingleDataAsync<BoothDto>
            (
                "sp_get_booth_by_name_pagination",
                new
                {
                    page_number = 1,
                    page_size = 1,
                    booth_name = request.booth_name
                }
            );
        
        

            if(checkBoothExited != null)
            {
                throw new BadRequestException("Booth is already exist");
            }

            var data = await dbHelper.QueryProceduceByUserAsync<BoothDto>
            (
                "sp_create_my_booth",
                new
                {
                    booth_id = Guid.NewGuid().ToString(),
                    booth_name = request.booth_name,
                    booth_description = request.booth_description,
                    avatar = request.avatar,
                    is_banned = false,
                    is_active = false
                }
            );

            return data;
        }
    }
}