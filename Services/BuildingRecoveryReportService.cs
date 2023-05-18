using DevExpress.Utils;
using DevExpress.XtraPrinting;
using DevExpress.XtraReports.UI;
using ClientPortal.Data.Repositories;
using ClientPortal.Models.ResponseModels;
using ClientPortal.PredefinedReports;
using ServiceStack;
using System.Drawing;
using System.Globalization;

namespace ClientPortal.Services
{
    public class BuildingRecoveryReportService
    {
        private readonly IReportRepository _repo;

        public BuildingRecoveryReportService(IReportRepository repo)
        {
            _repo = repo;
        }
        public async Task<XtraReport> BuildReport(string strtPeriodId, string endPeriodId)
        {
            BuildingRecoveryReport reportData = await Task.Run(() => { return _repo.GetBuildingRecoveryReport(strtPeriodId.ToInt(), endPeriodId.ToInt()); });

            XtraReport report = new BuildingRecovery(); // XtraReport();
            report.Landscape = true;
            report.Margins = new System.Drawing.Printing.Margins(10, 10, 100, 34);

            TopMarginBand topMarginBand = (TopMarginBand)report.Bands[BandKind.TopMargin];
            topMarginBand.Controls.Add(new XRLabel()
            {
                LocationFloat = new PointFloat(185F, 22F),
                Text = reportData.Title,
                SizeF = new SizeF(720F, 42.79167F),
                TextAlignment = TextAlignment.MiddleCenter,
                Font = new Font("Arial", 16F, FontStyle.Bold)
            });

            DetailBand detailBand = (DetailBand)report.Bands[BandKind.Detail];
            XRTable tenantTable = CreateTenantTable(reportData);
            XRTable bulkTable = CreateBulkTable(reportData);
            XRTable councilTable = CreateCouncilTable(reportData);
            detailBand.Controls.AddRange( new XRControl[] { tenantTable, bulkTable, councilTable });

            return report;
        }

        public async Task<XtraReport> ShopUsageVarianceReport(string buildingId, string strtPeriodId, string endPeriodId, string allTenantType)
        {
            //BuildingRecoveryReport reportData = await Task.Run(() => { return _repo.GetBuildingRecoveryReport(strtPeriodId.ToInt(), endPeriodId.ToInt()); });

            XtraReport report = new ShopUsageVariance(); // XtraReport();
            //report.Parameters[@]
            report.Landscape = true;
            report.Margins = new System.Drawing.Printing.Margins(10, 10, 60, 34);

            return report;
        }

        #region Tenant Table
        private static XRTable CreateTenantTable(BuildingRecoveryReport reportData)
        {
            // Create an empty table and set its size.
            XRTable tableTenant = new XRTable();
            tableTenant.Name = "TenantTable";

            // Start table initialization.
            tableTenant.BeginInit();

            InitiateTableTenant(ref tableTenant, reportData);

            ProcessTableTenant(ref tableTenant, reportData);

            // Finish table initialization.
            tableTenant.EndInit();

            return tableTenant;
        }

        private static void InitiateTableTenant(ref XRTable table, BuildingRecoveryReport reportData, float startPoint = 0F)
        {
            // specify table specifics.
            table.LocationFloat = new PointFloat(0F, startPoint);
            table.Padding = new PaddingInfo(2, 2, 0, 0, 96F);
            table.SizeF = new SizeF((float)(185F + (220F * reportData.TenantReportData.Data.Count)), 100F);
            table.StylePriority.UseFont = false;

            // Create first fixed table rows.
            XRTableRow row1 = new();
            XRTableRow row2 = new();
            XRTableRow row3 = new();

            //add rows to table
            table.Rows.AddRange(new XRTableRow[] { row1, row2, row3 });

            //Row 1
            //add first cell
            XRTableCell cell11 = new();

            //Cell 1
            cell11.BorderColor = Color.LightGray;
            cell11.Borders = ((BorderSide.Left | BorderSide.Top) | BorderSide.Right);
            cell11.Font = new Font("Arial", 8F);
            cell11.Text = "Total GLA";
            cell11.TextAlignment = TextAlignment.MiddleCenter;
            cell11.WidthF = 185F;

            row1.Cells.Add(cell11);

            XRTableCell cell21 = new();
            cell21.BorderColor = Color.LightGray;
            cell21.Borders = (BorderSide.Left | BorderSide.Right);
            cell21.Font = new Font("Arial1", 8F, FontStyle.Bold);
            cell21.Text = reportData.BuildingArea.ToString();
            cell21.TextAlignment = TextAlignment.TopCenter;
            cell21.WidthF = 185F;

            row2.Cells.Add(cell21);

            XRTableCell cell31 = new();
            cell31.BackColor = Color.LightGray;
            cell31.BorderColor = Color.LightGray;
            cell31.Borders = (BorderSide.All);
            cell31.Font = new Font("Arial1", 8F, FontStyle.Bold);
            cell31.Text = "Electricity Recovery";
            cell31.TextAlignment = TextAlignment.MiddleCenter;
            cell31.WidthF = 185F;

            row3.Cells.Add(cell31);

        }

