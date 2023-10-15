﻿namespace ClientPortal.Models.ResponseModels
{
    public class UmfaTenantDashboardBillingCardDetail
    {
        public int TenantID { get; set; }
        public string Tenant { get; set; }
        public int ShopID { get; set; }
        public string ShopNr { get; set; }
        public int GroupID { get; set; }
        public int PeriodID { get; set; }
        public string PeriodName { get; set; }
        public string GroupName { get; set; }
        public double Usage { get; set; }
        public decimal Amount { get; set; }
    }
}
