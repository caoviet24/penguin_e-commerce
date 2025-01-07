using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Domain.Enums
{
    public enum StatusOrderItem
    {
        none = -1,
        waiting = 0,
        shipping = 1,
        cancel = 2,
        back = 3,
        done = 4,

    }
}