        private static void ProcessTableTenant(ref XRTable table, BuildingRecoveryReport reportData)
        {
            //build the summary rows but do not add to table yet
            XRTableRow rowSum1 = new(); //Total Non Recoverable
            XRTableRow rowSum2 = new(); //Total Recoverable
            XRTableRow rowSum3 = new(); //Total Potential Recoverable
            XRTableRow rowSum4 = new(); //Recoverable per m²

            XRTableRow row1 = table.Rows[0];
            XRTableRow row2 = table.Rows[1];
            XRTableRow row3 = table.Rows[2];

            if (reportData.TenantReportData.Data.Count > 0)
            {
                //build the summary rows but do not add to table yet
                XRTableCell cellSum11 = new();
                cellSum11.BackColor = Color.WhiteSmoke;
                cellSum11.BorderColor = Color.LightGray;
                cellSum11.Borders = (BorderSide.All);
                cellSum11.Font = new Font("Arial1", 8F, FontStyle.Bold);
                cellSum11.Text = "Total Non Recoverable";
                cellSum11.TextAlignment = TextAlignment.MiddleLeft;
                cellSum11.WidthF = 185F;
                rowSum1.Cells.Add(cellSum11);

                XRTableCell cellSum21 = new();
                cellSum21.BackColor = Color.WhiteSmoke;
                cellSum21.BorderColor = Color.LightGray;
                cellSum21.Borders = (BorderSide.All);
                cellSum21.Font = new Font("Arial1", 8F, FontStyle.Bold);
                cellSum21.Text = "Total Recoverable";
                cellSum21.TextAlignment = TextAlignment.MiddleLeft;
                cellSum21.WidthF = 185F;
                rowSum2.Cells.Add(cellSum21);

                XRTableCell cellSum31 = new();
                cellSum31.BackColor = Color.WhiteSmoke;
                cellSum31.BorderColor = Color.LightGray;
                cellSum31.Borders = (BorderSide.All);
                cellSum31.Font = new Font("Arial1", 8F, FontStyle.Bold);
                cellSum31.Text = "Total Potential Recoverable";
                cellSum31.TextAlignment = TextAlignment.MiddleLeft;
                cellSum31.WidthF = 185F;
                rowSum3.Cells.Add(cellSum31);

                XRTableCell cellSum41 = new();
                cellSum41.BackColor = Color.WhiteSmoke;
                cellSum41.BorderColor = Color.LightGray;
                cellSum41.Borders = (BorderSide.All);
                cellSum41.Font = new Font("Arial1", 8F, FontStyle.Bold);
                cellSum41.Text = "Recoverable per m²";
                cellSum41.TextAlignment = TextAlignment.MiddleLeft;
                cellSum41.WidthF = 185F;
                rowSum4.Cells.Add(cellSum41);

            }

            //configure rows based on period data
            foreach (PeriodHeader ph in reportData.TenantReportData.Data)
            {
                //variables to calculate summaries
                var summaryVars = new Dictionary<string, decimal>()
                {
                    { "totNonReckWh", 0M },
                    { "totNonReckVA", 0M },
                    { "totNonRecRC", 0M },
                    { "totReckWh", 0M },
                    { "totReckVA", 0M },
                    { "totRecRC", 0M },
                    { "totPotkWh", 0M },
                    { "totPotkVA", 0M },
                    { "totPotRC", 0M },
                    { "totPMkWh", 0M },
                    { "totPMkVA", 0M },
                    { "totPMRC", 0M }
                };

                //row 1 cell 2
                XRTableCell cell12 = new();
                cell12.BackColor = (ph.Month == "Total") ? Color.DimGray : Color.FromArgb(71, 174, 227);
                cell12.BorderColor = Color.LightGray;
                cell12.Borders = (((BorderSide.Left | BorderSide.Top) | BorderSide.Right) | BorderSide.Bottom);
                cell12.Font = new Font("Arial", 8F, FontStyle.Bold);
                cell12.ForeColor = Color.White;
                cell12.Text = ph.Month;
                cell12.TextAlignment = TextAlignment.MiddleCenter;
                cell12.WidthF = 220F;

                row1.Cells.Add(cell12);

                //row 2 cells 2, 3, 4
                XRTableCell cell22 = new();
                cell22.BorderColor = Color.LightGray;
                cell22.Borders = BorderSide.All;
                cell22.Font = new Font("Arial", 8F);
                cell22.Text = "kWh";
                cell22.TextAlignment = TextAlignment.MiddleCenter;
                cell22.WidthF = 60F;

                row2.Cells.Add(cell22);

                XRTableCell cell23 = new();
                cell23.BorderColor = Color.LightGray;
                cell23.Borders = BorderSide.All;
                cell23.Font = new Font("Arial", 8F);
                cell23.Text = "kVA";
                cell23.TextAlignment = TextAlignment.MiddleCenter;
                cell23.WidthF = 60F;

                row2.Cells.Add(cell23);

                XRTableCell cell24 = new();
                cell24.BorderColor = Color.LightGray;
                cell24.Borders = BorderSide.All;
                cell24.Font = new Font("Arial", 8F);
                cell24.Text = "Total R/C";
                cell24.TextAlignment = TextAlignment.MiddleCenter;
                cell24.WidthF = 100F;

                row2.Cells.Add(cell24);

                //row 3 cells 2, 3, 4
                XRTableCell cell32 = new();
                cell32.BackColor = Color.Gainsboro;
                cell32.BorderColor = Color.LightGray;
                cell32.Borders = BorderSide.All;
                cell32.Font = new Font("Arial", 8F);
                cell32.Text = ph.StartDate;
                cell32.TextAlignment = TextAlignment.MiddleCenter;
                cell32.WidthF = 60F;

                row3.Cells.Add(cell32);

                XRTableCell cell33 = new();
                cell33.BackColor = Color.Gainsboro;
                cell33.BorderColor = Color.LightGray;
                cell33.Borders = BorderSide.All;
                cell33.Font = new Font("Arial", 8F);
                cell33.Text = ph.EndDate;
                cell33.TextAlignment = TextAlignment.MiddleCenter;
                cell33.WidthF = 60F;

                row3.Cells.Add(cell33);

                XRTableCell cell34 = new();
                cell34.BackColor = Color.Gainsboro;
                cell34.BorderColor = Color.LightGray;
                cell34.Borders = BorderSide.All;
                cell34.Font = new Font("Arial", 8F);
                cell34.Text = ph.PeriodDays;
                cell34.TextAlignment = TextAlignment.MiddleCenter;
                cell34.WidthF = 100F;

                row3.Cells.Add(cell34);

                if (ph.Details.Count > 0) ProcessTenantDetails(ref table, ph, ref summaryVars);

                summaryVars["totPMkWh"] = summaryVars["totReckWh"] / reportData.BuildingArea;
                summaryVars["totPMkVA"] = summaryVars["totReckVA"] / reportData.BuildingArea;
                summaryVars["totPMRC"] = summaryVars["totRecRC"] / reportData.BuildingArea;

                //add cells 2,3,4 to summary rows
                //summary row 1: Total no nrecoverable
                XRTableCell cellSum12 = new();
                cellSum12.BackColor = Color.WhiteSmoke;
                cellSum12.BorderColor = Color.LightGray;
                cellSum12.Borders = BorderSide.All;
                cellSum12.Font = new Font("Arial", 8F);
                cellSum12.Text = summaryVars["totNonReckWh"].ToString("### ### ##0");
                cellSum12.TextAlignment = TextAlignment.MiddleRight;
                cellSum12.WidthF = 60F;

                rowSum1.Cells.Add(cellSum12);

                XRTableCell cellSum13 = new();
                cellSum13.BackColor = Color.WhiteSmoke;
                cellSum13.BorderColor = Color.LightGray;
                cellSum13.Borders = BorderSide.All;
                cellSum13.Font = new Font("Arial", 8F);
                cellSum13.Text = summaryVars["totNonReckVA"].ToString("### ### ##0");
                cellSum13.TextAlignment = TextAlignment.MiddleRight;
                cellSum13.WidthF = 60F;

                rowSum1.Cells.Add(cellSum13);

                XRTableCell cellSum14 = new();
                cellSum14.BackColor = Color.WhiteSmoke;
                cellSum14.BorderColor = Color.LightGray;
                cellSum14.Borders = BorderSide.All;
                cellSum14.Font = new Font("Arial", 8F);
                cellSum14.Text = summaryVars["totNonRecRC"].ToString("C", CultureInfo.CurrentCulture);
                cellSum14.TextAlignment = TextAlignment.MiddleRight;
                cellSum14.WidthF = 100F;

                rowSum1.Cells.Add(cellSum14);

                //summary row 2: total recoverable
                XRTableCell cellSum22 = new();
                cellSum22.BackColor = Color.WhiteSmoke;
                cellSum22.BorderColor = Color.LightGray;
                cellSum22.Borders = BorderSide.All;
                cellSum22.Font = new Font("Arial", 8F);
                cellSum22.Text = summaryVars["totReckWh"].ToString("### ### ##0");
                cellSum22.TextAlignment = TextAlignment.MiddleRight;
                cellSum22.WidthF = 60F;

                rowSum2.Cells.Add(cellSum22);

                XRTableCell cellSum23 = new();
                cellSum23.BackColor = Color.WhiteSmoke;
                cellSum23.BorderColor = Color.LightGray;
                cellSum23.Borders = BorderSide.All;
                cellSum23.Font = new Font("Arial", 8F);
                cellSum23.Text = summaryVars["totReckVA"].ToString("### ### ##0");
                cellSum23.TextAlignment = TextAlignment.MiddleRight;
                cellSum23.WidthF = 60F;

                rowSum2.Cells.Add(cellSum23);

                XRTableCell cellSum24 = new();
                cellSum24.BackColor = Color.WhiteSmoke;
                cellSum24.BorderColor = Color.LightGray;
                cellSum24.Borders = BorderSide.All;
                cellSum24.Font = new Font("Arial", 8F);
                cellSum24.Text = summaryVars["totRecRC"].ToString("C", CultureInfo.CurrentCulture);
                cellSum24.TextAlignment = TextAlignment.MiddleRight;
                cellSum24.WidthF = 100F;

                rowSum2.Cells.Add(cellSum24);

                //summary row 3: tot potential recoverable
                XRTableCell cellSum32 = new();
                cellSum32.BackColor = Color.WhiteSmoke;
                cellSum32.BorderColor = Color.LightGray;
                cellSum32.Borders = BorderSide.All;
                cellSum32.Font = new Font("Arial", 8F);
                cellSum32.Text = summaryVars["totPotkWh"].ToString("### ### ##0");
                cellSum32.TextAlignment = TextAlignment.MiddleRight;
                cellSum32.WidthF = 60F;

                rowSum3.Cells.Add(cellSum32);

                XRTableCell cellSum33 = new();
                cellSum33.BackColor = Color.WhiteSmoke;
                cellSum33.BorderColor = Color.LightGray;
                cellSum33.Borders = BorderSide.All;
                cellSum33.Font = new Font("Arial", 8F);
                cellSum33.Text = summaryVars["totPotkVA"].ToString("### ### ##0");
                cellSum33.TextAlignment = TextAlignment.MiddleRight;
                cellSum33.WidthF = 60F;

                rowSum3.Cells.Add(cellSum33);

                XRTableCell cellSum34 = new();
                cellSum34.BackColor = Color.WhiteSmoke;
                cellSum34.BorderColor = Color.LightGray;
                cellSum34.Borders = BorderSide.All;
                cellSum34.Font = new Font("Arial", 8F);
                cellSum34.Text = summaryVars["totPotRC"].ToString("C", CultureInfo.CurrentCulture);
                cellSum34.TextAlignment = TextAlignment.MiddleRight;
                cellSum34.WidthF = 100F;

                rowSum3.Cells.Add(cellSum34);

                //summary row 4: Recoverable per m²
                XRTableCell cellSum42 = new();
                cellSum42.BackColor = Color.WhiteSmoke;
                cellSum42.BorderColor = Color.LightGray;
                cellSum42.Borders = BorderSide.All;
                cellSum42.Font = new Font("Arial", 8F);
                cellSum42.Text = summaryVars["totPMkWh"].ToString("##0.00");
                cellSum42.TextAlignment = TextAlignment.MiddleRight;
                cellSum42.WidthF = 60F;

                rowSum4.Cells.Add(cellSum42);

                XRTableCell cellSum43 = new();
                cellSum43.BackColor = Color.WhiteSmoke;
                cellSum43.BorderColor = Color.LightGray;
                cellSum43.Borders = BorderSide.All;
                cellSum43.Font = new Font("Arial", 8F);
                cellSum43.Text = summaryVars["totPMkVA"].ToString("##0.00");
                cellSum43.TextAlignment = TextAlignment.MiddleRight;
                cellSum43.WidthF = 60F;

                rowSum4.Cells.Add(cellSum43);

                XRTableCell cellSum44 = new();
                cellSum44.BackColor = Color.WhiteSmoke;
                cellSum44.BorderColor = Color.LightGray;
                cellSum44.Borders = BorderSide.All;
                cellSum44.Font = new Font("Arial", 8F);
                cellSum44.Text = summaryVars["totPMRC"].ToString("C", CultureInfo.CurrentCulture);
                cellSum44.TextAlignment = TextAlignment.MiddleRight;
                cellSum44.WidthF = 100F;

                rowSum4.Cells.Add(cellSum44);

                table.Rows.AddRange(new XRTableRow[] { rowSum1, rowSum2, rowSum3, rowSum4 });

            }
        }

