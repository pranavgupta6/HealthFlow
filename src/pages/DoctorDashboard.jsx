
import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, User, LogOut, Edit } from "lucide-react";
import { format, parseISO, isAfter, startOfWeek, endOfWeek } from "date-fns";

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const [doctorId, setDoctorId] = useState(null);
  const [doctor, setDoctor] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    setDoctorId(id);

    const fetchDoctor = async () => {
      const docs = await base44.entities.Doctor.filter({ id });
      if (docs.length > 0) {
        setDoctor(docs[0]);
      }
    };
    
    if (id) fetchDoctor();
  }, []);

  const { data: appointments = [] } = useQuery({
    queryKey: ['doctor-appointments', doctorId],
    queryFn: () => doctorId ? base44.entities.Appointment.filter({ doctor_id: doctorId }) : [],
    enabled: !!doctorId,
    initialData: [],
  });

  const thisWeekAppointments = appointments.filter(apt => {
    const aptDate = parseISO(apt.date);
    const now = new Date();
    return isAfter(aptDate, now) && 
           isAfter(aptDate, startOfWeek(now)) && 
           !isAfter(aptDate, endOfWeek(now));
  });

  const handleLogout = () => {
    localStorage.removeItem("doctor_session");
    navigate(createPageUrl("Home"));
  };

  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Welcome, {doctor.name || "Doctor"}
            </h1>
            <p className="text-gray-600">
              {doctor.specialization && `${doctor.specialization} Specialist`}
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => navigate(createPageUrl("DoctorProfile") + `?id=${doctorId}`)}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="text-red-600 hover:text-red-700"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Profile Card */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="md:col-span-1 border-2 border-blue-100">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardTitle>Your Profile</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {doctor.image_url && (
                <img 
                  src={doctor.image_url} 
                  alt={doctor.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-blue-200"
                />
              )}
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-semibold">{doctor.name || "Not set"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Degrees</p>
                  <p className="font-semibold">{doctor.degrees || "Not set"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">College</p>
                  <p className="font-semibold">{doctor.college || "Not set"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-semibold">{doctor.phone || "Not set"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-semibold">{doctor.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Appointments This Week */}
          <Card className="md:col-span-2 border-2 border-teal-100">
            <CardHeader className="bg-gradient-to-r from-teal-50 to-cyan-50">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                This Week's Appointments
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {thisWeekAppointments.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>No appointments scheduled for this week</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {thisWeekAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="p-4 bg-white rounded-lg border-2 border-teal-100 hover:border-teal-300 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <User className="w-4 h-4 text-teal-600" />
                            <span className="font-semibold text-gray-900">
                              {appointment.patient_name}
                            </span>
                            {appointment.token_number && (
                              <span className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded-full">
                                Token #{appointment.token_number}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {format(parseISO(appointment.date), "MMM d, yyyy")}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {appointment.time}
                            </span>
                          </div>
                          {appointment.reason && (
                            <p className="text-sm text-gray-500 mt-2">
                              Reason: {appointment.reason}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            appointment.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                            appointment.status === 'completed' ? 'bg-green-100 text-green-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {appointment.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* All Appointments */}
        <Card className="border-2 border-gray-100">
          <CardHeader className="bg-gray-50">
            <CardTitle>All Appointments</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {appointments.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p>No appointments found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {appointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold">{appointment.patient_name}</p>
                        <p className="text-sm text-gray-600">
                          {format(parseISO(appointment.date), "MMM d, yyyy")} at {appointment.time}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        appointment.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                        appointment.status === 'completed' ? 'bg-green-100 text-green-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {appointment.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
