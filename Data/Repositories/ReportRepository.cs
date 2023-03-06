using ClientPortal.DtOs;
using ClientPortal.Models.ResponseModels;
using Dapper;

namespace ClientPortal.Data.Repositories
{
    public interface IReportRepository
    {
        Task<BuildingRecoveryReport> GetBuildingRecoveryReport(int periodStart, int periodEnd);
    }
    public class ReportRepository : IReportRepository
    {
        private readonly ILogger<ReportRepository> _logger;
        private readonly UmfaDBContext _dBContext;

        public ReportRepository(ILogger<ReportRepository> logger,
            UmfaDBContext dBContext)
        {
            _logger = logger;
            _dBContext = dBContext;
        }

        public async Task<BuildingRecoveryReport> GetBuildingRecoveryReport(int pStart, int pEnd)
        {
            try
            {
                BuildingRecoveryReport report = new BuildingRecoveryReport();
                var CommandText = $"exec upPortal_BuildingRecoveryData {pStart}, {pEnd}";
                var connection = _dBContext.Database.GetDbConnection();
                await connection.OpenAsync();
                var results = await connection.QueryMultipleAsync(CommandText);

                //Build the response
                //header
                Header header = results.Read<Header>().ToList()[0];
                report.Title = header.Title;
                report.BuildingArea = header.BuildingArea;

                // Tenant Data
                List<Tenantdata> tenantData = results.Read<Tenantdata>().ToList();

                TenantReportData tenantReportData = new TenantReportData();
                // loop through tenant collection and strip out periods and details
                int periodId = -1;
                tenantReportData.Data = new List<PeriodHeader>();
                foreach (Tenantdata td in tenantData)
                {
                    if (tenantReportData.Data.Count > 0 && td.PeriodID == tenantReportData.Data[periodId].PeriodId)
                    {
                        PeriodDetail periodDetail = new PeriodDetail()
                        {
                            ItemName = td.Item,
                            kWhUsage = (decimal)td.KWHUsage,
                            kVAUsage = (decimal)td.KVAUsage,
                            TotalAmount = (decimal)td.TotalAmount,
                            Recoverable = td.Recoverable
                        };
                        tenantReportData.Data[periodId].Details.Add(periodDetail);
                    }
                    else
                    {
                        periodId++;
                        PeriodHeader periodHeader = new PeriodHeader()
                        {
                            PeriodId = td.PeriodID,
                            SortIndex = (int)td.SortId,
                            Month = td.Month,
                            StartDate = td.StartDate,
                            EndDate = td.EndDate,
                            PeriodDays = td.PeriodDays
                        };
                        periodHeader.Details = new List<PeriodDetail>();
                        PeriodDetail periodDetail = new PeriodDetail()
                        {
                            ItemName = td.Item,
                            kWhUsage = (decimal)td.KWHUsage,
                            kVAUsage = (decimal)td.KVAUsage,
                            TotalAmount = (decimal)td.TotalAmount,
                            Recoverable = td.Recoverable
                        };
                        periodHeader.Details.Add(periodDetail);
                        tenantReportData.Data.Add(periodHeader);
                    }
                }

                report.TenantReportData = tenantReportData;

                // Bulk Data
                List<Bulkdata> bulkData = results.Read<Bulkdata>().ToList();

                TenantReportData bulkReportData = new TenantReportData();
                // loop through tenant collection and strip out periods and details
                periodId = -1;
                bulkReportData.Data = new List<PeriodHeader>();
                foreach (Bulkdata bd in bulkData)
                {
                    if (bulkReportData.Data.Count > 0 && bd.PeriodID == bulkReportData.Data[periodId].PeriodId)
                    {
                        PeriodDetail periodDetail = new PeriodDetail()
                        {
                            ItemName = bd.Item,
                            kWhUsage = (decimal)bd.KWHUsage,
                            kVAUsage = (decimal)bd.KVAUsage,
                            TotalAmount = (decimal)bd.TotalAmount,
                            Recoverable = bd.Recoverable,
                            Highlighted = bd.HighLight
                        };
                        bulkReportData.Data[periodId].Details.Add(periodDetail);
                    }
                    else
                    {
                        periodId++;
                        PeriodHeader periodHeader = new PeriodHeader()
                        {
                            PeriodId = bd.PeriodID,
                            SortIndex = (int)bd.SortId,
                            Month = bd.Month,
                            StartDate = bd.StartDate,
                            EndDate = bd.EndDate,
                            PeriodDays = bd.PeriodDays
                        };
                        periodHeader.Details = new List<PeriodDetail>();
                        PeriodDetail periodDetail = new PeriodDetail()
                        {
                            ItemName = bd.Item,
                            kWhUsage = (decimal)bd.KWHUsage,
                            kVAUsage = (decimal)bd.KVAUsage,
                            TotalAmount = (decimal)bd.TotalAmount,
                            Recoverable = bd.Recoverable,
                            Highlighted = bd.HighLight
                        };
                        periodHeader.Details.Add(periodDetail);
                        bulkReportData.Data.Add(periodHeader);
                    }
                }

                report.BulkReportData = bulkReportData;

                // Council Data
                List<CouncilData> councilData = results.Read<CouncilData>().ToList();

                TenantReportData councilReportData = new TenantReportData();
                // loop through tenant collection and strip out periods and details
                periodId = -1;
                councilReportData.Data = new List<PeriodHeader>();
                foreach (CouncilData cd in councilData)
                {
                    if (councilReportData.Data.Count > 0 && cd.PeriodID == councilReportData.Data[periodId].PeriodId)
                    {
                        PeriodDetail periodDetail = new PeriodDetail()
                        {
                            ItemName = cd.Item,
                            kWhUsage = (decimal)cd.KWHUsage,
                            kVAUsage = (decimal)cd.KVAUsage,
                            TotalAmount = (decimal)cd.TotalAmount,
                            Recoverable = cd.Recoverable,
                            Highlighted = cd.HighLight
                        };
                        councilReportData.Data[periodId].Details.Add(periodDetail);
                    }
                    else
                    {
                        periodId++;
                        PeriodHeader periodHeader = new PeriodHeader()
                        {
                            PeriodId = cd.PeriodID,
                            SortIndex = (int)cd.SortId,
                            Month = cd.Month,
                            StartDate = cd.StartDate,
                            EndDate = cd.EndDate,
                            PeriodDays = cd.PeriodDays
                        };
                        periodHeader.Details = new List<PeriodDetail>();
                        PeriodDetail periodDetail = new PeriodDetail()
                        {
                            ItemName = cd.Item,
                            kWhUsage = (decimal)cd.KWHUsage,
                            kVAUsage = (decimal)cd.KVAUsage,
                            TotalAmount = (decimal)cd.TotalAmount,
                            Recoverable = cd.Recoverable,
                            Highlighted = cd.HighLight
                        };
                        periodHeader.Details.Add(periodDetail);
                        councilReportData.Data.Add(periodHeader);
                    }
                }

                report.CouncilReportData = councilReportData;

                return report;
            }
            catch (Exception ex)
            {
                _logger.LogError("Error while retrieving data for BuildingRecoveryReport with periodids {pStart} and {pEnd}", pStart, pEnd);
                throw new ApplicationException($"Error while retrieving data for BuildingRecoveryReport with periodids {pStart} and {pEnd}: {ex.Message}");
            }
            finally
            {
                await _dBContext.Database.CloseConnectionAsync();
            }
        }
    }
}