        private static void ProcessTenantDetails(ref XRTable table, PeriodHeader ph, ref Dictionary<string, decimal> summaryVars)
        {
            //detail rows
            foreach (PeriodDetail dt in ph.Details)
            {
                XRTableRow? rowDet = null;
                foreach (XRTableRow row in table.Rows)
                {
                    if (row.Cells.Count > 0 && row.Cells[0].Text == dt.ItemName)
                    {
                        rowDet = row;
                        break;
                    }
                }
                if (rowDet == null)
                {
                    rowDet = new XRTableRow();
                    table.Rows.Add(rowDet);
                    //Add first cell to detail row
                    XRTableCell cellDet1 = new();
                    cellDet1.BorderColor = Color.LightGray;
                    cellDet1.Borders = BorderSide.All;
                    cellDet1.Font = new Font("Arial", 8F, FontStyle.Bold);
                    cellDet1.Text = dt.ItemName;
                    cellDet1.TextAlignment = TextAlignment.MiddleLeft;
                    cellDet1.WidthF = 185F;

                    rowDet.Cells.Add(cellDet1);
                }

                //add cells 2,3,4 to row
                XRTableCell cellDet2 = new();
                cellDet2.BorderColor = Color.LightGray;
                cellDet2.Borders = BorderSide.All;
                cellDet2.Font = new Font("Arial", 8F);
                cellDet2.Text = dt.kWhUsage.ToString("### ### ##0");
                cellDet2.TextAlignment = TextAlignment.MiddleRight;
                cellDet2.WidthF = 60F;

                rowDet.Cells.Add(cellDet2);

                XRTableCell cellDet3 = new();
                cellDet3.BorderColor = Color.LightGray;
                cellDet3.Borders = BorderSide.All;
                cellDet3.Font = new Font("Arial", 8F);
                cellDet3.Text = dt.kVAUsage.ToString("### ### ##0");
                cellDet3.TextAlignment = TextAlignment.MiddleRight;
                cellDet3.WidthF = 60F;

                rowDet.Cells.Add(cellDet3);

                XRTableCell cellDet4 = new();
                cellDet4.BorderColor = Color.LightGray;
                cellDet4.Borders = BorderSide.All;
                cellDet4.Font = new Font("Arial", 8F);
                cellDet4.Text = dt.TotalAmount.ToString("C", CultureInfo.CurrentCulture);
                cellDet4.TextAlignment = TextAlignment.MiddleRight;
                cellDet4.WidthF = 100F;

                rowDet.Cells.Add(cellDet4);

                if (dt.Recoverable)
                {
                    summaryVars["totReckWh"] += dt.kWhUsage;
                    summaryVars["totReckVA"] += dt.kVAUsage;
                    summaryVars["totRecRC"] += dt.TotalAmount;
                }
                else
                {
                    summaryVars["totNonReckWh"] += dt.kWhUsage;
                    summaryVars["totNonReckVA"] += dt.kVAUsage;
                    summaryVars["totNonRecRC"] += dt.TotalAmount;
                }
                summaryVars["totPotkWh"] += dt.kWhUsage;
                summaryVars["totPotkVA"] += dt.kVAUsage;
                summaryVars["totPotRC"] += dt.TotalAmount;
            }

        }

