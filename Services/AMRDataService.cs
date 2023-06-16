using AutoMapper;
using ClientPortal.Data.Entities.PortalEntities;
using ClientPortal.Data.Repositories;
using ClientPortal.DtOs;
using ClientPortal.Models.RequestModels;
using ClientPortal.Models.ResponseModels;

namespace ClientPortal.Services
{
    public interface IAMRDataService
    {
        Task<List<AMRTOUHeaderResponse>> GetTouHeaders();
        Task<DemandProfileResponse> GetDemandProfile(AMRDemandProfileRequest request);
        Task<AMRWaterProfileResponse> GetWaterProfile(AMRWaterProfileRequest request);
        Task<List<AmrJobToRun>> GetAmrJobsAsync(int profileDays);
        Task<bool> DetailQueueStatusChange(int detailId, int status);
        Task<AmrJob> ProcessProfileJob(AmrJobToRun job);
        Task<AmrJob> ProcessReadingsJob(AmrJobToRun job);
        Task<AMRGraphProfileResponse> GetGraphProfile(AMRGraphProfileRequest request);
    }

    public class AMRDataService : IAMRDataService
    {
        private readonly ILogger<AMRDataService> _logger;
        private readonly IAMRDataRepository _repo;
        private readonly IMapper _mapper;
        private readonly IScadaCalls _scadaCalls;

        public AMRDataService(ILogger<AMRDataService> logger, IAMRDataRepository repo, IMapper mapper, IScadaCalls externalCalls)
        {
            _logger = logger;
            _repo = repo;
            _mapper = mapper;
            _scadaCalls = externalCalls;
        }

        public async Task<bool> DetailQueueStatusChange(int detailId, int status)
        {
            try
            {
                return await _repo.UpdateDetailStatus(detailId, status);
            }
            catch (Exception ex)
            {
                _logger.LogError("Error while setting queue status for detail {id}: {msg}", detailId, ex.Message);
                throw;
            }
        }

        public async Task<AmrJob> ProcessReadingsJob(AmrJobToRun job)
        {
            _logger.LogInformation("Retrieving Reading Data from Scada for: {key1}", job.Key1);
            //get tracked item for updates
            ScadaRequestHeader trackedHeader = await _repo.GetTrackedScadaHeader(job.HeaderId, job.DetailId);
            try
            {
                DateTime runStart = DateTime.UtcNow;
                AmrJob ret = new() { CommsIs = job.CommsId, Key1 = job.Key1, RunDate = runStart, Success = false };

                //update the current run date and status (2: running) for header and detail
                trackedHeader.ScadaRequestDetails[0].CurrentRunDTM = runStart;
                trackedHeader.ScadaRequestDetails[0].Status = 3;

                if (!await _repo.SaveTrackedItems())
                {
                    throw new ApplicationException("Could not save tracked items from service");
                }

                //get the scada reading data from scada server
                ScadaMeterReading readings = await _scadaCalls.GetAmrReadingsFromScada(job);
                if (readings == null || readings.Result != "SUCCESS")
                {
                    throw new ApplicationException($"Scada call returned failure: {readings?.Result ?? "Empty Object"}");
                }

                trackedHeader.ScadaRequestDetails[0].Status = 4;

                //insert the data into the database
                if (!await _repo.InsertScadaReadingData(readings))
                {
                    throw new ApplicationException($"Failed to insert reading data");
                }

                trackedHeader.ScadaRequestDetails[0].Status = 5;
                if (!await _repo.SaveTrackedItems())
                {
                    throw new ApplicationException("Could not save tracked items form service");
                }

                //update the detail 
                trackedHeader.LastRunDTM = runStart;
                trackedHeader.ScadaRequestDetails[0].Status = 1;
                trackedHeader.ScadaRequestDetails[0].LastRunDTM = runStart;
                DateTime lastDate = (DateTime.Parse(readings.Meter.EndTotal.ReadingDate) < job.FromDate.AddHours(24)) ?
                    job.FromDate.AddHours(24) :
                    DateTime.Parse(readings.Meter.EndTotal.ReadingDate);
                trackedHeader.ScadaRequestDetails[0].LastDataDate = lastDate;
                if (!await _repo.SaveTrackedItems())
                {
                    throw new ApplicationException("Could not save tracked items form service");
                }

                _logger.LogInformation("Successfully processed readings for meter {meter}", readings.Meter.SerialNumber);
                ret.Success = true;
                return ret;

            }
            catch (Exception ex)
            {
                _logger.LogError("Error while retrieving scada data for {key1}: {msg}", job.Key1, ex.Message);
                trackedHeader.ScadaRequestDetails[0].Status = 1;
                await _repo.SaveTrackedItems();
                throw;
            }
        }

