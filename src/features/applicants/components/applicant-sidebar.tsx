"use client";

import { useState, useEffect } from "react";
import { logoutUserAction } from "@/features/auth/server/auth.actions";
import { isActiveLink } from "@/lib/navigation-utils";
import { cn } from "@/lib/utils";
import { 
  LogOut, 
  Menu, 
  X, 
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  FileText,
  Bookmark,
  Settings,
  HelpCircle,
  Award,
  Clock,
  UserCheck
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { applicantNavItems } from "@/config/constant";


const ApplicantSidebar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile && isOpen) {
        setIsOpen(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Load collapsed state from localStorage
    const savedState = localStorage.getItem('sidebar-collapsed');
    if (savedState !== null && !isMobile) {
      setIsCollapsed(JSON.parse(savedState));
    }
    
    return () => window.removeEventListener('resize', checkMobile);
  }, [isOpen, isMobile]);

  const handleLinkClick = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const toggleCollapse = () => {
    if (!isMobile) {
      const newState = !isCollapsed;
      setIsCollapsed(newState);
      localStorage.setItem('sidebar-collapsed', JSON.stringify(newState));
    }
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 rounded-xl bg-white shadow-lg border border-gray-200 hover:bg-gray-50 hover:shadow-xl transition-all duration-300 group"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-all duration-300 animate-in fade-in"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed top-0 bottom-0 z-50 bg-white border-r border-gray-100 shadow-xl transition-all duration-300 ease-in-out",
          !isMobile && isCollapsed ? "w-20" : "w-64",
          isMobile ? (isOpen ? "translate-x-0" : "-translate-x-full") : "translate-x-0"
        )}
      >
        {/* Logo Section */}
        <div className={cn(
          "h-16 flex items-center border-b border-gray-100",
          !isMobile && isCollapsed ? "justify-center px-2" : "px-6"
        )}>
          {(!isCollapsed || isMobile) ? (
            <div className="flex items-center justify-between w-full">
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  JobPortal
                </h1>
                <p className="text-xs text-gray-400">Applicant Dashboard</p>
              </div>
              {!isMobile && (
                <button
                  onClick={toggleCollapse}
                  className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label="Collapse sidebar"
                >
                  <ChevronLeft className="h-4 w-4 text-gray-400" />
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center w-full">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-sm">JP</span>
              </div>
              <button
                onClick={toggleCollapse}
                className="absolute -right-3 p-1 rounded-full bg-white border border-gray-200 shadow-md hover:bg-gray-50 transition-colors"
                aria-label="Expand sidebar"
              >
                <ChevronRight className="h-3 w-3 text-gray-400" />
              </button>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto custom-scrollbar" style={{ maxHeight: 'calc(100vh - 120px)' }}>
          {applicantNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActiveLink(pathname, item.href, item.exact);

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={handleLinkClick}
                className={cn(
                  "group flex items-center gap-3 rounded-xl transition-all duration-200 relative",
                  !isMobile && isCollapsed ? "justify-center px-2 py-3" : "px-3 py-2.5",
                  active
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                )}
                title={!isMobile && isCollapsed ? item.name : ""}
              >
                <Icon className={cn(
                  "h-4 w-4 transition-all duration-200",
                  !isMobile && isCollapsed && "h-5 w-5",
                  active ? "text-white" : "text-gray-400 group-hover:text-gray-600",
                  !isMobile && isCollapsed && "group-hover:scale-110"
                )} />
                
                {(!isCollapsed || isMobile) && (
                  <span className={cn(
                    "text-sm font-medium",
                    active && "text-white"
                  )}>
                    {item.name}
                  </span>
                )}
                
                {active && !isCollapsed && (
                  <div className="absolute right-2 w-1 h-6 bg-white rounded-full" />
                )}
                
                {/* Tooltip for collapsed mode */}
                {!isMobile && isCollapsed && (
                  <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-lg">
                    {item.name}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section - Logout only */}
        <div className={cn(
          "absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 bg-white",
          !isMobile && isCollapsed && "p-3"
        )}>
          {/* Logout Button */}
          <button
            onClick={logoutUserAction}
            className={cn(
              "flex items-center gap-3 text-sm font-medium rounded-xl transition-all duration-200 hover:bg-red-50",
              !isMobile && isCollapsed ? "justify-center px-2 py-3 w-full" : "px-3 py-2.5 w-full",
              "text-red-600 hover:text-red-700"
            )}
            title={!isMobile && isCollapsed ? "Logout" : ""}
          >
            <LogOut className="h-4 w-4" />
            {(!isCollapsed || isMobile) && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        .animate-in {
          animation: fade-in 0.2s ease-in;
        }
      `}</style>
    </>
  );
};

export default ApplicantSidebar;