        #endregion

        #region Bulk Table
        private static XRTable CreateBulkTable(BuildingRecoveryReport reportData)
        {
            XRTable tableBulk = new XRTable();
            tableBulk.Name = "BulkTable";

            // Start table initialization.
            tableBulk.BeginInit();

            InitiateTableBulk(ref tableBulk, reportData, 120F);

            ProcessTableBulk(ref tableBulk, reportData);

            // Finish table initialization.
            tableBulk.EndInit();

            return tableBulk;
        }

        private static void InitiateTableBulk(ref XRTable table, BuildingRecoveryReport reportData, float startPoint = 0F)
        {
            // specify table specifics.
            table.LocationFloat = new PointFloat(0F, startPoint);
            table.Padding = new PaddingInfo(2, 2, 0, 0, 96F);
            table.SizeF = new SizeF((float)(185F + (220F * reportData.BulkReportData.Data.Count)), 100F);
            table.StylePriority.UseFont = false;

            // Create first fixed table rows.
            XRTableRow row1 = new();

            //add rows to table
            table.Rows.AddRange(new XRTableRow[] { row1 });

            //Row 1
            //add first cell
            XRTableCell cell11 = new();

            //Cell 1
            cell11.BackColor = Color.LightGray;
            cell11.BorderColor = Color.LightGray;
            cell11.Borders = BorderSide.All;
            cell11.Font = new Font("Arial", 8F, FontStyle.Bold);
            cell11.Text = "Electricity Bulk";
            cell11.TextAlignment = TextAlignment.MiddleLeft;
            cell11.WidthF = 185F;

            row1.Cells.Add(cell11);
        }

