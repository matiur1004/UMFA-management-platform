using ClientPortal.Data.Entities.UMFAEntities;

namespace ClientPortal.Models.ResponseModels
{
    public class UMFAPartnerResponse
    {
        public int UserId { get; set; }
        public string Status { get; set; } = "Success";
        public string ErrorMessage { get; set; }
        public List<UMFAPartner> Partners { get; set; }

        public UMFAPartnerResponse() {}

        public UMFAPartnerResponse(int userId)
        {
            this.UserId = userId;
            this.Status = "Success";
            this.ErrorMessage = "";
            this.Partners = new();
        }
    }
}
