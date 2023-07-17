using ClientPortal.Models.RequestModels;
using ClientPortal.Models.ResponseModels;
using Dapper;
using Newtonsoft.Json;

namespace ClientPortal.Data.Repositories
{
    public interface IUmfaRepository
    {
        #region Reports
        public Task<UtilityRecoveryReportSpResponse> GetUtilityRecoveryReportAsync(UtilityRecoveryReportRequest request);
        public Task<ShopUsageVarianceSpResponse> GetShopUsageVarianceReportAsync(ShopUsageVarianceRequest request);
        public Task<ShopCostVarianceSpResponse> GetShopCostVarianceReportAsync(ShopUsageVarianceRequest request);
        public Task<ConsumptionSummarySpResponse> GetConsumptionSummaryReport(ConsumptionSummarySpRequest request);
        public Task<ConsumptionSummaryReconResponse> GetConsumptionSummaryReconReport(ConsumptionSummaryReconRequest request);
        #endregion

        #region Basic
        public Task AddMappedMeterAsync(MappedMeterSpRequest request);
        public Task<UMFAShopsSpResponse> GetShopsAsync(UmfaShopsRequest request);
        public Task<UMFATenantsSpResponse> GetTenantsAsync(UmfaTenantsSpRequest request);
        public Task<UMFAShopsSpResponse> GetTenantShopsAsync(UmfaTenantShopsSpRequest request);
        #endregion

        public Task<TenantSlipCardInfoSpResponse> GetTenantSlipCardInfoAsync(TenantSlipCardInfoSpRequest request);
        public Task<TenantSlipCriteriaSpResponse> GetTenantSlipCriteriaAsync(TenantSlipCriteriaSpRequest request);
        public Task<TenantSlipReportSpResponse> GetTenantSlipReportsAsync(TenantSlipReportSpRequest request);
        public Task<TenantSlipDataSpResponse> GetTenantSlipDataAsync(TenantSlipDataSpRequest request);
        public Task<FileFormatDataSpResponse> GetFileFormatData(FileFormatDataSpRequest request);

        public Task UpdateArchiveFileFormatsAsync(UpdateArchiveFileFormatSpRequest request);
    }
    public class UmfaRepository : IUmfaRepository
    {
        private readonly ILogger<UmfaRepository> _logger;
        private readonly UmfaDBContext _context;

        public UmfaRepository(ILogger<UmfaRepository> logger, UmfaDBContext context)
        {
            _logger = logger;
            _context = context;
        }

        private async Task<T> RunStoredProcedureAsync<T, TArgumentClass>(string procedure, TArgumentClass? args = default) where T : new()
        {
            var connection = _context.Database.GetDbConnection();
            if (connection.State == System.Data.ConnectionState.Closed)
                await connection.OpenAsync();

            string commandText = $"exec {procedure}";

            // add arguments
            if(args is not null)
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
            var connection = _context.Database.GetDbConnection();
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

        public async Task<UtilityRecoveryReportSpResponse> GetUtilityRecoveryReportAsync(UtilityRecoveryReportRequest request)
        {

            var result = await RunStoredProcedureAsync<UtilityRecoveryReportSpResponse, UtilityRecoveryReportRequest>("upPortal_UtilityRecoveryReport", request);

            return result;
        }

        public async Task<ShopUsageVarianceSpResponse> GetShopUsageVarianceReportAsync(ShopUsageVarianceRequest request)
        {

            var result = await RunStoredProcedureAsync<ShopUsageVarianceSpResponse, ShopUsageVarianceRequest>("upPortal_RepBuildingShopUsageNoPivot", request);

            return result;
        }

        public async Task<ShopCostVarianceSpResponse> GetShopCostVarianceReportAsync(ShopUsageVarianceRequest request)
        {

            var result = await RunStoredProcedureAsync<ShopCostVarianceSpResponse, ShopUsageVarianceRequest>("upPortal_ShopCostVariance", request);

            return result;
        }

        public async Task AddMappedMeterAsync(MappedMeterSpRequest request)
        {
            await RunStoredProcedureAsync("upInsertMappedItems", request);
        }

        public async Task<UMFAShopsSpResponse> GetShopsAsync(UmfaShopsRequest request)
        {
            return await RunStoredProcedureAsync<UMFAShopsSpResponse, UmfaShopsRequest>("upPortal_GetShopsBuildingPeriod", request);
        }

        public async Task<ConsumptionSummarySpResponse> GetConsumptionSummaryReport(ConsumptionSummarySpRequest request)
        {
            return await RunStoredProcedureAsync<ConsumptionSummarySpResponse, ConsumptionSummarySpRequest>("upPortal_ConsumptionSummary", request);
        }

        public async Task<ConsumptionSummaryReconResponse> GetConsumptionSummaryReconReport(ConsumptionSummaryReconRequest request)
        {
            var response = await RunStoredProcedureAsync<ConsumptionSummaryReconSpResponse, ConsumptionSummaryReconRequest>("upPortal_ConsSummaryRecon", request);
            return new ConsumptionSummaryReconResponse(response);
        }

        public async Task<TenantSlipCardInfoSpResponse> GetTenantSlipCardInfoAsync(TenantSlipCardInfoSpRequest request)
        {
            return await RunStoredProcedureAsync<TenantSlipCardInfoSpResponse, TenantSlipCardInfoSpRequest>("upPortal_TenantSlipCardInfo", request);
        }

        public async Task<TenantSlipCriteriaSpResponse> GetTenantSlipCriteriaAsync(TenantSlipCriteriaSpRequest request)
        {
            return await RunStoredProcedureAsync<TenantSlipCriteriaSpResponse, TenantSlipCriteriaSpRequest>("upPortal_TenantSlipsCriteria", request);
        }

        public async Task<UMFATenantsSpResponse> GetTenantsAsync(UmfaTenantsSpRequest request)
        {
            return await RunStoredProcedureAsync<UMFATenantsSpResponse, UmfaTenantsSpRequest>("upPortal_GetBuildingPeriodTenants", request);
        }

        public async Task<UMFAShopsSpResponse> GetTenantShopsAsync(UmfaTenantShopsSpRequest request)
        {
             return await RunStoredProcedureAsync<UMFAShopsSpResponse, UmfaTenantShopsSpRequest>("upPortal_GetBuildingPeriodTenantShops", request);
        }

        public async Task<TenantSlipReportSpResponse> GetTenantSlipReportsAsync(TenantSlipReportSpRequest request)
        {
            return await RunStoredProcedureAsync<TenantSlipReportSpResponse, TenantSlipReportSpRequest>("upPortal_TenantSlipsData", request);
        }

        public async Task<TenantSlipDataSpResponse> GetTenantSlipDataAsync(TenantSlipDataSpRequest request)
        {
            return await RunStoredProcedureAsync<TenantSlipDataSpResponse, TenantSlipDataSpRequest>("upPortal_GetTenantSlipData", request);
        }

        public async Task<FileFormatDataSpResponse> GetFileFormatData(FileFormatDataSpRequest request)
        {
            return await RunStoredProcedureAsync<FileFormatDataSpResponse, FileFormatDataSpRequest>("upPortal_FileFormatdata", request);
        }

        public async Task UpdateArchiveFileFormatsAsync(UpdateArchiveFileFormatSpRequest request)
        {
            await RunStoredProcedureAsync<TenantSlipDataSpRequest>("upPortal_MaintainArchiveFileFormats");
        }
    }
}
