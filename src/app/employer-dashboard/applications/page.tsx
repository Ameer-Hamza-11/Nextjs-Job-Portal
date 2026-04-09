import { getCurrentUser } from "@/features/auth/server/auth.queries";
import { redirect } from "next/navigation";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import {
  Download,
  FileText,
  UserCircle,
  Briefcase,
  Trash2,
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { getEmployerApplications } from "@/features/server/employers.queries";
import { deleteApplicationAction } from "@/features/server/employer.action";
import { toast } from "sonner";
import RecentApplications from "@/features/employers/components/recent-applications";

export default async function EmployerApplicationsPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "employer") return redirect("/login");

  const applications = await getEmployerApplications(user.id);

  

  return (
   <RecentApplications applications={applications}/>
  );
}
