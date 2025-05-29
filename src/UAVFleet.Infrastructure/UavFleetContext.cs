// src/UAVFleet.Infrastructure/UavFleetContext.cs
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using UAVFleet.Domain.Models;

namespace UAVFleet.Infrastructure
{
    public class UavFleetContext : IdentityDbContext<IdentityUser>
    {
        public UavFleetContext(DbContextOptions<UavFleetContext> opts)
            : base(opts)
        {
        }

        public DbSet<Drone> Drones { get; set; }
        public DbSet<Operator> Operators { get; set; }
        public DbSet<Mission> Missions { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Извикваме базовата Identity конфигурация
            base.OnModelCreating(modelBuilder);

            // Вашите domain-специфични ограничения:
            modelBuilder.Entity<Drone>()
                .Property(d => d.SerialNumber)
                .HasMaxLength(50)
                .IsRequired();

            modelBuilder.Entity<Drone>()
                .Property(d => d.Manufacturer)
                .HasMaxLength(100)
                .IsRequired();

            modelBuilder.Entity<Drone>()
                .Property(d => d.Model)
                .HasMaxLength(100)
                .IsRequired();

            modelBuilder.Entity<Operator>()
                .Property(o => o.FirstName)
                .HasMaxLength(50)
                .IsRequired();

            modelBuilder.Entity<Operator>()
                .Property(o => o.LastName)
                .HasMaxLength(50)
                .IsRequired();

            modelBuilder.Entity<Operator>()
                .Property(o => o.Phone)
                .HasMaxLength(20)
                .IsRequired();

            modelBuilder.Entity<Operator>()
                .Property(o => o.LicenseNumber)
                .HasMaxLength(50)
                .IsRequired();

            modelBuilder.Entity<Operator>()
                .Property(o => o.Notes)
                .HasMaxLength(500);

            modelBuilder.Entity<Mission>()
                .Property(m => m.Objective)
                .HasMaxLength(500)
                .IsRequired();
        }
    }
}