        private static void ProcessTableBulk(ref XRTable table, BuildingRecoveryReport reportData)
        {
            //build the summary rows but do not add to table yet
            XRTableRow rowSum1 = new(); // Benchmark Expense per m²

            XRTableRow row1 = table.Rows[0];

            if (reportData.BulkReportData.Data.Count > 0)
            {
                //build the summary rows but do not add to table yet
                XRTableCell cellSum11 = new();
                cellSum11.BackColor = Color.WhiteSmoke;
                cellSum11.BorderColor = Color.LightGray;
                cellSum11.Borders = (BorderSide.All);
                cellSum11.Font = new Font("Arial1", 8F, FontStyle.Bold);
                cellSum11.Text = "Benchmark Expense per m²";
                cellSum11.TextAlignment = TextAlignment.MiddleLeft;
                cellSum11.WidthF = 185F;
                rowSum1.Cells.Add(cellSum11);

            }

            //configure rows based on period data
            foreach (PeriodHeader ph in reportData.BulkReportData.Data)
            {
                //variables to calculate summaries
                var summaryVars = new Dictionary<string, decimal>()
                {
                    { "sumRow1kWh", 0M },
                    { "sumRow1kVA", 0M },
                    { "sumRow1RC", 0M }
                };

                //row 1 cells 2, 3, 4
                XRTableCell cell12 = new();
                cell12.BackColor = Color.Gainsboro;
                cell12.BorderColor = Color.LightGray;
                cell12.Borders = BorderSide.All;
                cell12.Font = new Font("Arial", 8F);
                cell12.Text = ph.StartDate;
                cell12.TextAlignment = TextAlignment.MiddleCenter;
                cell12.WidthF = 60F;

                row1.Cells.Add(cell12);

                XRTableCell cell13 = new();
                cell13.BackColor = Color.Gainsboro;
                cell13.BorderColor = Color.LightGray;
                cell13.Borders = BorderSide.All;
                cell13.Font = new Font("Arial", 8F);
                cell13.Text = ph.EndDate;
                cell13.TextAlignment = TextAlignment.MiddleCenter;
                cell13.WidthF = 60F;

                row1.Cells.Add(cell13);

                XRTableCell cell14 = new();
                cell14.BackColor = Color.Gainsboro;
                cell14.BorderColor = Color.LightGray;
                cell14.Borders = BorderSide.All;
                cell14.Font = new Font("Arial", 8F);
                cell14.Text = ph.PeriodDays;
                cell14.TextAlignment = TextAlignment.MiddleCenter;
                cell14.WidthF = 100F;

                row1.Cells.Add(cell14);

                if (ph.Details.Count > 0) ProcessBulkDetails(ref table, ph, ref summaryVars);

                //add cells 2,3,4 to summary rows
                //summary row 1: Benchmark Expense per m²
                XRTableCell cellSum12 = new();
                cellSum12.BackColor = Color.WhiteSmoke;
                cellSum12.BorderColor = Color.LightGray;
                cellSum12.Borders = BorderSide.All;
                cellSum12.Font = new Font("Arial", 8F);
                cellSum12.Text = (summaryVars["sumRow1kWh"] / reportData.BuildingArea).ToString("##0.00");
                cellSum12.TextAlignment = TextAlignment.MiddleRight;
                cellSum12.WidthF = 60F;

                rowSum1.Cells.Add(cellSum12);

                XRTableCell cellSum13 = new();
                cellSum13.BackColor = Color.WhiteSmoke;
                cellSum13.BorderColor = Color.LightGray;
                cellSum13.Borders = BorderSide.All;
                cellSum13.Font = new Font("Arial", 8F);
                cellSum13.Text = (summaryVars["sumRow1kVA"] / reportData.BuildingArea).ToString("##0.00"); ;
                cellSum13.TextAlignment = TextAlignment.MiddleRight;
                cellSum13.WidthF = 60F;

                rowSum1.Cells.Add(cellSum13);

                XRTableCell cellSum14 = new();
                cellSum14.BackColor = Color.WhiteSmoke;
                cellSum14.BorderColor = Color.LightGray;
                cellSum14.Borders = BorderSide.All;
                cellSum14.Font = new Font("Arial", 8F);
                cellSum14.Text = (summaryVars["sumRow1RC"] / reportData.BuildingArea).ToString("C", CultureInfo.CurrentCulture);
                cellSum14.TextAlignment = TextAlignment.MiddleRight;
                cellSum14.WidthF = 100F;

                rowSum1.Cells.Add(cellSum14);

                table.Rows.AddRange(new XRTableRow[] { rowSum1 });

            }
        }

