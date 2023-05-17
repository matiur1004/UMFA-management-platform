using ClientPortal.Controllers.Authorization;
using ClientPortal.Data;
using System.Dynamic;

namespace ClientPortal.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class ReportShopUsageVarianceController : ControllerBase
    {
        private readonly ILogger<ReportShopUsageVarianceController> _logger;
        private readonly UmfaDBContext _context;

        public ReportShopUsageVarianceController(ILogger<ReportShopUsageVarianceController> logger, UmfaDBContext context)
        {
            _logger = logger;
            _context = context;
        }

        [HttpPost("getReportData")]
        public ActionResult<IEnumerable<dynamic>> GetReportData([FromBody] ShopUsageVarianceRequestModel model)
        {
            List<dynamic> resultList = new List<dynamic>();
            _logger.LogInformation(1, $"Get Report Shop Usage Variance for building id: {model.BuildingId} from database");
            try
            {
                using (var command = _context.Database.GetDbConnection().CreateCommand())
                {
                    command.CommandText = "upPortal_RepBuildingShopUsage";
                    command.CommandType = System.Data.CommandType.StoredProcedure;

                    var parameter1 = command.CreateParameter();
                    parameter1.ParameterName = "@BuildingId";
                    parameter1.Value = model.BuildingId;
                    command.Parameters.Add(parameter1);

                    var parameter2 = command.CreateParameter();
                    parameter2.ParameterName = "@FromPeriodId";
                    parameter2.Value = model.FromPeriodId;
                    command.Parameters.Add(parameter2);

                    var parameter3 = command.CreateParameter();
                    parameter3.ParameterName = "@ToPeriodId";
                    parameter3.Value = model.ToPeriodId;
                    command.Parameters.Add(parameter3);

                    var parameter4 = command.CreateParameter();
                    parameter4.ParameterName = "@AllTenants";
                    parameter4.Value = model.AllTenants;
                    command.Parameters.Add(parameter4);

                    _context.Database.OpenConnection();

                    using (var reader = command.ExecuteReader())
                    {
                        // Dictionary to store the sums for each item in reader[8]
                        Dictionary<object, decimal> totals = new Dictionary<object, decimal>();
                        int fieldCount = 0;
                        // Get field names from the reader's schema
                        var fieldNames = Enumerable.Range(0, reader.FieldCount)
                            .Select(i => reader.GetName(i))
                            .ToList();

                        while (reader.Read())
                        {
                            dynamic result = new ExpandoObject();
                            var dictionary = result as IDictionary<string, object>;
                            fieldCount = reader.FieldCount; // Store the field count in a variable for performance optimization

                            for (int i = 0; i < fieldCount; i++)
                            {
                                dictionary.Add(reader.GetName(i), reader.IsDBNull(i) ? null : reader[i]);
                            }

                            // Calculate Average
                            decimal sum = 0;
                            int count = 0;
                            string averageString = string.Empty;
                            string variancePercString = string.Empty;

                            for (int i = 9; i < fieldCount - 1; i++) // Use < instead of <= to exclude the last field
                            {
                                if (!reader.IsDBNull(i))
                                {
                                    decimal fieldValue = reader.GetDecimal(i);
                                    sum += fieldValue;
                                    count++;

                                    // Add running total to the dictionary
                                    string fieldName = fieldNames[i];
                                    if (!totals.ContainsKey(fieldName))
                                    {
                                        totals[fieldName] = fieldValue;
                                    }
                                    else
                                    {
                                        totals[fieldName] += fieldValue;
                                    }
                                }
                            }
                            decimal average = count > 0 ? sum / count : 0;

                            // Calculate Variance
                            decimal lastValue = reader.IsDBNull(fieldCount - 1) ? 0 : reader.GetDecimal(fieldCount - 1); // Get the last value directly
                            decimal variance = lastValue > 0 ? (average - lastValue) / lastValue * 100 : 0;

                            // Add Last Two Columns
                            if (average > 0) { averageString = average.ToString(); }
                            if (variance > 0) { variancePercString = variance.ToString("0.00") + "%"; }

                            dictionary.Add("Average", average > 0 ? Math.Round(average, 2) : null);
                            dictionary.Add("Variance", variance > 0 ? variancePercString : null);

                            // Calculate Totals
                            object key = reader[8]; // Assuming the item to group by is in reader[8]
                            if (!totals.ContainsKey(key))
                            {
                                totals[key] = 0;
                            }
                            totals[key] += sum;

                            resultList.Add(result);
                        }

                        // Add total lines for each item in reader[8]
                        foreach (var item in totals)
                        {
                            dynamic totalResult = new ExpandoObject();
                            var totalDictionary = totalResult as IDictionary<string, object>;
                            totalDictionary.Add(reader.GetName(8), item.Key); // Assuming the item to group by is in reader[8]
                            totalDictionary.Add("Total", item.Value);

                            // Add running totals
                            for (int i = 9; i < fieldCount - 1; i++) // Use < instead of <= to exclude the last field
                            {
                                string fieldName = fieldNames[i];
                                if (totals.ContainsKey(fieldName))
                                {
                                    totalDictionary.Add(fieldName + " Total", totals[fieldName]);
                                }
                            }
                            resultList.Add(totalResult);
                        }
                    }
                }
            }
            catch (Exception)
            {
                _logger?.LogError($"Failed to get Report Shop Usage Variance for BuildingId {model.BuildingId}");
                return Problem($"Failed to get Report Shop Usage Variance for BuildingId {model.BuildingId}");
            }
            if (resultList.Count > 0)
            {
                _logger.LogInformation(1, $"Returning Report Shop Usage Variance for building: {model.BuildingId}");
            }
            else
            {
                _logger.LogError(1, $"No Results Found For Report Shop Usage Variance for building: {model.BuildingId}");
            }

            return Ok(resultList);
        }
    }

    //exec upPortal_RepBuildingShopUsage 1808, 164387, 174137, 3
    //@BuildingId INT
    //@FromPeriodId INT
    //@ToPeriodId INT
    //@AllTenants smallint
    public class ShopUsageVarianceRequestModel
    {
        public int BuildingId { get; set; }
        public int FromPeriodId { get; set; }
        public int ToPeriodId { get; set; }
        public int AllTenants { get; set; }
    }
}
