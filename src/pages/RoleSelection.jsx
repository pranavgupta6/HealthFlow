import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { UserCog, Stethoscope, ClipboardList, ArrowLeft, ArrowRight } from "lucide-react";

export default function RoleSelection() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F9F7F3] py-16">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)} 
          className="mb-12 hover:bg-white text-[#0C0C0C] -ml-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          BACK
        </Button>

        <div className="mb-16">
          <p className="text-xs font-bold text-[#4A4A4A] uppercase tracking-[0.15em] mb-3">ACCESS</p>
          <h1 className="text-5xl md:text-6xl font-black text-[#0C0C0C] mb-4 tracking-[-0.02em] uppercase">
            Select Your Role
          </h1>
          <p className="text-lg text-[#4A4A4A]">
            Choose how you'd like to access the platform
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-px bg-[#E5E5E5]">
          {/* Admin Card */}
          <Link to={createPageUrl("AdminPanel")}>
            <div className="group cursor-pointer bg-white p-8 h-full hover:bg-[#0C0C0C] transition-all duration-300">
              <div className="w-12 h-12 border border-[#E5E5E5] group-hover:border-white flex items-center justify-center mb-6 transition-colors">
                <UserCog className="w-6 h-6 text-[#0C0C0C] group-hover:text-white transition-colors" />
              </div>
              <h2 className="text-xl font-black text-[#0C0C0C] group-hover:text-white uppercase mb-4 tracking-tight transition-colors">
                Admin
              </h2>
              <p className="text-sm text-[#4A4A4A] group-hover:text-gray-300 mb-6 leading-relaxed transition-colors">
                Register your hospital, manage doctors and receptionists, and oversee all operations
              </p>
              <div className="flex items-center text-xs font-bold text-[#0C0C0C] group-hover:text-white uppercase tracking-wider transition-colors">
                GET STARTED
                <ArrowRight className="w-3.5 h-3.5 ml-2" />
              </div>
            </div>
          </Link>

          {/* Doctor Card */}
          <Link to={createPageUrl("DoctorLogin")}>
            <div className="group cursor-pointer bg-white p-8 h-full hover:bg-[#0C0C0C] transition-all duration-300">
              <div className="w-12 h-12 border border-[#E5E5E5] group-hover:border-white flex items-center justify-center mb-6 transition-colors">
                <Stethoscope className="w-6 h-6 text-[#0C0C0C] group-hover:text-white transition-colors" />
              </div>
              <h2 className="text-xl font-black text-[#0C0C0C] group-hover:text-white uppercase mb-4 tracking-tight transition-colors">
                Doctor
              </h2>
              <p className="text-sm text-[#4A4A4A] group-hover:text-gray-300 mb-6 leading-relaxed transition-colors">
                Manage your profile, view appointments, and track your patient schedule efficiently
              </p>
              <div className="flex items-center text-xs font-bold text-[#0C0C0C] group-hover:text-white uppercase tracking-wider transition-colors">
                LOGIN
                <ArrowRight className="w-3.5 h-3.5 ml-2" />
              </div>
            </div>
          </Link>

          {/* Receptionist Card */}
          <Link to={createPageUrl("ReceptionistLogin")}>
            <div className="group cursor-pointer bg-white p-8 h-full hover:bg-[#0C0C0C] transition-all duration-300">
              <div className="w-12 h-12 border border-[#E5E5E5] group-hover:border-white flex items-center justify-center mb-6 transition-colors">
                <ClipboardList className="w-6 h-6 text-[#0C0C0C] group-hover:text-white transition-colors" />
              </div>
              <h2 className="text-xl font-black text-[#0C0C0C] group-hover:text-white uppercase mb-4 tracking-tight transition-colors">
                Receptionist
              </h2>
              <p className="text-sm text-[#4A4A4A] group-hover:text-gray-300 mb-6 leading-relaxed transition-colors">
                Handle appointments, manage patient tokens, and coordinate hospital operations
              </p>
              <div className="flex items-center text-xs font-bold text-[#0C0C0C] group-hover:text-white uppercase tracking-wider transition-colors">
                LOGIN
                <ArrowRight className="w-3.5 h-3.5 ml-2" />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}