using backend_dotnet.Models;
using Microsoft.AspNetCore.Mvc;

namespace backend_dotnet.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmpresasController : ControllerBase
    {
        private static List<Empresa> empresas = new();

        [HttpGet]
        public IActionResult Get() => Ok(empresas);

        [HttpPost]
        public IActionResult Post([FromForm] Empresa empresa)
        {
            empresa.Id = empresas.Count + 1;
            empresas.Add(empresa);
            return Ok(empresa);
        }
    }
}