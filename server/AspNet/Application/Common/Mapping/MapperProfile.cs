using Application.Account.Commands.Update;
using Application.Category.Commands.Create;
using Application.Category.Commands.Update;
using Application.CategoryDetail.Commands.Create;
using Application.CategoryDetail.Commands.Update;
using Application.Dtos;
using Application.Dtos.Account;
using Application.Identities.Commands.SignUp;
using Application.MyBooth.Commands.CreateBooth;
using Application.MyBooth.Commands.UpdateBooth;
using Application.Notification.Commands.Create;
using Application.OrderItem.Commands.Create;
using Application.Product.Create;
using Application.ProductReview.Commands.Create;
using Application.SaleBill.Commands.Create;
using Application.Voucher.Commands.Create;
using AutoMapper;
using Domain.Entities;

namespace Application.Common.Mapping
{
    public class MapperProfile : Profile
    {
        public MapperProfile()
        {
            CreateMap<AccountEntity, AccountDto>().ReverseMap();
            CreateMap<AccountEntity, CreateSignUpCommand>().ReverseMap();
            CreateMap<AccountEntity, UpdateAccountCommand>().ReverseMap();


            CreateMap<BoothEntity, CreateBoothCommand>().ReverseMap();
            CreateMap<BoothEntity, UpdateBoothCommand>().ReverseMap();
            CreateMap<BoothEntity, BoothDto>().ReverseMap();

            CreateMap<CategoryEntity, CreateCategoryCommand>().ReverseMap();
            CreateMap<CategoryEntity, UpdateCategoryCommand>().ReverseMap();
            CreateMap<CategoryEntity, CategoryDto>().ReverseMap();


            CreateMap<CategoryDetailEntity, CategoryDetailDto>().ReverseMap();
            CreateMap<CategoryDetailEntity, CreateCategoryDetailCommand>().ReverseMap();
            CreateMap<CategoryDetailEntity, CreateCategoryDetail2Command>().ReverseMap();
            CreateMap<CategoryDetailEntity, UpdateCategoryDetailCommand>().ReverseMap();

            CreateMap<ProductEntity, CreateProductCommand>().ReverseMap();
            CreateMap<ProductEntity, ProductDto>()
                .ForMember(dest => dest.booth_id, opt => opt.MapFrom(src => src.created_by))
                .ReverseMap()
                .ForMember(dest => dest.created_by, opt => opt.MapFrom(src => src.booth_id));


            CreateMap<ProductDetailEntity, CreateProductDetailCommand>().ReverseMap();
            CreateMap<ProductDetailEntity, ProductDetailDto>().ReverseMap();

            CreateMap<ProductReviewEntity, CreateProductReviewCommand>().ReverseMap();
            CreateMap<ProductReviewEntity, ProductReviewDto>().ReverseMap();
            CreateMap<ReviewMedia, ReviewMediaDto>().ReverseMap();


            CreateMap<OrderItemEntity, CreateOrderItemCommand>().ReverseMap();
            CreateMap<OrderItemEntity, OrderItemDto>()
                .ForMember(dest => dest.product_detail, opt => opt.MapFrom(src => src.ProductDetail))
                .ForMember(dest => dest.buyer_id, opt => opt.MapFrom(src => src.created_by))
                .ReverseMap()
                .ForMember(dest => dest.ProductDetail, opt => opt.MapFrom(src => src.product_detail))
                .ForMember(dest => dest.created_by, opt => opt.MapFrom(src => src.buyer_id));

            CreateMap<SaleBillEntity, SaleBillDto>().ReverseMap();
            CreateMap<CreateSaleBillCommand, SaleBillEntity>().ReverseMap();

            CreateMap<SaleBillDetailEntity, SaleBillDetailDto>().ReverseMap();
            CreateMap<CreateSaleBillDetailCommand, SaleBillDetailEntity>().ReverseMap();

            CreateMap<VoucherUseSaleBillEntity, CreateVoucherUseBillSaleCommand>().ReverseMap();
            CreateMap<VoucherUseSaleBillEntity, CreateVoucherUseBillSaleCommand>().ReverseMap();

            CreateMap<VoucherEntity, CreateVoucherCommand>().ReverseMap();
            CreateMap<VoucherEntity, VoucherDto>().ReverseMap();

            CreateMap<CreateNotifyCommand, NotifyEntity>().ReverseMap();
            CreateMap<NotifyEntity, NotifyDto>().ReverseMap();


            CreateMap<RefreshTokenEntity, RefreshTokenDto>().ReverseMap();
        }
    }
}