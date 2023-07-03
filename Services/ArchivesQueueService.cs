using Azure.Storage.Queues;
using ClientPortal.Settings;
using Microsoft.Extensions.Options;

namespace ClientPortal.Services
{
    public interface IQueueService
    {
        Task AddMessageToQueueAsync(string queueMessage);
    }
    public class ArchivesQueueService : IQueueService
    {
        private readonly QueueClient _queueClient;

        public ArchivesQueueService(IOptions<ArchivesQueueSettings> settings)
        {
            _queueClient = new QueueClient(settings.Value.ConnectionString, settings.Value.QueueName);
        }

        public async Task AddMessageToQueueAsync(string queueMessage)
        {
            await _queueClient.SendMessageAsync(queueMessage);
        }
    }
}
