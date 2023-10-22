using ClientPortal.Data.Entities.UMFAEntities;
using ClientPortal.Models.RequestModels;
using ClientPortal.Models.ResponseModels;
using ClientPortal.Settings;
using DevExpress.XtraPrinting.Shape.Native;
using Microsoft.Extensions.Options;
using System.Text.Json;
using System.Web;

namespace ClientPortal.Services
{

    public interface IUmfaService
    {
        public Task<UMFAShopsSpResponse> GetShopsAsync(UmfaShopsRequest request);

        public Task<List<UMFAShop>> GetTenantShopsAsync(UmfaTenantShopsSpRequest request);
        public Task<List<UMFATenant>> GetTenantsAsync(UmfaTenantsSpRequest request);

        public Task<TenantSlipCardInfo> GetTenantSlipCardInfoAsync(TenantSlipCardInfoSpRequest request);
        public Task<TenantSlipCriteriaResponse> GetTenantSlipCriteriaAsync(TenantSlipCriteriaSpRequest request);
        public Task<TenantSlipReportSpResponse> GetTenantSlipReportsAsync(TenantSlipReportSpRequest request);
        public Task<TenantSlipDataResponse> GetTenantSlipDataAsync(TenantSlipDataRequest request);
        public Task<TenantSlipDataForArchiveSpResponse> GetTenantSlipDataForArchiveAsync(TenantSlipDataForArchiveSpRequest request);

        public Task AddMappedMeterAsync(MappedMeterSpRequest request);

        #region Reports
        public Task<UtilityRecoveryReportResponse> GetUtilityRecoveryReportAsync(UtilityRecoveryReportRequest request);
        public Task<ShopUsageVarianceReportResponse> GetShopUsageVarianceReportAsync(ShopUsageVarianceRequest request);
        public Task<ShopCostVarianceReportResponse> GetShopCostVarianceReportAsync(ShopUsageVarianceRequest request);
        public Task<ConsumptionSummaryResponse> GetConsumptionSummaryReportAsync(ConsumptionSummarySpRequest request);
        public Task<ConsumptionSummaryReconResponse> GetConsumptionSummaryReconReportAsync(ConsumptionSummaryReconRequest request);
        public Task<BuildingRecoveryReport> GetBuildingRecoveryReportAsync(BuildingRecoveryReportSpRequest request);
        public Task UpdateReportArhivesFileFormatsAsync(UpdateArchiveFileFormatSpRequest request);
        public Task<UmfaBuildingRecoveryDataDieselResponse> GetBuildingRecoveryDieselAsync(UmfaBuildingRecoveryDataDieselSpRequest request);
        public Task<UmfaBuildingRecoveryDataWaterResponse> GetBuildingRecoveryWaterAsync(UmfaBuildingRecoveryDataWaterSpRequest request);
        public Task<UmfaBuildingRecoveryDataSewerResponse> GetBuildingRecoverySewerAsync(UmfaBuildingRecoveryDataSewerSpRequest request);
        public Task<BuildingRecoveryReport> GetBuildingRecoveryElectricityAsync(BuildingRecoveryReportSpRequest request);
        #endregion

        public Task<List<ShopDashboardShop>> GetDashboardShopDataAsync(int buildingId);
        public Task<ShopDashboardResponse> GetShopDashboardMainAsync(int buildingId, int shopId, int history);

        public Task<FileFormatDataSpResponse> GetFileFormatData(FileFormatDataSpRequest request);

        public Task<List<UMFAPeriod>> GetBuildingPeriods(int buildingId);

        public Task<List<UmfaShopDashboardBillingDetail>> GetShopDashboardBillingDetailsAsync(int buildingId, int shopId, int history);

        public Task<List<UmfaShopDashboardOccupation>> GetShopDashboardOccupationsAsync(int buildingId, int shopId);

        public Task<List<UmfaShopDashboardAssignedMeter>> GetShopDashboardAssignedMetersAsync(int buildingId, int shopId, int history);

        public Task<List<UmfaShopDashboardReading>> GetShopDashboardReadingsAsync(int buildingId, int shopId, int meterId, int history);

        public Task<UmfaMainDashboardTenantResponse> GetTenantMainDashboardAsync(int umfaId);

        public Task<UmfaFeedbackReportHeaderResponse> GetFeedbackReportHeaderAsync(UmfaFeedbackReportRequest request);

