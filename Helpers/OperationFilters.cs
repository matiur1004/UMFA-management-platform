using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace ClientPortal.Helpers
{
    public class SwaggerLeaveTheCaseAsIsFilter : IOperationFilter
    {
        public void Apply(OpenApiOperation operation, OperationFilterContext context)
        {
            foreach (var parameter in operation.Parameters)
            {
                parameter.Name = ToNoCase(parameter.Name);
            }
        }

        private static string ToNoCase(string value)
        {
            return value;
        }
    }
}
