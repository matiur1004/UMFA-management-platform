using Dapper;
using ClientPortal.Data.Entities.PortalEntities;
using ClientPortal.DtOs;
using System.Globalization;
using ServiceStack;

namespace ClientPortal.Data.Repositories
{
    public interface IAMRDataRepository
    {
        Task<List<TOUHeader>> GetTOUHeaders();
        Task<DemandProfileHeader> GetDemandProfile(int meterId, DateTime startDate, DateTime endDate, int touHeaderId);
        Task<AMRWaterProfileHeader> GetWaterProfile(int meterId, DateTime startDate, DateTime endDate, TimeOnly nightFlowStart, TimeOnly nightFlowEnd, bool ApplyNightFlow);
        Task<List<ScadaRequestHeader>> GetJobsToRunAsync();
        Task<bool> UpdateAmrJobStatus(List<ScadaRequestHeader> headers, int status);
        Task<ScadaRequestHeader> GetTrackedScadaHeader(int headerId, int detailId);
        Task<bool> SaveTrackedItems();
        Task<bool> InsertScadaProfileData(ScadaMeterProfile profile);
        Task<bool> InsertScadaReadingData(ScadaMeterReading readings);
        Task<bool> UpdateDetailStatus(int detailId, int status);
        Task<AMRGraphProfileHeader> GetGraphProfile(int meterId, DateTime startDate, DateTime endDate, TimeOnly nightFlowStart, TimeOnly nightFlowEnd, bool ApplyNightFlow);
    }

    public class AMRDataRepository : IAMRDataRepository
    {
        private readonly ILogger<AMRDataRepository> _logger;
        private readonly PortalDBContext _context;

        public AMRDataRepository(ILogger<AMRDataRepository> logger, PortalDBContext context)
        {
            _logger = logger;
            _context = context;
        }

        public async Task<bool> UpdateDetailStatus(int detailId, int status)
        {
            try
            {
                var detRecord = await _context.ScadaRequestDetails.FirstOrDefaultAsync(d => d.Id == detailId);
                if (detRecord != null) detRecord.Status = status;
                int changes = await _context.SaveChangesAsync();
                return changes == 1;
            }
            catch (Exception ex)
            {
                _logger.LogError("Error while updating status for detail {id}: {msg}", detailId, ex.Message);
                return false;
            }
        }

