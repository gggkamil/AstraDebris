using AstraGraph.Data;
using AstraGraph.Models;
using Microsoft.EntityFrameworkCore;

public class SpaceObjectsService
{
    private static readonly Random random = new Random();
    private readonly AstraDbContext _context;

    public SpaceObjectsService(AstraDbContext context)
    {
        _context = context;
    }

    public async Task<List<DebrisDto>> GenerateDebrisAsync()
    {
        var orbitalCounts = await _context.OrbitalCounts.ToListAsync();
        List<DebrisDto> debrisList = new List<DebrisDto>();

        foreach (var regime in orbitalCounts)
        {
            if (regime.Orbital_Regime == null) continue; 

            for (int i = 0; i < (regime.Total ?? 0); i++)
            {
                debrisList.Add(new DebrisDto
                {
                    Name = $"Debris {debrisList.Count + 1}",
                    Type = "Debris",
                    OrbitRegime = regime.Orbital_Regime,
                    Longitude = random.NextDouble() * 360 - 180,
                    Latitude = random.NextDouble() * 180 - 90,
                    Altitude = GenerateAltitudeForRegime(regime.Orbital_Regime)
                });
            }
        }

        return debrisList;
    }

private static double GenerateAltitudeForRegime(string orbitRegime)
{
    switch (orbitRegime)
    {
        case "LEO": 
            // LEO: 300 km < h_p < 2000 km, h_a < 2000 km
            return random.Next(300, 2000) * 1000;

        case "GEO":
            // GEO: 35,586 km < h_p = h_a < 35,986 km
            return random.Next(35586, 35987) * 1000;

        case "EGO":
            // EGO: 37,948 km < a < 46,380 km, e < 0.25, i < 25°
            return random.Next(37948, 46381) * 1000;

        case "GTO":
            // GTO: h_p < 2000 km, 31,570 km < h_a < 40,002 km
            double apogee = random.Next(31570, 40003) * 1000;
            // Perigee should be less than 2000 km, so use a value below 2000 km
            double perigee = random.Next(300, 2000) * 1000;
            return random.NextDouble() > 0.5 ? apogee : perigee;

        case "NSO":
            // NSO: 18,100 km < h_p < 24,300 km, 18,100 km < h_a < 24,300 km
            return random.Next(18100, 24301) * 1000;

        case "MEO":
            // MEO: 2,000 km < h_p, h_a < 31,570 km
            return random.Next(2000, 31571) * 1000;

        case "LMO":
            // LMO: h_p < 2000 km, 2000 km < h_a < 31,570 km
            double apogeeLMO = random.Next(2000, 31571) * 1000;
            // Perigee should be less than 2000 km
            double perigeeLMO = random.Next(300, 2000) * 1000;
            return random.NextDouble() > 0.5 ? apogeeLMO : perigeeLMO;

        case "MGO":
            // MGO: 2,000 km < h_p < 31,570 km, 31,570 km < h_a < 40,002 km
            double apogeeMGO = random.Next(31570, 40003) * 1000;
            // Perigee should be between 2000 km and 31,570 km
            double perigeeMGO = random.Next(2000, 31571) * 1000;
            return random.NextDouble() > 0.5 ? apogeeMGO : perigeeMGO;

        case "HEO":
            // HEO: h_p < 31,570 km, h_a > 40,002 km
            double apogeeHEO = random.Next(40002, 200000) * 1000;
            // Perigee should be below 31,570 km
            double perigeeHEO = random.Next(300, 31571) * 1000;
            return random.NextDouble() > 0.5 ? apogeeHEO : perigeeHEO;

        case "Other":
            // Use a reasonable default range, as "Other" is undefined
            return random.Next(500, 10000) * 1000;

        default:
            return random.Next(300, 2000) * 1000; // Default to LEO range
    }
}

}

public class DebrisDto
{
    public string? Name { get; set; }
    public string? Type { get; set; }
    public string? OrbitRegime { get; set; }
    public double Longitude { get; set; }
    public double Latitude { get; set; }
    public double Altitude { get; set; }
}
