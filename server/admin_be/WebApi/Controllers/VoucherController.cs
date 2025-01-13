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

        [HttpGet("get-inactive")]
        public Task<ResponDataDto> getInactive([FromQuery] GetVoucherInActiveQuery query)
        {
            logger.LogInformation("Get inactive voucher");
            return mediator.Send(query);
        }

        [HttpGet("get-active")]
        public Task<ResponDataDto> getActive([FromQuery] GetVoucherActiveQuery query)
        {
            logger.LogInformation("Get active voucher");
            return mediator.Send(query);
        }

        [HttpGet("get-deleted")]
        public Task<ResponDataDto> getDeleted([FromQuery] GetVoucherDeletedQuery query)
        {
            logger.LogInformation("Get deleted voucher");
            return mediator.Send(query);
        }
        [HttpPost("create")]
        public Task<VoucherDto> create([FromBody] CreateVoucherCommand command)
        {
            logger.LogInformation("Create voucher with name: {name}", command.voucher_name);
            return mediator.Send(command);
        }

        [HttpPut("update")]
        public Task<VoucherDto> update([FromBody] UpdateVoucherCommand command)
        {
            logger.LogInformation("update voucher with id: {id}", command.voucher_id);
            return mediator.Send(command);
        }

        [HttpPut("active/{id}")]
        public Task<VoucherDto> active([FromRoute] ActiveVoucherCommand command)
        {
            logger.LogInformation("active voucher with id: {id}", command.Id);
            return mediator.Send(command);
        }

        [HttpPut("inactive/{id}")]
        public Task<VoucherDto> inActive([FromRoute] InActiveVoucherCommand command)
        {
            logger.LogInformation("inactive voucher with id: {id}", command.Id);
            return mediator.Send(command);
        }

        [HttpPut("delete-soft/{id}")]
        public Task<VoucherDto> deleteSoft([FromRoute] DeleteSoftVoucherCommand command)
        {
            logger.LogInformation("Delete soft voucher with id: {id}", command.Id);
            return mediator.Send(command);
        }

        [HttpPut("restore/{id}")]
        public Task<VoucherDto> restore([FromRoute] RestoreVoucherCommand command)
        {
            logger.LogInformation("Restore voucher with id: {id}", command.Id);
            return mediator.Send(command);
        }

        [HttpPut("update-quantity")]
        public Task<VoucherDto> updateQuantity([FromBody] UpdateQuantityVoucherCommand command)
        {
            logger.LogInformation("Update quantity voucher with id: {id}", command.Id);
            return mediator.Send(command);
        }

    }
}