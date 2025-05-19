
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { PenIcon, Trash2Icon } from "lucide-react";
import StatusBadge from "./StatusBadge";

interface CourseListItemProps {
  course: {
    id: string;
    title: string;
    instructor: string;
    coverImage: string;
    category: string;
    students?: number;
    startDate?: string;
    schedule?: string;
    pais?: string;
    region?: string;
    ciudad?: string;
    concesionario?: string;
    empresa?: string;
    tipo?: string;
    status?: string;
  };
  onDelete: (id: string) => void;
}

const CourseListItem = ({ course, onDelete }: CourseListItemProps) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-48 h-40 relative">
            <img 
              src={course.coverImage} 
              alt={course.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 right-2">
              <StatusBadge status={course.status || "inactive"} />
            </div>
          </div>
          <div className="p-6 flex-1">
            <div className="flex flex-col md:flex-row justify-between mb-2">
              <div>
                <h3 className="text-lg font-bold">{course.title}</h3>
                <p className="text-sm text-muted-foreground">Instructor: {course.instructor}</p>
              </div>
              <div className="flex gap-2 mt-4 md:mt-0">
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/course/${course.id}`}>
                    Ver
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/course/${course.id}/manage`}>
                    <PenIcon className="h-4 w-4 mr-1" />
                    Editar
                  </Link>
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onDelete(course.id)}
                >
                  <Trash2Icon className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Categoría</p>
                <p className="text-sm">{course.category}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Estudiantes</p>
                <p className="text-sm">{course.students || 0}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Inicio</p>
                <p className="text-sm">{course.startDate || 'No definido'}</p>
              </div>
            </div>
            
            <div className="mt-4 flex flex-wrap gap-2">
              {course.pais && <Badge variant="secondary">{course.pais}</Badge>}
              {course.tipo && <Badge variant="outline" className="capitalize">{course.tipo}</Badge>}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseListItem;
