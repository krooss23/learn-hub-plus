import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeftIcon, PlusIcon, Trash2Icon, UsersIcon } from "lucide-react";
import CourseInfoForm from "@/components/courses/CourseInfoForm";
import ModulesManager from "@/components/courses/ModulesManager";
import AssignmentsManager from "@/components/courses/AssignmentsManager";
import StudentsTable from "@/components/courses/StudentsTable";

const ManageCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Mock course data
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<any[]>([]);

  useEffect(() => {
    // Mock API call to fetch course details
    setTimeout(() => {
      const mockCourse = {
        id,
        title: "Matemáticas Avanzadas",
        instructor: "Carlos Mendoza",
        coverImage: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        category: "Matemáticas",
        progress: 75,
        startDate: "10/05/2025",
        endDate: "30/07/2025",
        schedule: "Lun, Mié 15:00-17:00",
        description: "Este curso cubre temas avanzados de matemáticas incluyendo cálculo diferencial e integral, ecuaciones diferenciales y análisis numérico. Está diseñado para estudiantes con conocimientos previos de álgebra y trigonometría.",
        objectives: [
          "Dominar los conceptos fundamentales del cálculo diferencial e integral",
          "Resolver ecuaciones diferenciales aplicadas a problemas reales",
          "Implementar métodos numéricos para la solución aproximada de problemas matemáticos complejos",
          "Aplicar técnicas de optimización matemática en contextos prácticos"
        ],
        modules: [
          {
            id: "m1",
            title: "Introducción al Cálculo Diferencial",
            lessons: [
              { id: "l1", title: "Límites y continuidad", type: "video" },
              { id: "l2", title: "Derivadas: concepto y cálculo", type: "document" },
              { id: "l3", title: "Aplicaciones de la derivada", type: "quiz" }
            ]
          },
          {
            id: "m2",
            title: "Cálculo Integral",
            lessons: [
              { id: "l4", title: "La integral definida", type: "video" },
              { id: "l5", title: "Teorema fundamental del cálculo", type: "video" },
              { id: "l6", title: "Técnicas de integración", type: "document" }
            ]
          },
          {
            id: "m3",
            title: "Ecuaciones Diferenciales",
            lessons: [
              { id: "l7", title: "Ecuaciones diferenciales de primer orden", type: "video" },
              { id: "l8", title: "Ecuaciones diferenciales de segundo orden", type: "document" },
              { id: "l9", title: "Aplicaciones en física e ingeniería", type: "quiz" }
            ]
          }
        ],
        assignments: [
          {
            id: "a1",
            title: "Tarea: Límites y derivadas",
            dueDate: "25/05/2025",
            maxGrade: 100
          },
          {
            id: "a2",
            title: "Ejercicios: Aplicaciones de derivadas",
            dueDate: "10/06/2025",
            maxGrade: 100
          },
          {
            id: "a3",
            title: "Proyecto: Modelado con ecuaciones diferenciales",
            dueDate: "30/06/2025",
            maxGrade: 100
          }
        ],
        students: [
          {
            id: 1,
            name: "Ana Martínez",
            email: "ana.martinez@example.com",
            progress: 80
          },
          {
            id: 2,
            name: "Carlos López",
            email: "carlos.lopez@example.com",
            progress: 65
          },
          {
            id: 3,
            name: "María Rodríguez",
            email: "maria.rodriguez@example.com",
            progress: 90
          },
          {
            id: 4,
            name: "Juan Pérez",
            email: "juan.perez@example.com",
            progress: 75
          }
        ]
      };
      
      setCourse(mockCourse);
      setLoading(false);
    }, 500);
  }, [id]);

  useEffect(() => {
    // Cargar detalles del curso (puedes mantener tu lógica actual)
    // ...

    // Cargar estudiantes asignados al curso
    fetch(`http://localhost:5214/api/courses/${id}/students`)
      .then(res => res.json())
      .then(data => setStudents(data))
      .catch(err => setStudents([]));
  }, [id]);

  const handleSave = () => {
    toast({
      title: "Curso actualizado",
      description: "Los cambios han sido guardados correctamente.",
    });
    navigate("/manage-courses"); // Redirige después de guardar
  };

  const handleAddModule = () => {
    setCourse({
      ...course,
      modules: [
        ...course.modules,
        {
          id: `m${course.modules.length + 1}`,
          title: "Nuevo módulo",
          lessons: []
        }
      ]
    });
  };

  const handleAddLesson = (moduleId: string) => {
    const updatedModules = course.modules.map((module: any) => {
      if (module.id === moduleId) {
        return {
          ...module,
          lessons: [
            ...module.lessons,
            {
              id: `l${Math.random().toString(36).substr(2, 9)}`,
              title: "Nueva lección",
              type: "document"
            }
          ]
        };
      }
      return module;
    });
    
    setCourse({
      ...course,
      modules: updatedModules
    });
  };

  const handleAddAssignment = () => {
    setCourse({
      ...course,
      assignments: [
        ...course.assignments,
        {
          id: `a${course.assignments.length + 1}`,
          title: "Nueva tarea",
          dueDate: "",
          maxGrade: 100
        }
      ]
    });
  };

  const handleDeleteModule = (moduleId: string) => {
    setCourse({
      ...course,
      modules: course.modules.filter((module: any) => module.id !== moduleId)
    });
  };

  const handleDeleteLesson = (moduleId: string, lessonId: string) => {
    const updatedModules = course.modules.map((module: any) => {
      if (module.id === moduleId) {
        return {
          ...module,
          lessons: module.lessons.filter((lesson: any) => lesson.id !== lessonId)
        };
      }
      return module;
    });
    
    setCourse({
      ...course,
      modules: updatedModules
    });
  };

  const handleDeleteAssignment = (assignmentId: string) => {
    setCourse({
      ...course,
      assignments: course.assignments.filter((assignment: any) => assignment.id !== assignmentId)
    });
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-64">
          <p>Cargando curso...</p>
        </div>
      </MainLayout>
    );
  }

  if (!course) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-64">
          <p>Curso no encontrado.</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mb-6">
        <Link to="/manage-courses">
          <Button variant="ghost" size="sm" className="mb-2">
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Volver a cursos
          </Button>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Administrar Curso</h1>
        <div className="space-x-2">
          <Button variant="outline" onClick={() => navigate(`/course/${id}`)}>Cancelar</Button>
          <Button onClick={handleSave}>Guardar cambios</Button>
        </div>
      </div>

      <Tabs defaultValue="basic">
        <TabsList className="mb-6">
          <TabsTrigger value="basic">Información básica</TabsTrigger>
          <TabsTrigger value="content">Contenido</TabsTrigger>
          <TabsTrigger value="assignments">Tareas</TabsTrigger>
          <TabsTrigger value="students">Estudiantes</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <Card>
            <CardContent className="p-6">
              <CourseInfoForm course={course} setCourse={setCourse} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content">
          <Card>
            <CardContent className="p-6">
              <ModulesManager
                modules={course.modules}
                setCourse={setCourse}
                course={course}
                handleAddModule={handleAddModule}
                handleAddLesson={handleAddLesson}
                handleDeleteModule={handleDeleteModule}
                handleDeleteLesson={handleDeleteLesson}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assignments">
          <Card>
            <CardContent className="p-6">
              <AssignmentsManager
                assignments={course.assignments}
                setCourse={setCourse}
                course={course}
                handleAddAssignment={handleAddAssignment}
                handleDeleteAssignment={handleDeleteAssignment}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students">
          <Card>
            <CardContent className="p-6">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-center font-semibold">Nombre</th>
                    <th className="px-4 py-2 text-center font-semibold">Email</th>
                    <th className="px-4 py-2 text-center font-semibold">Empresa</th>
                    <th className="px-4 py-2 text-center font-semibold">Progreso</th>
                    <th className="px-4 py-2 text-center font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map(student => (
                    <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-center">{student.nombre}</td>
                      <td className="px-4 py-2 text-center">{student.email}</td>
                      <td className="px-4 py-2 text-center">{student.empresa}</td>
                      <td className="px-4 py-2 text-center">{student.progreso || "%"}</td>
                      <td className="px-4 py-2 text-center">
                        <button className="text-blue-600 hover:underline">Ver detalles</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default ManageCourse;
