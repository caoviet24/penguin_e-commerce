using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Domain.Enums.status
{
    public enum StatusBillSale
    {
        WAITING = 0,
        SELLER_CANCEL = 1,
        SHIPPING = 2,
        DONE = 3,
        USER_CANCEL = 4,
        BACK_PENDING = 5,
        BACK_REJECT = 6,
        BACK_SUCCESS = 7,
    }
}