        public Task<List<UmfaFeedbackReportElectricityUsage>> GetFeedbackReportElectricityUsagesAsync(UmfaFeedbackReportRequest request);

        public Task<List<UmfaFeedbackReportElectricityAmount>> GetFeedbackReportElectricityAmountsAsync(UmfaFeedbackReportRequest request);

        public Task<List<UmfaFeedbackReportElectricityCouncilEntry>> GetFeedbackReportElectricityCouncilAsync(UmfaFeedbackReportRequest request);

        public Task<List<UmfaFeedbackReportWaterUsage>> GetFeedbackReportWaterUsagesAsync(UmfaFeedbackReportRequest request);

        public Task<List<UmfaFeedbackReportWaterAmount>> GetFeedbackReportWaterAmountsAsync(UmfaFeedbackReportRequest request);

        public Task<List<UmfaFeedbackReportSewerUsage>> GetFeedbackReportSewerUsagesAsync(UmfaFeedbackReportRequest request);

        public Task<List<UmfaFeedbackReportSewerAmount>> GetFeedbackReportSewerAmountsAsync(UmfaFeedbackReportRequest request);

        public Task<List<UmfaFeedbackReportVacantAmount>> GetFeedbackReportVacantKwhAmountsAsync(UmfaFeedbackReportRequest request);

        public Task<List<UmfaFeedbackReportVacantAmount>> GetFeedbackReportVacantKlAmountsAsync(UmfaFeedbackReportRequest request);

        public Task<List<UmfaFeedbackReportVacantUsage>> GetFeedbackReportVacantKwhUsagesAsync(UmfaFeedbackReportRequest request);

        public Task<List<UmfaFeedbackReportVacantUsage>> GetFeedbackReportVacantKlUsagesAsync(UmfaFeedbackReportRequest request);

        public Task<List<UmfaShopDashboardTenantShop>> GetShopDashboardTenantShopsAsync(int buildingId, int umfaUserId);

        public Task<List<UmfaTenantUserMeter>> GetTenantUserMetersAsync(UmfaTenantUserMetersRequest request);

        public Task<List<UmfaTenantDashboardTenant>> GetTenantDashboardTenantsAsync(UmfaTenantDashboardTenantListRequest request);
        public Task<UmfaTenantMainDashboardResponse> GetTenantMainDashboardAsync(UmfaTenantMainDashboardRequest request);
        public Task<List<UmfaTenantMainDashboardBillingDetail>> GetTenantMainDashboardBillingDetailsAsync(UmfaTenantMainDashboardBillingDetailsRequest request);
        public Task<List<UmfaTenantDashboardBillingCardDetail>> GetTenantDashboardBillingCardDetailsAsync(UmfaTenantDashboardBillingCardDetailsRequest request);

        public Task<List<UmfaMultiClientDump>> GetMultiClientDumpsAsync(UmfaMultiClientDumpRequest request);
    }


    public class UmfaApiHttpService : IUmfaService
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<UmfaApiHttpService> _logger;

        public UmfaApiHttpService(IOptions<UmfaApiSettings> options, ILogger<UmfaApiHttpService> logger)
        {
            _httpClient = new HttpClient
            {
                BaseAddress = new Uri(options.Value.BaseUrl),
                Timeout = TimeSpan.FromSeconds(360)
            };
            _logger = logger;
        }

        private async Task<string> GetAsync(string endpoint, object? queryParams = null)
        {
            string queryString = queryParams != null ? ToQueryString(queryParams) : string.Empty;

            HttpResponseMessage response = await _httpClient.GetAsync(endpoint + queryString);

            response.EnsureSuccessStatusCode();

            return await response.Content.ReadAsStringAsync();
        }

        private async Task<string> PostAsync(string endpoint, object data, string mediaType = "application/json")
        {
            string jsonData = JsonSerializer.Serialize(data);
            StringContent content = new StringContent(jsonData, Encoding.UTF8, mediaType);

            HttpResponseMessage response = await _httpClient.PostAsync(endpoint, content);

            response.EnsureSuccessStatusCode();

            return await response.Content.ReadAsStringAsync();
        }

        private async Task<string> PutAsync(string endpoint, object data, string mediaType = "application/json")
        {
            string jsonData = JsonSerializer.Serialize(data);
            StringContent content = new StringContent(jsonData, Encoding.UTF8, mediaType);

            HttpResponseMessage response = await _httpClient.PutAsync(endpoint, content);

            response.EnsureSuccessStatusCode();

            return await response.Content.ReadAsStringAsync();
        }

