using System.Text.Json.Serialization;

namespace ClientPortal.Models.ResponseModels
{
    public class TenantSlipDataForArchiveSpResponse
    {
        // [JsonPropertyName("headers")]
        public List<TenantSlipDataForArchiveBusiness> Headers { get; set; }

        // [JsonPropertyName("tenantInfos")]
        public List<TenantSlipDataForArchiveTenantInfo> TenantInfos { get; set; }

        // [JsonPropertyName("shops")]
        public List<TenantSlipDataForArchiveShop> Shops { get; set; }

        // [JsonPropertyName("shopBillingInfos")]
        public List<TenantSlipDataForArchiveShopBillingInfo> ShopBillingInfos { get; set; }

        // [JsonPropertyName("serviceFees")]
        public List<TenantSlipDataForArchiveServiceFee> ServiceFees { get; set; }

        // [JsonPropertyName("meterCharges")]
        public List<TenantSlipDataForArchiveMeterCharge> MeterCharges { get; set; }

        // [JsonPropertyName("graphData")]
        public List<TenantSlipDataForArchiveGraphData> GraphData { get; set; }

        // [JsonPropertyName("fileName")]
        public string? FileName { get; set; }
    }

    public class TenantSlipDataForArchiveBusiness
    {
        // [JsonPropertyName("reportTypeId")]
        public int ReportTypeId { get; set; }

        // [JsonPropertyName("businessName")]
        public string BusinessName { get; set; }

        // [JsonPropertyName("compRegNr")]
        public string CompRegNr { get; set; }

        // [JsonPropertyName("postalAdd")]
        public string PostalAdd { get; set; }

        // [JsonPropertyName("physicalAdd")]
        public string PhysicalAdd { get; set; }

        // [JsonPropertyName("telNo")]
        public string TelNo { get; set; }

        // [JsonPropertyName("faxNo")]
        public string FaxNo { get; set; }

        // [JsonPropertyName("email")]
        public string Email { get; set; }

        // [JsonPropertyName("webURL")]
        public string WebURL { get; set; }

        // [JsonPropertyName("supplierName")]
        public string SupplierName { get; set; }

        // [JsonPropertyName("logoCrystalImage")]
        public byte[] LogoCrystalImage { get; set; }
    }

    public class TenantSlipDataForArchiveTenantInfo
    {
        // [JsonPropertyName("tenantId")]
        public int TenantId { get; set; }

        // [JsonPropertyName("tenantName")]
        public string TenantName { get; set; }

        // [JsonPropertyName("addLine1")]
        public string AddLine1 { get; set; }

        // [JsonPropertyName("addLine2")]
        public string AddLine2 { get; set; }

        // [JsonPropertyName("addLine3")]
        public string AddLine3 { get; set; }

        // [JsonPropertyName("addLine4")]
        public string AddLine4 { get; set; }

        // [JsonPropertyName("code")]
        public string Code { get; set; }

        // [JsonPropertyName("vatNr")]
        public string VatNr { get; set; }

        // [JsonPropertyName("building")]
        public string Building { get; set; }

        // [JsonPropertyName("exportCode")]
        public string ExportCode { get; set; }

        // [JsonPropertyName("units")]
        public string Units { get; set; }

        // [JsonPropertyName("area")]
        public double Area { get; set; }

        // [JsonPropertyName("comments")]
        public string Comments { get; set; }
    }

    public class TenantSlipDataForArchiveShop
    {
        // [JsonPropertyName("shopID")]
        public int ShopID { get; set; }

        // [JsonPropertyName("shopNr")]
        public string ShopNr { get; set; }

        // [JsonPropertyName("shopName")]
        public string ShopName { get; set; }

        // [JsonPropertyName("shopDescription")]
        public string ShopDescription { get; set; }

        // [JsonPropertyName("shopArea")]
        public double ShopArea { get; set; }

        // [JsonPropertyName("shopTotExcl")]
        public decimal ShopTotExcl { get; set; }
    }

    public class TenantSlipDataForArchiveShopBillingInfo
    {
        // [JsonPropertyName("shopID")]
        public int ShopID { get; set; }

        // [JsonPropertyName("groupID")]
        public int GroupID { get; set; }

        // [JsonPropertyName("groupName")]
        public string GroupName { get; set; }

        // [JsonPropertyName("groupTotExcl")]
        public decimal GroupTotExcl { get; set; }
    }

    public class TenantSlipDataForArchiveServiceFee
    {
        // [JsonPropertyName("shopID")]
        public int ShopID { get; set; }

        // [JsonPropertyName("groupID")]
        public int GroupID { get; set; }

        // [JsonPropertyName("serviceFeeName")]
        public string ServiceFeeName { get; set; }

        // [JsonPropertyName("serviceFeeExcl")]
        public decimal ServiceFeeExcl { get; set; }
    }

    public class TenantSlipDataForArchiveMeterCharge
    {
        // [JsonPropertyName("shopID")]
        public int ShopID { get; set; }

        // [JsonPropertyName("groupID")]
        public int GroupID { get; set; }

        // [JsonPropertyName("chargeName")]
        public string ChargeName { get; set; }

        // [JsonPropertyName("meterNo")]
        public string MeterNo { get; set; }

        // [JsonPropertyName("prevReadingDate")]
        public DateTime PrevReadingDate { get; set; }

        // [JsonPropertyName("prevReading")]
        public string PrevReading { get; set; }

        // [JsonPropertyName("readingDate")]
        public DateTime ReadingDate { get; set; }

        // [JsonPropertyName("closingReading")]
        public double ClosingReading { get; set; }

        // [JsonPropertyName("usage")]
        public double Usage { get; set; }

        // [JsonPropertyName("billedUsage")]
        public double BilledUsage { get; set; }

        // [JsonPropertyName("meterChargeExcl")]
        public decimal MeterChargeExcl { get; set; }
    }

    public class TenantSlipDataForArchiveGraphData
    {
        // [JsonPropertyName("periodID")]
        public int PeriodID { get; set; }

        // [JsonPropertyName("periodName")]
        public string PeriodName { get; set; }

        // [JsonPropertyName("readingShort")]
        public string ReadingShort { get; set; }

        // [JsonPropertyName("tenantTotExcl")]
        public double TenantTotExcl { get; set; }
    }
}
