// Program.cs
using System.Text;
using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using UAVFleet.Infrastructure;
using UAVFleet.API.Validators;
using Microsoft.AspNetCore.Http;

var builder = WebApplication.CreateBuilder(args);

// 1) EF Core + your SQL Server DbContext
builder.Services.AddDbContext<UavFleetContext>(opts =>
    opts.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"))
);

// 2) ASP.NET Core Identity (but we will *not* let its cookie scheme become the default challenge)
builder.Services.AddIdentity<IdentityUser, IdentityRole>(options =>
{
    // tweak password options if you like
    options.Password.RequireDigit = true;
    options.Password.RequiredLength = 6;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = true;
    options.Password.RequireLowercase = true;
})
.AddEntityFrameworkStores<UavFleetContext>()
.AddDefaultTokenProviders();

// 3) CORS for your Angular client during development
builder.Services.AddCors(o => o.AddPolicy("AllowAngularDev", p =>
    p.WithOrigins("http://localhost:4200")
     .AllowAnyMethod()
     .AllowAnyHeader()
));

// 4) Authentication: make JWT Bearer the *default* authenticate & challenge scheme
var jwtSection = builder.Configuration.GetSection("Jwt");
var jwtKey = Encoding.UTF8.GetBytes(jwtSection["Key"]!);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(opts =>
{
    opts.RequireHttpsMetadata = true;
    opts.SaveToken = true;
    opts.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSection["Issuer"],
        ValidAudience = jwtSection["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(jwtKey)
    };

    // if you really want to suppress any redirect-to-login behavior:
    opts.Events = new JwtBearerEvents
    {
        OnChallenge = context =>
        {
            context.HandleResponse();
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            return Task.CompletedTask;
        }
    };
});

// 5) MVC + FluentValidation
builder.Services
    .AddControllers()
    .AddFluentValidation(fv =>
        fv.RegisterValidatorsFromAssemblyContaining<DroneCreateDtoValidator>()
    );

// 6) Swagger/OpenAPI with JWT support
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "UAV Fleet Management API",
        Version = "v1"
    });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        Description = "Enter: Bearer {your JWT token}"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement {
        {
            new OpenApiSecurityScheme {
                Reference = new OpenApiReference {
                    Type = ReferenceType.SecurityScheme,
                    Id   = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

// 7) Seed database, roles, and an Admin user
using (var scope = app.Services.CreateScope())
{
    var ctx = scope.ServiceProvider.GetRequiredService<UavFleetContext>();
    var userMgr = scope.ServiceProvider.GetRequiredService<UserManager<IdentityUser>>();
    var roleMgr = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();

    // initialize your domain data
    DbInitializer.Initialize(ctx);

    // ensure "Admin" role exists
    if (!await roleMgr.RoleExistsAsync("Admin"))
        await roleMgr.CreateAsync(new IdentityRole("Admin"));

    // ensure a default admin user
    var adminEmail = builder.Configuration["AdminUser:Email"] ?? "admin@example.com";
    var adminPass = builder.Configuration["AdminUser:Password"] ?? "Str0ngP@ssw0rd!";
    var admin = await userMgr.FindByEmailAsync(adminEmail);
    if (admin is null)
    {
        admin = new IdentityUser
        {
            UserName = adminEmail,
            Email = adminEmail,
            EmailConfirmed = true
        };
        var res = await userMgr.CreateAsync(admin, adminPass);
        if (res.Succeeded)
            await userMgr.AddToRoleAsync(admin, "Admin");
        // else log errors from res.Errors…
    }
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// 8) Global error handling (for FluentValidation, etc.)
app.Use(async (ctx, next) =>
{
    try
    {
        await next();
    }
    catch (ValidationException vf)
    {
        ctx.Response.StatusCode = 400;
        await ctx.Response.WriteAsJsonAsync(new
        {
            code = 400,
            message = vf.Errors.Select(e => e.ErrorMessage)
        });
    }
    catch (Exception ex)
    {
        ctx.Response.StatusCode = 500;
        await ctx.Response.WriteAsJsonAsync(new
        {
            code = 500,
            message = ex.Message
        });
    }
});

app.UseHttpsRedirection();
app.UseCors("AllowAngularDev");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
