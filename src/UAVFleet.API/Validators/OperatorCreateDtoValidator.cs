using FluentValidation;
using UAVFleet.API.Models;

namespace UAVFleet.API.Validators
{
    public class OperatorCreateDtoValidator : AbstractValidator<OperatorCreateDto>
    {
        public OperatorCreateDtoValidator()
        {
            RuleFor(x => x.FirstName)
                .NotEmpty().MaximumLength(50);
            RuleFor(x => x.LastName)
                .NotEmpty().MaximumLength(50);
            RuleFor(x => x.Phone)
                .NotEmpty().MaximumLength(20);
            RuleFor(x => x.LicenseNumber)
                .NotEmpty().MaximumLength(50);
            RuleFor(x => x.HiredDate)
                .LessThanOrEqualTo(DateTime.UtcNow);
            RuleFor(x => x.Notes)
                .MaximumLength(500);
        }
    }
}
