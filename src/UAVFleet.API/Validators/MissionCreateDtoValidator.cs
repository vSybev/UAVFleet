using FluentValidation;
using UAVFleet.API.Models;

namespace UAVFleet.API.Validators
{
    public class MissionCreateDtoValidator : AbstractValidator<MissionCreateDto>
    {
        public MissionCreateDtoValidator()
        {
            RuleFor(x => x.DroneId)
                .GreaterThan(0);
            RuleFor(x => x.OperatorId)
                .GreaterThan(0);
            RuleFor(x => x.StartTime)
                .LessThan(x => x.EndTime)
                .WithMessage("StartTime must be before EndTime");
            RuleFor(x => x.EndTime)
                .GreaterThan(x => x.StartTime);
            RuleFor(x => x.Objective)
                .NotEmpty().MaximumLength(500);
            RuleFor(x => x.Result)
                .NotEmpty()
                .Must(r => new[] { "planned", "completed", "failed" }.Contains(r))
                .WithMessage("Result must be one of planned, completed, failed");
        }
    }
}
