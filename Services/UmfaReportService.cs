using ClientPortal.Data.Repositories;
using ClientPortal.Models.RequestModels;
using ClientPortal.Models.ResponseModels;
using DevExpress.DataAccess.DataFederation;

namespace ClientPortal.Services
{
    public interface IUmfaReportService 
    {
        public Task<UtilityRecoveryReportResponse> GetUtilityRecoveryReportAsync(UtilityRecoveryReportRequest request);
        public Task<ShopUsageVarianceReportResponse> GetShopUsageVarianceReportAsync(ShopUsageVarianceRequest request);
    }
    public class UmfaReportService : IUmfaReportService
    {
        private readonly ILogger<UmfaReportService> _logger;
        private readonly IUmfaRepository _repository;
        public UmfaReportService(ILogger<UmfaReportService> logger, IUmfaRepository repository)
        {
            _logger = logger;
            _repository = repository;
        }
        public async Task<UtilityRecoveryReportResponse> GetUtilityRecoveryReportAsync(UtilityRecoveryReportRequest request)
        {
            return await _repository.GetUtilityRecoveryReportAsync(request);
        }

        public async Task<ShopUsageVarianceReportResponse> GetShopUsageVarianceReportAsync(ShopUsageVarianceRequest request)
        {
            var spResponse = await _repository.GetShopUsageVarianceReportAsync(request);
            return CreateShopUsageVarianceReport(spResponse);
        }

        private ShopUsageVarianceReportResponse CreateShopUsageVarianceReport(ShopUsageVarianceSpResponse source)
        {
            var response = new ShopUsageVarianceReportResponse();

            // Map TenantShopInvoiceGroupings
            var shopGroups = source.ShopUsageVariances.GroupBy(v => new { v.ShopId, v.Shop, v.Tenants, v.InvGroup });
            foreach (var shopGroup in shopGroups)
            {
                var tenantShopInvoiceGrouping = new TenantShopInvoiceGrouping
                {
                    ShopId = shopGroup.Key.ShopId,
                    Shop = shopGroup.Key.Shop,
                    Tenants = shopGroup.Key.Tenants,
                    OccDTM = shopGroup.First().OccDTM,
                    PeriodUsageDetails = new List<PeriodUsageDetail>()
                };

                foreach (var shopUsageVariance in shopGroup)
                {
                    var periodUsageDetail = new PeriodUsageDetail
                    {
                        PeriodId = shopUsageVariance.PeriodID,
                        PeriodName = shopUsageVariance.PeriodName,
                        Usage = shopUsageVariance.UsageValue
                    };

                    tenantShopInvoiceGrouping.PeriodUsageDetails.Add(periodUsageDetail);
                }

                tenantShopInvoiceGrouping.Average = tenantShopInvoiceGrouping.PeriodUsageDetails.Where(p => p.Usage != null).Select(p => p.Usage).Average();

                var lastPeriodUsage = tenantShopInvoiceGrouping.PeriodUsageDetails.OrderByDescending(p => p.PeriodId).FirstOrDefault(p => p.Usage != null);

                if (lastPeriodUsage != null && tenantShopInvoiceGrouping.Average != 0)
                {
                    var variance = lastPeriodUsage.Usage!.Value / tenantShopInvoiceGrouping.Average -1;
                    tenantShopInvoiceGrouping.Variance = $"{variance}%";
                }

                response.TenantShopInvoiceGroupings.Add(tenantShopInvoiceGrouping);
            }

            // Map Totals
            var invGroups = source.ShopUsageVariances.GroupBy(s => new { s.InvGroup });
            var totals = new List<PeriodTotalDetails>();

            foreach (var invGroup in invGroups)
            {
                var periodTotalDetails = new PeriodTotalDetails
                {
                    PeriodUsageDetails = new List<PeriodUsageDetail>(),
                };

                var periodGroups = invGroup.GroupBy(ig => ig.PeriodID);

                foreach (var periodGroup in periodGroups)
                {
                    var periodUsageDetail = new PeriodUsageDetail
                    {
                        PeriodId = periodGroup.First().PeriodID,
                        PeriodName = periodGroup.First().PeriodName,
                        Usage = periodGroup.Sum(pg => pg.UsageValue)
                    };

                    periodTotalDetails.PeriodUsageDetails.Add(periodUsageDetail);
                }

                periodTotalDetails.Average = invGroup.Where(p => p.UsageValue != null).Select(p => p.UsageValue).Average();

                var lastPeriodUsage = periodTotalDetails.PeriodUsageDetails.OrderByDescending(p => p.PeriodId).FirstOrDefault(p => p.Usage != null);

                if (lastPeriodUsage != null && periodTotalDetails.Average != 0)
                {
                    var variance = lastPeriodUsage.Usage!.Value / periodTotalDetails.Average - 1;
                    periodTotalDetails.Variance = $"{variance}%";
                }

                periodTotalDetails.InvGroup = invGroup.First().InvGroup;

                totals.Add(periodTotalDetails);
            }

            response.Totals = totals;

            return response;
        }
    }
}
