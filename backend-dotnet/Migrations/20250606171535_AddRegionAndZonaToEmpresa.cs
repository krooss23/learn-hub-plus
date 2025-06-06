using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend_dotnet.Migrations
{
    /// <inheritdoc />
    public partial class AddRegionAndZonaToEmpresa : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Region",
                table: "Empresas",
                type: "longtext",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Zona",
                table: "Empresas",
                type: "longtext",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Region",
                table: "Empresas");

            migrationBuilder.DropColumn(
                name: "Zona",
                table: "Empresas");
        }
    }
}
