using Microsoft.AspNetCore.Mvc.Filters;
using ClientPortal.Data.Entities;

namespace ClientPortal.Controllers.Authorization
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
    public class AuthorizeAttribute : Attribute, IAuthorizationFilter
    {
        public void OnAuthorization(AuthorizationFilterContext context)
        {
            //skip if decorated with [AllowAnonymous]
            var allowAnonymous = context.ActionDescriptor.EndpointMetadata.OfType<AllowAnonymousAttribute>().Any();
            if (allowAnonymous) return;

            //authorization
            var user = (User?)context.HttpContext.Items["User"];
            if(user == null) 
                context.Result = new JsonResult(new { message = "Unauthorized" } ) { StatusCode = StatusCodes.Status401Unauthorized };
        }
    }
}
