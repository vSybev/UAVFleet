// src/UAVFleet.Infrastructure/UavFleetContext.cs
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Reflection.Emit;
using UAVFleet.Domain.Models;

namespace UAVFleet.Infrastructure
{
    public class UavFleetContext : DbContext
    {
        public UavFleetContext(DbContextOptions<UavFleetContext> options)
        : base(options) { }

        public DbSet<Drone> Drones => Set<Drone>();
        public DbSet<Operator> Operators => Set<Operator>();
        public DbSet<Mission> Missions => Set<Mission>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Ограничения съобразно JSON спецификацията
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
