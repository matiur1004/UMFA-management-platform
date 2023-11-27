using ClientPortal.Controllers.Authorization;
using ClientPortal.Data;
using ClientPortal.Models.ResponseModels;
using ClientPortal.Services;

namespace ClientPortal.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class AlarmsPerBuildingController : ControllerBase
    {
        private readonly ILogger<AlarmsPerBuildingController> _logger;
        private readonly PortalDBContext _context;
        private readonly IAMRMeterTriggeredAlarmService _alarmService;


        public AlarmsPerBuildingController(ILogger<AlarmsPerBuildingController> logger, PortalDBContext portalDBContext, IAMRMeterTriggeredAlarmService aMRMeterTriggeredAlarmService)
        {
            _logger = logger;
            _context = portalDBContext;
            _alarmService = aMRMeterTriggeredAlarmService;
        }

        [HttpGet("getAlarmsByBuilding/{buildingId}")]
        public ActionResult<IEnumerable<AlarmsPerBuildingResult>> GetAlarmsByBuilding(int buildingId)
        {
            List<AlarmsPerBuildingResult> resultList = new List<AlarmsPerBuildingResult>();
            _logger.LogInformation(1, $"Get meter alarms for building id: {buildingId} from database");
            try
            {
                using (var command = _context.Database.GetDbConnection().CreateCommand())
                {
                    command.CommandText = "spGetAlarmsByBuilding";
                    command.CommandType = System.Data.CommandType.StoredProcedure;

                    var parameter = command.CreateParameter();
                    parameter.ParameterName = "@BuildingId";
                    parameter.Value = buildingId;
                    command.Parameters.Add(parameter);

                    _context.Database.OpenConnection();

                    using (var reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            AlarmsPerBuildingResult result = new AlarmsPerBuildingResult
                            {
                                BuildingId = reader.IsDBNull(reader.GetOrdinal("BuildingId")) ? 0 : reader.GetInt32(reader.GetOrdinal("BuildingId")),
                                UmfaBuildingId = reader.IsDBNull(reader.GetOrdinal("UmfaBuildingId")) ? 0 : reader.GetInt32(reader.GetOrdinal("UmfaBuildingId")),
                                Building = reader.IsDBNull(reader.GetOrdinal("Building")) ? string.Empty : reader.GetString(reader.GetOrdinal("Building")),
                                AMRMeterId = reader.IsDBNull(reader.GetOrdinal("AMRMeterId")) ? 0 : reader.GetInt32(reader.GetOrdinal("AMRMeterId")),
                                MeterNo = reader.IsDBNull(reader.GetOrdinal("MeterNo")) ? string.Empty : reader.GetString(reader.GetOrdinal("MeterNo")),
                                Description = reader.IsDBNull(reader.GetOrdinal("Description")) ? string.Empty : reader.GetString(reader.GetOrdinal("Description")),
                                Make = reader.IsDBNull(reader.GetOrdinal("Make")) ? string.Empty : reader.GetString(reader.GetOrdinal("Make")),
                                Model = reader.IsDBNull(reader.GetOrdinal("Model")) ? string.Empty : reader.GetString(reader.GetOrdinal("Model")),
                                ScadaMeterNo = reader.IsDBNull(reader.GetOrdinal("ScadaMeterNo")) ? string.Empty : reader.GetString(reader.GetOrdinal("ScadaMeterNo")),
                                Configured = reader.IsDBNull(reader.GetOrdinal("Configured")) ? string.Empty : reader.GetString(reader.GetOrdinal("Configured")),
                                Triggered = reader.IsDBNull(reader.GetOrdinal("Triggered")) ? string.Empty : reader.GetString(reader.GetOrdinal("Triggered")),
                                SupplyType = reader.IsDBNull(reader.GetOrdinal("SupplyType")) ? string.Empty : reader.GetString(reader.GetOrdinal("SupplyType"))
                            };
                            resultList.Add(result);
                        }
                    }
                }
            }
            catch (Exception)
            {
                _logger?.LogError($"Failed to get meters for BuildingId {buildingId}");
                return Problem($"Failed to get meters with alarms for BuildingId {buildingId}");
            }
            if (resultList.Count > 0)
            {
                _logger.LogInformation(1, $"Returning meters with alarms for building: {buildingId}");
            }
            else
            {
                _logger.LogError(1, $"No Results Found For Meters with alarms for building: {buildingId}");
            }

            return resultList.DistinctBy(rl => rl.ScadaMeterNo).ToList();
        }

        [HttpGet("")]
        public async Task<ActionResult<IEnumerable<AlarmsPerBuildingEntry>>> GetAlarmsPerBuilding()
        {
            try
            {
                return await _alarmService.GetAlarmsPerBuildingAsync();
            }
            catch (Exception e)
            {
                _logger.LogError(e, "Could not get alarms per building");
                return Problem(e.Message);
            }
        }
    }

    public class AlarmsPerBuildingResult
    {
        public int BuildingId { get; set; }
        public int UmfaBuildingId { get; set; }
        public string Building { get; set; }
        public int AMRMeterId { get; set; }
        public string MeterNo { get; set; }
        public string Description { get; set; }
        public string Make { get; set; }
        public string Model { get; set; }
        public string ScadaMeterNo { get; set; }
        public string Configured { get; set; }
        public string Triggered { get; set; }
        public string SupplyType { get; set; }
    }
}
