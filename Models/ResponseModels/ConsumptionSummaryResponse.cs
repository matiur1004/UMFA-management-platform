using System.Text.Json.Serialization;

namespace ClientPortal.Models.ResponseModels
{
    public class ConsumptionSummaryResponse
    {
        // [JsonPropertyName("headers")]
        public List<ConsumptionSummaryHeader> Headers { get; set; }

        // [JsonPropertyName("details")]
        public List<ConsumptionSummaryDetail> Details { get; set; }

        // [JsonPropertyName("reportTotals")]
        public ConsumptionSummaryTotals ReportTotals { get; set; }

        public ConsumptionSummaryResponse() { }

        public ConsumptionSummaryResponse(ConsumptionSummarySpResponse request)
        {
            Headers = request.Headers;
            Details = request.Details;

            ReportTotals = new ConsumptionSummaryTotals();
            foreach (var invGroup in Details.GroupBy(x => new { x.InvGroup }))
            {
                var invTotal = new ConsumptionSummaryInvoiceGroupTotals();
                invTotal.Name = invGroup.Key.InvGroup;

                invTotal.Totals.ConsumptionExcl = invGroup.Sum(ig => ig.ShopCons);
                invTotal.Totals.BasicChargeExcl = invGroup.Sum(ig => ig.ShopBC);
                invTotal.Totals.TotalExcl = invGroup.Sum(ig => ig.Excl);

                ReportTotals.InvoiceGroupTotals.Add(invTotal);
            }

            ReportTotals.ReportTotalsExcl.TotalExcl = ReportTotals.InvoiceGroupTotals.Sum(ig => ig.Totals.TotalExcl);
            ReportTotals.ReportTotalsExcl.ConsumptionExcl = ReportTotals.InvoiceGroupTotals.Sum(ig => ig.Totals.ConsumptionExcl);
            ReportTotals.ReportTotalsExcl.BasicChargeExcl = ReportTotals.InvoiceGroupTotals.Sum(ig => ig.Totals.BasicChargeExcl);

            ReportTotals.Vat = Details.Sum(ig => ig.Vat);

            ReportTotals.TotalIncl = ReportTotals.ReportTotalsExcl.TotalExcl + ReportTotals.Vat;
        }
    }

    public class ConsumptionSummaryTotals
    {
        // [JsonPropertyName("invoiceGroupTotals")]
        public List<ConsumptionSummaryInvoiceGroupTotals> InvoiceGroupTotals { get; set; } = new List<ConsumptionSummaryInvoiceGroupTotals>();

        // [JsonPropertyName("reportTotalsExcl")]
        public ConsumptionSummaryTotalDetails ReportTotalsExcl { get; set; } = new ConsumptionSummaryTotalDetails();

        // [JsonPropertyName("vat")]
        public double Vat { get; set; }

        // [JsonPropertyName("totalIncl")]
        public double TotalIncl { get; set; }
    }

    public class ConsumptionSummaryInvoiceGroupTotals
    {
        // [JsonPropertyName("name")]
        public string Name { get; set; }

        // [JsonPropertyName("totals")]
        public ConsumptionSummaryTotalDetails Totals { get; set; } = new ConsumptionSummaryTotalDetails();
    }

    public class ConsumptionSummaryTotalDetails
    {
        // [JsonPropertyName("consumptionExcl")]
        public double ConsumptionExcl { get; set; }

        // [JsonPropertyName("basicChargeExcl")]
        public double BasicChargeExcl { get; set; }

        // [JsonPropertyName("totalExcl")]
        public double TotalExcl { get; set; }
    }
}
