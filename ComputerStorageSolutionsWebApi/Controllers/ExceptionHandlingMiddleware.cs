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
                context.Response.Cookies.Append("err", ex.Message);
                context.Response.Redirect("/error");
            }
        }
    }
}
