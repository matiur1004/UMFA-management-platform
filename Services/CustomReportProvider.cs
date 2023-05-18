using DevExpress.XtraReports.Services;
using DevExpress.XtraReports.UI;
using Microsoft.AspNetCore.Mvc;

namespace ClientPortal.Services
{
    public class CustomReportProvider : IReportProviderAsync
    {
        private readonly BuildingRecoveryReportService _brService;

        public CustomReportProvider(BuildingRecoveryReportService brService)
        {
            _brService = brService;
        }
        public async Task<XtraReport> GetReportAsync(string id, ReportProviderContext context)
        {
            // Parse the string with the report name and parameter values.
            string[] parts = id.Split('?');
            string reportName = parts[0];
            string parametersQueryString = parts.Length > 1 ? parts[1] : String.Empty;

            // Create a report instance.
            XtraReport? report = null;

            if (reportName == "BuildingRecovery")
            {
                string[] parms = parametersQueryString.Split(',');
                report = await Task.Run(() => { return _brService.BuildReport(parms[0], parms[1]); });
            } else if (reportName == "ShopUsageVariance") {
                string[] parms = parametersQueryString.Split(',');
                report = await Task.Run(() => { return _brService.ShopUsageVarianceReport(parms[0], parms[1], parms[2], parms[3]); });
            } else {
                throw new DevExpress.XtraReports.Web.ClientControls.FaultException(
                    string.Format("Could not find report '{0}'.", reportName)
                );
            }

            return report;
        }
    }
}
