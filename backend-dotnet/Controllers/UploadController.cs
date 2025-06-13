using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class UploadController : ControllerBase
{
    private readonly IWebHostEnvironment _env;

    public UploadController(IWebHostEnvironment env)
    {
        _env = env;
    }

    [HttpPost]
    public async Task<IActionResult> Upload([FromForm] IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest(new { error = "No file uploaded" });

        var uploads = Path.Combine(_env.WebRootPath ?? Path.Combine(_env.ContentRootPath, "wwwroot"), "uploads");
        if (!Directory.Exists(uploads))
            Directory.CreateDirectory(uploads);

        var fileName = Guid.NewGuid() + Path.GetExtension(file.FileName);
        var filePath = Path.Combine(uploads, fileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        var url = $"{Request.Scheme}://{Request.Host}/uploads/{fileName}";
        return Ok(new { url });
    }

    [HttpGet]
    public IActionResult GetImages()
    {
        var uploads = Path.Combine(_env.WebRootPath ?? Path.Combine(_env.ContentRootPath, "wwwroot"), "uploads");
        if (!Directory.Exists(uploads))
            return Ok(new List<string>());

        var files = Directory.GetFiles(uploads)
            .Select(f => $"{Request.Scheme}://{Request.Host}/uploads/{Path.GetFileName(f)}")
            .ToList();

        return Ok(files);
    }

    [HttpDelete]
    public IActionResult DeleteImage([FromBody] DeleteImageRequest request)
    {
        if (string.IsNullOrEmpty(request.Url))
            return BadRequest(new { error = "No URL provided" });

        // Extrae el nombre del archivo de la URL
        var fileName = Path.GetFileName(new Uri(request.Url).LocalPath);
        var uploads = Path.Combine(_env.WebRootPath ?? Path.Combine(_env.ContentRootPath, "wwwroot"), "uploads");
        var filePath = Path.Combine(uploads, fileName);

        if (!System.IO.File.Exists(filePath))
            return NotFound(new { error = "File not found" });

        System.IO.File.Delete(filePath);
        return Ok(new { message = "Image deleted" });
    }

    // Clase para recibir el body del DELETE
    public class DeleteImageRequest
    {
        public string? Url { get; set; }
    }
}