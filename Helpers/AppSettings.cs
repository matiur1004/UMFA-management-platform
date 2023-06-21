namespace ClientPortal.Helpers
{
    public class AppSettings
    {
        public string Secret { get; set; }
        //Jwt Token valid time period in minutes
        public int TimeToExpire { get; set; }
        //refrsh token time to live in days
        public int RefreshTokenTTL { get; set; }
        public string UmfaWebAPIURL { get; set; }
        public string EncryptionKey { get; set; }
        public string AppVersion { get; set; }
    }
}
