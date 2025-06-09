namespace backend_dotnet.Models
{
    public class EmpresaCreateDto
    {
        public required string Nombre { get; set; }
        public required string Pais { get; set; }
        public string? Region { get; set; }
        public string? Zona { get; set; }
        public required string TextoBienvenida { get; set; }
        public IFormFile? Logotipo { get; set; }
        public IFormFile? ImagenFondoLogin { get; set; }
        public IFormFile? ImagenHeader { get; set; }
        public bool Activo { get; set; } = true;
    }
}