
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Users, Building2, Activity, Calendar, MapPin, Shield, ArrowRight } from "lucide-react";
import HospitalCarousel from "../components/HospitalCarousel";

export default function Home() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isPatient, setIsPatient] = useState(false); // New state for patient role

  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await base44.auth.isAuthenticated();
      setIsAuthenticated(authenticated);
      
      if (authenticated) {
        try {
          const userData = await base44.auth.me();
          // Check if user is a patient (not admin) - patients have role 'user'
          setIsPatient(userData.role === 'user');
        } catch (error) {
          console.error("Error fetching user data:", error); // More specific error message
          // If fetching user data fails, assume they are not a patient or handle as needed
          setIsPatient(false); 
        }
      } else {
        // If not authenticated, ensure isPatient is false
        setIsPatient(false);
      }
    };
    checkAuth();
  }, []);

  const handlePatientClick = async () => {
    const authenticated = await base44.auth.isAuthenticated();
    if (authenticated) {
      navigate(createPageUrl("HospitalsList"));
    } else {
      // Redirect to login with the next URL as HospitalsList
      const nextUrl = window.location.origin + createPageUrl("HospitalsList");
      base44.auth.redirectToLogin(nextUrl);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F7F3]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#F9F7F3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 md:pt-20 pb-20 sm:pb-28 md:pb-32">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 sm:gap-3 border border-[#0C0C0C] px-3 sm:px-4 py-1 sm:py-2 mb-6 sm:mb-8 md:mb-12 bg-white">
              <Activity className="w-3 sm:w-4 h-3 sm:h-4 text-[#0C0C0C]" strokeWidth={2.5} />
              <span className="text-[9px] sm:text-xs font-semibold text-[#0C0C0C] uppercase tracking-[0.12em]">
                HEALTHCARE INFRASTRUCTURE
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[110px] font-black text-[#0C0C0C] mb-4 sm:mb-6 md:mb-10 leading-[0.9] tracking-[-0.02em] uppercase">
              HEALTHCARE<br />MANAGEMENT<br />SIMPLIFIED
            </h1>
            
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-[#6B6B6B] mb-6 sm:mb-8 md:mb-12 max-w-2xl leading-relaxed font-light">
              A unified platform connecting patients, hospitals, and healthcare professionals. Modern infrastructure for modern healthcare.
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3 md:gap-4">
              <Button 
                onClick={handlePatientClick}
                className="bg-[#0C0C0C] hover:bg-[#1E1E1E] text-white px-4 sm:px-6 md:px-8 h-9 sm:h-12 md:h-14 text-[9px] sm:text-xs md:text-sm font-bold uppercase tracking-wider transition-colors w-full sm:w-auto"
              >
                I AM A PATIENT
                <ArrowRight className="w-3 sm:w-3.5 md:w-4 h-3 sm:h-3.5 md:h-4 ml-1.5 sm:ml-2 md:ml-3" />
              </Button>
              
              {!isPatient && (
                <Link to={createPageUrl("RoleSelection")} className="w-full sm:w-auto">
                  <Button variant="outline" className="border-2 border-[#0C0C0C] text-[#0C0C0C] hover:bg-[#0C0C0C] hover:text-white px-4 sm:px-6 md:px-8 h-9 sm:h-12 md:h-14 text-[9px] sm:text-xs md:text-sm font-bold uppercase tracking-wider transition-all w-full">
                    HOSPITAL AND MANAGEMENT LOGIN
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Hospital Carousel */}
      <HospitalCarousel />

      {/* Features Section */}
      <section className="py-16 sm:py-20 md:py-24 bg-[#F9F7F3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 sm:mb-14 md:mb-16">
            <p className="text-xs font-bold text-[#4A4A4A] uppercase tracking-[0.15em] mb-2 sm:mb-3">FEATURES</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0C0C0C] tracking-[-0.02em] uppercase max-w-2xl">
              COMPLETE HEALTHCARE MANAGEMENT
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#E5E5E5]">
            {/* Feature 1 */}
            <div className="bg-white p-6 sm:p-8 group hover:bg-[#0C0C0C] transition-colors duration-300">
              <div className="w-10 h-10 border border-[#E5E5E5] group-hover:border-white flex items-center justify-center mb-4 sm:mb-6 transition-colors">
                <Calendar className="w-5 h-5 text-[#0C0C0C] group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-sm font-bold text-[#0C0C0C] group-hover:text-white uppercase tracking-wide mb-2 sm:mb-3 transition-colors">
                Instant Booking
              </h3>
              <p className="text-sm text-[#4A4A4A] group-hover:text-gray-300 leading-relaxed transition-colors">
                Book appointments with top doctors in seconds. View available slots and schedule visits instantly.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 sm:p-8 group hover:bg-[#0C0C0C] transition-colors duration-300">
              <div className="w-10 h-10 border border-[#E5E5E5] group-hover:border-white flex items-center justify-center mb-4 sm:mb-6 transition-colors">
                <Activity className="w-5 h-5 text-[#0C0C0C] group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-sm font-bold text-[#0C0C0C] group-hover:text-white uppercase tracking-wide mb-2 sm:mb-3 transition-colors">
                Real-Time Updates
              </h3>
              <p className="text-sm text-[#4A4A4A] group-hover:text-gray-300 leading-relaxed transition-colors">
                Check real-time hospital bed availability. Get instant updates on capacity and emergency room status.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 sm:p-8 group hover:bg-[#0C0C0C] transition-colors duration-300">
              <div className="w-10 h-10 border border-[#E5E5E5] group-hover:border-white flex items-center justify-center mb-4 sm:mb-6 transition-colors">
                <MapPin className="w-5 h-5 text-[#0C0C0C] group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-sm font-bold text-[#0C0C0C] group-hover:text-white uppercase tracking-wide mb-2 sm:mb-3 transition-colors">
                Location-Based
              </h3>
              <p className="text-sm text-[#4A4A4A] group-hover:text-gray-300 leading-relaxed transition-colors">
                Find hospitals near you. View addresses, contact details, and get directions to the nearest facility.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-6 sm:p-8 group hover:bg-[#0C0C0C] transition-colors duration-300">
              <div className="w-10 h-10 border border-[#E5E5E5] group-hover:border-white flex items-center justify-center mb-4 sm:mb-6 transition-colors">
                <Users className="w-5 h-5 text-[#0C0C0C] group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-sm font-bold text-[#0C0C0C] group-hover:text-white uppercase tracking-wide mb-2 sm:mb-3 transition-colors">
                Expert Care
              </h3>
              <p className="text-sm text-[#4A4A4A] group-hover:text-gray-300 leading-relaxed transition-colors">
                Connect with qualified specialists. View profiles, qualifications, and patient reviews before booking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-white border-y border-[#E5E5E5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 md:gap-12">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-[#0C0C0C] mb-1 sm:mb-2 tracking-tight">24/7</div>
              <div className="text-[9px] sm:text-[10px] md:text-xs font-semibold text-[#4A4A4A] uppercase tracking-wider">Healthcare Access</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-[#0C0C0C] mb-1 sm:mb-2 tracking-tight">100+</div>
              <div className="text-[9px] sm:text-[10px] md:text-xs font-semibold text-[#4A4A4A] uppercase tracking-wider">Partner Hospitals</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-[#0C0C0C] mb-1 sm:mb-2 tracking-tight">500+</div>
              <div className="text-[9px] sm:text-[10px] md:text-xs font-semibold text-[#4A4A4A] uppercase tracking-wider">Qualified Doctors</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-[#0C0C0C] mb-1 sm:mb-2 tracking-tight">10K+</div>
              <div className="text-[9px] sm:text-[10px] md:text-xs font-semibold text-[#4A4A4A] uppercase tracking-wider">Happy Patients</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-[#F9F7F3]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-[#0C0C0C] mb-3 sm:mb-4 md:mb-6 tracking-[-0.02em] uppercase">
            Ready to Get Started?
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-[#4A4A4A] mb-6 sm:mb-8 md:mb-10 leading-relaxed px-2">
            Join thousands of patients experiencing better healthcare management
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3 justify-center px-2">
            <Button 
              onClick={handlePatientClick}
              className="bg-[#0C0C0C] hover:bg-[#1E1E1E] text-white rounded-full px-4 sm:px-6 md:px-8 h-9 sm:h-11 md:h-12 text-[9px] sm:text-xs font-bold uppercase tracking-wider transition-colors w-full sm:w-auto"
            >
              <Building2 className="w-3 sm:w-3.5 h-3 sm:h-3.5 mr-1.5 sm:mr-2" />
              I AM A PATIENT
            </Button>
            {!isPatient && (
              <Link to={createPageUrl("RoleSelection")} className="w-full sm:w-auto">
                <Button variant="outline" className="border-2 border-[#0C0C0C] text-[#0C0C0C] hover:bg-[#0C0C0C] hover:text-white rounded-full px-4 sm:px-6 md:px-8 h-9 sm:h-11 md:h-12 text-[9px] sm:text-xs font-bold uppercase tracking-wider transition-all w-full">
                  <Shield className="w-3 sm:w-3.5 h-3 sm:h-3.5 mr-1.5 sm:mr-2" />
                  HOSPITAL LOGIN
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
