
import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X, ArrowLeft, Building2, MapPin, Bed } from "lucide-react";
import { toast } from "sonner";

export default function AdminPanel() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [user, setUser] = useState(null);
  const [hospital, setHospital] = useState({
    name: "",
    image_url: "",
    description: "",
    address: "",
    phone: "",
    email: "",
    location: { lat: "", lng: "" },
    bed_availability: {
      one_bed: 0,
      two_bed: 0,
      six_bed: 0,
      twelve_bed: 0,
      general_ward: 0
    }
  });
  const [doctors, setDoctors] = useState([{ email: "", password: "", name: "" }]);
  const [receptionists, setReceptionists] = useState([{ email: "", password: "", name: "", phone: "" }]);

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
        setCheckingAuth(false);
      }
    };
    checkAuth();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!hospital.name || !hospital.address || !hospital.phone || !hospital.email) {
      toast.error("Please fill in all required hospital information fields (marked with *)");
      return;
    }

    setLoading(true);

    try {
      const hospitalData = {
        ...hospital,
        location: hospital.location.lat && hospital.location.lng ? {
          lat: parseFloat(hospital.location.lat),
          lng: parseFloat(hospital.location.lng)
        } : null,
        bed_availability: {
          one_bed: parseInt(hospital.bed_availability.one_bed) || 0,
          two_bed: parseInt(hospital.bed_availability.two_bed) || 0,
          six_bed: parseInt(hospital.bed_availability.six_bed) || 0,
          twelve_bed: parseInt(hospital.bed_availability.twelve_bed) || 0,
          general_ward: parseInt(hospital.bed_availability.general_ward) || 0
        },
        admin_email: user.email
      };

      const createdHospital = await base44.entities.Hospital.create(hospitalData);

      if (doctors.length > 0 && doctors[0].email) {
        const doctorsData = doctors
          .filter(d => d.email && d.password)
          .map(d => ({
            ...d,
            hospital_id: createdHospital.id,
            profile_completed: false
          }));
        if (doctorsData.length > 0) {
          await base44.entities.Doctor.bulkCreate(doctorsData);
        }
      }

      if (receptionists.length > 0 && receptionists[0].email) {
        const receptionistsData = receptionists
          .filter(r => r.email && r.password)
          .map(r => ({
            ...r,
            hospital_id: createdHospital.id
          }));
        if (receptionistsData.length > 0) {
          await base44.entities.Receptionist.bulkCreate(receptionistsData);
        }
      }

      toast.success("Hospital registered successfully!");
      navigate(createPageUrl("Home"));
    } catch (error) {
      toast.error("Failed to register hospital: " + (error.message || "Please try again"));
      console.error("Registration error:", error);
    }

    setLoading(false);
  };

  const addDoctor = () => {
    setDoctors([...doctors, { email: "", password: "", name: "" }]);
  };

  const removeDoctor = (index) => {
    setDoctors(doctors.filter((_, i) => i !== index));
  };

  const addReceptionist = () => {
    setReceptionists([...receptionists, { email: "", password: "", name: "", phone: "" }]);
  };

  const removeReceptionist = (index) => {
    setReceptionists(receptionists.filter((_, i) => i !== index));
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl mb-4">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Register Your Hospital
          </h1>
          <p className="text-lg text-gray-600">
            Fill in the details to add your hospital to HEALTHFLOW
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Hospital Details */}
          <Card className="border-2 border-teal-100 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-teal-50 to-cyan-50">
              <CardTitle className="flex items-center gap-2 text-teal-900">
                <Building2 className="w-5 h-5" />
                Hospital Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Hospital Name *</Label>
                  <Input
                    id="name"
                    required
                    value={hospital.name}
                    onChange={(e) => setHospital({...hospital, name: e.target.value})}
                    placeholder="Enter hospital name"
                  />
                </div>
                <div>
                  <Label htmlFor="image_url">Hospital Image URL</Label>
                  <Input
                    id="image_url"
                    value={hospital.image_url}
                    onChange={(e) => setHospital({...hospital, image_url: e.target.value})}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={hospital.description}
                  onChange={(e) => setHospital({...hospital, description: e.target.value})}
                  placeholder="Describe your hospital, specialties, facilities..."
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  required
                  value={hospital.address}
                  onChange={(e) => setHospital({...hospital, address: e.target.value})}
                  placeholder="Full address"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    required
                    value={hospital.phone}
                    onChange={(e) => setHospital({...hospital, phone: e.target.value})}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={hospital.email}
                    onChange={(e) => setHospital({...hospital, email: e.target.value})}
                    placeholder="contact@hospital.com"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="lat" className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Latitude
                  </Label>
                  <Input
                    id="lat"
                    value={hospital.location.lat}
                    onChange={(e) => setHospital({...hospital, location: {...hospital.location, lat: e.target.value}})}
                    placeholder="40.7128"
                  />
                </div>
                <div>
                  <Label htmlFor="lng">Longitude</Label>
                  <Input
                    id="lng"
                    value={hospital.location.lng}
                    onChange={(e) => setHospital({...hospital, location: {...hospital.location, lng: e.target.value}})}
                    placeholder="-74.0060"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bed Availability Section */}
          <Card className="border-2 border-purple-100 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
              <CardTitle className="flex items-center gap-2 text-purple-900">
                <Bed className="w-5 h-5" />
                Bed Availability
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
                <div>
                  <Label htmlFor="one_bed">1-Bed Rooms</Label>
                  <Input
                    id="one_bed"
                    type="number"
                    min="0"
                    value={hospital.bed_availability.one_bed}
                    onChange={(e) => setHospital({
                      ...hospital, 
                      bed_availability: {...hospital.bed_availability, one_bed: e.target.value}
                    })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="two_bed">2-Bed Rooms</Label>
                  <Input
                    id="two_bed"
                    type="number"
                    min="0"
                    value={hospital.bed_availability.two_bed}
                    onChange={(e) => setHospital({
                      ...hospital, 
                      bed_availability: {...hospital.bed_availability, two_bed: e.target.value}
                    })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="six_bed">6-Bed Rooms</Label>
                  <Input
                    id="six_bed"
                    type="number"
                    min="0"
                    value={hospital.bed_availability.six_bed}
                    onChange={(e) => setHospital({
                      ...hospital, 
                      bed_availability: {...hospital.bed_availability, six_bed: e.target.value}
                    })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="twelve_bed">12-Bed Rooms</Label>
                  <Input
                    id="twelve_bed"
                    type="number"
                    min="0"
                    value={hospital.bed_availability.twelve_bed}
                    onChange={(e) => setHospital({
                      ...hospital, 
                      bed_availability: {...hospital.bed_availability, twelve_bed: e.target.value}
                    })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="general_ward">General Ward</Label>
                  <Input
                    id="general_ward"
                    type="number"
                    min="0"
                    value={hospital.bed_availability.general_ward}
                    onChange={(e) => setHospital({
                      ...hospital, 
                      bed_availability: {...hospital.bed_availability, general_ward: e.target.value}
                    })}
                    placeholder="0"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Doctors Section */}
          <Card className="border-2 border-blue-100 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardTitle className="flex items-center justify-between">
                <span className="text-blue-900">Doctors</span>
                <Button type="button" onClick={addDoctor} size="sm" variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Doctor
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {doctors.map((doctor, index) => (
                <div key={index} className="p-4 bg-blue-50 rounded-lg border border-blue-200 relative">
                  {doctors.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeDoctor(index)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                  <div className="grid md:grid-cols-3 gap-3">
                    <Input
                      placeholder="Doctor Name"
                      value={doctor.name}
                      onChange={(e) => {
                        const newDoctors = [...doctors];
                        newDoctors[index].name = e.target.value;
                        setDoctors(newDoctors);
                      }}
                    />
                    <Input
                      type="email"
                      placeholder="Email"
                      value={doctor.email}
                      onChange={(e) => {
                        const newDoctors = [...doctors];
                        newDoctors[index].email = e.target.value;
                        setDoctors(newDoctors);
                      }}
                    />
                    <Input
                      type="password"
                      placeholder="Password"
                      value={doctor.password}
                      onChange={(e) => {
                        const newDoctors = [...doctors];
                        newDoctors[index].password = e.target.value;
                        setDoctors(newDoctors);
                      }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Receptionists Section */}
          <Card className="border-2 border-orange-100 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50">
              <CardTitle className="flex items-center justify-between">
                <span className="text-orange-900">Receptionists</span>
                <Button type="button" onClick={addReceptionist} size="sm" variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Receptionist
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {receptionists.map((receptionist, index) => (
                <div key={index} className="p-4 bg-orange-50 rounded-lg border border-orange-200 relative">
                  {receptionists.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeReceptionist(index)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                  <div className="grid md:grid-cols-4 gap-3">
                    <Input
                      placeholder="Name"
                      value={receptionist.name}
                      onChange={(e) => {
                        const newReceptionists = [...receptionists];
                        newReceptionists[index].name = e.target.value;
                        setReceptionists(newReceptionists);
                      }}
                    />
                    <Input
                      placeholder="Phone"
                      value={receptionist.phone}
                      onChange={(e) => {
                        const newReceptionists = [...receptionists];
                        newReceptionists[index].phone = e.target.value;
                        setReceptionists(newReceptionists);
                      }}
                    />
                    <Input
                      type="email"
                      placeholder="Email"
                      value={receptionist.email}
                      onChange={(e) => {
                        const newReceptionists = [...receptionists];
                        newReceptionists[index].email = e.target.value;
                        setReceptionists(newReceptionists);
                      }}
                    />
                    <Input
                      type="password"
                      placeholder="Password"
                      value={receptionist.password}
                      onChange={(e) => {
                        const newReceptionists = [...receptionists];
                        newReceptionists[index].password = e.target.value;
                        setReceptionists(newReceptionists);
                      }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 px-8"
            >
              {loading ? "Registering..." : "Register Hospital"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
