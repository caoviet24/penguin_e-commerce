using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Dapper;
using Microsoft.Data.SqlClient;
using Application.Interface;

namespace WebApi.DBHelper
{
    public class DbHepler(IDbConnection dbConnection, IUser user) : IDbHelper
    {
        public async Task<T> QueryProceduceSingleDataAsync<T>(string procedureName, object parameters)
        {
            var dynamicParameters = new DynamicParameters(parameters);

           
                var result = await dbConnection.QueryFirstOrDefaultAsync<T>
                (
                    procedureName,
                    dynamicParameters,
                    commandType: CommandType.StoredProcedure
                );

                if (result == null)
                {
                    return default!;
                }

                return result;
            
        }


        public async Task<List<T>> QueryProceduceMultiDataAsync<T>(string procedureName, object parameters)
        {
            var dynamicParameters = new DynamicParameters(parameters);
            try
            {
                var result = (await dbConnection.QueryAsync<T>
                (
                    procedureName,
                    dynamicParameters,
                    commandType: CommandType.StoredProcedure
                )).ToList();

                if (result == null)
                {

                    return default!;
                }

                return result;
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException("Error executing query.", ex);
            }
        }

        public async Task<T> QueryProceduceByUserAsync<T>(string procedureName, dynamic parameters)
        {
            var dynamicParameters = new DynamicParameters(parameters);
            dynamicParameters.Add("created_at", DateTime.Now);
            dynamicParameters.Add("last_updated", DateTime.Now);
            dynamicParameters.Add("created_by", user.getCurrentUser());
            dynamicParameters.Add("updated_by", user.getCurrentUser());

            try
            {
                var result = await dbConnection.QueryFirstOrDefaultAsync<T>
                (
                    procedureName,
                    dynamicParameters,
                    commandType: CommandType.StoredProcedure
                );

                if (result == null)
                {
                    return default!;
                }
                return result;
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException("Error executing query.", ex);
            }
        }


    }
}