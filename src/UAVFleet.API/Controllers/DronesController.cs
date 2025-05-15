// src/UAVFleet.API/Controllers/DronesController.cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UAVFleet.Infrastructure;
using UAVFleet.API.Models;
using UAVFleet.Domain.Models;

[ApiController]
[Route("api/[controller]")]
public class DronesController : ControllerBase
{
    private readonly UavFleetContext _ctx;
    public DronesController(UavFleetContext ctx) => _ctx = ctx;

    // GET api/drones?page=1&size=10&sortBy=serialNumber&serialNumber=&status=
    [HttpGet]
    public async Task<IActionResult> Get(
        [FromQuery] int page = 1,
        [FromQuery] int size = 10,
        [FromQuery] string sortBy = "serialNumber",
        [FromQuery] string? serialNumber = null,
        [FromQuery] string? status = null
    )
    {
        var q = _ctx.Drones.AsQueryable();

        if (!string.IsNullOrEmpty(serialNumber))
            q = q.Where(d => d.SerialNumber.Contains(serialNumber));
        if (!string.IsNullOrEmpty(status))
            q = q.Where(d => d.Status == status);

        // Sort
        q = sortBy switch
        {
            "manufacturer" => q.OrderBy(d => d.Manufacturer),
            "model" => q.OrderBy(d => d.Model),
            "status" => q.OrderBy(d => d.Status),
            _ /*serialNumber*/ => q.OrderBy(d => d.SerialNumber)
        };

        var totalItems = await q.CountAsync();
        var items = await q
            .Skip((page - 1) * size)
            .Take(size)
            .Select(d => new DroneDto
            {
                DroneId = d.DroneId,
                SerialNumber = d.SerialNumber,
                Manufacturer = d.Manufacturer,
                Model = d.Model,
                PayloadCapacity = d.PayloadCapacity,
                ServiceDate = d.ServiceDate,
                Status = d.Status
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
        var d = await _ctx.Drones.FindAsync(id);
        if (d == null) return NotFound();
        var dto = new DroneDto
        {
            DroneId = d.DroneId,
            SerialNumber = d.SerialNumber,
            Manufacturer = d.Manufacturer,
            Model = d.Model,
            PayloadCapacity = d.PayloadCapacity,
            ServiceDate = d.ServiceDate,
            Status = d.Status
        };
        return Ok(dto);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] DroneCreateDto input)
    {
        // validation via FluentValidation
        var d = new Drone
        {
            SerialNumber = input.SerialNumber,
            Manufacturer = input.Manufacturer,
            Model = input.Model,
            PayloadCapacity = input.PayloadCapacity,
            ServiceDate = input.ServiceDate,
            Status = input.Status
        };
        _ctx.Drones.Add(d);
        await _ctx.SaveChangesAsync();
        return CreatedAtAction(nameof(Get), new { id = d.DroneId }, d);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] DroneCreateDto input)
    {
        var d = await _ctx.Drones.FindAsync(id);
        if (d == null) return NotFound();

        d.SerialNumber = input.SerialNumber;
        d.Manufacturer = input.Manufacturer;
        d.Model = input.Model;
        d.PayloadCapacity = input.PayloadCapacity;
        d.ServiceDate = input.ServiceDate;
        d.Status = input.Status;

        await _ctx.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var d = await _ctx.Drones.FindAsync(id);
        if (d == null) return NotFound();
        _ctx.Drones.Remove(d);
        await _ctx.SaveChangesAsync();
        return NoContent();
    }
}
