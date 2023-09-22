using ClientPortal.Models.RequestModels;
using ClientPortal.Models.ResponseModels;
using Dapper;
using Newtonsoft.Json;

namespace ClientPortal.Data.Repositories
{
    public interface IPortalSpRepository
    {
        public Task<GetSmartServicesSpResponse> GetSmartServices(GetSmartServicesSpRequest request);
        Task<SmartServiceTenantSpResponse> GetSmartServicesForTenant(SmartServicesTenantSpRequest request);
    }
    public class PortalSpRepository : IPortalSpRepository
    {
        private readonly ILogger<PortalSpRepository> _logger;
        private readonly PortalDBContext _dbContext;

        public PortalSpRepository(ILogger<PortalSpRepository> logger, PortalDBContext dbContext)
        {
            _logger = logger;
            _dbContext = dbContext;
        }

        public async Task<GetSmartServicesSpResponse> GetSmartServices(GetSmartServicesSpRequest request)
        {
            return await RunStoredProcedureAsync<GetSmartServicesSpResponse, GetSmartServicesSpRequest>("spGetSmartServices", request);
        }

        public async Task<SmartServiceTenantSpResponse> GetSmartServicesForTenant(SmartServicesTenantSpRequest request)
        {
            return await RunStoredProcedureAsync<SmartServiceTenantSpResponse, SmartServicesTenantSpRequest>("spGetSmartServicesTenant", request);
        }

        private async Task<T> RunStoredProcedureAsync<T, TArgumentClass>(string procedure, TArgumentClass? args = default) where T : new()
        {
            var connection = _dbContext.Database.GetDbConnection();
            if (connection.State == System.Data.ConnectionState.Closed)
                await connection.OpenAsync();

            string commandText = $"exec {procedure}";

            // add arguments
            if (args is not null)
            {
                var argumentProperties = typeof(TArgumentClass).GetProperties();

                var arguments = string.Join(", ", argumentProperties.Select(property =>
                {
                    var value = property.GetValue(args);
                    if (value is int || value is bool)
                    {
                        int intValue = (value is bool bit) ? (bit ? 1 : 0) : Convert.ToInt32(value);
                        return $"@{property.Name} = {intValue}";
                    }
                    else
                    {
                        return $"@{property.Name} = '{value}'";
                    }
                }));

                commandText += $" {arguments}";
            }

            using (var results = await connection.QueryMultipleAsync(commandText))
            {
                if (results == null)
                {
                    _logger.LogError($"Not time to run yet...");
                    return default(T);
                }

                var combinedResult = new T();

                foreach (var property in typeof(T).GetProperties())
                {
                    if (property.PropertyType.IsGenericType && property.PropertyType.GetGenericTypeDefinition() == typeof(List<>))
                    {
                        var resultType = property.PropertyType.GetGenericArguments()[0];
                        var result = await results.ReadAsync(resultType);
                        var resultList = JsonConvert.DeserializeObject(JsonConvert.SerializeObject(result), property.PropertyType);
                        property.SetValue(combinedResult, resultList);
                    }
                }

                return combinedResult;
            }
        }

        private async Task RunStoredProcedureAsync<TArgumentClass>(string procedure, TArgumentClass? args = default)
        {
            var connection = _dbContext.Database.GetDbConnection();
            if (connection.State == System.Data.ConnectionState.Closed)
                await connection.OpenAsync();

            string commandText = $"exec {procedure}";

            // add arguments
            if (args is not null)
            {
                var argumentProperties = typeof(TArgumentClass).GetProperties();

                var arguments = string.Join(", ", argumentProperties.Select(property =>
                {
                    var value = property.GetValue(args);
                    if (value is int || value is bool)
                    {
                        int intValue = (value is bool bit) ? (bit ? 1 : 0) : Convert.ToInt32(value);
                        return $"@{property.Name} = {intValue}";
                    }
                    else
                    {
                        return $"@{property.Name} = '{value}'";
                    }
                }));

                commandText += $" {arguments}";
            }

            using (var results = await connection.QueryMultipleAsync(commandText))
            {
                if (results == null)
                {
                    _logger.LogError($"Not time to run yet...");
                    return;
                }

                return;
            }
        }
    }
}
