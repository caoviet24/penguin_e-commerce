using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;
using Domain.Common;

namespace Domain.Entities
{
    public class UserEntity : BaseEntity
    {
        public string full_name { get; set; } = null!;
        public string nick_name { get; set; } = null!;
        public string gender { get; set; } = null!;
        public DateTime birth { get; set; }
        public string avatar { get; set; } = null!;
        public string address { get; set; } = null!;
        public string phone { get; set; } = null!;
        public virtual AccountEntity Account { get; set; } = null!;
    }
}