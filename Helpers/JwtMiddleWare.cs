using ClientPortal.Services;

namespace ClientPortal.Helpers
{
    public class JwtMiddleWare
    {
        private readonly RequestDelegate _next;

        public JwtMiddleWare(
            RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context, IUserService userService, IJwtUtils jwtUtils)
        {
            var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();
            var userId = jwtUtils.ValidateToken(token);
            if(userId != null && userId != 0)
            {
                context.Items["User"] = userService.GetUserById(userId.Value);
            }

            await _next(context);
        }
    }
}
