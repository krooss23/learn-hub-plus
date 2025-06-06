namespace backend_dotnet.Models
{
    public class Empresa
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string Pais { get; set; } = string.Empty;
        public string? Region { get; set; }    // <-- Agrega esto
        public string? Zona { get; set; }      // <-- Y esto
        public string TextoBienvenida { get; set; } = string.Empty;
        public string? LogotipoUrl { get; set; }
        public string? ImagenFondoLoginUrl { get; set; }
        public string? ImagenHeaderUrl { get; set; }
        public bool Activo { get; set; } = true;
    }
}