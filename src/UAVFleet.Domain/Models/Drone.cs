using System;

namespace UAVFleet.Domain.Models
{
    public class Drone
    {
        public int DroneId { get; set; }
        public string SerialNumber { get; set; } = null!;
        public string Manufacturer { get; set; } = null!;
        public string Model { get; set; } = null!;
        public double PayloadCapacity { get; set; }
        public DateTime ServiceDate { get; set; }
        public string Status { get; set; } = null!;  // idle, in_mission, maintenance
    }
}
