namespace ClientPortal.Models.ResponseModels
{
    public class DashboardShopsSpResponse
    {
        public List<DashboardShopInfo> Infos { get; set; }
        public List<DashboardShopBilling> Billings { get; set; }
        public List<DashboardShopOccupation> Occupations { get; set; }
        public List<DashboardShopAssignedMeter> AssignedMeters { get; set; }
        public List<DasboardShopReading> Readings { get; set; }
    }

    public class DashboardShopInfo
    {
        public int Id { get; set; }
        public int ShopID { get; set; }
        public bool IsVacant { get; set; }
        public string ShopNr { get; set; }
        public string ShopName { get; set; }
        public string ShopDescription { get; set; }
        public double ShopArea { get; set; }
        public bool ShopActive { get; set; }
        public int NoOfOccupations { get; set; }
    }

    public class DashboardShopBilling
    {
        public int Id { get; set; }
        public int ShopID { get; set; }
        public int GroupID { get; set; }
        public int PeriodID { get; set; }
        public string PeriodName { get; set; }
        public string GroupName { get; set; }
        public double Usage { get; set; }
        public decimal Amount { get; set; }
    }

    public class DashboardShopOccupation
    {
        public int Id { get; set; }
        public int ShopID { get; set; }
        public int TenantId { get; set; }
        public string TenantName { get; set; }
        public bool TenantActive { get; set; }
        public DateTime OccupationDTM { get; set; }
        public DateTime? VacationDTM { get; set; }
    }

    public class DashboardShopAssignedMeter
    {
        public int Id { get; set; }
        public int ShopID { get; set; }
        public int BuildingServiceID { get; set; }
        public string MeterNo { get; set; }
        public string AssType { get; set; }
    }

    public class DasboardShopReading
    {
        public int Id { get; set; }
        public int BuildingServiceID { get; set; }
        public int PeriodId { get; set; }
        public string PeriodName { get; set; }
        public DateTime PeriodStart { get; set; }
        public DateTime PeriodEnd { get; set; }
        public DateTime ReadingDate { get; set; }
        public double ActualReading { get; set; }
        public double ReadingUsage { get; set; }
        public string ReadingMethod { get; set; }
        public string Photo { get; set; }
    }
}
