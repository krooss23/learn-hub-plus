import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeftIcon } from "lucide-react";
import CourseInfoForm from "@/components/courses/CourseInfoForm";
import ModulesManager from "@/components/courses/ModulesManager";
import AssignmentsManager from "@/components/courses/AssignmentsManager";
import StudentsTable from "@/components/courses/StudentsTable";
import { Checkbox } from "@/components/ui/checkbox"; // Asegúrate de tener este componente
import { useRef } from "react";
import { Check, X, MoreVertical } from "lucide-react";

const attendanceStates = {
  PRESENT: "present",
  ABSENT: "absent",
  LATE: "late",
  EARLY_LEAVE: "early_leave",
};

const ManageCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Inicialización segura: category: undefined
  const [course, setCourse] = useState<any>({
    title: "",
    description: "",
    category: undefined,
    instructor: "",
    startDate: "",
    endDate: "",
    schedule: "",
    coverImage: "",
    objectives: [],
    modules: [],
    assignments: [],
  });
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<{ [studentId: number]: string }>({});
  const [selected, setSelected] = useState<number[]>([]);
  const [menuOpen, setMenuOpen] = useState<number | null>(null);

  useEffect(() => {
    setTimeout(() => {
      const mockCourse = {
        id,
        title: "Matemáticas Avanzadas",
        instructor: "Carlos Mendoza",
        coverImage: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        category: "Matemáticas", // o "" si viene vacío
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
        modules: [],
        assignments: [],
        students: [],
      };

      // Nunca permitir ""
      setCourse({
        ...mockCourse,
        category: mockCourse.category && mockCourse.category !== "" ? mockCourse.category : undefined,
      });
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

  const handleAttendance = (studentId: number, state: string) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: state,
    }));
  };

  const handleSelect = (studentId: number) => {
    setSelected((prev) =>
      prev.includes(studentId) ? prev.filter((id) => id !== studentId) : [...prev, studentId]
    );
  };

  const presentCount = Object.values(attendance).filter((v) => v === attendanceStates.PRESENT).length;
  const absentCount = Object.values(attendance).filter((v) => v === attendanceStates.ABSENT).length;
  const waitingCount = students.length - presentCount - absentCount;
  const total = students.length;

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

      <Tabs defaultValue="info" className="w-full">
        <TabsList>
          <TabsTrigger value="info">Información básica</TabsTrigger>
          <TabsTrigger value="content">Contenido</TabsTrigger>
          <TabsTrigger value="assignments">Tareas</TabsTrigger>
          <TabsTrigger value="students">Estudiantes</TabsTrigger>
          <TabsTrigger value="attendance">Asistencia</TabsTrigger> {/* Nueva pestaña */}
        </TabsList>

        <TabsContent value="info">
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

        <TabsContent value="attendance">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="outline" size="sm">
              Pasar Presente ({selected.length})
            </Button>
            <div className="flex gap-2">
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                {presentCount} Presentes
              </span>
              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                {waitingCount} En espera
              </span>
              <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">
                {absentCount} Ausentes
              </span>
              <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded text-xs">
                {total} Asistencia total
              </span>
            </div>
          </div>
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="px-2 py-2 border">
                  <input
                    type="checkbox"
                    checked={selected.length === students.length}
                    onChange={() =>
                      setSelected(selected.length === students.length ? [] : students.map((s) => s.id))
                    }
                  />
                </th>
                <th className="px-4 py-2 border">NOMBRE</th>
                <th className="px-4 py-2 border">ESTADO</th>
                <th className="px-4 py-2 border">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td className="px-2 py-2 border text-center">
                    <input
                      type="checkbox"
                      checked={selected.includes(student.id)}
                      onChange={() => handleSelect(student.id)}
                    />
                  </td>
                  <td className="px-4 py-2 border">
                    <div className="font-semibold">{student.nombre}</div>
                    <div className="text-xs text-gray-500">
                      Presente el Lun 30 Oct 2023 10:23
                    </div>
                  </td>
                  <td className="px-4 py-2 border text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        className={`p-1 rounded ${attendance[student.id] === attendanceStates.PRESENT ? "bg-green-200" : "bg-gray-100"}`}
                        onClick={() => handleAttendance(student.id, attendanceStates.PRESENT)}
                      >
                        <Check className="w-4 h-4 text-green-700" />
                      </button>
                      <button
                        className={`p-1 rounded ${attendance[student.id] === attendanceStates.ABSENT ? "bg-red-200" : "bg-gray-100"}`}
                        onClick={() => handleAttendance(student.id, attendanceStates.ABSENT)}
                      >
                        <X className="w-4 h-4 text-red-700" />
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-2 border text-center relative">
                    <button
                      className="p-1 rounded hover:bg-gray-200"
                      onClick={() => setMenuOpen(menuOpen === student.id ? null : student.id)}
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    {menuOpen === student.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-10">
                        <button
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                          onClick={() => {
                            // Excluir
                            setMenuOpen(null);
                          }}
                        >
                          Excluir
                        </button>
                        <button
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                          onClick={() => {
                            handleAttendance(student.id, attendanceStates.ABSENT);
                            setMenuOpen(null);
                          }}
                        >
                          Pasar ausente
                        </button>
                        <button
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                          onClick={() => {
                            handleAttendance(student.id, attendanceStates.LATE);
                            setMenuOpen(null);
                          }}
                        >
                          Retraso
                        </button>
                        <button
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                          onClick={() => {
                            handleAttendance(student.id, attendanceStates.EARLY_LEAVE);
                            setMenuOpen(null);
                          }}
                        >
                          Salida anticipada
                        </button>
                        <button
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                          onClick={() => {
                            // Escribir comentario
                            setMenuOpen(null);
                          }}
                        >
                          Escribir un comentario
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Button
            className="mt-4"
            onClick={() => {
              toast({
                title: "Asistencia guardada",
                description: "La asistencia ha sido registrada correctamente.",
              });
            }}
          >
            Guardar asistencia
          </Button>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default ManageCourse;
