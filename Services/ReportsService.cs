using ClientPortal.Data.Entities.PortalEntities;
using ClientPortal.Data.Repositories;
using ClientPortal.Models.MessagingModels;

namespace ClientPortal.Services
{
    public interface IReportsService
    {
        public  Task<FeedbackReportRequest> AddFeedbackReportRequestAsync(FeedbackReportRequestData request);
        public Task<FeedbackReportRequest> GetFeedbackReportRequestAsync(FeedbackReportRequestData request);
        public Task<FeedbackReportRequest> UpdateFeedbackReportRequestAsync(int requestId, int status, string? url = null);
    }
    
    public class ReportsService : IReportsService
    {
        private readonly ILogger<ReportsService> _logger;
        private readonly IFeedbackReportRequestRepository _feedbackReportRequestRepository;

        public ReportsService(ILogger<ReportsService> loggger, IFeedbackReportRequestRepository feedbackReportRequestRepository)
        {
            _logger = loggger;
            _feedbackReportRequestRepository = feedbackReportRequestRepository;
        }

        public async Task<FeedbackReportRequest> AddFeedbackReportRequestAsync(FeedbackReportRequestData request)
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

            return reportRequest;
        }

        public async Task<FeedbackReportRequest> GetFeedbackReportRequestAsync(FeedbackReportRequestData request)
        {
            return (await _feedbackReportRequestRepository.GetAsync(fbr => fbr.Active && fbr.BuildingId.Equals(request.BuildingId) && fbr.PeriodId.Equals(request.PeriodId)));
        }

        public async Task<FeedbackReportRequest> UpdateFeedbackReportRequestAsync(int requestId, int status, string? url = null)
        {
            var feedbackReportRequest = await _feedbackReportRequestRepository.GetAsync(requestId);

            if(feedbackReportRequest is null)
            {
                _logger.LogError($"Could not find feedback report request {requestId}");
                return null;
            }

            feedbackReportRequest.Status = status;
            feedbackReportRequest.Url = url;

            var updatedRequest = await _feedbackReportRequestRepository.UpdateAsync(feedbackReportRequest);

            return updatedRequest;
        }
    }
}
