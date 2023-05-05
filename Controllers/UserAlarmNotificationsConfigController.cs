using ClientPortal.Controllers.Authorization;
using ClientPortal.Data;
using System.Dynamic;

namespace ClientPortal.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class UserAlarmNotificationsConfigController : ControllerBase
    {
        private readonly ILogger<UserAlarmNotificationsConfigController> _logger;
        private readonly PortalDBContext _context;

        public UserAlarmNotificationsConfigController(ILogger<UserAlarmNotificationsConfigController> logger, PortalDBContext portalDBContext)
        {
            _logger = logger;
            _context = portalDBContext;
        }

        [HttpPost("getUserAlarmNotificationConfig")]
        public async Task<ActionResult<IEnumerable<dynamic>>> GetUserAlarmNotificationConfig([FromBody] UserAlarmNotificationConfigModel model)
        {
            if (!int.TryParse(model.UserId.ToString(), out int userId)) return BadRequest(new ApplicationException($"Invalid UserId: '{model.UserId}'"));
            if (!int.TryParse(model.BuildingId.ToString(), out int buildingId)) return BadRequest(new ApplicationException($"Invalid BuildingId: '{model.BuildingId}'"));

            List<dynamic> resultList = new List<dynamic>();
            _logger.LogInformation(1, "Get UserAlarmNotificationConfig Details for User: {0} and Building: {1}", model.UserId, model.BuildingId);
            try
            {
                await using (var command = _context.Database.GetDbConnection().CreateCommand())
                {
                    command.CommandText = "spGetUserAlarmNotificationConfig";
                    command.CommandType = System.Data.CommandType.StoredProcedure;

                    var parameter = command.CreateParameter();
                    parameter.ParameterName = "@UserId";
                    parameter.Value = userId;
                    command.Parameters.Add(parameter);

                    var parameter2 = command.CreateParameter();
                    parameter2.ParameterName = "@BuildingId";
                    parameter2.Value = buildingId;
                    command.Parameters.Add(parameter2);

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
                string message = $"Failed to get UserAlarmNotificationConfig for User: {model.UserId} and Building: {model.BuildingId}";
                _logger?.LogError(1, message);
                return Problem($"Failed to get UserAlarmNotificationConfig for User: {model.UserId} and Building: {model.BuildingId}");
            }
            if (resultList.Count > 0)
            {
                _logger.LogInformation(1, $"Returning UserAlarmNotificationConfig for User: {model.UserId} and Building: {model.BuildingId}");
            }
            else
            {
                _logger.LogError(1, $"No UserAlarmNotificationConfig for User: {model.UserId} and Building: {model.BuildingId}");
            }

            return Ok(resultList);
        }

        [HttpPost("setUserAlarmNotification")]
        public IActionResult MaintainUserAlarmNotification([FromBody] UserAlarmNotificationMaintainModel model)
        {
            if (!int.TryParse(model.UserId.ToString(), out int userId)) return BadRequest(new ApplicationException($"Invalid UserId: '{model.UserId}'"));
            if (!int.TryParse(model.AMRMeterId.ToString(), out int amrMeterId)) return BadRequest(new ApplicationException($"Invalid BuildingId: '{model.AMRMeterId}'"));
            if (!int.TryParse(model.AlarmTypeId.ToString(), out int alarmTypeId)) return BadRequest(new ApplicationException($"Invalid BuildingId: '{model.AlarmTypeId}'"));
            if (!bool.TryParse(model.Enabled.ToString(), out bool enabled)) return BadRequest(new ApplicationException($"Invalid BuildingId: '{model.Enabled}'"));

            _logger.LogInformation(1, "Maintain UserAlarmNotification Details for User: {0}", model.UserId);
            try
            {
                using (var command = _context.Database.GetDbConnection().CreateCommand())
                {
                    command.CommandText = "spMaintainUserAlarmNotification";
                    command.CommandType = System.Data.CommandType.StoredProcedure;

                    var parameter = command.CreateParameter();
                    parameter.ParameterName = "@UserId";
                    parameter.Value = userId;
                    command.Parameters.Add(parameter);

                    var parameter2 = command.CreateParameter();
                    parameter2.ParameterName = "@AMRMeterId";
                    parameter2.Value = amrMeterId;
                    command.Parameters.Add(parameter2);

                    var parameter3 = command.CreateParameter();
                    parameter3.ParameterName = "@AlarmTypeId";
                    parameter3.Value = alarmTypeId;
                    command.Parameters.Add(parameter3);
                    
                    var parameter4 = command.CreateParameter();
                    parameter4.ParameterName = "@Enabled";
                    parameter4.Value = model.Enabled;
                    command.Parameters.Add(parameter4);

                    _context.Database.OpenConnection();
                    var result = command.ExecuteNonQuery();
                    return Ok("Success: " + result);
                }
            }
            catch (Exception)
            {
                string message = $"Failed to Update UserAMRMeterActiveNotifications for User: {model.UserId}";
                _logger?.LogError(1, message);
                return Problem($"Failed to Update UserAMRMeterActiveNotifications for User: {model.UserId}");
            }
        }
    }

    //Config
    public class UserAlarmNotificationConfigModel
    {
        public int UserId { get; set; }
        public int BuildingId { get; set; }
    }

    //Maintain
    public class UserAlarmNotificationMaintainModel
    {
        public int UserId { get; set; }
        public int AMRMeterId { get; set; }
        public int AlarmTypeId { get; set; }
        public bool Enabled { get; set; }
    }
}





