using Microsoft.EntityFrameworkCore;
using AstraGraph.Models;

namespace AstraGraph.Data
{
    public class AstraDbContext : DbContext
    {
        public AstraDbContext(DbContextOptions<AstraDbContext> options) : base(options) { }

        public DbSet<OrbitalCounts> OrbitalCounts { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<OrbitalCounts>().HasKey(c => c.Orbital_Regime);
        }
    }
}
