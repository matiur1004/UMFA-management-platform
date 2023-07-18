namespace ClientPortal.Models.ResponseModels
{
    public class TenantSlipDataForArchiveSpResponse
    {
        public List<TenantSlipDataForArchiveBusiness> Headers { get; set; }
        public List<TenantSlipDataForArchiveTenantInfo> TenantInfos { get; set; }
        public List<TenantSlipDataForArchiveShop> Shops { get; set; }
        public List<TenantSlipDataForArchiveShopBillingInfo> ShopBillingInfos { get; set; }
        public List<TenantSlipDataForArchiveServiceFee> ServiceFees { get; set; }
        public List<TenantSlipDataForArchiveMeterCharge> MeterCharges { get; set; }
        public List<TenantSlipDataForArchiveGraphData> GraphData { get; set; }

        public string? FileName { get; set; }
    }

    public class TenantSlipDataForArchiveBusiness
    {
        public int ReportTypeId { get; set; }
        public string BusinessName { get; set; }
        public string CompRegNr { get; set; }
        public string PostalAdd { get; set; }
        public string PhysicalAdd { get; set; }
        public string TelNo { get; set; }
        public string FaxNo { get; set; }
        public string Email { get; set; }
        public string WebURL { get; set; }
        public string SupplierName { get; set; }
        public byte[] LogoCrystalImage { get; set; }
    }

    public class TenantSlipDataForArchiveTenantInfo
    {
        public int TenantId { get; set; }
        public string TenantName { get; set; }
        public string AddLine1 { get; set; }
        public string AddLine2 { get; set; }
        public string AddLine3 { get; set; }
        public string AddLine4 { get; set; }
        public string Code { get; set; }
        public string VatNr { get; set; }
        public string Building { get; set; }
        public string ExportCode { get; set; }
        public string Units { get; set; }
        public double Area { get; set; }
        public string Comments { get; set; }
    }

    public class TenantSlipDataForArchiveShop
    {
        public int ShopID { get; set; }
        public string ShopNr { get; set; }
        public string ShopName { get; set; }
        public string ShopDescription { get; set; }
        public double ShopArea { get; set; }
        public decimal ShopTotExcl { get; set; }
    }

    public class TenantSlipDataForArchiveShopBillingInfo
    {
        public int ShopID { get; set; }
        public int GroupID { get; set; }
        public string GroupName { get; set; }
        public decimal GroupTotExcl { get; set; }
    }

    public class TenantSlipDataForArchiveServiceFee
    {
        public int ShopID { get; set; }
        public int GroupID { get; set; }
        public string ServiceFeeName { get; set; }
        public decimal ServiceFeeExcl { get; set; }
    }

    public class TenantSlipDataForArchiveMeterCharge
    {
        public int ShopID { get; set; }
        public int GroupID { get; set; }
        public string ChargeName { get; set; }
        public string MeterNo { get; set; }
        public DateTime PrevReadingDate { get; set; }
        public string PrevReading { get; set; }
        public DateTime ReadingDate { get; set; }
        public double ClosingReading { get; set; }
        public double Usage { get; set; }
        public double BilledUsage { get; set; }
        public decimal MeterChargeExcl { get; set; }
    }

    public class TenantSlipDataForArchiveGraphData
    {
        public int PeriodID { get; set; }
        public string PeriodName { get; set; }
        public string ReadingShort { get; set; }
        public double TenantTotExcl { get; set; }

    }
}
