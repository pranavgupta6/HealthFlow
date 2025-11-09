
import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Building2, MapPin, Phone, Mail, Bed, Stethoscope, Calendar, User } from "lucide-react";
import { toast } from "sonner";

export default function HospitalDetails() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [hospitalId, setHospitalId] = useState(null);
  const [activeTab, setActiveTab] = useState("beds");
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [user, setUser] = useState(null);
  const [booking, setBooking] = useState({
    doctor_id: "",
    date: "",
    time: "",
    reason: ""
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    setHospitalId(id);

    const fetchUser = async () => {
      const userData = await base44.auth.me();
      setUser(userData);
    };
    fetchUser();
  }, []);

  const { data: hospital } = useQuery({
    queryKey: ['hospital', hospitalId],
    queryFn: async () => {
      const hospitals = await base44.entities.Hospital.filter({ id: hospitalId });
      return hospitals[0];
    },
    enabled: !!hospitalId,
  });

  const { data: doctors = [] } = useQuery({
    queryKey: ['hospital-doctors', hospitalId],
    queryFn: () => base44.entities.Doctor.filter({ hospital_id: hospitalId }),
    enabled: !!hospitalId,
    initialData: [],
  });

  const bookAppointmentMutation = useMutation({
    mutationFn: (data) => base44.entities.Appointment.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['user-appointments']);
      toast.success("Appointment booked successfully!");
      setShowBookingForm(false);
      setBooking({ doctor_id: "", date: "", time: "", reason: "" });
    },
  });

  const handleBookAppointment = (e) => {
    e.preventDefault();
    bookAppointmentMutation.mutate({
      ...booking,
      hospital_id: hospitalId,
      patient_email: user.email,
      patient_name: user.full_name,
      status: "scheduled"
    });
  };

  if (!hospital) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-500">Loading...</div>
      </div>
    );
  }

  const bedAvailability = hospital.bed_availability || {
    one_bed: 0,
    two_bed: 0,
    six_bed: 0,
    twelve_bed: 0,
    general_ward: 0
  };

  const totalBeds = Object.values(bedAvailability).reduce((sum, count) => sum + count, 0);

  return (
    <div className="min-h-screen bg-[#F9F7F3] py-6 sm:py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4 sm:mb-6 md:mb-8 text-xs sm:text-sm">
          <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
          Back to Hospitals
        </Button>

        {/* Hospital Header Card */}
        <Card className="mb-4 sm:mb-5 md:mb-6 border-2 border-[#0C0C0C]">
          <CardContent className="p-4 sm:p-6 md:p-8">
            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
              {/* Hospital Logo/Icon */}
              <div className="flex-shrink-0 mx-auto sm:mx-0">
                {hospital.image_url ? (
                  <img
                    src={hospital.image_url}
                    alt={hospital.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg border-2 border-[#0C0C0C]"
                  />
                ) : (
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#0C0C0C] flex items-center justify-center rounded-lg">
                    <Building2 className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                  </div>
                )}
              </div>

              {/* Hospital Details */}
              <div className="flex-1 text-center sm:text-left w-full overflow-hidden">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#0C0C0C] uppercase tracking-tight mb-3 sm:mb-4 break-words">
                  {hospital.name}
                </h1>
                
                <div className="grid sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                  <div className="flex items-start gap-2 text-[#4A4A4A] justify-center sm:justify-start">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0" />
                    <span className="text-xs sm:text-sm break-words">{hospital.address}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-[#4A4A4A] justify-center sm:justify-start">
                    <Phone className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                    <span className="text-xs sm:text-sm font-semibold break-all">{hospital.phone}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-[#4A4A4A] justify-center sm:justify-start sm:col-span-2">
                    <Mail className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                    <span className="text-xs sm:text-sm break-all">{hospital.email}</span>
                  </div>
                </div>

                {hospital.description && (
                  <p className="text-xs sm:text-sm text-[#4A4A4A] mt-3 sm:mt-4 leading-relaxed break-words">
                    {hospital.description}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <div className="flex gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-5 md:mb-6">
          <button
            onClick={() => setActiveTab("doctors")}
            className={`flex-1 sm:flex-none px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-wider transition-all border-2 ${
              activeTab === "doctors"
                ? "bg-[#0C0C0C] text-white border-[#0C0C0C]"
                : "bg-white text-[#0C0C0C] border-[#0C0C0C] hover:bg-[#0C0C0C] hover:text-white"
            }`}
          >
            DOCTORS ({doctors.length})
          </button>
          <button
            onClick={() => setActiveTab("beds")}
            className={`flex-1 sm:flex-none px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-wider transition-all border-2 ${
              activeTab === "beds"
                ? "bg-[#0C0C0C] text-white border-[#0C0C0C]"
                : "bg-white text-[#0C0C0C] border-[#0C0C0C] hover:bg-[#0C0C0C] hover:text-white"
            }`}
          >
            BEDS
          </button>
        </div>

        {/* Beds Tab Content */}
        {activeTab === "beds" && (
          <Card className="border-2 border-[#0C0C0C]">
            <CardContent className="p-8">
              {/* Bed Availability Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <Bed className="w-5 h-5" />
                  <h2 className="text-lg font-black uppercase tracking-tight">BED AVAILABILITY</h2>
                </div>
                <div className="px-4 py-1 border-2 border-green-600 text-green-600 text-sm font-bold uppercase">
                  {totalBeds} AVAILABLE
                </div>
              </div>

              {/* By Category */}
              <div>
                <h3 className="text-sm font-black uppercase tracking-tight mb-4">BY CATEGORY</h3>
                {totalBeds === 0 ? (
                  <div className="text-center py-12 text-[#4A4A4A]">
                    No bed categories configured
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bedAvailability.one_bed > 0 && (
                      <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200">
                        <span className="font-semibold text-[#0C0C0C]">1-Bed Rooms</span>
                        <span className="text-lg font-black text-green-600">{bedAvailability.one_bed}</span>
                      </div>
                    )}
                    {bedAvailability.two_bed > 0 && (
                      <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200">
                        <span className="font-semibold text-[#0C0C0C]">2-Bed Rooms</span>
                        <span className="text-lg font-black text-green-600">{bedAvailability.two_bed}</span>
                      </div>
                    )}
                    {bedAvailability.six_bed > 0 && (
                      <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200">
                        <span className="font-semibold text-[#0C0C0C]">6-Bed Rooms</span>
                        <span className="text-lg font-black text-green-600">{bedAvailability.six_bed}</span>
                      </div>
                    )}
                    {bedAvailability.twelve_bed > 0 && (
                      <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200">
                        <span className="font-semibold text-[#0C0C0C]">12-Bed Rooms</span>
                        <span className="text-lg font-black text-green-600">{bedAvailability.twelve_bed}</span>
                      </div>
                    )}
                    {bedAvailability.general_ward > 0 && (
                      <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200">
                        <span className="font-semibold text-[#0C0C0C]">General Ward</span>
                        <span className="text-lg font-black text-green-600">{bedAvailability.general_ward}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Doctors Tab Content */}
        {activeTab === "doctors" && (
          <div>
            {doctors.length > 0 && (
              <div className="flex justify-end mb-6">
                <Button
                  onClick={() => setShowBookingForm(!showBookingForm)}
                  className="bg-[#0C0C0C] hover:bg-[#1E1E1E] text-white px-6 py-3 text-sm font-bold uppercase"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  BOOK APPOINTMENT
                </Button>
              </div>
            )}

            {doctors.length === 0 ? (
              <Card className="border-2 border-[#0C0C0C]">
                <CardContent className="p-16 text-center">
                  <Stethoscope className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-[#4A4A4A] font-semibold">No doctors available at the moment</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {doctors.map((doctor) => (
                  <Card key={doctor.id} className="border-2 border-[#0C0C0C] hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      {doctor.image_url ? (
                        <img
                          src={doctor.image_url}
                          alt={doctor.name || doctor.email}
                          className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-2 border-[#0C0C0C]"
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-4">
                          <User className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                      
                      <h3 className="text-lg font-black text-center text-[#0C0C0C] uppercase mb-2">
                        {doctor.name || doctor.email}
                      </h3>
                      
                      {doctor.specialization && (
                        <p className="text-center text-sm text-[#0C0C0C] font-semibold mb-4">
                          {doctor.specialization}
                        </p>
                      )}
                      
                      {!doctor.profile_completed && (
                        <p className="text-center text-xs text-[#4A4A4A] italic mb-4">
                          Profile pending completion
                        </p>
                      )}
                      
                      <div className="text-xs text-[#4A4A4A] space-y-2 pt-4 border-t border-gray-200">
                        {doctor.degrees && (
                          <p><strong className="text-[#0C0C0C]">Degrees:</strong> {doctor.degrees}</p>
                        )}
                        {doctor.college && (
                          <p><strong className="text-[#0C0C0C]">College:</strong> {doctor.college}</p>
                        )}
                        {doctor.phone && (
                          <p><strong className="text-[#0C0C0C]">Phone:</strong> {doctor.phone}</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Booking Form */}
            {showBookingForm && (
              <Card className="mt-8 border-2 border-[#0C0C0C]">
                <CardHeader className="bg-[#F9F7F3] border-b-2 border-[#0C0C0C]">
                  <CardTitle className="text-xl font-black uppercase">BOOK AN APPOINTMENT</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <form onSubmit={handleBookAppointment} className="space-y-4">
                    <div>
                      <Label htmlFor="doctor" className="text-sm font-bold uppercase">Select Doctor *</Label>
                      <Select
                        value={booking.doctor_id}
                        onValueChange={(value) => setBooking({...booking, doctor_id: value})}
                        required
                      >
                        <SelectTrigger className="border-2 border-gray-300">
                          <SelectValue placeholder="Choose a doctor" />
                        </SelectTrigger>
                        <SelectContent>
                          {doctors.map((doctor) => (
                            <SelectItem key={doctor.id} value={doctor.id}>
                              {doctor.name || doctor.email} {doctor.specialization && `- ${doctor.specialization}`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid md::grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="date" className="text-sm font-bold uppercase">Preferred Date *</Label>
                        <Input
                          id="date"
                          type="date"
                          required
                          value={booking.date}
                          onChange={(e) => setBooking({...booking, date: e.target.value})}
                          className="border-2 border-gray-300"
                        />
                      </div>

                      <div>
                        <Label htmlFor="time" className="text-sm font-bold uppercase">Preferred Time *</Label>
                        <Input
                          id="time"
                          type="time"
                          required
                          value={booking.time}
                          onChange={(e) => setBooking({...booking, time: e.target.value})}
                          className="border-2 border-gray-300"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="reason" className="text-sm font-bold uppercase">Reason for Visit</Label>
                      <Textarea
                        id="reason"
                        value={booking.reason}
                        onChange={(e) => setBooking({...booking, reason: e.target.value})}
                        placeholder="Describe your symptoms or reason for visit..."
                        rows={4}
                        className="border-2 border-gray-300"
                      />
                    </div>

                    <div className="flex justify-end gap-3">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setShowBookingForm(false)}
                        className="border-2 border-[#0C0C0C]"
                      >
                        CANCEL
                      </Button>
                      <Button 
                        type="submit"
                        className="bg-[#0C0C0C] hover:bg-[#1E1E1E] text-white"
                      >
                        BOOK APPOINTMENT
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
