using ClientPortal.Data.Repositories;
using ClientPortal.Models.RequestModels;
using ClientPortal.Models.ResponseModels;
using ServiceStack;

namespace ClientPortal.Services
{
    public interface IUmfaReportService 
    {
        public Task<UtilityRecoveryReportResponse> GetUtilityRecoveryReportAsync(UtilityRecoveryReportRequest request);
        public Task<ShopUsageVarianceReportResponse> GetShopUsageVarianceReportAsync(ShopUsageVarianceRequest request);
        public Task<ShopCostVarianceReportResponse> GetShopCostVarianceReportAsync(ShopUsageVarianceRequest request);
        public Task<ConsumptionSummaryResponse> GetConsumptionSummaryReport(ConsumptionSummarySpRequest request);
        public Task<ConsumptionSummaryReconResponse> GetConsumptionSummaryReconReport(ConsumptionSummaryReconRequest request);

        public Task UpdateReportArhivesFileFormats(UpdateArchiveFileFormatSpRequest request);
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
            var spResponse = await _repository.GetUtilityRecoveryReportAsync(request);
            return CreateUtilityRecoveryReportResponse(spResponse);
        }

        public async Task<ShopUsageVarianceReportResponse> GetShopUsageVarianceReportAsync(ShopUsageVarianceRequest request)
        {
            var spResponse = await _repository.GetShopUsageVarianceReportAsync(request);
            return CreateShopUsageVarianceReport(spResponse);
        }

        public async Task<ShopCostVarianceReportResponse> GetShopCostVarianceReportAsync(ShopUsageVarianceRequest request)
        {
            var spResponse = await _repository.GetShopCostVarianceReportAsync(request);
            return CreateShopCostVarianceReport(spResponse);
        }

        public async Task<ConsumptionSummaryResponse> GetConsumptionSummaryReport(ConsumptionSummarySpRequest request)
        {
            var response =  await _repository.GetConsumptionSummaryReport(request);

            return new ConsumptionSummaryResponse(response);
        }

        private UtilityRecoveryReportResponse CreateUtilityRecoveryReportResponse(UtilityRecoveryReportSpResponse source)
        {
            var response = new UtilityRecoveryReportResponse();

            response.HeaderValues = source.HeaderValues;

            //Grid values
            var gridGroups = source.GridValues.GroupBy(gv => new { gv.RepType, gv.RowHeader, gv.RowNr });
            foreach( var group in gridGroups )
            {
                var reportGridValues = new UtilityRecoveryGridReport
                {
                    RepType = group.Key.RepType,
                    RowHeader = group.Key.RowHeader,
                    RowNumber = group.Key.RowNr,
                    PeriodDetails = new List<UtilityRecoveryPeriodDetail>(),
                };

                foreach(var period in group)
                {
                    var periodDetails = new UtilityRecoveryPeriodDetail
                    {
                        ColValue = period.ColValue,
                        PeriodId = period.PeriodId,
                        PeriodName = period.PeriodName,
                    };

                    reportGridValues.PeriodDetails.Add(periodDetails);
                }

                response.GridValues.Add(reportGridValues);
            }

            //Graph Values
            var graphGroups = source.GraphValues.GroupBy(gv => new { gv.RowHeader, gv.RowNr });
            foreach (var group in graphGroups)
            {
                var reportGraphValues = new UtilityRecoveryGraphReport
                {
                    RowHeader = group.Key.RowHeader,
                    RowNumber = group.Key.RowNr,
                    PeriodDetails = new List<UtilityRecoveryPeriodDetail>(),
                };

                foreach (var period in group)
                {
                    var periodDetails = new UtilityRecoveryPeriodDetail
                    {
                        ColValue = period.ColValue,
                        PeriodId = period.PeriodId,
                        PeriodName = period.PeriodName,
                    };

                    reportGraphValues.PeriodDetails.Add(periodDetails);
                }

                response.GraphValues.Add(reportGraphValues);
            }

            //Period List
            response.PeriodList = source.GridValues.DistinctBy(gv => gv.PeriodId).OrderBy(gv => gv.PeriodId).Select(gv => gv.PeriodName).ToList();

            return response;
        }

