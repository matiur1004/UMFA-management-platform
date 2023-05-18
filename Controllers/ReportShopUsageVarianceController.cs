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
                        // Dictionary to store the totals for each group
                        Dictionary<string, Dictionary<string, decimal>> groupTotals = new Dictionary<string, Dictionary<string, decimal>>();
                        int fieldCount = 0;
                        int groupIndex = 8;
                        int totalCount = 0;
                        // Get field names from the reader's schema
                        var fieldNames = Enumerable.Range(0, reader.FieldCount)
                            .Select(i => reader.GetName(i))
                            .ToList();

                        while (reader.Read())
                        {
                            string groupName = reader.GetString(groupIndex);

                            if (!groupTotals.ContainsKey(groupName))
                            {
                                groupTotals[groupName] = new Dictionary<string, decimal>();
                            }

                            dynamic result = new ExpandoObject();
                            var dictionary = result as IDictionary<string, object>;
                            fieldCount = reader.FieldCount; // Store the field count in a variable for performance optimization

                            // Add LineItems
                            for (int i = 0; i < fieldCount; i++)
                            {
                                string columnName = reader.GetName(i);
                                dictionary.Add(columnName, reader.IsDBNull(i) ? null : reader[i]);

                                if (i >= 9 && i <= fieldCount -1)
                                {
                                    decimal columnValue = reader.IsDBNull(i) ? 0 : reader.GetDecimal(i);

                                    if (groupTotals[groupName].ContainsKey(columnName))
                                    {
                                        groupTotals[groupName][columnName] += columnValue;
                                    }
                                    else
                                    {
                                        groupTotals[groupName][columnName] = columnValue;
                                    }
                                }
                            }

                            // Calculate Average
                            decimal sum = 0;
                            int count = 0;

                            for (int i = 9; i < fieldCount - 1; i++) // Use < instead of <= to exclude the last field
                            {
                                if (!reader.IsDBNull(i))
                                {
                                    decimal fieldValue = reader.GetDecimal(i);
                                    sum += fieldValue;
                                    count++;
                                }
                            }
                            decimal average = count > 0 ? sum / count : 0;

                            // Calculate Variance
                            decimal lastValue = reader.IsDBNull(fieldCount - 1) ? 0 : reader.GetDecimal(fieldCount - 1); // Get the last value directly
                            decimal variance = lastValue > 0 ? (average - lastValue) / lastValue * 100 : 0;

                            // Add Average and Variance Columns
                            dictionary.Add("Average", average > 0 ? Math.Round(average, 2) : null);
                            dictionary.Add("Variance", variance > 0 ? variance.ToString("0.00") + "%" : null);

                            resultList.Add(result);
                        }

                        // Add Totals Row for each group
                        foreach (var group in groupTotals)
                        {
                            dynamic totalsRow = new ExpandoObject();
                            var totalsDictionary = totalsRow as IDictionary<string, object>;

                            totalsDictionary.Add(fieldNames[0], "TOTALS");
                            totalsDictionary.Add(fieldNames[1], "FOR");
                            totalsDictionary.Add(fieldNames[2], "GROUP:");
                            totalsDictionary.Add(fieldNames[3], "");
                            totalsDictionary.Add(fieldNames[4], "");
                            totalsDictionary.Add(fieldNames[5], "");
                            totalsDictionary.Add(fieldNames[6], "");
                            totalsDictionary.Add(fieldNames[7], "");
                            // Add the group name to the totals row
                            totalsDictionary.Add("InvGroup", group.Key);

                            foreach (var kvp in group.Value)
                            {
                                totalsDictionary.Add(kvp.Key, kvp.Value);
                            }

                            // Calculate Totals Average
                            decimal sumTotals = group.Value.Values.Sum();
                            decimal averageTotals = group.Value.Count > 0 ? sumTotals / group.Value.Count : 0;

                            // Calculate Totals Variance
                            decimal lastValueTotals = group.Value.ContainsKey(fieldCount.ToString()) ? group.Value[fieldCount.ToString()] : 0;
                            decimal varianceTotals = lastValueTotals > 0 ? (averageTotals - lastValueTotals) / lastValueTotals * 100 : 0;

                            totalsDictionary.Add("Average", averageTotals > 0 ? Math.Round(averageTotals, 2) : null);
                            totalsDictionary.Add("Variance", varianceTotals > 0 ? varianceTotals.ToString("0.00") + "%" : null);

                            resultList.Add(totalsRow);
                        }
                    }
                }
            }

            //            foreach (var group in groupTotals)
            //            {
            //                dynamic groupTotalsRow = new ExpandoObject();
            //                var groupTotalsDictionary = groupTotalsRow as IDictionary<string, object>;

            //                groupTotalsDictionary.Add(fieldNames[0], "Totals");
            //                groupTotalsDictionary.Add(fieldNames[1], "");
            //                groupTotalsDictionary.Add(fieldNames[2], "");
            //                groupTotalsDictionary.Add(fieldNames[3], "");
            //                groupTotalsDictionary.Add(fieldNames[4], "");
            //                groupTotalsDictionary.Add(fieldNames[5], "");
            //                groupTotalsDictionary.Add(fieldNames[6], "");
            //                groupTotalsDictionary.Add(fieldNames[7], "");
            //                groupTotalsDictionary.Add(fieldNames[8], "");
            //                foreach (var kvp in group)
            //                {
            //                    groupTotalsDictionary.Add(kvp.Key, kvp.Value);
            //                }

            //                groupTotalsDictionary.Add("Average", averageTotals > 0 ? Math.Round(averageTotals, 2) : null);
            //                groupTotalsDictionary.Add("Variance", varianceTotals > 0 ? varianceTotals.ToString("0.00") + "%" : null);

            //                resultList.Add(groupTotalsRow);
            //            }
            //        }
            //    }
            //}
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
