namespace backend_dotnet.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string Apellidos { get; set; } = string.Empty;
        public string SenceNet { get; set; } = string.Empty;
        public string Pais { get; set; } = string.Empty;
        public string Estado { get; set; } = "activo";
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Rol { get; set; } = "estudiante";

        // Nuevos campos agregados:
        public string Rut { get; set; } = string.Empty;
        public string Empresa { get; set; } = string.Empty;
        public string Concesionario { get; set; } = string.Empty;
        public string Tipo { get; set; } = string.Empty;
        public int EmpresaId { get; set; }

        // Relación con cursos
        public List<UserCourse> UserCourses { get; set; } = new();
    }
}