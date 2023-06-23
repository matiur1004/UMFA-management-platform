namespace ClientPortal.Models.ResponseModels
{
    public class ConsumptionSummaryResponse
    {
        public List<ConsumptionSummaryHeader> Headers { get; set; }
        public List<ConsumptionSummaryDetail> Details { get; set; }
        public ConsumptionSummaryTotals ReportTotals { get; set; }

        public ConsumptionSummaryResponse(ConsumptionSummarySpResponse request) 
        {
            Headers = request.Headers;
            Details = request.Details;

            ReportTotals = new ConsumptionSummaryTotals();
            foreach(var invGroup in Details.GroupBy(x => new { x.InvGroup }))
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
        public List<ConsumptionSummaryInvoiceGroupTotals> InvoiceGroupTotals { get; set; } = new List<ConsumptionSummaryInvoiceGroupTotals>();
        public ConsumptionSummaryTotalDetails ReportTotalsExcl { get; set; } = new ConsumptionSummaryTotalDetails();
        public double Vat { get; set; }
        public double TotalIncl { get; set; }
    }

    public class ConsumptionSummaryInvoiceGroupTotals
    {
        public string Name { get; set; }
        public ConsumptionSummaryTotalDetails Totals { get; set; } = new ConsumptionSummaryTotalDetails();
    }

    public class ConsumptionSummaryTotalDetails
    {
        public double ConsumptionExcl { get; set; }
        public double BasicChargeExcl { get; set; }
        public double TotalExcl { get; set; }
    }
}
