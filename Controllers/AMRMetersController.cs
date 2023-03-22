using ClientPortal.Data;
using ClientPortal.Data.Entities.PortalEntities;
using DevExtreme.AspNet.Data;
using DevExtreme.AspNet.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Newtonsoft.Json;
using System.Collections;
using System.Globalization;

namespace ClientPortal.Controllers
{
    [Route("api/[controller]/[action]")]
    public class AMRMetersController : Controller
    {
        private PortalDBContext _context;

        public AMRMetersController(PortalDBContext context) {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> Get(DataSourceLoadOptions loadOptions) {
            var amrmeters = _context.AMRMeters.Select(i => new {
                i.Id,
                i.MeterNo,
                i.Description,
                i.MakeModelId,
                i.Phase,
                i.CbSize,
                i.CtSizePrim,
                i.CtSizeSec,
                i.ProgFact,
                i.Digits,
                i.Active,
                i.CommsId,
                i.MeterSerial,
                i.UserId,
                i.BuildingId
            });

            // If underlying data is a large SQL table, specify PrimaryKey and PaginateViaPrimaryKey.
            // This can make SQL execution plans more efficient.
            // For more detailed information, please refer to this discussion: https://github.com/DevExpress/DevExtreme.AspNet.Data/issues/336.
            // loadOptions.PrimaryKey = new[] { "Id" };
            // loadOptions.PaginateViaPrimaryKey = true;

            return Json(await DataSourceLoader.LoadAsync(amrmeters, loadOptions));
        }

        [HttpPost]
        public async Task<IActionResult> Post(string values) {
            var model = new AMRMeter();
            var valuesDict = JsonConvert.DeserializeObject<IDictionary>(values);
            PopulateModel(model, valuesDict);

            if(!TryValidateModel(model))
                return BadRequest(GetFullErrorMessage(ModelState));

            var result = _context.AMRMeters.Add(model);
            await _context.SaveChangesAsync();

            return Json(new { result.Entity.Id });
        }

        [HttpPut]
        public async Task<IActionResult> Put(int key, string values) {
            var model = await _context.AMRMeters.FirstOrDefaultAsync(item => item.Id == key);
            if(model == null)
                return StatusCode(409, "Object not found");

            var valuesDict = JsonConvert.DeserializeObject<IDictionary>(values);
            PopulateModel(model, valuesDict);

            if(!TryValidateModel(model))
                return BadRequest(GetFullErrorMessage(ModelState));

            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete]
        public async Task Delete(int key) {
            var model = await _context.AMRMeters.FirstOrDefaultAsync(item => item.Id == key);

            _context.AMRMeters.Remove(model);
            await _context.SaveChangesAsync();
        }


        [HttpGet]
        public async Task<IActionResult> MetersMakeModelsLookup(DataSourceLoadOptions loadOptions) {
            var lookup = from i in _context.MetersMakeModels
                         orderby i.Make
                         select new {
                             Value = i.Id,
                             Text = i.Make
                         };
            return Json(await DataSourceLoader.LoadAsync(lookup, loadOptions));
        }

        [HttpGet]
        public async Task<IActionResult> UsersLookup(DataSourceLoadOptions loadOptions) {
            var lookup = from i in _context.Users
                         orderby i.FirstName
                         select new {
                             Value = i.Id,
                             Text = i.FirstName
                         };
            return Json(await DataSourceLoader.LoadAsync(lookup, loadOptions));
        }

        private void PopulateModel(AMRMeter model, IDictionary values) {
            string ID = nameof(AMRMeter.Id);
            string METER_NO = nameof(AMRMeter.MeterNo);
            string DESCRIPTION = nameof(AMRMeter.Description);
            string MAKE_MODEL_ID = nameof(AMRMeter.MakeModelId);
            string PHASE = nameof(AMRMeter.Phase);
            string CB_SIZE = nameof(AMRMeter.CbSize);
            string CT_SIZE_PRIM = nameof(AMRMeter.CtSizePrim);
            string CT_SIZE_SEC = nameof(AMRMeter.CtSizeSec);
            string PROG_FACT = nameof(AMRMeter.ProgFact);
            string DIGITS = nameof(AMRMeter.Digits);
            string ACTIVE = nameof(AMRMeter.Active);
            string COMMS_ID = nameof(AMRMeter.CommsId);
            string METER_SERIAL = nameof(AMRMeter.MeterSerial);
            string USER_ID = nameof(AMRMeter.UserId);
            string BUILDING_ID = nameof(AMRMeter.BuildingId);

            if(values.Contains(ID)) {
                model.Id = Convert.ToInt32(values[ID]);
            }

            if(values.Contains(METER_NO)) {
                model.MeterNo = Convert.ToString(values[METER_NO]);
            }

            if(values.Contains(DESCRIPTION)) {
                model.Description = Convert.ToString(values[DESCRIPTION]);
            }

            if(values.Contains(MAKE_MODEL_ID)) {
                model.MakeModelId = Convert.ToInt32(values[MAKE_MODEL_ID]);
            }

            if(values.Contains(PHASE)) {
                model.Phase = Convert.ToInt32(values[PHASE]);
            }

            if(values.Contains(CB_SIZE)) {
                model.CbSize = Convert.ToInt32(values[CB_SIZE]);
            }

            if(values.Contains(CT_SIZE_PRIM)) {
                model.CtSizePrim = Convert.ToInt32(values[CT_SIZE_PRIM]);
            }

            if(values.Contains(CT_SIZE_SEC)) {
                model.CtSizeSec = Convert.ToInt32(values[CT_SIZE_SEC]);
            }

            if(values.Contains(PROG_FACT)) {
                model.ProgFact = Convert.ToSingle(values[PROG_FACT], CultureInfo.InvariantCulture);
            }

            if(values.Contains(DIGITS)) {
                model.Digits = Convert.ToInt32(values[DIGITS]);
            }

            if(values.Contains(ACTIVE)) {
                model.Active = Convert.ToBoolean(values[ACTIVE]);
            }

            if(values.Contains(COMMS_ID)) {
                model.CommsId = Convert.ToString(values[COMMS_ID]);
            }

            if(values.Contains(METER_SERIAL)) {
                model.MeterSerial = Convert.ToString(values[METER_SERIAL]);
            }

            if(values.Contains(USER_ID)) {
                model.UserId = Convert.ToInt32(values[USER_ID]);
            }

            if(values.Contains(BUILDING_ID)) {
                model.BuildingId = Convert.ToInt32(values[BUILDING_ID]);
            }
        }

        private string GetFullErrorMessage(ModelStateDictionary modelState) {
            var messages = new List<string>();

            foreach(var entry in modelState) {
                foreach(var error in entry.Value.Errors)
                    messages.Add(error.ErrorMessage);
            }

            return String.Join(" ", messages);
        }
    }
}