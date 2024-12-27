using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos;
using Application.Common.Dtos.ResponData;
using Application.Voucher.Commands.CreateVoucher;
using Application.Voucher.Queries.GetVoucherInactivePagination;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace WebApi.Controllers
{
    [Authorize]
    [Route("voucher")]
    public class VoucherController(IMediator mediator, ILogger<VoucherController> logger) : ControllerBase
    {

        [HttpGet("get-inactive")]
        public Task<ResponDataDto> getInactive([FromQuery] GetVoucherInactivePaginationQuery query)
        {
            logger.LogInformation("Get inactive voucher");
            return mediator.Send(query);
        }

        [HttpPost("create")]
        public Task<VoucherDto> create([FromBody] CreateVoucherCommand command) 
        {
            logger.LogInformation("Create voucher with name: {name}", command.voucher_name);
            return mediator.Send(command);
        }

    }
}