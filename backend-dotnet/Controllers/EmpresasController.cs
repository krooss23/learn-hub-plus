using backend_dotnet.Data;
using backend_dotnet.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IO;

namespace backend_dotnet.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmpresasController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _env; // Agrega este campo

        public EmpresasController(AppDbContext context, IWebHostEnvironment env) // Modifica el constructor
        {
            _context = context;
            _env = env;
        }

        [HttpGet]
        public async Task<IActionResult> GetEmpresas()
        {
            var empresas = await _context.Empresas.ToListAsync();
            return Ok(empresas);
        }

        [HttpPost]
        public async Task<IActionResult> CrearEmpresa([FromForm] EmpresaCreateDto dto)
        {
            string? logotipoUrl = null;

            if (dto.Logotipo != null)
            {
                var uploadsFolder = Path.Combine(_env.WebRootPath, "uploads"); // Usa _env
                if (!Directory.Exists(uploadsFolder))
                    Directory.CreateDirectory(uploadsFolder);

                var extension = Path.GetExtension(dto.Logotipo.FileName); // .jpg, .png, etc.
                var fileName = $"{Guid.NewGuid()}{extension}";
                var filePath = Path.Combine(uploadsFolder, fileName);

                using (var stream = System.IO.File.Create(filePath))
                {
                    await dto.Logotipo.CopyToAsync(stream);
                }

                logotipoUrl = $"/uploads/{fileName}";
            }

            var empresa = new Empresa
            {
                Nombre = dto.Nombre,
                Pais = dto.Pais,
                Region = dto.Region,
                Zona = dto.Zona,
                TextoBienvenida = dto.TextoBienvenida,
                LogotipoUrl = logotipoUrl,
                Activo = dto.Activo
                // ...otros campos...
            };

            // Guarda la empresa en la base de datos
            _context.Empresas.Add(empresa);
            await _context.SaveChangesAsync();

            return Ok(empresa);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEmpresa(int id, [FromForm] EmpresaCreateDto dto)
        {
            var empresaDb = await _context.Empresas.FindAsync(id);
            if (empresaDb == null)
                return NotFound();

            empresaDb.Nombre = dto.Nombre;
            empresaDb.Pais = dto.Pais;
            empresaDb.Region = dto.Region;
            empresaDb.Zona = dto.Zona;
            empresaDb.TextoBienvenida = dto.TextoBienvenida;
            empresaDb.Activo = dto.Activo;

            // Si hay nuevo logotipo, elimina el anterior y guarda el nuevo
            if (dto.Logotipo != null)
            {
                // Elimina el archivo anterior si existe
                if (!string.IsNullOrEmpty(empresaDb.LogotipoUrl))
                {
                    // Quita la barra inicial y usa Path.Combine para asegurar la ruta correcta
                    var relativePath = empresaDb.LogotipoUrl.StartsWith("/")
                        ? empresaDb.LogotipoUrl.Substring(1)
                        : empresaDb.LogotipoUrl;

                    var oldLogoPath = Path.Combine(_env.WebRootPath, relativePath.Replace("/", Path.DirectorySeparatorChar.ToString()));

                    Console.WriteLine($"Intentando borrar: {oldLogoPath} - Existe: {System.IO.File.Exists(oldLogoPath)}");

                    if (System.IO.File.Exists(oldLogoPath))
                    {
                        System.IO.File.Delete(oldLogoPath);
                    }
                }

                var uploadsFolder = Path.Combine(_env.WebRootPath, "uploads");
                if (!Directory.Exists(uploadsFolder))
                    Directory.CreateDirectory(uploadsFolder);

                var extension = Path.GetExtension(dto.Logotipo.FileName);
                var fileName = $"{Guid.NewGuid()}{extension}";
                var filePath = Path.Combine(uploadsFolder, fileName);

                using (var stream = System.IO.File.Create(filePath))
                {
                    await dto.Logotipo.CopyToAsync(stream);
                }

                empresaDb.LogotipoUrl = $"/uploads/{fileName}";
            }

            await _context.SaveChangesAsync();
            return Ok(empresaDb);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetEmpresa(int id)
        {
            var empresa = await _context.Empresas.FindAsync(id);
            if (empresa == null)
                return NotFound();
            return Ok(empresa);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEmpresa(int id)
        {
            var empresa = await _context.Empresas.FindAsync(id);
            if (empresa == null)
                return NotFound();

            _context.Empresas.Remove(empresa);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // Obtener usuarios de la empresa
        [HttpGet("{empresaId}/usuarios")]
        public async Task<IActionResult> GetUsuariosDeEmpresa(int empresaId)
        {
            var usuarios = await _context.Users
                .Where(u => u.EmpresaId == empresaId)
                .ToListAsync();
            return Ok(usuarios);
        }

        // Obtener cursos de la empresa
        [HttpGet("{empresaId}/cursos")]
        public async Task<IActionResult> GetCursosDeEmpresa(int empresaId)
        {
            var cursos = await _context.Courses
                .Where(c => c.EmpresaId == empresaId)
                .ToListAsync();
            return Ok(cursos);
        }

        // Obtener profesores de la empresa (usuarios con rol "profesor")
        [HttpGet("{empresaId}/profesores")]
        public async Task<IActionResult> GetProfesoresDeEmpresa(int empresaId)
        {
            var profesores = await _context.Users
                .Where(u => u.EmpresaId == empresaId && u.Rol == "profesor")
                .ToListAsync();
            return Ok(profesores);
        }
    }
}