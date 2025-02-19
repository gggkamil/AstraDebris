using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AstraGraph.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SpaceObjectsController : ControllerBase
    {
        private readonly SpaceObjectsService _service;

        public SpaceObjectsController(SpaceObjectsService service)
        {
            _service = service;
        }

        [HttpGet("debris")]
        public async Task<IActionResult> GetDebris()
        {
            var debris = await _service.GenerateDebrisAsync();
            return Ok(debris);
        }
    }
}
