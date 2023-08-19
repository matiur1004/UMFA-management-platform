using ClientPortal.Data.Entities.PortalEntities;
using ClientPortal.Data.Repositories;
using ClientPortal.Models.MessagingModels;
using System.Text.Json;

namespace ClientPortal.Services
{
    public interface IReportsService
    {
        public  Task<FeedbackReportRequest> AddFeedbackReportRequest(FeedbackReportRequestData request);
    }
    
    public class ReportsService : IReportsService
    {
        private readonly ILogger<ReportsService> _logger;
        private readonly IFeedbackReportRequestRepository _feedbackReportRequestRepository;
        private readonly IFeedbackReportsQueueService _feedbackReportsQueueService;

        public ReportsService(ILogger<ReportsService> loggger, IFeedbackReportRequestRepository feedbackReportRequestRepository, IFeedbackReportsQueueService feedbackReportsQueueService)
        {
            _logger = loggger;
            _feedbackReportRequestRepository = feedbackReportRequestRepository;
            _feedbackReportsQueueService = feedbackReportsQueueService;
        }

        public async Task<FeedbackReportRequest> AddFeedbackReportRequest(FeedbackReportRequestData request)
        {
            _logger.LogInformation("Adding feedback report request");

            var reportRequest = await  _feedbackReportRequestRepository.AddAsync(new FeedbackReportRequest 
            { 
                BuildingId = (int)request.BuildingId!,
                PeriodId = (int)request.PeriodId!,
                Active = true,
                CreatedDTM = DateTime.Now,
                LastUpdateDTM = DateTime.Now,
                Status = 1,
                StatusMessage = "Requested",
            });

            
            if (reportRequest != null)
            {
                _logger.LogInformation("Sending feedback report queue message");
                await _feedbackReportsQueueService.AddMessageToQueueAsync(JsonSerializer.Serialize(request));
            }
            else
            {
                _logger.LogError("Request was not added to db");
            }

            return reportRequest;
        }
    }
}
