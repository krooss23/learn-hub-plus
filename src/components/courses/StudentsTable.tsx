import { Button } from "@/components/ui/button";
import { UsersIcon } from "lucide-react";

interface Props {
  students: any[];
}

const StudentsTable = ({ students }: Props) => (
  <div>
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-semibold">Estudiantes inscritos</h2>
      <Button>
        <UsersIcon className="h-4 w-4 mr-2" />
        Inscribir estudiantes
      </Button>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="py-2 px-4 text-left font-medium">Nombre</th>
            <th className="py-2 px-4 text-left font-medium">Email</th>
            <th className="py-2 px-4 text-left font-medium">Progreso</th>
            <th className="py-2 px-4 text-left font-medium">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student: any) => (
            <tr key={student.id} className="border-b last:border-0">
              <td className="py-2 px-4">{student.name}</td>
              <td className="py-2 px-4">{student.email}</td>
              <td className="py-2 px-4">{student.progress}%</td>
              <td className="py-2 px-4">
                <Button variant="ghost" size="sm">
                  Ver detalles
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default StudentsTable;