        public async Task<AmrJob> ProcessProfileJob(AmrJobToRun job)
        {
            _logger.LogInformation("Retrieving Data from Scada for: {key1}", job.Key1);
            //get tracked item for updates
            ScadaRequestHeader trackedHeader = await _repo.GetTrackedScadaHeader(job.HeaderId, job.DetailId);
            try
            {
                DateTime runStart = DateTime.UtcNow;
                AmrJob ret = new() { CommsIs = job.CommsId, Key1 = job.Key1, RunDate = runStart, Success = false };

                //update the current run date and status (2: running) for header and detail
                trackedHeader.ScadaRequestDetails[0].CurrentRunDTM = runStart;
                trackedHeader.ScadaRequestDetails[0].Status = 3;

                if (!await _repo.SaveTrackedItems())
                {
                    throw new ApplicationException("Could not save tracked items form service");
                }

                //get the scada profile data from scada server
                ScadaMeterProfile profile = await _scadaCalls.GetAmrProfileFromScada(job);
                if (profile == null || profile.Result != "SUCCESS")
                {
                    throw new ApplicationException($"Scada call returned failure: {profile.Result ?? "Empty Object"}");
                }

                trackedHeader.ScadaRequestDetails[0].Status = 4;

                if (!await _repo.SaveTrackedItems())
                {
                    throw new ApplicationException("Could not save tracked items form service");
                }

                //insert the data into the database
                if (!await _repo.InsertScadaProfileData(profile))
                {
                    throw new ApplicationException($"Failed to insert profile data");
                }

                trackedHeader.ScadaRequestDetails[0].Status = 5;
                if (!await _repo.SaveTrackedItems())
                {
                    throw new ApplicationException("Could not save tracked items form service");
                }

                //update the header and detail LastRunDTM and status (0: rest to not busy)

                //update the detail 
                trackedHeader.LastRunDTM = runStart;
                trackedHeader.ScadaRequestDetails[0].Status = 1;
                trackedHeader.ScadaRequestDetails[0].LastRunDTM = runStart;
                if (profile.Meter.ProfileSamples.Length > 0)
                    trackedHeader.ScadaRequestDetails[0].LastDataDate = DateTime.Parse(profile.Meter.ProfileSamples[profile.Meter.ProfileSamples.Length - 1].Date);
                if (!await _repo.SaveTrackedItems())
                {
                    throw new ApplicationException("Could not save tracked items form service");
                }

                _logger.LogInformation("Successfully processed {records} for meter {meter}", profile.Meter.ProfileSamples.Length, profile.Meter.SerialNumber);
                ret.Success = true;
                return ret;

            }
            catch (Exception ex)
            {
                _logger.LogError("Error while retrieving scada data for {key1}: {msg}", job.Key1, ex.Message);
                trackedHeader.ScadaRequestDetails[0].Status = 1;
                await _repo.SaveTrackedItems();
                throw;
            }
        }

