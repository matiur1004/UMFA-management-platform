﻿using ClientPortal.Models.RequestModels;
using ClientPortal.Models.ResponseModels;
using Dapper;
using Microsoft.Identity.Client;
using Newtonsoft.Json;

namespace ClientPortal.Data.Repositories
{
    public interface IUmfaRepository
    {
        public Task<UtilityRecoveryReportSpResponse> GetUtilityRecoveryReportAsync(UtilityRecoveryReportRequest request);
        public Task<ShopUsageVarianceSpResponse> GetShopUsageVarianceReportAsync(ShopUsageVarianceRequest request);
        public Task<ShopCostVarianceSpResponse> GetShopCostVarianceReportAsync(ShopUsageVarianceRequest request);
        public Task AddMappedMeterAsync(MappedMeterSpRequest request);
        public Task<UMFAShopsSpResponse> GetShopsASync(UmfaShopsRequest request);
        public Task<ConsumptionSummarySpResponse> GetConsumptionSummaryReport(ConsumptionSummarySpRequest request);
        public Task<ConsumptionSummaryReconResponse> GetConsumptionSummaryReconReport(ConsumptionSummaryReconRequest request);
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

        public async Task<UMFAShopsSpResponse> GetShopsASync(UmfaShopsRequest request)
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
    }
}
