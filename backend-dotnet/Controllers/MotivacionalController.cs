using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class MotivacionalController : ControllerBase
{
    private static readonly (string Frase, string Autor)[] Frases = new[]
    {
        ("El éxito es la suma de pequeños esfuerzos repetidos día tras día.", "Robert Collier"),
        ("Nunca es tarde para aprender algo nuevo.", "Anónimo"),
        ("La motivación te impulsa a comenzar, el hábito te mantiene en marcha.", "Jim Ryun"),
        ("Cree en ti y todo será posible.", "Anónimo"),
        ("El único límite es tu mente.", "Anónimo")
    };

    [HttpGet("frase")]
    public IActionResult GetFrase()
    {
        var random = new Random();
        var seleccion = Frases[random.Next(Frases.Length)];
        return Ok(new { frase = seleccion.Frase, autor = seleccion.Autor });
    }
}