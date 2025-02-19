using AstraGraph.Data;
using Microsoft.EntityFrameworkCore;
namespace AstraGraph
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Register SpaceObjectsService as Scoped
            builder.Services.AddScoped<SpaceObjectsService>();

            // Register controllers
            builder.Services.AddControllers();

            // Enable CORS for frontend
            builder.Services.AddCors(options =>
            {
                options.AddDefaultPolicy(builder =>
                {
                    builder.WithOrigins("http://localhost:5173") // Frontend URL
                           .AllowAnyHeader()
                           .AllowAnyMethod();
                });
            });

            // Register DbContext with Scoped lifetime
            builder.Services.AddDbContext<AstraDbContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"))
            );

            // Register repositories as scoped

            var app = builder.Build();

            // Use CORS middleware
            app.UseCors();

            // Configure the HTTP request pipeline
            app.MapGet("/", () => "Hello World!");
            app.MapControllers();  // Only one call to MapControllers()

            // Set up HTTPS redirection and authorization
            app.UseHttpsRedirection();
            app.UseAuthorization();

            app.Run();
        }
    }
}
