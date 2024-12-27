using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Common;

namespace Domain.Entities
{
    public class VerifyAccount : BaseEntity
    {
        public string type_account { get; set; } = null!;
        public string type_identity { get; set; } = null!;
        public string identity { get; set; } = null!;
        public int status_verify { get; set; }
        public virtual AccountEntity Account { get; set; } = null!;
    }
}