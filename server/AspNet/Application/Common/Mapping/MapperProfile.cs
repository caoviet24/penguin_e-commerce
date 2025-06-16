using Application.Account.Commands.Update;
using Application.BackBill.Command.Create;
using Application.BackBill.Command.Update;
using Application.Category.Commands.Create;
using Application.Category.Commands.Update;
using Application.CategoryDetail.Commands.Create;
using Application.CategoryDetail.Commands.Update;
using Application.DeliveryAddress.Commands.Create;
using Application.DeliveryAddress.Commands.Update;
using Application.Dtos;
using Application.Dtos.Account;
using Application.Identities.Commands.SignUp;
using Application.MyBooth.Commands.CreateBooth;
using Application.MyBooth.Commands.UpdateBooth;
using Application.Notification.Commands.Create;
using Application.OrderItem.Commands.Create;
using Application.Product.Create;
using Application.ProductDetail.Commands.Create;
using Application.ProductDetail.Commands.Update;
using Application.ProductReview.Commands.Create;
using Application.SaleBill.Commands.Create;
using Application.Voucher.Commands.Create;
using Application.Voucher.Commands.Update;
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

            CreateMap<ProductEntity, CreateProductCommand>()
                .ForMember(dest => dest.booth_id, opt => opt.MapFrom(src => src.created_by))
                .ReverseMap()
                .ForMember(dest => dest.created_by, opt => opt.MapFrom(src => src.booth_id));

            CreateMap<ProductEntity, ProductDto>()
                .ForMember(dest => dest.booth_id, opt => opt.MapFrom(src => src.created_by))
                .ReverseMap()
                .ForMember(dest => dest.created_by, opt => opt.MapFrom(src => src.booth_id));


            CreateMap<ProductDetailEntity, ProductDetailDto>().ReverseMap();
            CreateMap<ProductDetailEntity, CreateProductDetailCommand>().ReverseMap();
            CreateMap<ProductDetailEntity, CreateProductDetailCommand2>().ReverseMap();
            CreateMap<ProductDetailEntity, UpdateProductDetailCommand>().ReverseMap();

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

            CreateMap<SaleBillEntity, SaleBillDto>()
                .ForMember(dest => dest.seller_id, opt => opt.MapFrom(src => src.booth_id))
                .ForMember(dest => dest.buyer_id, opt => opt.MapFrom(src => src.created_by))
                .ForMember(dest => dest.booth, opt => opt.MapFrom(src => src.MyBooth))
                .ForMember(dest => dest.delivery_address, opt => opt.MapFrom(src => src.AddressDelivery))
                .ForMember(dest => dest.list_sale_bill_detail, opt => opt.MapFrom(src => src.ListSaleBillDetail))
                .ForMember(dest => dest.back_bill, opt => opt.MapFrom(src => src.BackBill))
                .ReverseMap()
                .ForMember(dest => dest.booth_id, opt => opt.MapFrom(src => src.seller_id))
                .ForMember(dest => dest.created_by, opt => opt.MapFrom(src => src.buyer_id))
                .ForMember(dest => dest.MyBooth, opt => opt.MapFrom(src => src.booth))
                .ForMember(dest => dest.AddressDelivery, opt => opt.MapFrom(src => src.delivery_address))
                .ForMember(dest => dest.ListSaleBillDetail, opt => opt.MapFrom(src => src.list_sale_bill_detail))
                .ForMember(dest => dest.BackBill, opt => opt.MapFrom(src => src.back_bill));

            CreateMap<CreateSaleBillCommand, SaleBillEntity>()
               .ForMember(dest => dest.booth_id, opt => opt.MapFrom(src => src.seller_id))
                .ReverseMap()
                .ForMember(dest => dest.seller_id, opt => opt.MapFrom(src => src.booth_id));


            CreateMap<SaleBillDetailEntity, SaleBillDetailDto>()
                .ForMember(dest => dest.product_name, opt => opt.MapFrom(src => src.ProductDetail.product_name))
                .ForMember(dest => dest.image, opt => opt.MapFrom(src => src.ProductDetail.image))
                .ForMember(dest => dest.sale_price, opt => opt.MapFrom(src => src.ProductDetail.sale_price))
                .ForMember(dest => dest.promotional_price, opt => opt.MapFrom(src => src.ProductDetail.promotional_price))
                .ForMember(dest => dest.product_detail, opt => opt.MapFrom(src => src.ProductDetail))
                .ReverseMap();
            CreateMap<CreateSaleBillDetailCommand, SaleBillDetailEntity>().ReverseMap();
            CreateMap<AddressDeliveryEntity, DeliveryAddressDto>().ReverseMap();
            CreateMap<CreateDeliveryAddressCommand, AddressDeliveryEntity>().ReverseMap();
            CreateMap<UpdateDeliveryAddressCommand, AddressDeliveryEntity>().ReverseMap();

            CreateMap<VoucherUseSaleBillEntity, CreateVoucherUseBillSaleCommand>().ReverseMap();
            CreateMap<VoucherUseSaleBillEntity, CreateVoucherUseBillSaleCommand>().ReverseMap();

            CreateMap<VoucherEntity, CreateVoucherCommand>().ReverseMap();
            CreateMap<VoucherEntity, UpdateVoucherCommand>().ReverseMap();
            CreateMap<VoucherEntity, VoucherDto>().ReverseMap();

            CreateMap<BackBillEntity, BackBillDto>()
                .ForMember(dest => dest.account, opt => opt.MapFrom(src => src.Buyer))
                .ReverseMap();
            CreateMap<CreateBackBillCommand, BackBillEntity>().ReverseMap();
            CreateMap<UpdateBackBillCommand, BackBillEntity>().ReverseMap();

            CreateMap<CreateNotifyCommand, NotifyEntity>().ReverseMap();
            CreateMap<NotifyEntity, NotifyDto>().ReverseMap();


            CreateMap<RefreshTokenEntity, RefreshTokenDto>().ReverseMap();

        }
    }
}