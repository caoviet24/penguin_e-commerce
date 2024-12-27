using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos;
using Application.Dtos.Account;
using Application.Interface;
using AutoMapper;
using BCrypt.Net;
using Dapper;
using Domain.Entities;
using Domain.enums;
using Domain.Exceptions;
using MediatR;
using WebApi.DBHelper;

namespace Application.Identities.Commands.SignUp
{
    public class CreateSignUpCommand : IRequest<AccountDto>
    {
        public string username { get; set; } = null!;
        public string password { get; set; } = null!;
        public string full_name { get; set; } = null!;
        public int gender { get; set; }
        public DateTime birth { get; set; }
        public string avatar { get; set; } = null!;
        public string address { get; set; } = null!;
        public string phone { get; set; } = null!;
    }
    public class CreateSignUpHandler(IDbConnection dbConnection, IMapper mapper) : IRequestHandler<CreateSignUpCommand, AccountDto>
    {

        public async Task<AccountDto> Handle(CreateSignUpCommand request, CancellationToken cancellationToken)
        {

            var checkExitAccount = await dbConnection.QueryFirstOrDefaultAsync<AccountEntity>
            (
                "sp_get_account_by_username",
                new
                {
                    username = request.username
                }
            );
            if (checkExitAccount?.Id != null)
            {
                throw new BadRequestException("username is already exist");
            }


            Dictionary<string, AccountDto> accDic = new Dictionary<string, AccountDto>();


            string acc_id = Guid.NewGuid().ToString();
            var accountNew = await dbConnection.QueryAsync<AccountDto, UserDto, AccountDto>
            (
                "sp_create_account",
                (acc, user) =>
                {
                    if (!accDic.TryGetValue(acc.Id, out var accEntry))
                    {
                        accEntry = acc;
                        accEntry.User = user;
                        accDic.Add(accEntry.Id, accEntry);

                    }

                    if (accEntry.User.user_id != null)
                    {
                        accEntry.User = user;
                    }

                    return accEntry;

                },
                new
                {
                    acc_id,
                    username = request.username,
                    password = BCrypt.Net.BCrypt.HashPassword(request.password, 10),
                    role = Role.User.ToString(),
                    is_banned = false,
                    created_at = DateTime.Now,
                    updated_at = DateTime.Now,

                    user_id = Guid.NewGuid().ToString(),
                    full_name = request.full_name,
                    nick_name = $"user_{new Random().Next(10000, 99999)}",
                    gender = request.gender == 0 ? "Nam" : "Nữ",
                    birth = request.birth,
                    avatar = request.avatar,
                    address = request.address,
                    phone = request.phone,
                    last_updated = DateTime.Now,
                    updated_by = acc_id,
                },
                commandType: CommandType.StoredProcedure,
                splitOn: "user_id"
            );

            return accDic.Values.First();


        }
    }
}