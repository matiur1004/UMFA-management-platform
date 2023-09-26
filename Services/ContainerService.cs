using Azure.Storage.Blobs;
using ClientPortal.Settings;
using Microsoft.Extensions.Options;

namespace ClientPortal.Services
{
    public interface IContainerService
    {
        public Task AddBlobAsync(MemoryStream stream, string blobName, bool overwrite = false);
    }

    public class ContainerService<TSettings> : IContainerService where TSettings : ContainerSettings
    {
        private readonly TSettings _settings;
        private readonly ILogger<ContainerService<TSettings>> _logger;

        public ContainerService(ILogger<ContainerService<TSettings>> logger, IOptions<TSettings> options) 
        {
            _logger = logger;
            _settings = options.Value;
        }

        public async Task AddBlobAsync(MemoryStream stream, string blobName, bool overwrite = false)
        {
            _logger.LogDebug($"Adding Blob {blobName} to container {_settings.ContainerName}");
            stream.Position = 0;

            var blobClient = new BlobClient(_settings.ContainerConnection, _settings.ContainerName, blobName);
            await blobClient.UploadAsync(stream, overwrite);

            _logger.LogDebug($"Added Blob {blobName} to container {_settings.ContainerName}");
        }
    }
}
