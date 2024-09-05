using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ComputerStorageSolutionsWebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TroubleShootingController : ControllerBase
    {
        [HttpGet]
        [Route("error")]
        public IActionResult ErrorAction()
        {
            string? Message = Request.Cookies["err"];
            return Content(Message ?? "NOTHING");
        }
    }
}
