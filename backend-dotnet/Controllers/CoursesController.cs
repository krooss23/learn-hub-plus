// filepath: c:\Users\deyso\OneDrive\Escritorio\INC\inc produ\learn-hub-plus\backend-dotnet\Controllers\CoursesController.cs
using Microsoft.AspNetCore.Mvc;
using backend_dotnet.Data;
using backend_dotnet.Models;
using Microsoft.EntityFrameworkCore; // Agregado para usar Include()

namespace backend_dotnet.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CoursesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CoursesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetAllCourses()
        {
            var courses = _context.Courses.ToList();
            return Ok(courses);
        }

        [HttpPost]
        public IActionResult CreateCourse(Course course)
        {
            _context.Courses.Add(course);
            _context.SaveChanges();
            return Ok(course);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateCourse(int id, Course updatedCourse)
        {
            var course = _context.Courses.Find(id);
            if (course == null) return NotFound();

            course.Nombre = updatedCourse.Nombre;
            course.Descripcion = updatedCourse.Descripcion;
            _context.SaveChanges();

            return Ok(course);
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteCourse(int id)
        {
            var course = _context.Courses.Find(id);
            if (course == null) return NotFound();

            _context.Courses.Remove(course);
            _context.SaveChanges();

            return NoContent();
        }

        [HttpGet("{courseId}/students")]
        public IActionResult GetStudentsByCourse(int courseId)
        {
            var students = _context.UserCourses
                .Where(uc => uc.CourseId == courseId && uc.User != null)
                .Include(uc => uc.User)
                .Select(uc => new {
                    Id = uc.User!.Id,
                    Nombre = uc.User!.Nombre,
                    Email = uc.User!.Email,
                    Empresa = uc.User!.Empresa ?? "",
                    Progreso = "" // o elimina esta línea si no la necesitas
                })
                .ToList();

            return Ok(students);
        }

        [HttpGet("categories")]
        public IActionResult GetCategories()
        {
            var categories = _context.Courses
                .Select(c => c.Categoria)
                .Distinct()
                .ToList();
            return Ok(categories);
        }
    }
}