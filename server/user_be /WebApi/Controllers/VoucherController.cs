using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos;
using Application.Common.Dtos.ResponData;
using Application.Voucher.Commands.Active;
using Application.Voucher.Commands.Create;
using Application.Voucher.Commands.DeleteSoft;
using Application.Voucher.Commands.InActive;
using Application.Voucher.Commands.Restore;
using Application.Voucher.Commands.Update;
using Application.Voucher.Commands.UpdateQuantity;
using Application.Voucher.Queries.GetDeleted;
using Application.Voucher.Queries.GetInActive;
using Application.Voucher.Queries.GetVoucherActive;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace WebApi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("voucher")]
    public class VoucherController(IMediator mediator, ILogger<VoucherController> logger) : ControllerBase
    {


        [HttpGet("get-active")]
        public Task<ResponDataDto> getActive([FromQuery] GetVoucherActiveQuery query)
        {
            logger.LogInformation("Get active voucher");
            return mediator.Send(query);
        }
        [HttpPut("update-quantity")]
        public Task<VoucherDto> updateQuantity([FromBody] UpdateQuantityVoucherCommand command)
        {
            logger.LogInformation("Update quantity voucher with id: {id}", command.Id);
            return mediator.Send(command);
        }

    }
}