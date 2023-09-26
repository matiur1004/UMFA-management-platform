using Azure.Storage.Queues;
using ClientPortal.Settings;
using Microsoft.Extensions.Options;

namespace ClientPortal.Services
{
    public interface IQueueService
    {
        Task AddMessageToQueueAsync(string queueMessage);
    }
    public class QueueService<TSettings> : IQueueService where TSettings : QueueSettings
    {
        private readonly QueueClient _queueClient;

        public QueueService(IOptions<TSettings> settings)
        {
            _queueClient = new QueueClient(settings.Value.ConnectionString, settings.Value.QueueName);
            _queueClient.CreateIfNotExists();
        }

        public async Task AddMessageToQueueAsync(string queueMessage)
        {
            string encodedMessage = Convert.ToBase64String(Encoding.UTF8.GetBytes(queueMessage));
            await _queueClient.SendMessageAsync(encodedMessage);
        }
    }
}