        public async Task<bool> InsertScadaReadingData(ScadaMeterReading readings)
        {
            try
            {
                List<ScadaReadingData> existing = new();

                int cntRetry = 0;
                while (cntRetry < 3)
                {
                    try
                    {
                        existing = await _context.scadaReadingData
                            .Where(r => r.SerialNumber == readings.Meter.SerialNumber && r.ReadingDate.ToString().Substring(0, 16) ==
                                readings.Meter.EndTotal.ReadingDate.ToString().Substring(0, 16))
                            .ToListAsync();
                        break;
                    }
                    catch
                    {
                        cntRetry++;
                        if (cntRetry == 3)
                            throw new Exception($"Cant connect to db to get existing readings for 3 retries");
                        else
                        {
                            Thread.Sleep(1000);
                            continue;
                        }
                    }
                }

                if (existing != null && existing.Count > 0) //first disable existing records
                {
                    foreach (ScadaReadingData p in existing) p.IsActive = false;
                    cntRetry = 0;
                    while (cntRetry < 3)
                    {
                        try
                        {
                            await _context.SaveChangesAsync();
                            break;
                        }
                        catch
                        {
                            cntRetry++;
                            if (cntRetry == 3)
                                throw new Exception($"Cant connect to db to update existing profiles for 3 retries");
                            else
                            {
                                Thread.Sleep(1000);
                                continue;
                            }
                        }
                    }
                }

                ScadaReadingData newItem = new()
                {
                    ProcessedStatus = 0,
                    SerialNumber = readings.Meter.SerialNumber,
                    Description = readings.Meter.Description,
                    ReadingResult = readings.Meter.EndTotal.Result,
                    ReadingDate = DateTime.Parse(readings.Meter.EndTotal.ReadingDate),
                    P1 = float.Parse(readings.Meter.EndTotal.P1, CultureInfo.InvariantCulture.NumberFormat),
                    P2 = float.Parse(readings.Meter.EndTotal.P2, CultureInfo.InvariantCulture.NumberFormat),
                    Q1 = float.Parse(readings.Meter.EndTotal.Q1, CultureInfo.InvariantCulture.NumberFormat),
                    Q2 = float.Parse(readings.Meter.EndTotal.Q2, CultureInfo.InvariantCulture.NumberFormat),
                    Q3 = float.Parse(readings.Meter.EndTotal.Q3, CultureInfo.InvariantCulture.NumberFormat),
                    Q4 = float.Parse(readings.Meter.EndTotal.Q4, CultureInfo.InvariantCulture.NumberFormat),
                    ReadingStatus = int.Parse(readings.Meter.EndTotal.Status),
                    KvaResult = readings.Meter.MaxDemand.Result,
                    kvaDate = DateTime.Parse(readings.Meter.MaxDemand.MaxDemandDate),
                    kVA = float.Parse(readings.Meter.MaxDemand.kVA, CultureInfo.InvariantCulture.NumberFormat),
                    IsActive = true
                };

                await _context.scadaReadingData.AddAsync(newItem);

                _context.Database.SetCommandTimeout(120);
                cntRetry = 0;
                while (cntRetry < 3)
                {
                    try
                    {
                        await _context.SaveChangesAsync();
                        break;
                    }
                    catch
                    {
                        cntRetry++;
                        if (cntRetry == 3)
                            throw new Exception($"Cant connect to db to update existing profiles for 3 retries");
                        else
                        {
                            Thread.Sleep(1000);
                            continue;
                        }
                    }
                }

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError("Error while inserting Scada Reading Data: {msg}", ex.Message);
                return false;
            }
        }

        public async Task<bool> InsertScadaProfileData(ScadaMeterProfile profile)
        {
            try
            {
                _context.Database.SetCommandTimeout(120);

                List<string> readingDates = profile.Meter.ProfileSamples.Select(p => p.Date.Substring(0, 19)).ToList();
                List<ScadaProfileData> existing = new();
                int cntRetry = 0;
                while (cntRetry < 3)
                {
                    try
                    {
                        existing = await _context.ScadaProfileData
                            .Where(p => p.SerialNumber == profile.Meter.SerialNumber && readingDates.Contains(p.ReadingDate.ToString().Substring(0, 19))).ToListAsync();
                        break;
                    }
                    catch
                    {
                        cntRetry++;
                        if (cntRetry == 3)
                            throw new Exception($"Cant connect to db to get existing profiles for 3 retries");
                        else
                        {
                            Thread.Sleep(1000);
                            continue;
                        }
                    }
                }

                if (existing != null && existing.Count > 0) //first disable existing records
                {
                    foreach (ScadaProfileData p in existing) p.IsActive = false;
                    cntRetry = 0;
                    while (cntRetry < 3)
                    {
                        try
                        {
                            await _context.SaveChangesAsync();
                            break;
                        }
                        catch
                        {
                            cntRetry++;
                            if (cntRetry == 3)
                                throw new Exception($"Cant connect to db to update existing profiles for 3 retries");
                            else
                            {
                                Thread.Sleep(1000);
                                continue;
                            }
                        }
                    }
                }

                List<ScadaProfileData> newItems = new();

                foreach (Sample s in profile.Meter.ProfileSamples)
                {
                    newItems.Add(new ScadaProfileData()
                    {
                        ProcessedStatus = 0, //not processed yet
                        SerialNumber = profile.Meter.SerialNumber,
                        Description = profile.Meter.Description,
                        Result = s.Result,
                        Status = int.Parse(s.Status),
                        ReadingDate = DateTime.Parse(s.Date),
                        kVA = float.Parse(s.KVA, CultureInfo.InvariantCulture.NumberFormat),
                        P1 = float.Parse(s.P1, CultureInfo.InvariantCulture.NumberFormat),
                        P2 = float.Parse(s.P2, CultureInfo.InvariantCulture.NumberFormat),
                        Q1 = float.Parse(s.Q1, CultureInfo.InvariantCulture.NumberFormat),
                        Q2 = float.Parse(s.Q2, CultureInfo.InvariantCulture.NumberFormat),
                        Q3 = float.Parse(s.Q3, CultureInfo.InvariantCulture.NumberFormat),
                        Q4 = float.Parse(s.Q4, CultureInfo.InvariantCulture.NumberFormat),
                        IsActive = true
                    });
                }

                await _context.ScadaProfileData.AddRangeAsync(newItems);

                cntRetry = 0;
                while (cntRetry < 3)
                {
                    try
                    {
                        await _context.SaveChangesAsync();
                        break;
                    }
                    catch
                    {
                        cntRetry++;
                        if (cntRetry == 3)
                            throw new Exception($"Cant connect to db to update existing profiles for 3 retries");
                        else
                        {
                            Thread.Sleep(1000);
                            continue;
                        }
                    }
                }

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError("Error while inserting Scada Profile Data: {msg}", ex.Message);
                return false;
            }
        }
        public async Task<bool> SaveTrackedItems()
        {
            try
            {
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError("Error while saving tracked items: {msg}", ex.Message);
                return false;
            }
        }

