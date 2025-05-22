using System;

namespace UAVFleet.API.Models
{
    public class MissionCreateDto
    {
        public int DroneId { get; set; }
        public int OperatorId { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public string Objective { get; set; } = null!;
        public string Result { get; set; } = null!;
    }
}
