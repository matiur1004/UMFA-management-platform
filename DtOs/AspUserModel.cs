using System.Text.Json.Serialization;

namespace ClientPortal.DtOs
{

    public class AspUserModel
    {
        [JsonPropertyName("userId")]
        public int UserId { get; set; } = 0;
        [JsonPropertyName("createdDtm")]
        public DateTime CreatedDtm { get; set; }
        [JsonPropertyName("lastUpdateDtm")]
        public DateTime LastUpdateDtm { get; set; }
        [JsonPropertyName("active")]
        public bool Active { get; set; } = false;
        [JsonPropertyName("aspnetUserid")]
        public string AspnetUserid { get; set; }
        [JsonPropertyName("faxNumber")]
        public string FaxNumber { get; set; }
        [JsonPropertyName("telephoneNumber")]
        public string TelephoneNumber { get; set; }
        [JsonPropertyName("mobile")]
        public string Mobile { get; set; }
        [JsonPropertyName("name")]
        public string Name { get; set; }
        [JsonPropertyName("surname")]
        public string Surname { get; set; }
        [JsonPropertyName("validated")]
        public bool Validated { get; set; } = false ;
        [JsonPropertyName("isSiteAdmin")]
        public bool IsSiteAdmin { get; set; } = false;
        [JsonPropertyName("createdUserId")]
        public int CreatedUserId { get; set; }
        [JsonPropertyName("lastUpdateUserId")]
        public int LastUpdateUserId { get; set; }
        [JsonPropertyName("isClient")]
        public bool IsClient { get; set; } = false;
        [JsonPropertyName("employeeCode")]
        public string EmployeeCode { get; set; }
        [JsonPropertyName("isTenant")]
        public bool IsTenant { get; set; } = false;
        [JsonPropertyName("scadaUsername")]
        public string ScadaUsername { get; set; }
        [JsonPropertyName("scadaPwd")]
        public string ScadaPwd { get; set; }

        public AspUserModel() { }

    }
}
