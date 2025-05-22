using System;
using System.Linq;
using UAVFleet.Domain.Models;

namespace UAVFleet.Infrastructure
{
    public static class DbInitializer
    {
        public static void Initialize(UavFleetContext ctx)
        {
            ctx.Database.EnsureCreated();

            if (ctx.Drones.Any()) return;

            var drones = new[]
            {
                new Drone { SerialNumber = "SN-001", Manufacturer = "DJI", Model = "Phantom 4", PayloadCapacity = 1.2, ServiceDate = DateTime.UtcNow.AddMonths(-1), Status = "idle" },
                new Drone { SerialNumber = "SN-002", Manufacturer = "Parrot", Model = "Anafi",    PayloadCapacity = 0.8, ServiceDate = DateTime.UtcNow.AddMonths(-2), Status = "maintenance" },
                new Drone { SerialNumber = "SN-003", Manufacturer = "Autel", Model = "Evo II",    PayloadCapacity = 1.5, ServiceDate = DateTime.UtcNow.AddMonths(-3), Status = "in_mission" }
            };
            ctx.Drones.AddRange(drones);
            ctx.SaveChanges();

            var operators = new[]
            {
                new Operator { FirstName = "Ivan",  LastName = "Petrov", Phone = "+359888000001", LicenseNumber = "LIC-001", HiredDate = DateTime.UtcNow.AddYears(-2), Notes = "Survey specialist" },
                new Operator { FirstName = "Maria", LastName = "Ivanova",Phone = "+359888000002", LicenseNumber = "LIC-002", HiredDate = DateTime.UtcNow.AddYears(-1), Notes = "Mapping expert"    }
            };
            ctx.Operators.AddRange(operators);
            ctx.SaveChanges();

            var missions = new[]
            {
                new Mission
                {
                    DroneId    = drones[0].DroneId,
                    OperatorId = operators[0].OperatorId,
                    StartTime  = DateTime.UtcNow.AddDays(-7),
                    EndTime    = DateTime.UtcNow.AddDays(-7).AddHours(2),
                    Objective  = "Inspect power lines",
                    Result     = "completed"
                },
                new Mission
                {
                    DroneId    = drones[2].DroneId,
                    OperatorId = operators[1].OperatorId,
                    StartTime  = DateTime.UtcNow.AddDays(-1),
                    EndTime    = DateTime.UtcNow.AddDays(-1).AddHours(1),
                    Objective  = "Crop health survey",
                    Result     = "planned"
                }
            };
            ctx.Missions.AddRange(missions);
            ctx.SaveChanges();
        }
    }
}
