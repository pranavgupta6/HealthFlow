import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Calendar, MapPin, Phone, Mail, LogOut, Edit, Building2, Stethoscope } from "lucide-react";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";

export default function UserDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState({ address: "", phone: "" });

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await base44.auth.me();
      setUser(userData);
      setProfile({
        address: userData.address || "",
        phone: userData.phone || ""
      });
    };
    fetchUser();
  }, []);

  const { data: appointments = [] } = useQuery({
    queryKey: ['user-appointments', user?.email],
    queryFn: () => user ? base44.entities.Appointment.filter({ patient_email: user.email }) : [],
    enabled: !!user,
    initialData: [],
  });

  const { data: hospitals = [] } = useQuery({
    queryKey: ['all-hospitals'],
    queryFn: () => base44.entities.Hospital.list(),
    initialData: [],
  });

  const { data: doctors = [] } = useQuery({
    queryKey: ['all-doctors'],
    queryFn: () => base44.entities.Doctor.list(),
    initialData: [],
  });

  const getHospitalName = (hospitalId) => {
    const hospital = hospitals.find(h => h.id === hospitalId);
    return hospital?.name || "Hospital";
  };

  const getDoctorName = (doctorId) => {
    const doctor = doctors.find(d => d.id === doctorId);
    return doctor?.name || doctor?.email || "Doctor";
  };

  const handleSaveProfile = async () => {
    try {
      await base44.auth.updateMe(profile);
      setUser({...user, ...profile});
      setEditMode(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile");
      console.error(error);
    }
  };

  const handleLogout = () => {
    base44.auth.logout();
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-lg text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-2 tracking-tight">
              My Dashboard
            </h1>
            <p className="text-gray-600">Manage your profile and appointments</p>
          </div>
          <div className="flex gap-3">
            <Link to={createPageUrl("HospitalsList")}>
              <Button variant="outline" className="border-gray-300 hover:bg-gray-50">
                <Building2 className="w-4 h-4 mr-2" />
                Browse Hospitals
              </Button>
            </Link>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="text-red-600 hover:text-red-700 border-gray-300 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="md:col-span-1 border border-gray-200 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-teal-50 to-cyan-50 border-b border-gray-200">
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-gray-900">
                  <User className="w-5 h-5" />
                  Your Profile
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setEditMode(!editMode)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {!editMode ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">Full Name</p>
                    <p className="font-semibold text-gray-900">{user.full_name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">Email</p>
                    <p className="font-semibold text-gray-900">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">Address</p>
                    <p className="font-semibold text-gray-900">{user.address || "Not set"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">Phone</p>
                    <p className="font-semibold text-gray-900">{user.phone || "Not set"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">Role</p>
                    <p className="font-semibold text-gray-900 capitalize">{user.role}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label className="text-xs font-medium uppercase tracking-wide">Full Name</Label>
                    <Input value={user.full_name} disabled className="bg-gray-100" />
                    <p className="text-xs text-gray-500 mt-1">Cannot be changed</p>
                  </div>
                  <div>
                    <Label className="text-xs font-medium uppercase tracking-wide">Email</Label>
                    <Input value={user.email} disabled className="bg-gray-100" />
                    <p className="text-xs text-gray-500 mt-1">Cannot be changed</p>
                  </div>
                  <div>
                    <Label htmlFor="address" className="text-xs font-medium uppercase tracking-wide">Address</Label>
                    <Input
                      id="address"
                      value={profile.address}
                      onChange={(e) => setProfile({...profile, address: e.target.value})}
                      placeholder="Enter your address"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-xs font-medium uppercase tracking-wide">Phone</Label>
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => setProfile({...profile, phone: e.target.value})}
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSaveProfile}
                      className="flex-1 bg-gray-900 hover:bg-black"
                    >
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditMode(false);
                        setProfile({
                          address: user.address || "",
                          phone: user.phone || ""
                        });
                      }}
                      className="border-gray-300"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Appointments */}
          <Card className="md:col-span-2 border border-gray-200 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <Calendar className="w-5 h-5" />
                My Appointments
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {appointments.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="mb-4">You haven't booked any appointments yet</p>
                  <Link to={createPageUrl("HospitalsList")}>
                    <Button className="bg-gray-900 hover:bg-black">
                      Browse Hospitals
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {appointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="p-4 bg-white rounded-lg border border-gray-200 hover:border-teal-300 hover:shadow-sm transition-all"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-teal-600" />
                            <p className="font-semibold text-gray-900">
                              {getHospitalName(appointment.hospital_id)}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Stethoscope className="w-4 h-4 text-blue-600" />
                            <p className="text-sm text-gray-700">
                              Dr. {getDoctorName(appointment.doctor_id)}
                            </p>
                          </div>
                          {appointment.token_number && (
                            <span className="inline-block text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded-full font-medium">
                              Token #{appointment.token_number}
                            </span>
                          )}
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          appointment.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                          appointment.status === 'completed' ? 'bg-green-100 text-green-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {appointment.status}
                        </span>
                      </div>
                      
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-teal-600" />
                          <span>{format(parseISO(appointment.date), "MMMM d, yyyy")}</span>
                          <span className="mx-2">•</span>
                          <span>{appointment.time}</span>
                        </div>
                        {appointment.reason && (
                          <p className="text-gray-500">
                            <strong>Reason:</strong> {appointment.reason}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}