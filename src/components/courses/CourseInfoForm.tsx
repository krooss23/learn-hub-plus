import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusIcon, Trash2Icon } from "lucide-react";

interface Props {
  course: any;
  setCourse: (course: any) => void;
}

const CourseInfoForm = ({ course, setCourse }: Props) => (
  <div className="grid grid-cols-1 gap-6">
    <div className="space-y-2">
      <Label htmlFor="title">Título del curso</Label>
      <Input
        id="title"
        value={course.title}
        onChange={(e) => setCourse({ ...course, title: e.target.value })}
        required
      />
    </div>
    <div className="space-y-2">
      <Label htmlFor="description">Descripción</Label>
      <Textarea
        id="description"
        value={course.description}
        onChange={(e) => setCourse({ ...course, description: e.target.value })}
        rows={4}
      />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="category">Categoría</Label>
        <Select
          value={course.category}
          onValueChange={(value) => setCourse({ ...course, category: value })}
        >
          <SelectTrigger id="category">
            <SelectValue placeholder="Selecciona una categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Matemáticas">Matemáticas</SelectItem>
            <SelectItem value="Ciencias">Ciencias</SelectItem>
            <SelectItem value="Historia">Historia</SelectItem>
            <SelectItem value="Literatura">Literatura</SelectItem>
            <SelectItem value="Tecnología">Tecnología</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="instructor">Instructor</Label>
        <Input
          id="instructor"
          value={course.instructor}
          onChange={(e) => setCourse({ ...course, instructor: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="startDate">Fecha de inicio</Label>
        <Input
          id="startDate"
          type="date"
          value={course.startDate}
          onChange={(e) => setCourse({ ...course, startDate: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="endDate">Fecha de fin</Label>
        <Input
          id="endDate"
          type="date"
          value={course.endDate}
          onChange={(e) => setCourse({ ...course, endDate: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="schedule">Horario</Label>
        <Input
          id="schedule"
          value={course.schedule}
          onChange={(e) => setCourse({ ...course, schedule: e.target.value })}
          placeholder="Ej: Lun, Mié 15:00-17:00"
        />
      </div>
    </div>
    <div>
      <Label htmlFor="coverImage">Imagen de portada</Label>
      <div className="mt-2 flex flex-col gap-4">
        <img
          src={course.coverImage}
          alt={course.title}
          className="h-40 w-full object-cover rounded-md"
        />
        <Input
          id="coverImage"
          type="file"
          accept="image/*"
        />
      </div>
    </div>
    <div className="space-y-2">
      <Label>Objetivos del curso</Label>
      <div className="space-y-2">
        {course.objectives.map((objective: string, index: number) => (
          <div key={index} className="flex gap-2">
            <Input
              value={objective}
              onChange={(e) => {
                const newObjectives = [...course.objectives];
                newObjectives[index] = e.target.value;
                setCourse({ ...course, objectives: newObjectives });
              }}
              className="flex-1"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                const newObjectives = course.objectives.filter((_: string, i: number) => i !== index);
                setCourse({ ...course, objectives: newObjectives });
              }}
            >
              <Trash2Icon className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setCourse({
              ...course,
              objectives: [...course.objectives, "Nuevo objetivo"]
            });
          }}
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Añadir objetivo
        </Button>
      </div>
    </div>
  </div>
);

export default CourseInfoForm;