        private ShopCostVarianceReportResponse CreateShopCostVarianceReport(ShopCostVarianceSpResponse source)
        {
            var response = new ShopCostVarianceReportResponse();

            // Map TenantShopInvoiceGroupings
            var shopGroups = source.ShopCostVariances.GroupBy(s => new { s.ShopId, s.Tenants, s.GroupId });
            foreach (var shopGroup in shopGroups)
            {
                var tenantShopInvoiceGrouping = new TenantShopInvoiceCostGrouping
                {
                    ShopId = shopGroup.Key.ShopId,
                    Shop = shopGroup.First().Shop,
                    Group = shopGroup.First().GroupName,
                    GroupId = shopGroup.First().GroupId,
                    Tenants = shopGroup.Key.Tenants,
                    OccDTM = shopGroup.First().OccDTM,
                    PeriodCostDetails = new List<PeriodCostDetail>()
                };

                foreach (var shopCostVariance in shopGroup)
                {
                    var periodCostDetail = new PeriodCostDetail
                    {
                        PeriodId = shopCostVariance.PeriodID,
                        PeriodName = shopCostVariance.PeriodName,
                        Cost = shopCostVariance.RandValue
                    };

                    tenantShopInvoiceGrouping.PeriodCostDetails.Add(periodCostDetail);
                }

                tenantShopInvoiceGrouping.Average = tenantShopInvoiceGrouping.PeriodCostDetails.Where(p => p.Cost != null).Select(p => p.Cost).Average();

                var lastPeriodCost = tenantShopInvoiceGrouping.PeriodCostDetails.OrderByDescending(p => p.PeriodId).FirstOrDefault(p => p.Cost != null);

                if (lastPeriodCost != null && tenantShopInvoiceGrouping.Average != 0)
                {
                    var variance = (lastPeriodCost.Cost!.Value / tenantShopInvoiceGrouping.Average -1) * 100;
                    tenantShopInvoiceGrouping.Variance = $"{Math.Round((decimal)variance, 2)}%";
                }

                response.TenantShopInvoiceGroupings.Add(tenantShopInvoiceGrouping);
            }

            // Map Totals
            var invGroups = source.ShopCostVariances.GroupBy(s => new { s.GroupId });
            var totals = new List<PeriodTotalCostDetails>();

            foreach (var invGroup in invGroups)
            {
                var periodTotalDetails = new PeriodTotalCostDetails
                {
                    PeriodCostDetails = new List<PeriodCostDetail>(),
                };

                var periodGroups = invGroup.GroupBy(ig => ig.PeriodID);

                foreach (var periodGroup in periodGroups)
                {
                    var periodCostDetail = new PeriodCostDetail
                    {
                        PeriodId = periodGroup.First().PeriodID,
                        PeriodName = periodGroup.First().PeriodName,
                        Cost = periodGroup.Sum(pg => pg.RandValue)
                    };

                    periodTotalDetails.PeriodCostDetails.Add(periodCostDetail);
                }

                periodTotalDetails.Average = periodTotalDetails.PeriodCostDetails.Where(p => p.Cost != null).Select(p => p.Cost).Average();

                var lastPeriodCost = periodTotalDetails.PeriodCostDetails.OrderByDescending(p => p.PeriodId).FirstOrDefault(p => p.Cost != null);

                if (lastPeriodCost != null && periodTotalDetails.Average != 0)
                {
                    var variance = (lastPeriodCost.Cost!.Value / periodTotalDetails.Average - 1) * 100;
                    periodTotalDetails.Variance = $"{Math.Round((decimal)variance,2)}%";
                }

                periodTotalDetails.GroupName = invGroup.First().GroupName;

                totals.Add(periodTotalDetails);
            }

            response.Totals = totals;

            //Period List
            response.PeriodList = source.ShopCostVariances.DistinctBy(s => s.PeriodID).OrderBy(s => s.PeriodID).Select(s => s.PeriodName).ToList();


            return response;
        }

        private ShopUsageVarianceReportResponse CreateShopUsageVarianceReport(ShopUsageVarianceSpResponse source)
        {
            var response = new ShopUsageVarianceReportResponse();

            // Map TenantShopInvoiceGroupings
            var shopGroups = source.ShopUsageVariances.GroupBy(v => new { v.ShopId, v.Shop, v.Tenants, v.InvGroup });
            foreach (var shopGroup in shopGroups)
            {
                var tenantShopInvoiceGrouping = new TenantShopInvoiceUsageGrouping
                {
                    ShopId = shopGroup.Key.ShopId,
                    Shop = shopGroup.Key.Shop,
                    Tenants = shopGroup.Key.Tenants,
                    OccDTM = shopGroup.First().OccDTM,
                    PeriodUsageDetails = new List<PeriodUsageDetail>(),
                    InvGroup = shopGroup.Key.InvGroup,
                    Recoverable = shopGroup.Any(sg => sg.Recoverable),
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
                    var variance = (lastPeriodUsage.Usage!.Value / tenantShopInvoiceGrouping.Average - 1) * 100;
                    tenantShopInvoiceGrouping.Variance = $"{Math.Round((decimal)variance, 2)}%";
                }

                response.TenantShopInvoiceGroupings.Add(tenantShopInvoiceGrouping);
            }

            // Map Totals
            var invGroups = source.ShopUsageVariances.GroupBy(s => new { s.InvGroup });
            var totals = new List<PeriodTotalUsageDetails>();

            foreach (var invGroup in invGroups)
            {
                var periodTotalDetails = new PeriodTotalUsageDetails
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

                periodTotalDetails.Average = periodTotalDetails.PeriodUsageDetails.Where(p => p.Usage != null).Select(p => p.Usage).Average();

                var lastPeriodUsage = periodTotalDetails.PeriodUsageDetails.OrderByDescending(p => p.PeriodId).FirstOrDefault(p => p.Usage != null);

                if (lastPeriodUsage != null && periodTotalDetails.Average != 0)
                {
                    var variance = (lastPeriodUsage.Usage!.Value / periodTotalDetails.Average - 1) * 100;
                    periodTotalDetails.Variance = $"{Math.Round((decimal)variance, 2)}%";
                }

                periodTotalDetails.InvGroup = invGroup.First().InvGroup;

                totals.Add(periodTotalDetails);
            }

            response.Totals = totals;

            //Period List
            response.PeriodList = source.ShopUsageVariances.DistinctBy(s => s.PeriodID).OrderBy(s => s.PeriodID).Select(s => s.PeriodName).ToList();

            return response;
        }

        public async Task<ConsumptionSummaryReconResponse> GetConsumptionSummaryReconReport(ConsumptionSummaryReconRequest request)
        {
            return await _repository.GetConsumptionSummaryReconReport(request);
        }

        public async Task UpdateReportArhivesFileFormats(UpdateArchiveFileFormatSpRequest request)
        {
            await _repository.UpdateArchiveFileFormatsAsync(request);
        }
    }
}
