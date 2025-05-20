using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend_dotnet.Migrations
{
    /// <inheritdoc />
    public partial class AddCourseFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Categoria",
                table: "Courses",
                type: "longtext",
                nullable: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "FechaInicio",
                table: "Courses",
                type: "datetime(6)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Horario",
                table: "Courses",
                type: "longtext",
                nullable: false);

            migrationBuilder.AddColumn<string>(
                name: "ImagenUrl",
                table: "Courses",
                type: "longtext",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Categoria",
                table: "Courses");

            migrationBuilder.DropColumn(
                name: "FechaInicio",
                table: "Courses");

            migrationBuilder.DropColumn(
                name: "Horario",
                table: "Courses");

            migrationBuilder.DropColumn(
                name: "ImagenUrl",
                table: "Courses");
        }
    }
}
