import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PlusIcon, Trash2Icon } from "lucide-react";

interface Props {
  assignments: any[];
  setCourse: (course: any) => void;
  course: any;
  handleAddAssignment: () => void;
  handleDeleteAssignment: (assignmentId: string) => void;
}

const AssignmentsManager = ({
  assignments,
  setCourse,
  course,
  handleAddAssignment,
  handleDeleteAssignment,
}: Props) => (
  <div>
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-semibold">Tareas y evaluaciones</h2>
      <Button onClick={handleAddAssignment}>
        <PlusIcon className="h-4 w-4 mr-2" />
        Añadir tarea
      </Button>
    </div>
    <div className="space-y-4">
      {assignments.map((assignment: any) => (
        <div key={assignment.id} className="border rounded-lg p-4">
          <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
            <div className="flex-1">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor={`title-${assignment.id}`}>Título</Label>
                  <Input
                    id={`title-${assignment.id}`}
                    value={assignment.title}
                    onChange={(e) => {
                      const updatedAssignments = course.assignments.map((a: any) => {
                        if (a.id === assignment.id) {
                          return { ...a, title: e.target.value };
                        }
                        return a;
                      });
                      setCourse({ ...course, assignments: updatedAssignments });
                    }}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`dueDate-${assignment.id}`}>Fecha de entrega</Label>
                    <Input
                      id={`dueDate-${assignment.id}`}
                      type="date"
                      value={assignment.dueDate}
                      onChange={(e) => {
                        const updatedAssignments = course.assignments.map((a: any) => {
                          if (a.id === assignment.id) {
                            return { ...a, dueDate: e.target.value };
                          }
                          return a;
                        });
                        setCourse({ ...course, assignments: updatedAssignments });
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`maxGrade-${assignment.id}`}>Calificación máxima</Label>
                    <Input
                      id={`maxGrade-${assignment.id}`}
                      type="number"
                      value={assignment.maxGrade}
                      onChange={(e) => {
                        const updatedAssignments = course.assignments.map((a: any) => {
                          if (a.id === assignment.id) {
                            return { ...a, maxGrade: parseInt(e.target.value) };
                          }
                          return a;
                        });
                        setCourse({ ...course, assignments: updatedAssignments });
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <Button 
              variant="ghost"
              size="icon"
              className="self-start"
              onClick={() => handleDeleteAssignment(assignment.id)}
            >
              <Trash2Icon className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default AssignmentsManager;