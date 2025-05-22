using System;

namespace UAVFleet.API.Models
{
    public class OperatorCreateDto
    {
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string Phone { get; set; } = null!;
        public string LicenseNumber { get; set; } = null!;
        public DateTime HiredDate { get; set; }
        public string? Notes { get; set; }
    }
}
