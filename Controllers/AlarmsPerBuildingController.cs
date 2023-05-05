using ClientPortal.Controllers.Authorization;
using ClientPortal.Data;
using Dapper;
using System.Dynamic;

namespace ClientPortal.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class AlarmsPerBuildingController : ControllerBase
    {
        private readonly ILogger<AlarmsPerBuildingController> _logger;
        private readonly PortalDBContext _context;

        public AlarmsPerBuildingController(ILogger<AlarmsPerBuildingController> logger, PortalDBContext portalDBContext)
        {
            _logger = logger;
            _context = portalDBContext;
        }

        [HttpGet("getAlarmsByBuilding/{buildingId}")]
        public ActionResult<IEnumerable<dynamic>> GetAlarmsByBuilding(int buildingId)
        {
            List<dynamic> resultList = new List<dynamic>();
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
                            dynamic result = new ExpandoObject();
                            var dictionary = result as IDictionary<string, object>;

                            for (int i = 0; i < reader.FieldCount; i++)
                            {
                                dictionary.Add(reader.GetName(i), reader.IsDBNull(i) ? null : reader[i]);
                            }
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

            return Ok(resultList);
        }
    }

    public class AlarmsPerBuildingResult
    {
        public int AMRMeterId { get; set; }
        public string MeterNo { get; set; }
        public string Description { get; set; }
        public string Make { get; set; }
        public string Model { get; set; }
        public string ScadaMeterNo { get; set; }
        public string Configured { get; set; }
        public string Triggered { get; set; }
    }
}
