using System.ComponentModel.DataAnnotations;

namespace AstraGraph.Models
{
    public class OrbitalCounts
    {
        [Key]
        public string? Orbital_Regime { get; set; }
        public int? Total { get; set; }
    }
}