namespace ClientPortal.Settings
{
    public abstract class ContainerSettings
    {
        public string ContainerConnection { get; set; }
        public string ContainerName { get; set; }
        public string StorageAccount { get; set; }
        public string ContainerBaseUrl => $"https://{StorageAccount}.blob.core.windows.net/{ContainerName}";
    }
}
