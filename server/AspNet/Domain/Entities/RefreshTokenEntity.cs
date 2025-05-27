using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Common;

namespace Domain.Entities
{
    public class RefreshTokenEntity : BaseEntity
    {
        public string refresh_token { get; set; } = null!;
        public virtual AccountEntity Account { get; set; } = null!;
    }
}