using System;

namespace UAVFleet.Domain.Models
{
    public class Mission
    {
        public int MissionId { get; set; }
        public int DroneId { get; set; }
        public int OperatorId { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public string Objective { get; set; } = null!;
        public string Result { get; set; } = null!; // planned, completed, failed
        public Drone? Drone { get; set; }
        public Operator? Operator { get; set; }
    }
}
