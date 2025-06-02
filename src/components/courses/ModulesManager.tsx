import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GripVertical, PlusIcon, Trash2Icon } from "lucide-react";

interface Props {
  modules: any[];
  setCourse: (course: any) => void;
  course: any;
  handleAddModule: () => void;
  handleAddLesson: (moduleId: string) => void;
  handleDeleteModule: (moduleId: string) => void;
  handleDeleteLesson: (moduleId: string, lessonId: string) => void;
}

const ModulesManager = ({
  modules,
  setCourse,
  course,
  handleAddModule,
  handleAddLesson,
  handleDeleteModule,
  handleDeleteLesson,
}: Props) => (
  <div>
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-semibold">Módulos y lecciones</h2>
      <Button onClick={handleAddModule}>
        <PlusIcon className="h-4 w-4 mr-2" />
        Añadir módulo
      </Button>
    </div>
    <div className="space-y-6">
      {modules.map((module: any) => (
        <div key={module.id} className="border rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <GripVertical className="h-5 w-5 text-gray-400" />
              <Input
                value={module.title}
                onChange={(e) => {
                  const updatedModules = course.modules.map((m: any) => {
                    if (m.id === module.id) {
                      return { ...m, title: e.target.value };
                    }
                    return m;
                  });
                  setCourse({ ...course, modules: updatedModules });
                }}
                className="max-w-md"
              />
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleAddLesson(module.id)}
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Añadir lección
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => handleDeleteModule(module.id)}
              >
                <Trash2Icon className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          </div>
          <div className="space-y-2 pl-7">
            {module.lessons.map((lesson: any) => (
              <div key={lesson.id} className="flex items-center gap-2 border-b pb-2">
                <GripVertical className="h-4 w-4 text-gray-400" />
                <Input
                  value={lesson.title}
                  onChange={(e) => {
                    const updatedModules = course.modules.map((m: any) => {
                      if (m.id === module.id) {
                        const updatedLessons = m.lessons.map((l: any) => {
                          if (l.id === lesson.id) {
                            return { ...l, title: e.target.value };
                          }
                          return l;
                        });
                        return { ...m, lessons: updatedLessons };
                      }
                      return m;
                    });
                    setCourse({ ...course, modules: updatedModules });
                  }}
                  className="flex-1"
                />
                <Select
                  value={lesson.type}
                  onValueChange={(value) => {
                    const updatedModules = course.modules.map((m: any) => {
                      if (m.id === module.id) {
                        const updatedLessons = m.lessons.map((l: any) => {
                          if (l.id === lesson.id) {
                            return { ...l, type: value };
                          }
                          return l;
                        });
                        return { ...m, lessons: updatedLessons };
                      }
                      return m;
                    });
                    setCourse({ ...course, modules: updatedModules });
                  }}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="document">Documento</SelectItem>
                    <SelectItem value="quiz">Cuestionario</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleDeleteLesson(module.id, lesson.id)}
                >
                  <Trash2Icon className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default ModulesManager;