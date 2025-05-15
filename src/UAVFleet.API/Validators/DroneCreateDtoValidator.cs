using FluentValidation;
using UAVFleet.API.Models;

namespace UAVFleet.API.Validators
{
    public class DroneCreateDtoValidator : AbstractValidator<DroneCreateDto>
    {
        public DroneCreateDtoValidator()
        {
            RuleFor(x => x.SerialNumber)
            .NotEmpty().MaximumLength(50);
            RuleFor(x => x.Manufacturer)
                .NotEmpty().MaximumLength(100);
            RuleFor(x => x.Model)
                .NotEmpty().MaximumLength(100);
            RuleFor(x => x.PayloadCapacity)
                .GreaterThanOrEqualTo(0);
            RuleFor(x => x.ServiceDate)
                .LessThanOrEqualTo(DateTime.UtcNow);
            RuleFor(x => x.Status)
                .NotEmpty().Must(s => new[] { "idle", "in_mission", "maintenance" }.Contains(s))
                .WithMessage("Status must be one of idle, in_mission, maintenance");
        }
    }
}