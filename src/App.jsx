
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { Phone, Activity, User, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Layout({ children, currentPageName }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await base44.auth.isAuthenticated();
      setIsAuthenticated(authenticated);
      if (authenticated) {
        try {
          const userData = await base44.auth.me();
          setUser(userData);
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      }
    };
    checkAuth();
  }, []);

  const handleEmergencyCall = () => {
    window.location.href = "tel:911";
  };

  const handleLogout = () => {
    // Clear any local storage sessions
    localStorage.removeItem("doctor_session");
    localStorage.removeItem("receptionist_session");
    base44.auth.logout();
  };

  const handleDashboard = () => {
    if (user) {
      navigate(createPageUrl("UserDashboard"));
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F7F3]">
      {/* Header */}
      <header className="bg-[#F9F7F3] border-b border-[#E5E5E5] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 md:py-5">
          <div className="flex justify-between items-center">
            <Link to={createPageUrl("Home")} className="flex items-center gap-2 sm:gap-3 hover:opacity-70 transition-opacity">
              <div className="w-10 h-10 sm:w-12 md:w-14 sm:h-12 md:h-14 bg-[#0C0C0C] flex items-center justify-center">
                <Activity className="w-5 h-5 sm:w-6 md:w-7 sm:h-6 md:h-7 text-white" strokeWidth={2.5} />
              </div>
              <h1 className="text-sm sm:text-base md:text-xl font-black text-[#0C0C0C] tracking-tight uppercase">
                HEALTHFLOW
              </h1>
            </Link>
            
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
              {isAuthenticated && user && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="border-2 border-[#0C0C0C] w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 p-0 hover:bg-[#0C0C0C] hover:text-white transition-colors">
                      <User className="w-4 h-4 sm:w-5 sm:h-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 bg-white border-2 border-[#E5E5E5]">
                    <div className="px-3 py-2 border-b border-[#E5E5E5]">
                      <p className="text-xs font-bold text-[#0C0C0C] uppercase tracking-wider">
                        {user.full_name}
                      </p>
                      <p className="text-xs text-[#4A4A4A] truncate">{user.email}</p>
                    </div>
                    <DropdownMenuItem 
                      onClick={handleDashboard}
                      className="cursor-pointer hover:bg-[#F9F7F3] py-3"
                    >
                      <LayoutDashboard className="w-4 h-4 mr-3" />
                      <span className="text-xs font-semibold uppercase tracking-wide">Dashboard</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={handleLogout}
                      className="cursor-pointer hover:bg-[#F9F7F3] py-3 text-red-600"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      <span className="text-xs font-semibold uppercase tracking-wide">Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              
              <Button
                onClick={handleEmergencyCall}
                className="bg-[#0C0C0C] hover:bg-[#1E1E1E] text-white px-3 sm:px-4 md:px-8 h-9 sm:h-12 md:h-14 text-[9px] sm:text-xs md:text-sm font-bold uppercase tracking-wider transition-colors"
              >
                <Phone className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 md:mr-3" />
                <span className="hidden sm:inline">EMERGENCY</span>
                <span className="sm:hidden">911</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="min-h-[calc(100vh-89px)]">
        {children}
      </main>
    </div>
  );
}
