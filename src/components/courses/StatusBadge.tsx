
import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: string;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  if (status === "active") {
    return <Badge className="bg-green-500">Activo</Badge>;
  } else if (status === "draft") {
    return <Badge variant="secondary">Borrador</Badge>;
  } else {
    return <Badge variant="outline">Inactivo</Badge>;
  }
};

export default StatusBadge;
