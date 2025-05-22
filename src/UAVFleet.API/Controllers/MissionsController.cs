using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UAVFleet.API.Models;
using UAVFleet.Domain.Models;
using UAVFleet.Infrastructure;

namespace UAVFleet.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class MissionsController : ControllerBase
    {
        private readonly UavFleetContext _ctx;
        public MissionsController(UavFleetContext ctx) => _ctx = ctx;

        [HttpGet]
        public async Task<IActionResult> Get(
            [FromQuery] int page = 1,
            [FromQuery] int size = 10,
            [FromQuery] string sortBy = "startTime",
            [FromQuery] int? droneId = null,
            [FromQuery] int? operatorId = null
        )
        {
            var q = _ctx.Missions.AsQueryable();

            if (droneId.HasValue)
                q = q.Where(m => m.DroneId == droneId.Value);
            if (operatorId.HasValue)
                q = q.Where(m => m.OperatorId == operatorId.Value);

            q = sortBy switch
            {
                "endTime" => q.OrderBy(m => m.EndTime),
                "result" => q.OrderBy(m => m.Result),
                _ /*startTime*/ => q.OrderBy(m => m.StartTime)
            };

            var totalItems = await q.CountAsync();
            var items = await q
                .Skip((page - 1) * size)
                .Take(size)
                .Select(m => new MissionDto
                {
                    MissionId = m.MissionId,
                    DroneId = m.DroneId,
                    OperatorId = m.OperatorId,
                    StartTime = m.StartTime,
                    EndTime = m.EndTime,
                    Objective = m.Objective,
                    Result = m.Result
                })
                .ToListAsync();

            return Ok(new
            {
                totalItems,
                totalPages = (int)Math.Ceiling(totalItems / (double)size),
                items
            });
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> Get(int id)
        {
            var m = await _ctx.Missions.FindAsync(id);
            if (m == null) return NotFound();
            var dto = new MissionDto
            {
                MissionId = m.MissionId,
                DroneId = m.DroneId,
                OperatorId = m.OperatorId,
                StartTime = m.StartTime,
                EndTime = m.EndTime,
                Objective = m.Objective,
                Result = m.Result
            };
            return Ok(dto);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] MissionCreateDto input)
        {
            var m = new Mission
            {
                DroneId = input.DroneId,
                OperatorId = input.OperatorId,
                StartTime = input.StartTime,
                EndTime = input.EndTime,
                Objective = input.Objective,
                Result = input.Result
            };
            _ctx.Missions.Add(m);
            await _ctx.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new { id = m.MissionId }, m);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] MissionCreateDto input)
        {
            var m = await _ctx.Missions.FindAsync(id);
            if (m == null) return NotFound();

            m.DroneId = input.DroneId;
            m.OperatorId = input.OperatorId;
            m.StartTime = input.StartTime;
            m.EndTime = input.EndTime;
            m.Objective = input.Objective;
            m.Result = input.Result;

            await _ctx.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var m = await _ctx.Missions.FindAsync(id);
            if (m == null) return NotFound();
            _ctx.Missions.Remove(m);
            await _ctx.SaveChangesAsync();
            return NoContent();
        }
    }
}
