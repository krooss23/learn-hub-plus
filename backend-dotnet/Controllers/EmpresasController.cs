using backend_dotnet.Data;
using backend_dotnet.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore; // Asegúrate de tener esto

namespace backend_dotnet.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmpresasController : ControllerBase
    {
        private readonly AppDbContext _context;

        public EmpresasController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var empresas = await _context.Empresas.ToListAsync();
            return Ok(empresas);
        }

        [HttpPost]
        public async Task<IActionResult> CreateEmpresa([FromBody] Empresa empresa)
        {
            _context.Empresas.Add(empresa);
            await _context.SaveChangesAsync();
            return Ok(empresa);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEmpresa(int id, [FromBody] Empresa empresa)
        {
            var empresaDb = await _context.Empresas.FindAsync(id);
            if (empresaDb == null)
                return NotFound();

            empresaDb.Nombre = empresa.Nombre;
            empresaDb.Pais = empresa.Pais;
            empresaDb.Region = empresa.Region;
            empresaDb.Zona = empresa.Zona;
            empresaDb.TextoBienvenida = empresa.TextoBienvenida;
            empresaDb.Activo = empresa.Activo;
            // Agrega aquí otros campos si tienes más

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
    }
}