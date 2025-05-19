
import CourseListItem from "./CourseListItem";

interface CourseListProps {
  courses: {
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
  }[];
  onDelete: (id: string) => void;
}

const CourseList = ({ courses, onDelete }: CourseListProps) => {
  if (courses.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">No se encontraron cursos con los filtros seleccionados.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {courses.map(course => (
        <CourseListItem 
          key={course.id} 
          course={course} 
          onDelete={onDelete} 
        />
      ))}
    </div>
  );
};

export default CourseList;