        public async Task<List<AmrJobToRun>> GetAmrJobsAsync(int profileDays)
        {
            _logger.LogInformation("Getting the AMR Jobs to process...");
            try
            {
                List<AmrJobToRun> jobs = new();

                var headers = await _repo.GetJobsToRunAsync();

                var headers2Proccess = new List<ScadaRequestHeader>();
                int detailCnt = 0;
                foreach(var header in headers)
                {
                    detailCnt = header.ScadaRequestDetails.Count;
                    headers2Proccess.Add(header);
                    if (detailCnt >= 100) break;
                }

                if (headers2Proccess != null && headers2Proccess.Count > 0)
                {
                    bool statusChanged = await _repo.UpdateAmrJobStatus(headers2Proccess, 2); //update status to running = 2
                    if (statusChanged)
                    {
                        foreach (var header in headers2Proccess)
                        {
                            if (header.JobType == 1) //Profile Job
                            {
                                foreach (var detail in header.ScadaRequestDetails)
                                {
                                    DateTime dtLastRun = (detail.LastRunDTM == null || detail.LastRunDTM == DateTime.MinValue) ? DateTime.MinValue : DateTime.Parse(detail.LastRunDTM.ToString());
                                    DateTime dtLastData = (detail.LastDataDate == null || detail.LastDataDate == DateTime.MinValue) ? header.StartRunDTM : DateTime.Parse(detail.LastDataDate.ToString());
                                    if (dtLastData < DateTime.Parse(DateTime.UtcNow.ToString("yyyy-MM-dd 00:00:00")).AddMinutes(-detail.UpdateFrequency)
                                        || (dtLastRun == DateTime.MinValue || dtLastRun.AddMinutes(detail.UpdateFrequency) <= DateTime.UtcNow))
                                    {
                                        DateTime fromDate = dtLastData;
                                        DateTime toDate = fromDate.AddDays((profileDays < 1)? 1 : profileDays);
                                        if (toDate > DateTime.Parse(DateTime.UtcNow.ToString("yyyy-MM-dd 00:00:00"))) toDate = DateTime.Parse(DateTime.UtcNow.ToString("yyyy-MM-dd 00:00:00"));
                                        if (fromDate <= DateTime.Parse(DateTime.UtcNow.ToString("yyyy-MM-dd 00:00:00")))
                                        {
                                            AmrJobToRun job = new()
                                            {
                                                HeaderId = header.Id,
                                                DetailId = detail.Id,
                                                CommsId = detail.AmrMeter.CommsId,
                                                Key1 = detail.AmrMeter.MeterSerial,
                                                SqdUrl = detail.AmrScadaUser.SgdUrl,
                                                ProfileName = detail.AmrScadaUser.ProfileName,
                                                ScadaUserName = detail.AmrScadaUser.ScadaUserName,
                                                ScadaPassword = detail.AmrScadaUser.ScadaPassword,
                                                JobType = header.JobType,
                                                FromDate = fromDate,
                                                ToDate = toDate
                                            };

                                            jobs.Add(job);
                                        }
                                    }
                                }
                            }
                            else if (header.JobType == 2) //Readings
                            {
                                foreach (var detail in header.ScadaRequestDetails)
                                {
                                    DateTime dtLastRun = (detail.LastRunDTM == null || detail.LastRunDTM == DateTime.MinValue) ? DateTime.MinValue : DateTime.Parse(detail.LastRunDTM.ToString());
                                    DateTime dtLastData = (detail.LastDataDate == null || detail.LastDataDate == DateTime.MinValue) ? new DateTime(2021, 1, 1, 0, 0, 0) : DateTime.Parse(detail.LastDataDate.ToString());
                                    if (dtLastData < DateTime.Parse(DateTime.UtcNow.ToString("yyyy-MM-dd 00:00:00")).AddDays(-1)
                                        || (dtLastRun == DateTime.MinValue || dtLastRun.AddMinutes(detail.UpdateFrequency) <= DateTime.UtcNow))
                                    {
                                        DateTime fromDate = dtLastData;
                                        DateTime toDate = fromDate.AddDays(1);
                                        if (toDate > DateTime.Parse(DateTime.UtcNow.ToString("yyyy-MM-dd 00:00:00"))) toDate = DateTime.Parse(DateTime.UtcNow.ToString("yyyy-MM-dd 00:00:00"));
                                        if (fromDate <= DateTime.Parse(DateTime.UtcNow.ToString("yyyy-MM-dd 00:00:00")))
                                        {
                                            AmrJobToRun job = new()
                                            {
                                                HeaderId = header.Id,
                                                DetailId = detail.Id,
                                                CommsId = detail.AmrMeter.CommsId,
                                                Key1 = detail.AmrMeter.MeterSerial,
                                                SqdUrl = detail.AmrScadaUser.SgdUrl,
                                                ProfileName = detail.AmrScadaUser.ProfileName,
                                                ScadaUserName = detail.AmrScadaUser.ScadaUserName,
                                                ScadaPassword = detail.AmrScadaUser.ScadaPassword,
                                                JobType = header.JobType,
                                                FromDate = fromDate,
                                                ToDate = toDate
                                            };

                                            jobs.Add(job);
                                        }
                                    }
                                }
                            }
                        }
                        await _repo.UpdateAmrJobStatus(headers2Proccess, 1);
                    }
                }

                return jobs;
            }
            catch (Exception ex)
            {
                _logger.LogError("Error getting AMR Jobs: {Message}", ex.Message);
                throw new ApplicationException($"Error getting AMR Jobs: {ex.Message}");
            }
        }

