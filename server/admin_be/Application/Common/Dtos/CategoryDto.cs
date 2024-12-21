

using Application.Common.Dtos;

namespace Application.Dtos
{
    public class CategoryDto
    {
        public string Id { get; set; } = null!;
        public string category_name { get; set; }  = null!;
        public DateTime created_at { get; set; }
        public DateTime last_updated { get; set; }
        public string created_by { get; set; }  = null!;
        public string updated_by { get; set; }  = null!;

        public List<CategoryDetailDto> list_category_detail { get; set; } = new List<CategoryDetailDto>();
    }
}