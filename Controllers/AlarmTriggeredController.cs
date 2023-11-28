using ClientPortal.Controllers.Authorization;
using ClientPortal.Data.Entities.PortalEntities;
using ClientPortal.Models.RequestModels;
using ClientPortal.Models.ResponseModels;
using ClientPortal.Services;

namespace ClientPortal.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class AlarmTriggeredController : ControllerBase
    {
        private readonly ILogger<AlarmTriggeredController> _logger;
        private readonly IAMRMeterTriggeredAlarmService _amrMeterTriggeredAlarmService;

        public AlarmTriggeredController(ILogger<AlarmTriggeredController> logger, IAMRMeterTriggeredAlarmService amrMeterTriggeredAlarmService)
        {
            _logger = logger;
            _amrMeterTriggeredAlarmService = amrMeterTriggeredAlarmService;
        }

        [HttpPost("getAlarmTriggered")]
        public async Task<ActionResult<AlarmTriggeredResultModel>> GetAlarmTriggered([FromBody] AlarmTriggeredModel model)
        {
            if (!int.TryParse(model.AMRMeterTriggeredAlarmId.ToString(), out _)) return BadRequest(new ApplicationException($"Invalid AMR Meter Triggered Alarm Id: '{model.AMRMeterTriggeredAlarmId}'"));

            var returnResult = new AlarmTriggeredResultModel();

            _logger.LogInformation(1, "Get Triggered Alarm Details for AMRMeterTriggeredAlarmId: {0}", model.AMRMeterTriggeredAlarmId);

            try
            {
                var triggeredAlarmDetails = await _amrMeterTriggeredAlarmService.GetTriggeredAlarmAsync(model.AMRMeterTriggeredAlarmId);
                
                returnResult.AlarmData = triggeredAlarmDetails.AlarmTriggeredResultDataModels;
                returnResult.AlarmInfo = triggeredAlarmDetails.AlarmTriggeredResultInfoModels.First();

            }
            catch (Exception ex)
            {
                _logger?.LogError("Failed to get AlarmTriggered Details for Meter: {MeterSerialNo}", model.AMRMeterTriggeredAlarmId);
                Console.WriteLine(ex.ToString());
                return Problem($"Failed to get AlarmTriggered Details for Meter: {model.AMRMeterTriggeredAlarmId}");
            }

            if (returnResult.AlarmData.Count >= 0)
            {
                _logger.LogInformation(1, message: "Returning AlarmTriggered Details for Meter: {MeterSerialNo}", model.AMRMeterTriggeredAlarmId);
            }
            else
            {
                _logger.LogError(1, "No Results Found For AlarmTriggered Details for Meter: {MeterSerialNo}", model.AMRMeterTriggeredAlarmId);
            }
            return Ok(returnResult);
        }

        [HttpPost("updateAcknowledged")]
        public async Task<IActionResult> UpdateAcknowledged([FromBody] AlarmTriggeredModel model)
        {
            try
            {
                _logger.LogInformation($"Update AlarmTriggered Acknowledged With Id: {model.AMRMeterTriggeredAlarmId}");

                var updatedAlarm = await _amrMeterTriggeredAlarmService.AcknowledgeAlarmAsync(new AMRMeterTriggeredAlarmAcknowledgeRequest { Acknowledged = true }, model.AMRMeterTriggeredAlarmId);

                if (updatedAlarm is not null)
                {
                    var result = new SuccessModel();
                    result.Status = "Success";
                    _logger.LogInformation($"Successfully updated user: {model.AMRMeterTriggeredAlarmId}");
                    return Ok(result);
                }
                else throw new Exception($"Failed to Update AlarmTriggered Acknowledged With Id: {model.AMRMeterTriggeredAlarmId}");
            }
            catch (Exception ex)
            {
                _logger?.LogError($"Failed to update User Roles: {ex.Message}");
                return BadRequest(new ApplicationException($"Failed to update User Roles and Notification Settings: {ex.Message}"));
            }
        }

        [HttpGet("{amrMeterAlarmId:int}/not-acknowledged/count")]
        public ActionResult<int> GetNotAcknowledgedTriggeredAlarm(int amrMeterAlarmId)
        {
            var count = _amrMeterTriggeredAlarmService.GetNotAcknowledgedTriggeredAlarmsCount(amrMeterAlarmId);

            if(count is null)
            {
                return Problem("Could not get triggered alarm count");
            }

            return count;
        }

        [HttpGet("")]
        public async Task<ActionResult<List<AMRMeterTriggeredAlarmInfo>>> GetAlaramsTriggered([FromQuery] AMRTriggeredAlarmsRequest request)
        {
            try
            {
                return await _amrMeterTriggeredAlarmService.GetTriggeredAlarmsAsync(request);
            }
            catch(Exception e)
            {
                _logger.LogError(e.Message, e);
                return Problem("Could not get triggered alarms");
            }
        }
    }

    //Config
    public class AlarmTriggeredModel
    {
        public int AMRMeterTriggeredAlarmId { get; set; }

    }

   

    public class AlarmTriggeredResultModel
    {
        public AlarmTriggeredResultInfoModel AlarmInfo { get; set; }
        public List<AlarmTriggeredResultDataModel> AlarmData { get; set; }
    }

    public class SuccessModel
    {
        public string Status { get; set; }
    }
}