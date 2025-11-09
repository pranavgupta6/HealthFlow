import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function DoctorProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [doctorId, setDoctorId] = useState(null);
  const [profile, setProfile] = useState({
    name: "",
    image_url: "",
    degrees: "",
    college: "",
    phone: "",
    specialization: ""
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    setDoctorId(id);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await base44.entities.Doctor.update(doctorId, {
        ...profile,
        profile_completed: true
      });

      toast.success("Profile updated successfully!");
      navigate(createPageUrl("DoctorDashboard") + `?id=${doctorId}`);
    } catch (error) {
      toast.error("Failed to update profile. Please try again.");
      console.error(error);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <Card className="border-2 border-blue-100 shadow-2xl">
          <CardHeader className="text-center bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900">
              Complete Your Profile
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Tell us about yourself and your qualifications
            </p>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    required
                    value={profile.name}
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                    placeholder="Dr. John Smith"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => setProfile({...profile, phone: e.target.value})}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="image_url">Profile Image URL</Label>
                <Input
                  id="image_url"
                  value={profile.image_url}
                  onChange={(e) => setProfile({...profile, image_url: e.target.value})}
                  placeholder="https://..."
                />
              </div>

              <div>
                <Label htmlFor="specialization">Specialization</Label>
                <Input
                  id="specialization"
                  value={profile.specialization}
                  onChange={(e) => setProfile({...profile, specialization: e.target.value})}
                  placeholder="Cardiology, Pediatrics, etc."
                />
              </div>

              <div>
                <Label htmlFor="degrees">Degrees & Qualifications</Label>
                <Input
                  id="degrees"
                  value={profile.degrees}
                  onChange={(e) => setProfile({...profile, degrees: e.target.value})}
                  placeholder="MBBS, MD, etc."
                />
              </div>

              <div>
                <Label htmlFor="college">Medical College</Label>
                <Input
                  id="college"
                  value={profile.college}
                  onChange={(e) => setProfile({...profile, college: e.target.value})}
                  placeholder="University Medical School"
                />
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-8"
                >
                  {loading ? "Saving..." : "Save Profile"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}