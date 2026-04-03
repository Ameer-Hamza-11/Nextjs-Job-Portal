"use client";

import { useState } from "react";
import { logoutUserAction } from "@/features/auth/server/auth.actions";
import { isActiveLink } from "@/lib/navigation-utils";
import { cn } from "@/lib/utils";
import { LogOut, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { applicantNavItems } from "@/config/constant";

const ApplicantSidebar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* 🔥 Mobile Toggle */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-card border"
      >
        <Menu />
      </button>

      {/* 🔥 Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* 🔥 Sidebar */}
      <div
        className={cn(
          "w-64 bg-card border-r border-border fixed top-0 bottom-0 z-50 transition-transform duration-300",
          "lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="p-6 flex items-center justify-between">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Applicant Dashboard
          </h2>

          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden"
          >
            <X />
          </button>
        </div>

        {/* Nav */}
        <nav className="px-3 space-y-1">
          {applicantNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActiveLink(pathname, item.href, item.exact);

            return (
              <Link
                key={item.name}
                href={item.href || "#"}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                  active
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-6 left-3 right-3">
          <button
            onClick={logoutUserAction}
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg w-full"
          >
            <LogOut className="h-4 w-4" />
            Log-out
          </button>
        </div>
      </div>
    </>
  );
};

export default ApplicantSidebar;  