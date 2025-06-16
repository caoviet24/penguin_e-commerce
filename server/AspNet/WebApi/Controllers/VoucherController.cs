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
using Application.Voucher.Queries;
using Application.Voucher.Queries.GetAll;
using Application.Voucher.Queries.GetWithPagination;
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

        [HttpGet("get-all")]
        public Task<List<VoucherDto>> getAll([FromQuery] GetAllVoucherQuery query)
        {
            logger.LogInformation("Get all vouchers with pagination");
            return mediator.Send(query);
        }

        [HttpGet("get-with-pagination")]
        public Task<ResponDataDto<List<VoucherDto>>> getWithPagination([FromQuery] GetVoucherWithPaginationQuery query)
        {
            logger.LogInformation("Get vouchers with pagination");
            return mediator.Send(query);
        }

        [HttpGet("get-by-id/{id}")]
        public Task<VoucherDto> getById([FromRoute] string id)
        {
            logger.LogInformation("Get voucher by id: {id}", id);
            return mediator.Send(new GetVoucherByIdQuery { voucher_id = id });
        }

        [HttpPost("create")]
        public Task<VoucherDto> create([FromBody] CreateVoucherCommand command)
        {
            logger.LogInformation("Create voucher with name: {name}", command.voucher_name);
            return mediator.Send(command);
        }

        [HttpPut("update/{id}")]
        public Task<VoucherDto> update([FromBody] UpdateVoucherCommand command)
        {
            logger.LogInformation("update voucher with id: {id}", command.Id);
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

    }
}