        public async Task<ScadaRequestHeader> GetTrackedScadaHeader(int headerId, int detailId)
        {
            var ret = await _context.ScadaRequestHeaders
                .Include(h => h.ScadaRequestDetails.Where(d => d.Id == detailId))
                .FirstOrDefaultAsync(h => h.Id == headerId);

            return ret;
        }

        public async Task<bool> UpdateAmrJobStatus(List<ScadaRequestHeader> headers, int status)
        {
            try
            {
                foreach (var header in headers)
                {
                    var updHeader = await _context.ScadaRequestHeaders
                        //.Include(h => h.ScadaRequestDetails)
                        .FirstOrDefaultAsync(h => h.Id == header.Id);

                    if (updHeader != null)
                    {
                        updHeader.Status = status;
                        foreach (var detail in header.ScadaRequestDetails)
                        {
                            var updDetail = await _context.ScadaRequestDetails.FirstOrDefaultAsync(d => d.Id == detail.Id);
                            updDetail.Status = status;
                        }
                    }
                }

                await _context.SaveChangesAsync();

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError("Error while updating job status: {Message}", ex.Message);
                throw;
            }
        }

        public async Task<List<ScadaRequestHeader>> GetJobsToRunAsync()
        {
            try
            {
                var header = await _context.ScadaRequestHeaders.AsNoTracking()
                    .Where(h => h.Active == true && h.Status == 1 && h.StartRunDTM <= DateTime.UtcNow &&
                        (h.LastRunDTM == null || h.LastRunDTM < DateTime.UtcNow.AddMinutes(-h.Interval)))
                    .Include(h => h.ScadaRequestDetails.Where(d => d.Active && d.Status == 1))
                        .ThenInclude(d => d.AmrScadaUser)
                    .Include(h => h.ScadaRequestDetails)
                        .ThenInclude(d => d.AmrMeter)
                    .OrderBy(h => h.LastRunDTM)
                    .ToListAsync();

                return header;
            }
            catch (Exception ex)
            {
                _logger.LogError("Error while retrieving AMR Jobs: {Message}", ex.Message);
                throw new ApplicationException($"Error while retrieving AMR Jobs: {ex.Message}");
            }
        }