        private static void ProcessBulkDetails(ref XRTable table, PeriodHeader ph, ref Dictionary<string, decimal> summaryVars)
        {
            //detail rows
            foreach (PeriodDetail dt in ph.Details)
            {
                XRTableRow? rowDet = null;
                foreach (XRTableRow row in table.Rows)
                {
                    if (row.Cells.Count > 0 && row.Cells[0].Text == dt.ItemName)
                    {
                        rowDet = row;
                        break;
                    }
                }
                if (rowDet == null)
                {
                    rowDet = new XRTableRow();
                    table.Rows.Add(rowDet);
                    //Add first cell to detail row
                    XRTableCell cellDet1 = new();
                    cellDet1.BorderColor = Color.LightGray;
                    cellDet1.Borders = BorderSide.All;
                    cellDet1.Font = new Font("Arial", 8F, FontStyle.Bold);
                    cellDet1.Text = dt.ItemName;
                    cellDet1.TextAlignment = TextAlignment.MiddleLeft;
                    cellDet1.WidthF = 185F;

                    rowDet.Cells.Add(cellDet1);
                }

                //add cells 2,3,4 to row
                XRTableCell cellDet2 = new();
                cellDet2.BorderColor = Color.LightGray;
                cellDet2.Borders = BorderSide.All;
                cellDet2.Font = new Font("Arial", 8F);
                cellDet2.Text = (dt.ItemName.Contains("%")) ? (dt.kWhUsage).ToString("##0.00") : dt.kWhUsage.ToString("### ### ##0");
                cellDet2.TextAlignment = TextAlignment.MiddleRight;
                cellDet2.WidthF = 60F;

                rowDet.Cells.Add(cellDet2);

                XRTableCell cellDet3 = new();
                cellDet3.BorderColor = Color.LightGray;
                cellDet3.Borders = BorderSide.All;
                cellDet3.Font = new Font("Arial", 8F);
                cellDet3.Text = (dt.ItemName.Contains("%")) ? dt.kVAUsage.ToString("### ##0.00") : dt.kVAUsage.ToString("### ### ##0");
                cellDet3.TextAlignment = TextAlignment.MiddleRight;
                cellDet3.WidthF = 60F;

                rowDet.Cells.Add(cellDet3);

                XRTableCell cellDet4 = new();
                cellDet4.BorderColor = Color.LightGray;
                cellDet4.Borders = BorderSide.All;
                cellDet4.Font = new Font("Arial", 8F);
                cellDet4.Text = dt.TotalAmount.ToString("C", CultureInfo.CurrentCulture);
                cellDet4.TextAlignment = TextAlignment.MiddleRight;
                cellDet4.WidthF = 100F;

                rowDet.Cells.Add(cellDet4);

                if (!dt.Highlighted)
                {
                    summaryVars["sumRow1kWh"] += dt.kWhUsage;
                    summaryVars["sumRow1kVA"] += dt.kVAUsage;
                    summaryVars["sumRow1RC"] += dt.TotalAmount;
                }
            }

        }

