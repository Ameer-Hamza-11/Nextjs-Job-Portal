"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MoreVertical, Building2 } from "lucide-react";
import Link from "next/link";

type EmployerType = {
  id: string | number;
  name: string;
  industry: string;
  employees: string;
  logo?: string | null;
};

export default function EmployerListPage({
  data,
}: {
  data: EmployerType[];
}) {
  return (
    <div className="w-full">
      {/* ========== TOP BAR: SEARCH + SORT ========== */}
   

      {/* ========== LIST GRID ========== */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {data.map((item) => (
          <Card
            key={item.id}
            className="rounded-2xl shadow-sm hover:shadow-md transition-all border border-border/50"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-semibold">
                {item.name}
              </CardTitle>

              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </CardHeader>

            <CardContent>
              {/* Logo */}
              <div className="w-full flex justify-center mb-4">
                {item.logo ? (
                  <Image
                    src={item.logo}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="object-contain rounded-lg"
                  />
                ) : (
                  <div className="w-[80px] h-[80px] bg-muted rounded-lg flex items-center justify-center">
                    <Building2 className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
              </div>

              <div className="space-y-1 text-sm">
                <p className="text-muted-foreground">
                  Industry:{" "}
                  <span className="text-foreground font-medium">
                    {item.industry}
                  </span>
                </p>

                <p className="text-muted-foreground">
                  Employees:{" "}
                  <span className="text-foreground font-medium">
                    {item.employees}
                  </span>
                </p>
              </div>

              <Button className="w-full mt-4" asChild>
                <Link href={`/employers/${item.id}`}>View Details</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}