        public async Task<AMRWaterProfileHeader> GetWaterProfile(int meterId, DateTime startDate, DateTime endDate, TimeOnly nightFlowStart, TimeOnly nightFlowEnd, bool applyNightFlow)
        {
            try
            {
                string sDate = startDate.ToString("yyyy/MM/dd HH:mm");
                string eDate = endDate.ToString("yyyy/MM/dd HH:mm");
                string nfsTime = nightFlowStart.ToString("HH:mm");
                string nfeTime = nightFlowEnd.ToString("HH:mm");
                bool applyNF = applyNightFlow;
                var CommandText = $"exec spGetWaterProfile {meterId}, '{sDate}', '{eDate}', '{nfsTime}', '{nfeTime}', {applyNF}";
                AMRWaterProfileHeader header = new();
                var connection = _context.Database.GetDbConnection();
                await connection.OpenAsync();
                var results = await connection.QueryMultipleAsync(CommandText);
                header = results.Read<AMRWaterProfileHeader>().ToList()[0];
                header.Profile = results.Read<WaterProfile>().ToList();
                return header;
            }
            catch (Exception ex)
            {
                _logger.LogError("Error while retrieving water profile data for meterId {meterId}: {message}", meterId, ex.Message);
                throw new ApplicationException($"Error while retrieving water profile data for meterId {meterId}: {ex.Message}");
            }
            finally
            {
                await _context.Database.CloseConnectionAsync();
            }
        }

        public async Task<DemandProfileHeader> GetDemandProfile(int meterId, DateTime startDate, DateTime endDate, int touHeaderId)
        {
            try
            {
                string sDate = startDate.ToString("yyyy/MM/dd HH:mm");
                string eDate = endDate.ToString("yyyy/MM/dd HH:mm");
                var CommandText = $"exec spGetDemandProfile {meterId}, '{sDate}', '{eDate}', {touHeaderId}, 0";
                DemandProfileHeader header = new();
                var connection = _context.Database.GetDbConnection();
                await connection.OpenAsync();
                var results = await connection.QueryMultipleAsync(CommandText);
                header = results.Read<DemandProfileHeader>().ToList()[0];
                header.Profile = results.Read<DemandProfile>().ToList();
                return header;
            }
            catch (Exception ex)
            {
                _logger.LogError("Error while retrieving demand profile data for meterId {meterId}: {message}", meterId, ex.Message);
                throw new ApplicationException($"Error while retrieving demand profile data for meterId {meterId}: {ex.Message}");
            }
            finally
            {
                await _context.Database.CloseConnectionAsync();
            }
        }


        public async Task<AMRGraphProfileHeader> GetGraphProfile(int meterId, DateTime startDate, DateTime endDate, TimeOnly nightFlowStart, TimeOnly nightFlowEnd, bool applyNightFlow)
        {
            try
            {
                string sDate = startDate.ToString("yyyy/MM/dd HH:mm");
                string eDate = endDate.ToString("yyyy/MM/dd HH:mm");
                string nfsTime = nightFlowStart.ToString("HH:mm");
                string nfeTime = nightFlowEnd.ToString("HH:mm");
                bool applyNF = applyNightFlow;
                var CommandText = $"exec spGetWaterProfile {meterId}, '{sDate}', '{eDate}', '{nfsTime}', '{nfeTime}', {applyNF}";
                AMRGraphProfileHeader header = new();
                var connection = _context.Database.GetDbConnection();
                await connection.OpenAsync();
                var results = await connection.QueryMultipleAsync(CommandText);
                header = results.Read<AMRGraphProfileHeader>().ToList()[0];
                header.Profile = results.Read<GraphProfile>().ToList();
                return header;
            }
            catch (Exception ex)
            {
                _logger.LogError("Error while retrieving water profile data for meterId {meterId}: {message}", meterId, ex.Message);
                throw new ApplicationException($"Error while retrieving water profile data for meterId {meterId}: {ex.Message}");
            }
            finally
            {
                await _context.Database.CloseConnectionAsync();
            }
        }

        public async Task<List<TOUHeader>> GetTOUHeaders()
        {
            try
            {
                var res = await _context.TOUHeaders.Where(t => t.Active).ToListAsync();
                return res;
            }
            catch (Exception ex)
            {
                _logger.LogError("Error while retrieving TOU Header: {Message}", ex.Message);
                throw new ApplicationException($"Error while retrieving TOU Header: {ex.Message}");
            }
        }
    }
}