        #endregion

        #region Council Table

        private static XRTable CreateCouncilTable(BuildingRecoveryReport reportData)
        {
            XRTable tableBulk = new XRTable();
            tableBulk.Name = "CouncilTable";

            // Start table initialization.
            tableBulk.BeginInit();

            InitiateTableCouncil(ref tableBulk, reportData, 240F);

            ProcessTableCouncil(ref tableBulk, reportData);

            // Finish table initialization.
            tableBulk.EndInit();

            return tableBulk;
        }

        private static void InitiateTableCouncil(ref XRTable table, BuildingRecoveryReport reportData, float startPoint = 0F)
        {
            // specify table specifics.
            table.LocationFloat = new PointFloat(0F, startPoint);
            table.Padding = new PaddingInfo(2, 2, 0, 0, 96F);
            table.SizeF = new SizeF((float)(185F + (220F * reportData.CouncilReportData.Data.Count)), 100F);
            table.StylePriority.UseFont = false;

            // Create first fixed table rows.
            XRTableRow row1 = new();

            //add rows to table
            table.Rows.AddRange(new XRTableRow[] { row1 });

            //Row 1
            //add first cell
            XRTableCell cell11 = new();

            //Cell 1
            cell11.BackColor = Color.LightGray;
            cell11.BorderColor = Color.LightGray;
            cell11.Borders = BorderSide.All;
            cell11.Font = new Font("Arial", 8F, FontStyle.Bold);
            cell11.Text = "Electricity Council Acc";
            cell11.TextAlignment = TextAlignment.MiddleLeft;
            cell11.WidthF = 185F;

            row1.Cells.Add(cell11);
        }

        private static void ProcessTableCouncil(ref XRTable table, BuildingRecoveryReport reportData)
        {
            //build the summary rows but do not add to table yet
            XRTableRow rowSum1 = new(); // Benchmark Expense per m²

            XRTableRow row1 = table.Rows[0];

            if (reportData.CouncilReportData.Data.Count > 0)
            {
                //build the summary rows but do not add to table yet
                XRTableCell cellSum11 = new();
                cellSum11.BackColor = Color.WhiteSmoke;
                cellSum11.BorderColor = Color.LightGray;
                cellSum11.Borders = (BorderSide.All);
                cellSum11.Font = new Font("Arial1", 8F, FontStyle.Bold);
                cellSum11.Text = "Expense per m²";
                cellSum11.TextAlignment = TextAlignment.MiddleLeft;
                cellSum11.WidthF = 185F;
                rowSum1.Cells.Add(cellSum11);

            }

            //configure rows based on period data
            foreach (PeriodHeader ph in reportData.CouncilReportData.Data)
            {
                //variables to calculate summaries
                var summaryVars = new Dictionary<string, decimal>()
                {
                    { "sumRow1kWh", 0M },
                    { "sumRow1kVA", 0M },
                    { "sumRow1RC", 0M }
                };

                //row 1 cells 2, 3, 4
                XRTableCell cell12 = new();
                cell12.BackColor = Color.Gainsboro;
                cell12.BorderColor = Color.LightGray;
                cell12.Borders = BorderSide.All;
                cell12.Font = new Font("Arial", 8F);
                cell12.Text = ph.StartDate;
                cell12.TextAlignment = TextAlignment.MiddleCenter;
                cell12.WidthF = 60F;

                row1.Cells.Add(cell12);

                XRTableCell cell13 = new();
                cell13.BackColor = Color.Gainsboro;
                cell13.BorderColor = Color.LightGray;
                cell13.Borders = BorderSide.All;
                cell13.Font = new Font("Arial", 8F);
                cell13.Text = ph.EndDate;
                cell13.TextAlignment = TextAlignment.MiddleCenter;
                cell13.WidthF = 60F;

                row1.Cells.Add(cell13);

                XRTableCell cell14 = new();
                cell14.BackColor = Color.Gainsboro;
                cell14.BorderColor = Color.LightGray;
                cell14.Borders = BorderSide.All;
                cell14.Font = new Font("Arial", 8F);
                cell14.Text = ph.PeriodDays;
                cell14.TextAlignment = TextAlignment.MiddleCenter;
                cell14.WidthF = 100F;

                row1.Cells.Add(cell14);

                if (ph.Details.Count > 0) ProcessCouncilDetails(ref table, ph, ref summaryVars);

                //add cells 2,3,4 to summary rows
                //summary row 1: Benchmark Expense per m²
                XRTableCell cellSum12 = new();
                cellSum12.BackColor = Color.WhiteSmoke;
                cellSum12.BorderColor = Color.LightGray;
                cellSum12.Borders = BorderSide.All;
                cellSum12.Font = new Font("Arial", 8F);
                cellSum12.Text = (summaryVars["sumRow1kWh"] / reportData.BuildingArea).ToString("##0.00");
                cellSum12.TextAlignment = TextAlignment.MiddleRight;
                cellSum12.WidthF = 60F;

                rowSum1.Cells.Add(cellSum12);

                XRTableCell cellSum13 = new();
                cellSum13.BackColor = Color.WhiteSmoke;
                cellSum13.BorderColor = Color.LightGray;
                cellSum13.Borders = BorderSide.All;
                cellSum13.Font = new Font("Arial", 8F);
                cellSum13.Text = (summaryVars["sumRow1kVA"] / reportData.BuildingArea).ToString("##0.00"); ;
                cellSum13.TextAlignment = TextAlignment.MiddleRight;
                cellSum13.WidthF = 60F;

                rowSum1.Cells.Add(cellSum13);

                XRTableCell cellSum14 = new();
                cellSum14.BackColor = Color.WhiteSmoke;
                cellSum14.BorderColor = Color.LightGray;
                cellSum14.Borders = BorderSide.All;
                cellSum14.Font = new Font("Arial", 8F);
                cellSum14.Text = (summaryVars["sumRow1RC"] / reportData.BuildingArea).ToString("C", CultureInfo.CurrentCulture);
                cellSum14.TextAlignment = TextAlignment.MiddleRight;
                cellSum14.WidthF = 100F;

                rowSum1.Cells.Add(cellSum14);

                table.Rows.AddRange(new XRTableRow[] { rowSum1 });

            }
        }

