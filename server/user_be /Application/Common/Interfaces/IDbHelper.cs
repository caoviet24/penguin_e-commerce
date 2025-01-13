using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Dapper;

namespace WebApi.DBHelper
{
    public interface IDbHelper
    {
        Task<T> QueryProceduceSingleDataAsync<T>(string procedureName, object parameters);
        Task<T> ExecuteUpdateProduceByUserAsync<T>(string procedureName, object parameters);
        Task<T> QueryProceduceByUserAsync<T>(string procedureName, object parameters);
        Task<List<T>> QueryProceduceMultiDataAsync<T>(string procedureName, object parameters);
    }
}