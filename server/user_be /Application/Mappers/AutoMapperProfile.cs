using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos;
using Application.Dtos.Account;
using AutoMapper;

namespace Application.Mappers
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<AccountDto, UserDto>()
                .ForMember(dest => dest.user_id, opt => opt.MapFrom(src => src.User.user_id))
                .ForMember(dest => dest.full_name, opt => opt.MapFrom(src => src.User.full_name))
                .ForMember(dest => dest.nick_name, opt => opt.MapFrom(src => src.User.nick_name))
                .ForMember(dest => dest.birth, opt => opt.MapFrom(src => src.User.birth))
                .ForMember(dest => dest.avatar, opt => opt.MapFrom(src => src.User.avatar))
                .ForMember(dest => dest.address, opt => opt.MapFrom(src => src.User.address))
                .ForMember(dest => dest.phone, opt => opt.MapFrom(src => src.User.phone));
        }
    }
}