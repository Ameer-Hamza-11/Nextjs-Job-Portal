import { Card, CardContent } from "@/components/ui/card";
import { getAllCounts } from "@/features/server/employer.action";
import { Briefcase, Users } from "lucide-react";

export async function StatsCards() {
    const res = await getAllCounts()
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-6">
      <Card className="bg-blue-50 border-blue-100">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-foreground">{res.data?.totalEmployerJobs ?? 0}</p>
              <p className="text-sm text-muted-foreground">Your Total Jobs</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Briefcase className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-orange-50 border-orange-100">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-foreground">{res.data?.totalApplications ??  0}</p>
              <p className="text-sm text-muted-foreground">Applicatiions</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <Users className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