        private async Task<string> DeleteAsync(string endpoint, object data = null, string mediaType = "application/json")
        {
            if (data != null)
            {
                string jsonData = JsonSerializer.Serialize(data);
                StringContent content = new StringContent(jsonData, Encoding.UTF8, mediaType);

                HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Delete, endpoint)
                {
                    Content = content
                };
                HttpResponseMessage response = await _httpClient.SendAsync(request);

                response.EnsureSuccessStatusCode();

                return await response.Content.ReadAsStringAsync();
            }
            else
            {
                HttpResponseMessage response = await _httpClient.DeleteAsync(endpoint);

                response.EnsureSuccessStatusCode();

                return await response.Content.ReadAsStringAsync();
            }
        }

        private string ToQueryString(object queryParams)
        {
            var queryString = HttpUtility.ParseQueryString(string.Empty);
            var properties = queryParams.GetType().GetProperties();

            foreach (var property in properties)
            {
                var value = property.GetValue(queryParams, null);
                if (value != null)
                {
                    queryString[property.Name] = value.ToString();
                }
            }

            return "?" + queryString.ToString();
        }

        public async Task<TenantSlipDataForArchiveSpResponse> GetTenantSlipDataForArchiveAsync(TenantSlipDataForArchiveSpRequest request)
        {
            var response = await GetAsync("tenantSlips/archiveData", request);

            return JsonSerializer.Deserialize<TenantSlipDataForArchiveSpResponse>(response);
        }

        public async Task<TenantSlipCriteriaResponse> GetTenantSlipCriteriaAsync(TenantSlipCriteriaSpRequest request)
        {
            var response = await GetAsync("tenantSlips/criteria", request);
            return JsonSerializer.Deserialize<TenantSlipCriteriaResponse>(response);
        }

        public async Task<TenantSlipCardInfo> GetTenantSlipCardInfoAsync(TenantSlipCardInfoSpRequest request)
        {
            var response = await GetAsync("tenantSlips/cardInfo", request);
            return JsonSerializer.Deserialize<TenantSlipCardInfo>(response);
        }

        public async Task<List<UMFATenant>> GetTenantsAsync(UmfaTenantsSpRequest request)
        {
            var response = await GetAsync("tenants", request);
            return JsonSerializer.Deserialize<List<UMFATenant>>(response);
        }

        public async Task<List<UMFAShop>> GetTenantShopsAsync(UmfaTenantShopsSpRequest request)
        {
            var response = await GetAsync("tenants/shops", request);
            return JsonSerializer.Deserialize<List<UMFAShop>>(response);
        }

        public async Task<UMFAShopsSpResponse> GetShopsAsync(UmfaShopsRequest request)
        {
            var response = await GetAsync("shops", request);
            return JsonSerializer.Deserialize<UMFAShopsSpResponse>(response);
        }

        public async Task<TenantSlipReportSpResponse> GetTenantSlipReportsAsync(TenantSlipReportSpRequest request)
        {
            var response = await GetAsync("tenantSlips/reports", request);
            return JsonSerializer.Deserialize<TenantSlipReportSpResponse>(response);
        }

        public async Task<TenantSlipDataResponse> GetTenantSlipDataAsync(TenantSlipDataRequest request)
        {
            var response = await PutAsync("tenantSlips/data", request);
            return JsonSerializer.Deserialize<TenantSlipDataResponse>(response);
        }

        #region
        public async Task<UtilityRecoveryReportResponse> GetUtilityRecoveryReportAsync(UtilityRecoveryReportRequest request)
        {
            var response = "";
            try
            {
                response = await GetAsync("reports/utilityrecoveryreport", request);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error while getting UtilityRecoveryReport: {ex.Message}");
                throw ex;
            }
            return JsonSerializer.Deserialize<UtilityRecoveryReportResponse>(response);
        }

        public async Task<ShopUsageVarianceReportResponse> GetShopUsageVarianceReportAsync(ShopUsageVarianceRequest request)
        {
            var response = await GetAsync("reports/shopUsagevariancereport", request);
            return JsonSerializer.Deserialize<ShopUsageVarianceReportResponse>(response);
        }

        public async Task<ShopCostVarianceReportResponse> GetShopCostVarianceReportAsync(ShopUsageVarianceRequest request)
        {
            var response = await GetAsync("reports/shopcostvariancereport", request);
            return JsonSerializer.Deserialize<ShopCostVarianceReportResponse>(response);
        }

        public async Task<ConsumptionSummaryResponse> GetConsumptionSummaryReportAsync(ConsumptionSummarySpRequest request)
        {
            var response = await PutAsync("reports/consumptionsummaryreport", request);
            return JsonSerializer.Deserialize<ConsumptionSummaryResponse>(response);
        }

        public async Task<ConsumptionSummaryReconResponse> GetConsumptionSummaryReconReportAsync(ConsumptionSummaryReconRequest request)
        {
            ConsumptionSummaryReconResponse ret = null;
            try
            {
                _logger.LogInformation($"Getting BRR data for Period: {request.PeriodId}");
                var response = await GetAsync("reports/consumptionsummaryreconreport", request);
                _logger.LogInformation($"BRR Data recieved for Period: {request.PeriodId}, now deserializing..");
                ret = JsonSerializer.Deserialize<ConsumptionSummaryReconResponse>(response);
                _logger.LogInformation($"Serialized success!: {ret.ToString()}");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error while deserializing reponse: {ex.Message}");
            }
            return ret;
        }

        public async Task UpdateReportArhivesFileFormatsAsync(UpdateArchiveFileFormatSpRequest request)
        {
            await PutAsync("reports/updatereportarhivesfileformats", request);
        }
        #endregion

        public async Task AddMappedMeterAsync(MappedMeterSpRequest request)
        {
            await PostAsync("mappedmeters", request);
        }

        public async Task<List<ShopDashboardShop>> GetDashboardShopDataAsync(int buildingId)
        {
            var response = "";
            try
            {
                _logger.LogInformation($"Getting shops for building {buildingId}...");
                response = await GetAsync($"dashboard/buildings/{buildingId}/shops");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error getting shops for building {buildingId}: {ex.Message}");
            }

            return JsonSerializer.Deserialize<List<ShopDashboardShop>>(response);
        }

        public async Task<BuildingRecoveryReport> GetBuildingRecoveryReportAsync(BuildingRecoveryReportSpRequest request)
        {
            var response = await GetAsync("reports/buildingrecoveryreport", request);
            return JsonSerializer.Deserialize<BuildingRecoveryReport>(response);
        }

        public async Task<FileFormatDataSpResponse> GetFileFormatData(FileFormatDataSpRequest request)
        {
            var response = await GetAsync("archives/fileformatdata", request);
            return JsonSerializer.Deserialize<FileFormatDataSpResponse>(response);
        }

        public async Task<List<UMFAPeriod>> GetBuildingPeriods(int buildingId)
        {
            var response = await GetAsync($"buildings/{buildingId}/periods");
            return JsonSerializer.Deserialize<List<UMFAPeriod>>(response);
        }

        public async Task<ShopDashboardResponse> GetShopDashboardMainAsync(int buildingId, int shopId, int history)
        {
            var response = await GetAsync($"dashboard/buildings/{buildingId}/shops/{shopId}", new UmfaShopDashboardRequest { History = history });

            var umfaDashboard = JsonSerializer.Deserialize<UmfaShopDashboardResponse>(response);

            return new ShopDashboardResponse(umfaDashboard);
        }

        public async Task<List<UmfaShopDashboardBillingDetail>> GetShopDashboardBillingDetailsAsync(int buildingId, int shopId, int history)
        {
            var response = await GetAsync($"dashboard/buildings/{buildingId}/shops/{shopId}/billing-details", new UmfaShopDashboardBillingDetailsRequest { History = history });

            return JsonSerializer.Deserialize<List<UmfaShopDashboardBillingDetail>>(response);

        }

        public async Task<List<UmfaShopDashboardOccupation>> GetShopDashboardOccupationsAsync(int buildingId, int shopId)
        {
            var response = await GetAsync($"dashboard/buildings/{buildingId}/shops/{shopId}/occupations");

            return JsonSerializer.Deserialize<List<UmfaShopDashboardOccupation>>(response);
        }

        public async Task<List<UmfaShopDashboardAssignedMeter>> GetShopDashboardAssignedMetersAsync(int buildingId, int shopId, int history)
        {
            var response = await GetAsync($"dashboard/buildings/{buildingId}/shops/{shopId}/assigned-meters", new UmfaShopDashboardAssignedMetersRequest { History = history });

            return JsonSerializer.Deserialize<List<UmfaShopDashboardAssignedMeter>>(response);
        }

        public async Task<List<UmfaShopDashboardReading>> GetShopDashboardReadingsAsync(int buildingId, int shopId, int meterId, int history)
        {
            var response = await GetAsync($"dashboard/buildings/{buildingId}/shops/{shopId}/meters/{meterId}/readings", new UmfaShopDashboardReadingsRequest { History = history });

            return JsonSerializer.Deserialize<List<UmfaShopDashboardReading>>(response);
        }

        public async Task<UmfaBuildingRecoveryDataDieselResponse> GetBuildingRecoveryDieselAsync(UmfaBuildingRecoveryDataDieselSpRequest request)
        {
            var response = await GetAsync("reports/buildingrecoverydiesel", request);
            return JsonSerializer.Deserialize<UmfaBuildingRecoveryDataDieselResponse>(response);
        }

        public async Task<UmfaBuildingRecoveryDataWaterResponse> GetBuildingRecoveryWaterAsync(UmfaBuildingRecoveryDataWaterSpRequest request)
        {
            var response = await GetAsync("reports/buildingrecoverywater", request);
            return JsonSerializer.Deserialize<UmfaBuildingRecoveryDataWaterResponse>(response);
        }

        public async Task<UmfaBuildingRecoveryDataSewerResponse> GetBuildingRecoverySewerAsync(UmfaBuildingRecoveryDataSewerSpRequest request)
        {
            var response = await GetAsync("reports/buildingrecoverysewer", request);
            return JsonSerializer.Deserialize<UmfaBuildingRecoveryDataSewerResponse>(response);
        }

        public async Task<BuildingRecoveryReport> GetBuildingRecoveryElectricityAsync(BuildingRecoveryReportSpRequest request)
        {
            var response = await GetAsync("reports/buildingrecoveryelectricity", request);
            return JsonSerializer.Deserialize<BuildingRecoveryReport>(response);
        }

        public async Task<UmfaMainDashboardTenantResponse> GetTenantMainDashboardAsync(int umfaId)
        {
            var response = await GetAsync($"tenants/{umfaId}/dashboard");
            return JsonSerializer.Deserialize<UmfaMainDashboardTenantResponse>(response);
        }

        public async Task<UmfaFeedbackReportHeaderResponse> GetFeedbackReportHeaderAsync(UmfaFeedbackReportRequest request)
        {
            var response = await GetAsync($"reports/feedbackreport/header", request);

            return JsonSerializer.Deserialize<UmfaFeedbackReportHeaderResponse>(response);
        }

        public async Task<List<UmfaFeedbackReportElectricityUsage>> GetFeedbackReportElectricityUsagesAsync(UmfaFeedbackReportRequest request)
        {
            var response = await GetAsync($"reports/feedbackreport/electricity-usage", request);

            return JsonSerializer.Deserialize<List<UmfaFeedbackReportElectricityUsage>>(response);
        }

        public async Task<List<UmfaFeedbackReportElectricityAmount>> GetFeedbackReportElectricityAmountsAsync(UmfaFeedbackReportRequest request)
        {
            var response = await GetAsync($"reports/feedbackreport/electricity-amount", request);

            return JsonSerializer.Deserialize<List<UmfaFeedbackReportElectricityAmount>>(response);
        }

        public async Task<List<UmfaFeedbackReportElectricityCouncilEntry>> GetFeedbackReportElectricityCouncilAsync(UmfaFeedbackReportRequest request)
        {
            var response = await GetAsync($"reports/feedbackreport/electricity-council", request);

            return JsonSerializer.Deserialize<List<UmfaFeedbackReportElectricityCouncilEntry>>(response);
        }

        public async Task<List<UmfaFeedbackReportWaterUsage>> GetFeedbackReportWaterUsagesAsync(UmfaFeedbackReportRequest request)
        {
            var response = await GetAsync($"reports/feedbackreport/water-usage", request);

            return JsonSerializer.Deserialize<List<UmfaFeedbackReportWaterUsage>>(response);
        }

        public async Task<List<UmfaFeedbackReportWaterAmount>> GetFeedbackReportWaterAmountsAsync(UmfaFeedbackReportRequest request)
        {
            var response = await GetAsync($"reports/feedbackreport/water-amount", request);

            return JsonSerializer.Deserialize<List<UmfaFeedbackReportWaterAmount>>(response);
        }

        public async Task<List<UmfaFeedbackReportSewerUsage>> GetFeedbackReportSewerUsagesAsync(UmfaFeedbackReportRequest request)
        {
            var response = await GetAsync($"reports/feedbackreport/sewer-usage", request);

            return JsonSerializer.Deserialize<List<UmfaFeedbackReportSewerUsage>>(response);
        }

        public async Task<List<UmfaFeedbackReportSewerAmount>> GetFeedbackReportSewerAmountsAsync(UmfaFeedbackReportRequest request)
        {
            var response = await GetAsync($"reports/feedbackreport/sewer-amount", request);

            return JsonSerializer.Deserialize<List<UmfaFeedbackReportSewerAmount>>(response);
        }

        public async Task<List<UmfaFeedbackReportVacantAmount>> GetFeedbackReportVacantKwhAmountsAsync(UmfaFeedbackReportRequest request)
        {
            var response = await GetAsync($"reports/feedbackreport/vacant/kwh/amount", request);

            return JsonSerializer.Deserialize<List<UmfaFeedbackReportVacantAmount>>(response);
        }

        public async Task<List<UmfaFeedbackReportVacantAmount>> GetFeedbackReportVacantKlAmountsAsync(UmfaFeedbackReportRequest request)
        {
            var response = await GetAsync($"reports/feedbackreport/vacant/kl/amount", request);

            return JsonSerializer.Deserialize<List<UmfaFeedbackReportVacantAmount>>(response);
        }

        public async Task<List<UmfaFeedbackReportVacantUsage>> GetFeedbackReportVacantKwhUsagesAsync(UmfaFeedbackReportRequest request)
        {
            var response = await GetAsync($"reports/feedbackreport/vacant/kwh/usage", request);

            return JsonSerializer.Deserialize<List<UmfaFeedbackReportVacantUsage>>(response);
        }

        public async Task<List<UmfaFeedbackReportVacantUsage>> GetFeedbackReportVacantKlUsagesAsync(UmfaFeedbackReportRequest request)
        {
            var response = await GetAsync($"reports/feedbackreport/vacant/kl/usage", request);

            return JsonSerializer.Deserialize<List<UmfaFeedbackReportVacantUsage>>(response);
        }

        public async Task<List<UmfaShopDashboardTenantShop>> GetShopDashboardTenantShopsAsync(int buildingId, int umfaUserId)
        {
            var response = await GetAsync($"dashboard/buildings/{buildingId}/tenants/{umfaUserId}/shops");

            return JsonSerializer.Deserialize<List<UmfaShopDashboardTenantShop>>(response);
        }

        public async Task<List<UmfaTenantUserMeter>> GetTenantUserMetersAsync(UmfaTenantUserMetersRequest request)
        {
            var response = await GetAsync($"meters", request);

            return JsonSerializer.Deserialize<List<UmfaTenantUserMeter>>(response);
        }

        public async Task<List<UmfaTenantDashboardTenant>> GetTenantDashboardTenantsAsync(UmfaTenantDashboardTenantListRequest request)
        {
            var response = await GetAsync($"tenantdashboard/tenants", request);

            return JsonSerializer.Deserialize<List<UmfaTenantDashboardTenant>>(response);
        }

        public async Task<UmfaTenantMainDashboardResponse> GetTenantMainDashboardAsync(UmfaTenantMainDashboardRequest request)
        {
            var response = await GetAsync($"tenantdashboard/main", request);

            return JsonSerializer.Deserialize<UmfaTenantMainDashboardResponse>(response);
        }

        public async Task<List<UmfaTenantMainDashboardBillingDetail>> GetTenantMainDashboardBillingDetailsAsync(UmfaTenantMainDashboardBillingDetailsRequest request)
        {
            var response = await GetAsync($"tenantdashboard/main/billing-details", request);

            return JsonSerializer.Deserialize<List<UmfaTenantMainDashboardBillingDetail>>(response);
        }

        public async Task<List<UmfaTenantDashboardBillingCardDetail>> GetTenantDashboardBillingCardDetailsAsync(UmfaTenantDashboardBillingCardDetailsRequest request)
        {
            var response = await GetAsync($"tenantdashboard/billing-card-details", request);

            return JsonSerializer.Deserialize<List<UmfaTenantDashboardBillingCardDetail>>(response);
        }

        public async Task<List<UmfaMultiClientDump>> GetMultiClientDumpsAsync(UmfaMultiClientDumpRequest request)
        {
            var response = await GetAsync($"reports/clientfeedbackreport", request);

            return JsonSerializer.Deserialize<List<UmfaMultiClientDump>>(response);
        }
    }
}
