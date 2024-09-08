namespace ComputerStorageSolutionsWebApi.Controllers
{
    public class ExceptionHandlingMiddleware
    {
        RequestDelegate next;
        public ExceptionHandlingMiddleware(RequestDelegate next)
        {
            this.next = next;
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                await next.Invoke(context);
            }
            catch (Exception ex)
            {
                context.Response.Cookies.Append("err", ex.Message, new CookieOptions
                {
                    Secure = true,
                    SameSite = SameSiteMode.Lax, // or SameSiteMode.None if using HTTPS
                    HttpOnly = true,
                    Expires = DateTimeOffset.UtcNow.AddDays(7),
                    MaxAge = TimeSpan.FromDays(7),
                    Domain = "yourdomain.com", // Adjust as needed
                    Path = "/"
                });
                context.Response.Redirect("/error");
            }
        }
    }
}