        public async Task<AMRWaterProfileResponse> GetWaterProfile(AMRWaterProfileRequest request)
        {
            _logger.LogInformation("Attempting to retrieve water profile data for meter {meterid}", request.MeterId);
            AMRWaterProfileResponse result = new();
            try
            {
                var res = await _repo.GetWaterProfile(request.MeterId, request.StartDate, request.EndDate, request.NightFlowStart, request.NightFlowEnd, request.ApplyNightFlow);
                result.Header = _mapper.Map<AMRWaterProfileResponseHeader>(res);
                result.Detail = _mapper.Map<List<WaterProfileResponseDetail>>(res.Profile);
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError("Error retrieving water profile data for meter {meterId}: {Message}", request.MeterId, ex.Message);
                result.Status = "Error";
                result.ErrorMessage = $"Error retrieving water profile data for meter {request.MeterId}: {ex.Message}";
                return result;
            }
        }

        public async Task<DemandProfileResponse> GetDemandProfile(AMRDemandProfileRequest request)
        {
            _logger.LogInformation("Attempting to retrieve demand profile data for meter {meterid}", request.MeterId);
            DemandProfileResponse result = new();
            try
            {
                var res = await _repo.GetDemandProfile(request.MeterId, request.StartDate, request.EndDate, request.TOUHeaderId);
                result.Header = _mapper.Map<DemandProfileResponseHeader>(res);
                result.Detail = _mapper.Map<List<DemandProfileResponseDetail>>(res.Profile);
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError("Error retrieving demand profile data for meter {meterId}: {Message}", request.MeterId, ex.Message);
                result.Status = "Error";
                result.ErrorMessage = $"Error retrieving demand profile data for meter {request.MeterId}: {ex.Message}";
                return result;
            }
        }

        public async Task<AMRGraphProfileResponse> GetGraphProfile(AMRGraphProfileRequest request)
        {
            _logger.LogInformation($"Attempting to retrieve graph profile data for meter {request.MeterId}");
            AMRGraphProfileResponse result = new();
            try
            {
                var res = await _repo.GetGraphProfile(request.MeterId, request.StartDate, request.EndDate, request.NightFlowStart, request.NightFlowEnd, request.ApplyNightFlow);
                result.Header = _mapper.Map<AMRGraphProfileResponseHeader>(res);
                result.Detail = _mapper.Map<List<GraphProfileResponseDetail>>(res.Profile);
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError("Error retrieving graph profile data for meter {meterId}: {Message}", request.MeterId, ex.Message);
                result.Status = "Error";
                result.ErrorMessage = $"Error retrieving graph profile data for meter {request.MeterId}: {ex.Message}";
                return result;
            }
        }

        public async Task<List<AMRTOUHeaderResponse>> GetTouHeaders()
        {
            try
            {
                _logger.LogInformation("Attempting to retrieve tou headers...");
                var res = await _repo.GetTOUHeaders();
                var ret = _mapper.Map<List<AMRTOUHeaderResponse>>(res);
                return ret;
            }
            catch (Exception ex)
            {
                _logger.LogError("Error retrieving TOU Headers: {Message}", ex.Message);
                throw new ApplicationException($"Error retrieving TOU Headers: {ex.Message}");
            }
        }
    }
}
