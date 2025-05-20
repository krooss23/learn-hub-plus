namespace backend_dotnet.Models
{
    public class Course
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string Descripcion { get; set; } = string.Empty;
        public string Categoria { get; set; } = string.Empty;
        public DateTime? FechaInicio { get; set; }
        public string Horario { get; set; } = string.Empty;
        public string? ImagenUrl { get; set; } // Para guardar la URL de la imagen si la implementas después
        public string Profesor { get; set; } = string.Empty;
    }
}