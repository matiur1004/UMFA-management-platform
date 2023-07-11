using Azure.Storage.Blobs;
using ClientPortal.Settings;
using Microsoft.Extensions.Options;

namespace ClientPortal.Services
{
    public interface IContainerService
    {
        public Task AddBlobAsync(MemoryStream stream, string blobName, bool overwrite = false);
    }

    public class ContainerService : IContainerService
    {
        private readonly ArchiveContainerSettings _settings;
        private readonly ILogger<ContainerService> _logger;
        public ContainerService(ILogger<ContainerService> logger, IOptions<ArchiveContainerSettings> options) 
        {
            _logger = logger;
            _settings = options.Value;
        }

        public async Task AddBlobAsync(MemoryStream stream, string blobName, bool overwrite = false)
        {
            _logger.LogDebug($"Adding Blob {blobName} to container {_settings.ContainerName}");
            stream.Position = 0;

            BlobClient blobClient = new BlobClient(_settings.ContainerConnection, _settings.ContainerName, blobName);
            await blobClient.UploadAsync(stream, overwrite);

            _logger.LogDebug($"Added Blob {blobName} to container {_settings.ContainerName}");
        }
    }
}
