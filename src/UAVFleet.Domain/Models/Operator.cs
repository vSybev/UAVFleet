// src/UAVFleet.Domain/Models/Operator.cs
using System;

namespace UAVFleet.Domain.Models
{
    public class Operator
    {
        public int OperatorId { get; set; }
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string Phone { get; set; } = null!;
        public string LicenseNumber { get; set; } = null!;
        public DateTime HiredDate { get; set; }
        public string? Notes { get; set; }
    }
}
