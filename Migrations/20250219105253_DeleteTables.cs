using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AstraGrpah.Migrations
{
    /// <inheritdoc />
    public partial class DeleteTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "OrbitalCounts",
                columns: table => new
                {
                    Orbital_Regime = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Total = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrbitalCounts", x => x.Orbital_Regime);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "OrbitalCounts");
        }
    }
}
