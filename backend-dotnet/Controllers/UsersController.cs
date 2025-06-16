using Microsoft.AspNetCore.Mvc;
using backend_dotnet.Data;
using backend_dotnet.Models;
using BCrypt.Net;
using Microsoft.EntityFrameworkCore;

namespace backend_dotnet.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsersController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetAllUsers()
        {
            var users = _context.Users.ToList();
            return Ok(users);
        }

        [HttpPost]
        public IActionResult CreateUser(User user)
        {
            // Validación de email duplicado (opcional)
            if (_context.Users.Any(u => u.Email == user.Email))
                return BadRequest(new { message = "El email ya está registrado" });

            // Cifrado de contraseña
            user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);

            _context.Users.Add(user);
            _context.SaveChanges();
            return Ok(user);
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            var user = _context.Users.FirstOrDefault(u => u.Email == request.Email && u.EmpresaId == request.EmpresaId);

            // Verifica el usuario y la contraseña cifrada
            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.Password))
            {
                return Unauthorized(new { message = "Credenciales incorrectas" });
            }

            return Ok(new { user.Id, user.Nombre, user.Email, user.Rol, user.EmpresaId });
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteUser(int id)
        {
            var user = _context.Users.FirstOrDefault(u => u.Id == id);
            if (user == null)
            {
                return NotFound(new { message = "Usuario no encontrado" });
            }

            _context.Users.Remove(user);
            _context.SaveChanges();
            return Ok(new { message = "Usuario eliminado correctamente" });
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }

        [HttpPut("{id}")]
        public IActionResult UpdateUser(int id, [FromBody] User updatedUser)
        {
            var user = _context.Users.FirstOrDefault(u => u.Id == id);
            if (user == null)
            {
                return NotFound(new { message = "Usuario no encontrado" });
            }

            // Actualiza los campos necesarios
            user.Nombre = updatedUser.Nombre;
            user.Apellidos = updatedUser.Apellidos;
            user.SenceNet = updatedUser.SenceNet;
            user.Pais = updatedUser.Pais;
            user.Estado = updatedUser.Estado;
            user.Email = updatedUser.Email;
            user.Rol = updatedUser.Rol;
            // No actualices la contraseña aquí, a menos que lo requieras

            _context.SaveChanges();
            return Ok(user);
        }

        [HttpPost("{userId}/courses")]
        public async Task<IActionResult> AssignCourses(int userId, [FromBody] List<int> courseIds)
        {
            var user = await _context.Users
                .Include(u => u.UserCourses)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null) return NotFound();

            // Elimina asignaciones previas que no estén en la nueva lista
            user.UserCourses.RemoveAll(uc => !courseIds.Contains(uc.CourseId));

            // Agrega los nuevos cursos
            foreach (var courseId in courseIds)
            {
                if (!user.UserCourses.Any(uc => uc.CourseId == courseId))
                {
                    user.UserCourses.Add(new UserCourse { UserId = userId, CourseId = courseId });
                }
            }

            await _context.SaveChangesAsync();
            return Ok();
        }
    }

    public class LoginRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public int EmpresaId { get; set; } 
    }
}