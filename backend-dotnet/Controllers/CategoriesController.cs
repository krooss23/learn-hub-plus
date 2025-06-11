using Microsoft.AspNetCore.Mvc;
using backend_dotnet.Data;
using backend_dotnet.Models;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly AppDbContext _context;
    public CategoriesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public IActionResult GetCategories()
    {
        var categories = _context.Categories.Select(c => c.Nombre).ToList();
        return Ok(categories);
    }

    [HttpPost]
    public async Task<IActionResult> AddCategory([FromBody] string nombre)
    {
        if (string.IsNullOrWhiteSpace(nombre))
            return BadRequest("Nombre requerido");

        if (_context.Categories.Any(c => c.Nombre == nombre))
            return Conflict("La categoría ya existe");

        var categoria = new Category { Nombre = nombre };
        _context.Categories.Add(categoria);
        await _context.SaveChangesAsync();
        return Ok(categoria.Nombre);
    }
}