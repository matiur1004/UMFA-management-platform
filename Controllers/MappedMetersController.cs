﻿using ClientPortal.Controllers.Authorization;
using ClientPortal.Data;
using ClientPortal.Data.Entities.DunamisEntities;
using ClientPortal.Data.Entities.PortalEntities;
using ClientPortal.Models.RequestModels;
using ClientPortal.Services;

namespace ClientPortal.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class MappedMetersController : ControllerBase
    {
        private readonly PortalDBContext _context;
        private readonly DunamisDBContext _dbContext;
        private readonly MappedMetersService _mappedMetersService;
        private readonly IAMRMeterService _amRMeterService;
        private readonly ILogger<MappedMetersController> _logger;

        public MappedMetersController(PortalDBContext context, DunamisDBContext dBContext, MappedMetersService mappedMetersService, IAMRMeterService amRMeterService, ILogger<MappedMetersController> logger)
        {
            _context = context;
            _dbContext = dBContext;
            _mappedMetersService = mappedMetersService;
            _amRMeterService = amRMeterService;
            _logger = logger;
        }

        // GET: MappedMeters/GetAll
        [HttpGet("GetAll")]
        public async Task<ActionResult<IEnumerable<MappedMeter>>> GetMappedMeters()
        {
            return await _context.MappedMeters.ToListAsync();
        }

        //GET: MappedMeters/GetAllMappedMetersForBuilding/
        [HttpGet("GetAllMappedMetersForBuilding/{buildingId}")]
        public async Task<ActionResult<IEnumerable<MappedMeter>>> GetAllMappedMetersForBuilding(int buildingId)
        {
            var selectedMeters = await _mappedMetersService.GetAllMappedMetersForBuilding(buildingId);
            return selectedMeters;
        }

        // GET: MappedMeters/GetMappedMeter/5
        [HttpGet("GetMappedMeter/{id}")]
        public async Task<ActionResult<MappedMeter>> GetMappedMeter(int id)
        {
            var mappedMeter = await _context.MappedMeters.FindAsync(id);

            if (mappedMeter == null)
            {
                return NotFound();
            }

            return mappedMeter;
        }

        // PUT: MappedMeters/UpdateMappedMeter/5
        [HttpPut("UpdateMappedMeter/{id}")]
        public async Task<IActionResult> PutMappedMeter(int id, MappedMeter mappedMeter)
        {
            if (id != mappedMeter.MappedMeterId)
            {
                return BadRequest();
            }

            _context.Entry(mappedMeter).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MappedMeterExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: MappedMeters/AddMappedMeter/{MappedMeter}
        [HttpPost("AddMappedMeter")]
        public async Task<ActionResult<MappedMeter>> PostMappedMeter(MappedMeter mappedMeter)
        {
            //add building if not exist
            var bldng = await _context.Buildings.Where(b => b.UmfaId == mappedMeter.BuildingId).FirstOrDefaultAsync();
            if (bldng == null)
            {
                bldng = new() { UmfaId = mappedMeter.BuildingId, Name = mappedMeter.BuildingName, PartnerId = mappedMeter.PartnerId, Partner = mappedMeter.PartnerName };
                _context.Buildings.Add(bldng);
            }
            _context.MappedMeters.Add(mappedMeter);
            await _context.SaveChangesAsync();
            _logger?.LogInformation($"Added MappedMeter {mappedMeter.MappedMeterId}");

            //Add AMRMeter
            var aMrMeterNo = mappedMeter.MeterNo;
            var mter = await _context.AMRMeters.Where(b => b.MeterNo == aMrMeterNo).FirstOrDefaultAsync();
            if (mter == null)
            {
                try
                {
                    var makeModelId = mappedMeter.SupplyType == "Water" ? 6 : 5;

                    var amrMeter = new AMRMeterRequest
                    {
                        BuildingName = mappedMeter.BuildingName,
                        Make = " ",
                        Model = " ",
                        UmfaId = mappedMeter.BuildingId,
                        UtilityId = 0,
                        Utility = " ",
                        Active = true,
                        BuildingId = mappedMeter.BuildingId,
                        CbSize = 60,
                        CommsId = "0",
                        CtSizePrim = 5,
                        CtSizeSec = 5,
                        Description = mappedMeter.Description,
                        Digits = 7,
                        Id = 0,
                        MakeModelId = makeModelId,
                        MeterNo = mappedMeter.MeterNo,
                        MeterSerial = mappedMeter.ScadaSerial,
                        Phase = 3,
                        ProgFact = 1,
                        UserId = mappedMeter.UserId
                    };

                    var meterUpdateRequest = new AMRMeterUpdateRequest { UserId = mappedMeter.UserId, Meter = amrMeter };
                    await _amRMeterService.AddMeterAsync(meterUpdateRequest);
                    _logger?.LogInformation($"Added AMRMeter {amrMeter.Id}");
                }
                catch (Exception ex)
                {
                    _logger?.LogError($"ERROR: Could not add AMRMeter {ex.Message}");
                }
            }
            else
            {
                _logger?.LogError($"ERROR: Could not add AMRMeter {aMrMeterNo} as it already exists!");
            }
            // End Add AMRMeter

            return CreatedAtAction("PostMappedMeter", new { id = mappedMeter.MappedMeterId }, mappedMeter);
        }

        // DELETE: MappedMeters/RemoveMappedMeter/5
        [HttpDelete("RemoveMappedMeter/{id}")]
        public async Task<IActionResult> DeleteMappedMeter(int id)
        {
            var mappedMeter = await _context.MappedMeters.FindAsync(id);
            if (mappedMeter == null)
            {
                return NotFound();
            }

            _context.MappedMeters.Remove(mappedMeter);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool MappedMeterExists(int id)
        {
            return _context.MappedMeters.Any(e => e.MappedMeterId == id);
        }

        // MappedMeters Dropdowns

        //RegisterTypes
        // GET: MappedMeters/getAllRegisterTypes
        [HttpGet("getAllRegisterTypes")]
        public async Task<ActionResult<IEnumerable<RegisterType>>> GetAllRegisterTypes()
        {
            return await _context.RegisterTypes.ToListAsync();
        }

        //TimeOfUse
        //GET: MappedMeters/getAllTimeOfUse
        [HttpGet("getAllTimeOfUse")]
        public async Task<ActionResult<IEnumerable<TOUHeader>>> GetAllTouHeaders()
        {
            return await _context.TOUHeaders.ToListAsync();
        }

        //SupplyTypes
        //GET: MappedMeters/getAllSupplyTypes
        [HttpGet("getAllSupplyTypes")]
        public async Task<ActionResult<IEnumerable<SupplyType>>> GetAllSupplyTypes()
        {
            return await _context.SupplyTypes.ToListAsync();
        }

        //SupplyTo
        //GET: MappedMeters/getAllSuppliesTo
        [HttpGet("getAllSuppliesTo")]
        public async Task<ActionResult<IEnumerable<SuppliesTo>>> GetAllSuppliesTo()
        {
            return await _dbContext.SuppliesTo.ToListAsync();
        }

        //LocationType
        //GET: MappedMeters/getAllLocationTypes
        [HttpGet("getAllLocationTypes")]
        public async Task<List<LocationType>> GetAllLocationTypes()
        {
            var locationTypes = await  _dbContext.LocationTypes.FromSqlRaw("SELECT t.name AS SuppliesTo, " +
                "CASE typ.SupplyType WHEN 0 THEN 'Electricity' WHEN 1 THEN 'Water' WHEN 2 THEN 'Gas' WHEN 3 THEN 'Sewerage' " +
                "WHEN 4 THEN 'Solar' ELSE 'AdHoc' END AS SupplyType, loc.Name AS LocationName FROM SuppliesTo t " +
                "JOIN SuppliesToSupplyTypes typ ON (t.Id = typ.SuppliesToId)" +
                "JOIN SuppliesToSupplyTypesLocations l ON (typ.Id = l.SuppliesToSupplyTypeId)" +
                "JOIN SupplyToLocations loc ON (l.SupplyToLocationId = loc.Id) ORDER BY 1, 2, 3").ToListAsync();
            return locationTypes.ToList();
        }
    }
}
