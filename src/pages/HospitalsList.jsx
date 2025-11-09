
import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, MapPin, Phone, Mail, Bed, ArrowRight, User } from "lucide-react";

export default function HospitalsList() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuth = await base44.auth.isAuthenticated();
        if (!isAuth) {
          const nextUrl = window.location.origin + window.location.pathname;
          base44.auth.redirectToLogin(nextUrl);
          return;
        }
        const userData = await base44.auth.me();
        setUser(userData);
      } catch (error) {
        console.error("Auth error:", error);
        const nextUrl = window.location.origin + window.location.pathname;
        base44.auth.redirectToLogin(nextUrl);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const { data: hospitals = [], isLoading } = useQuery({
    queryKey: ['hospitals'],
    queryFn: () => base44.entities.Hospital.list('-created_date'),
    enabled: !!user,
    initialData: [],
  });

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9F7F3]">
        <div className="text-sm text-[#4A4A4A]">Loading...</div>
      </div>
    );
  }

  const getTotalBeds = (bedAvailability) => {
    if (!bedAvailability) return 0;
    // Assuming bed_availability is an object like { "available": 10, "occupied": 5 } or { "room_type_1": 5, "room_type_2": 3 }
    // We sum all numeric values within the object.
    return Object.values(bedAvailability).reduce((sum, count) => {
      if (typeof count === 'number') {
        return sum + count;
      }
      return sum;
    }, 0);
  };

  return (
    <div className="min-h-screen bg-[#F9F7F3] py-8 sm:py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 sm:mb-12 md:mb-16">
          <div>
            <p className="text-[10px] sm:text-xs font-bold text-[#4A4A4A] uppercase tracking-[0.15em] mb-2 sm:mb-3">HOSPITALS</p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#0C0C0C] mb-3 sm:mb-4 tracking-[-0.02em] uppercase">
              Find a Hospital
            </h1>
            <p className="text-sm sm:text-base text-[#4A4A4A]">
              Browse hospitals and book appointments with top doctors
            </p>
          </div>
        </div>

        {/* Hospitals Grid */}
        {isLoading ? (
          <div className="text-center py-20 text-[#4A4A4A]">Loading hospitals...</div>
        ) : hospitals.length === 0 ? (
          <div className="text-center py-12 sm:py-16 md:py-20 bg-white border border-[#E5E5E5] p-8 sm:p-12 md:p-16">
            <Building2 className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-4 text-[#E5E5E5]" />
            <h3 className="text-lg sm:text-xl font-bold text-[#0C0C0C] uppercase mb-2">
              No Hospitals Found
            </h3>
            <p className="text-sm sm:text-base text-[#4A4A4A]">
              Check back later for hospital listings
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {hospitals.map((hospital) => (
              <div
                key={hospital.id}
                className="group bg-white cursor-pointer transition-all hover:translate-y-[-2px] border border-[#E5E5E5]"
                onClick={() => navigate(createPageUrl("HospitalDetails") + `?id=${hospital.id}`)}
              >
                {hospital.image_url && (
                  <div className="h-36 sm:h-44 md:h-48 overflow-hidden bg-[#F9F7F3] border-b border-[#E5E5E5]">
                    <img
                      src={hospital.image_url}
                      alt={hospital.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                    />
                  </div>
                )}
                <div className="p-5 sm:p-6 md:p-7">
                  <h3 className="text-base sm:text-lg font-bold text-[#0C0C0C] mb-2 sm:mb-3 uppercase tracking-tight">
                    {hospital.name}
                  </h3>
                  
                  {hospital.description && (
                    <p className="text-xs sm:text-sm text-[#4A4A4A] mb-3 sm:mb-4 line-clamp-2">
                      {hospital.description}
                    </p>
                  )}

                  <div className="space-y-1.5 sm:space-y-2 mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-[#E5E5E5]">
                    <div className="flex items-start gap-2 text-[10px] sm:text-xs text-[#4A4A4A]">
                      <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-2">{hospital.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] sm:text-xs text-[#4A4A4A]">
                      <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                      <span>{hospital.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] sm:text-xs text-[#4A4A4A]">
                      <Mail className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                      <span className="truncate">{hospital.email}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <Bed className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#0C0C0C]" />
                      <span className="text-[10px] sm:text-xs font-bold text-[#0C0C0C] uppercase">
                        {getTotalBeds(hospital.bed_availability)} Beds
                      </span>
                    </div>
                    <div className="flex items-center text-[10px] sm:text-xs font-bold text-[#0C0C0C] uppercase tracking-wider group-hover:gap-2 transition-all">
                      VIEW
                      <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 ml-1" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
