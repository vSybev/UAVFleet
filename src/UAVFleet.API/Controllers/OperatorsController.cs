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
    public class OperatorsController : ControllerBase
    {
        private readonly UavFleetContext _ctx;
        public OperatorsController(UavFleetContext ctx) => _ctx = ctx;

        [HttpGet]
        public async Task<IActionResult> Get(
            [FromQuery] int page = 1,
            [FromQuery] int size = 10,
            [FromQuery] string sortBy = "lastName",
            [FromQuery] string? firstName = null,
            [FromQuery] string? lastName = null
        )
        {
            var q = _ctx.Operators.AsQueryable();

            if (!string.IsNullOrEmpty(firstName))
                q = q.Where(o => o.FirstName.Contains(firstName));
            if (!string.IsNullOrEmpty(lastName))
                q = q.Where(o => o.LastName.Contains(lastName));

            q = sortBy switch
            {
                "firstName" => q.OrderBy(o => o.FirstName),
                "hiredDate" => q.OrderBy(o => o.HiredDate),
                _ => q.OrderBy(o => o.LastName)
            };

            var totalItems = await q.CountAsync();
            var items = await q
                .Skip((page - 1) * size)
                .Take(size)
                .Select(o => new OperatorDto
                {
                    OperatorId = o.OperatorId,
                    FirstName = o.FirstName,
                    LastName = o.LastName,
                    Phone = o.Phone,
                    LicenseNumber = o.LicenseNumber,
                    HiredDate = o.HiredDate,
                    Notes = o.Notes
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
            var o = await _ctx.Operators.FindAsync(id);
            if (o == null) return NotFound();
            var dto = new OperatorDto
            {
                OperatorId = o.OperatorId,
                FirstName = o.FirstName,
                LastName = o.LastName,
                Phone = o.Phone,
                LicenseNumber = o.LicenseNumber,
                HiredDate = o.HiredDate,
                Notes = o.Notes
            };
            return Ok(dto);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] OperatorCreateDto input)
        {
            var o = new Operator
            {
                FirstName = input.FirstName,
                LastName = input.LastName,
                Phone = input.Phone,
                LicenseNumber = input.LicenseNumber,
                HiredDate = input.HiredDate,
                Notes = input.Notes
            };
            _ctx.Operators.Add(o);
            await _ctx.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new { id = o.OperatorId }, o);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] OperatorCreateDto input)
        {
            var o = await _ctx.Operators.FindAsync(id);
            if (o == null) return NotFound();

            o.FirstName = input.FirstName;
            o.LastName = input.LastName;
            o.Phone = input.Phone;
            o.LicenseNumber = input.LicenseNumber;
            o.HiredDate = input.HiredDate;
            o.Notes = input.Notes;

            await _ctx.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var o = await _ctx.Operators.FindAsync(id);
            if (o == null) return NotFound();
            _ctx.Operators.Remove(o);
            await _ctx.SaveChangesAsync();
            return NoContent();
        }
    }
}
