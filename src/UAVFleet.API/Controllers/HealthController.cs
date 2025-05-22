using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UAVFleet.API.Models;
using Microsoft.AspNetCore.Authorization;

namespace UAVFleet.API.Controllers
{
    [ApiController]
    [Route("health")]
    public class HealthController : ControllerBase
    {
        [HttpGet, AllowAnonymous]
        public ActionResult<HealthStatus> Get()
        {
            return Ok(new HealthStatus
            {
                Status = "OK",
                Timestamp = DateTime.UtcNow
            });
        }
    }
}
