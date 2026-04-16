"use client";

import { useState } from "react";
import { logoutUserAction } from "@/features/auth/server/auth.actions";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  User,
  Plus,
  Briefcase,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const base = "/employer-dashboard";

const navigationItems = [
  { name: "Overview", icon: LayoutDashboard, href: base + "/" },
  { name: "Applications", icon: User, href: base + "/applications" },
  { name: "Post a Job", icon: Plus, href: base + "/jobs/create" },
  { name: "My Jobs", icon: Briefcase, href: base + "/jobs" },
  { name: "Settings", icon: Settings, href: base + "/settings" },
];

const EmployerSidebar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  function isLinkActive({
    href,
    pathname,
  }: {
    href: string;
    pathname: string;
  }) {
    const normalizedHref = href.replace(/\/$/, "") || "/";

    if (pathname === normalizedHref) return true;
    return pathname.startsWith(normalizedHref + "/");
  }

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-card border"
      >
        <Menu />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
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
            Employers Dashboard
          </h2>

          <button onClick={() => setIsOpen(false)} className="lg:hidden">
            <X />
          </button>
        </div>

        {/* Nav */}
        <nav className="px-3 space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                  isLinkActive({ href: item.href, pathname }) &&
                    "text-primary bg-accent"
                )}
              >
                <Icon />
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

export default EmployerSidebar;