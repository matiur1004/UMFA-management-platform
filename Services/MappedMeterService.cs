using ClientPortal.Data;
using ClientPortal.Data.Entities.PortalEntities;
using ClientPortal.Data.Repositories;
using ClientPortal.Models.ResponseModels;
using Microsoft.EntityFrameworkCore;

namespace ClientPortal.Services
{
    public class MappedMetersService
    {
        private readonly ILogger<MappedMetersService> _logger;
        private readonly PortalDBContext _context;

        public MappedMetersService(PortalDBContext context, ILogger<MappedMetersService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<List<MappedMeter>> GetAllMappedMetersForBuilding(int buildingId)
        {
            _logger.LogInformation($"Getting meters for Building: {buildingId}", buildingId);
            var selectedMeters = new List<MappedMeter>();
            try
            {
                var meters = await _context.MappedMeters.ToListAsync();
                foreach (var meter in meters)
                {
                    if (meter.BuildingId == buildingId)
                    {
                        selectedMeters.Add(meter);
                    }
                }
                return selectedMeters;
            }
            catch (Exception ex)
            {
                _logger.LogError("Error while getting meters for Building: {buildingId}: {Message}", buildingId, ex.Message);
                throw new ApplicationException($"Error while getting meters for Building: {buildingId}: {ex.Message}");
            }
        }


        public bool RemoveMappedMeterAsync(int meterId)
        {
            throw new NotImplementedException();
        }


        public async Task<bool> SaveChangesAsync()
        {
            try
            {
                var ret = await _context.SaveChangesAsync();
                return ret > 0;
            }
            catch (Exception ex)
            {
                _logger.LogError("Error while saving meter: {Message}", ex.Message);
                throw new ApplicationException($"Error while saving meter: {ex.Message}");
            }
        }
    }
}
