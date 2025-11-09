import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function ReceptionistLogin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState({ email: "", password: "" });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const allReceptionists = await base44.entities.Receptionist.list();
      
      const receptionist = allReceptionists.find(r => r.email === credentials.email);

      if (!receptionist) {
        toast.error("Email not found");
        setLoading(false);
        return;
      }
      
      if (receptionist.password !== credentials.password) {
        toast.error("Invalid password");
        setLoading(false);
        return;
      }

      localStorage.setItem("receptionist_session", JSON.stringify(receptionist));
      navigate(createPageUrl("ReceptionistDashboard") + `?id=${receptionist.id}`);
    } catch (error) {
      toast.error("Login failed. Please try again.");
      console.error(error);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F9F7F3] flex items-center justify-center py-16">
      <div className="max-w-md w-full px-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)} 
          className="mb-12 hover:bg-white text-[#0C0C0C] -ml-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          BACK
        </Button>

        <div className="bg-white border border-[#E5E5E5]">
          <div className="text-center p-12 border-b border-[#E5E5E5]">
            <div className="w-16 h-16 bg-[#0C0C0C] flex items-center justify-center mx-auto mb-6">
              <ClipboardList className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-black text-[#0C0C0C] uppercase tracking-tight mb-2">
              Receptionist Login
            </h1>
            <p className="text-sm text-[#4A4A4A]">
              Manage appointments and hospital operations
            </p>
          </div>
          <div className="p-8">
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <Label htmlFor="email" className="text-xs font-bold text-[#0C0C0C] uppercase tracking-wider mb-2 block">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={credentials.email}
                  onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                  placeholder="receptionist@hospital.com"
                  className="border-[#E5E5E5] focus:border-[#0C0C0C] h-12"
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-xs font-bold text-[#0C0C0C] uppercase tracking-wider mb-2 block">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={credentials.password}
                  onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                  placeholder="Enter your password"
                  className="border-[#E5E5E5] focus:border-[#0C0C0C] h-12"
                />
              </div>

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full bg-[#0C0C0C] hover:bg-[#1E1E1E] text-white rounded-full h-12 text-xs font-bold uppercase tracking-wider transition-colors"
              >
                {loading ? "LOGGING IN..." : "LOGIN"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}