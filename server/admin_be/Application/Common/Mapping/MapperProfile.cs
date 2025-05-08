using Application.User.Commands.Update;
using AutoMapper;
using Domain.Entities;

namespace Application.Common.Mapping
{
    public class MapperProfile : Profile
    {
        public MapperProfile()
        {
            CreateMap<UserEntity, UpdateUserCommand>().ReverseMap();
        }
    }
}