        private static void ProcessCouncilDetails(ref XRTable table, PeriodHeader ph, ref Dictionary<string, decimal> summaryVars)
        {
            //detail rows
            foreach (PeriodDetail dt in ph.Details)
            {
                XRTableRow? rowDet = null;
                foreach (XRTableRow row in table.Rows)
                {
                    if (row.Cells.Count > 0 && row.Cells[0].Text == dt.ItemName)
                    {
                        rowDet = row;
                        break;
                    }
                }
                if (rowDet == null)
                {
                    rowDet = new XRTableRow();
                    table.Rows.Add(rowDet);
                    //Add first cell to detail row
                    XRTableCell cellDet1 = new();
                    cellDet1.BorderColor = Color.LightGray;
                    cellDet1.Borders = BorderSide.All;
                    cellDet1.Font = new Font("Arial", 8F, FontStyle.Bold);
                    cellDet1.Text = dt.ItemName;
                    cellDet1.TextAlignment = TextAlignment.MiddleLeft;
                    cellDet1.WidthF = 185F;

                    rowDet.Cells.Add(cellDet1);
                }

                //add cells 2,3,4 to row
                XRTableCell cellDet2 = new();
                cellDet2.BorderColor = Color.LightGray;
                cellDet2.Borders = BorderSide.All;
                cellDet2.Font = new Font("Arial", 8F);
                cellDet2.Text = (dt.ItemName.Contains("%")) ? (dt.kWhUsage).ToString("##0.00") : dt.kWhUsage.ToString("### ### ##0");
                cellDet2.TextAlignment = TextAlignment.MiddleRight;
                cellDet2.WidthF = 60F;

                rowDet.Cells.Add(cellDet2);

                XRTableCell cellDet3 = new();
                cellDet3.BorderColor = Color.LightGray;
                cellDet3.Borders = BorderSide.All;
                cellDet3.Font = new Font("Arial", 8F);
                cellDet3.Text = (dt.ItemName.Contains("%")) ? dt.kVAUsage.ToString("### ##0.00") : dt.kVAUsage.ToString("### ### ##0");
                cellDet3.TextAlignment = TextAlignment.MiddleRight;
                cellDet3.WidthF = 60F;

                rowDet.Cells.Add(cellDet3);

                XRTableCell cellDet4 = new();
                cellDet4.BorderColor = Color.LightGray;
                cellDet4.Borders = BorderSide.All;
                cellDet4.Font = new Font("Arial", 8F);
                cellDet4.Text = dt.TotalAmount.ToString("C", CultureInfo.CurrentCulture);
                cellDet4.TextAlignment = TextAlignment.MiddleRight;
                cellDet4.WidthF = 100F;

                rowDet.Cells.Add(cellDet4);

                if (!dt.Highlighted)
                {
                    summaryVars["sumRow1kWh"] += dt.kWhUsage;
                    summaryVars["sumRow1kVA"] += dt.kVAUsage;
                    summaryVars["sumRow1RC"] += dt.TotalAmount;
                }
            }

        }

        #endregion
    }
}
