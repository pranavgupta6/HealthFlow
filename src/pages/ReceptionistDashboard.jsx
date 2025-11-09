import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { LogOut, Plus, Minus, Calendar, Bed, Users, Activity } from "lucide-react";
import { toast } from "sonner";

export default function ReceptionistDashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [receptionistId, setReceptionistId] = useState(null);
  const [receptionist, setReceptionist] = useState(null);
  const [hospital, setHospital] = useState(null);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [appointment, setAppointment] = useState({
    doctor_id: "",
    patient_name: "",
    patient_email: "",
    date: "",
    time: "",
    token_number: "",
    reason: ""
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    setReceptionistId(id);

    const fetchData = async () => {
      const recs = await base44.entities.Receptionist.filter({ id });
      if (recs.length > 0) {
        setReceptionist(recs[0]);
        const hospitals = await base44.entities.Hospital.filter({ id: recs[0].hospital_id });
        if (hospitals.length > 0) {
          setHospital(hospitals[0]);
        }
      }
    };
    
    if (id) fetchData();
  }, []);

  const { data: doctors = [] } = useQuery({
    queryKey: ['hospital-doctors', hospital?.id],
    queryFn: () => hospital ? base44.entities.Doctor.filter({ hospital_id: hospital.id }) : [],
    enabled: !!hospital,
    initialData: [],
  });

  const { data: appointments = [] } = useQuery({
    queryKey: ['hospital-appointments', hospital?.id],
    queryFn: () => hospital ? base44.entities.Appointment.filter({ hospital_id: hospital.id }) : [],
    enabled: !!hospital,
    initialData: [],
  });

  const updateBedsMutation = useMutation({
    mutationFn: (newBedData) => base44.entities.Hospital.update(hospital.id, { bed_availability: newBedData }),
    onSuccess: () => {
      queryClient.invalidateQueries(['hospital-data']);
      toast.success("Bed count updated");
    },
  });

  const createAppointmentMutation = useMutation({
    mutationFn: (data) => base44.entities.Appointment.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['hospital-appointments']);
      toast.success("Appointment created successfully");
      setShowAppointmentForm(false);
      setAppointment({
        doctor_id: "",
        patient_name: "",
        patient_email: "",
        date: "",
        time: "",
        token_number: "",
        reason: ""
      });
    },
  });

  const handleBedUpdate = (bedType, increment) => {
    const currentBeds = hospital?.bed_availability || {
      one_bed: 0,
      two_bed: 0,
      six_bed: 0,
      twelve_bed: 0,
      general_ward: 0
    };
    
    const newCount = Math.max(0, (currentBeds[bedType] || 0) + (increment ? 1 : -1));
    const updatedBeds = {
      ...currentBeds,
      [bedType]: newCount
    };
    
    updateBedsMutation.mutate(updatedBeds);
    setHospital({...hospital, bed_availability: updatedBeds});
  };

  const handleCreateAppointment = (e) => {
    e.preventDefault();
    createAppointmentMutation.mutate({
      ...appointment,
      hospital_id: hospital.id,
      token_number: parseInt(appointment.token_number),
      status: "scheduled"
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("receptionist_session");
    navigate(createPageUrl("Home"));
  };

  if (!receptionist || !hospital) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9F7F3]">
        <div className="text-lg text-[#4A4A4A]">Loading...</div>
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
    <div className="min-h-screen bg-[#F9F7F3]">
      {/* Header Section */}
      <div className="bg-[#F9F7F3] border-b-2 border-[#0C0C0C]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          <div className="flex justify-between items-start">
            <div>
              <div className="inline-flex items-center gap-3 border border-[#0C0C0C] px-4 py-2 mb-4 bg-white">
                <Activity className="w-4 h-4 text-[#0C0C0C]" strokeWidth={2.5} />
                <span className="text-xs font-semibold text-[#0C0C0C] uppercase tracking-[0.12em]">
                  RECEPTIONIST DASHBOARD
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl font-black text-[#0C0C0C] tracking-[-0.02em] uppercase mb-3">
                {hospital.name}
              </h1>
              <p className="text-[#4A4A4A] text-lg">Welcome, {receptionist.name}</p>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-2 border-[#0C0C0C] text-[#0C0C0C] hover:bg-[#0C0C0C] hover:text-white px-8 h-14 text-sm font-bold uppercase tracking-wider"
            >
              <LogOut className="w-4 h-4 mr-2" />
              LOGOUT
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-px bg-[#E5E5E5] mb-12">
          <div className="bg-white p-8 text-center group hover:bg-[#0C0C0C] transition-colors">
            <div className="w-12 h-12 border border-[#E5E5E5] group-hover:border-white flex items-center justify-center mx-auto mb-4 transition-colors">
              <Bed className="w-6 h-6 text-[#0C0C0C] group-hover:text-white transition-colors" />
            </div>
            <div className="text-5xl font-black text-[#0C0C0C] group-hover:text-white mb-2 transition-colors">{totalBeds}</div>
            <div className="text-xs font-bold text-[#4A4A4A] group-hover:text-gray-300 uppercase tracking-wider transition-colors">Available Beds</div>
          </div>
          
          <div className="bg-white p-8 text-center group hover:bg-[#0C0C0C] transition-colors">
            <div className="w-12 h-12 border border-[#E5E5E5] group-hover:border-white flex items-center justify-center mx-auto mb-4 transition-colors">
              <Users className="w-6 h-6 text-[#0C0C0C] group-hover:text-white transition-colors" />
            </div>
            <div className="text-5xl font-black text-[#0C0C0C] group-hover:text-white mb-2 transition-colors">{doctors.length}</div>
            <div className="text-xs font-bold text-[#4A4A4A] group-hover:text-gray-300 uppercase tracking-wider transition-colors">Doctors</div>
          </div>
          
          <div className="bg-white p-8 text-center group hover:bg-[#0C0C0C] transition-colors">
            <div className="w-12 h-12 border border-[#E5E5E5] group-hover:border-white flex items-center justify-center mx-auto mb-4 transition-colors">
              <Calendar className="w-6 h-6 text-[#0C0C0C] group-hover:text-white transition-colors" />
            </div>
            <div className="text-5xl font-black text-[#0C0C0C] group-hover:text-white mb-2 transition-colors">{appointments.length}</div>
            <div className="text-xs font-bold text-[#4A4A4A] group-hover:text-gray-300 uppercase tracking-wider transition-colors">Appointments</div>
          </div>
        </div>

        {/* Bed Management Section */}
        <Card className="mb-8 border-2 border-[#0C0C0C]">
          <CardHeader className="bg-white border-b-2 border-[#0C0C0C]">
            <CardTitle className="flex items-center gap-2 text-xl font-black uppercase tracking-tight">
              <Bed className="w-5 h-5" />
              BED AVAILABILITY MANAGEMENT
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
              {/* 1-Bed Rooms */}
              <div className="bg-[#F9F7F3] p-6 border-2 border-[#E5E5E5] hover:border-[#0C0C0C] transition-colors">
                <p className="text-xs font-bold text-[#0C0C0C] uppercase tracking-wider mb-3">1-Bed Rooms</p>
                <div className="text-5xl font-black text-[#0C0C0C] mb-4 text-center">
                  {bedAvailability.one_bed}
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleBedUpdate('one_bed', false)}
                    variant="outline"
                    size="sm"
                    className="flex-1 border-2 border-[#0C0C0C]"
                    disabled={bedAvailability.one_bed === 0}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => handleBedUpdate('one_bed', true)}
                    className="flex-1 bg-[#0C0C0C] hover:bg-[#1E1E1E]"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* 2-Bed Rooms */}
              <div className="bg-[#F9F7F3] p-6 border-2 border-[#E5E5E5] hover:border-[#0C0C0C] transition-colors">
                <p className="text-xs font-bold text-[#0C0C0C] uppercase tracking-wider mb-3">2-Bed Rooms</p>
                <div className="text-5xl font-black text-[#0C0C0C] mb-4 text-center">
                  {bedAvailability.two_bed}
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleBedUpdate('two_bed', false)}
                    variant="outline"
                    size="sm"
                    className="flex-1 border-2 border-[#0C0C0C]"
                    disabled={bedAvailability.two_bed === 0}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => handleBedUpdate('two_bed', true)}
                    className="flex-1 bg-[#0C0C0C] hover:bg-[#1E1E1E]"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* 6-Bed Rooms */}
              <div className="bg-[#F9F7F3] p-6 border-2 border-[#E5E5E5] hover:border-[#0C0C0C] transition-colors">
                <p className="text-xs font-bold text-[#0C0C0C] uppercase tracking-wider mb-3">6-Bed Rooms</p>
                <div className="text-5xl font-black text-[#0C0C0C] mb-4 text-center">
                  {bedAvailability.six_bed}
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleBedUpdate('six_bed', false)}
                    variant="outline"
                    size="sm"
                    className="flex-1 border-2 border-[#0C0C0C]"
                    disabled={bedAvailability.six_bed === 0}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => handleBedUpdate('six_bed', true)}
                    className="flex-1 bg-[#0C0C0C] hover:bg-[#1E1E1E]"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* 12-Bed Rooms */}
              <div className="bg-[#F9F7F3] p-6 border-2 border-[#E5E5E5] hover:border-[#0C0C0C] transition-colors">
                <p className="text-xs font-bold text-[#0C0C0C] uppercase tracking-wider mb-3">12-Bed Rooms</p>
                <div className="text-5xl font-black text-[#0C0C0C] mb-4 text-center">
                  {bedAvailability.twelve_bed}
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleBedUpdate('twelve_bed', false)}
                    variant="outline"
                    size="sm"
                    className="flex-1 border-2 border-[#0C0C0C]"
                    disabled={bedAvailability.twelve_bed === 0}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => handleBedUpdate('twelve_bed', true)}
                    className="flex-1 bg-[#0C0C0C] hover:bg-[#1E1E1E]"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* General Ward */}
              <div className="bg-[#F9F7F3] p-6 border-2 border-[#E5E5E5] hover:border-[#0C0C0C] transition-colors">
                <p className="text-xs font-bold text-[#0C0C0C] uppercase tracking-wider mb-3">General Ward</p>
                <div className="text-5xl font-black text-[#0C0C0C] mb-4 text-center">
                  {bedAvailability.general_ward}
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleBedUpdate('general_ward', false)}
                    variant="outline"
                    size="sm"
                    className="flex-1 border-2 border-[#0C0C0C]"
                    disabled={bedAvailability.general_ward === 0}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => handleBedUpdate('general_ward', true)}
                    className="flex-1 bg-[#0C0C0C] hover:bg-[#1E1E1E]"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mb-8">
          <Button
            onClick={() => setShowAppointmentForm(!showAppointmentForm)}
            className="bg-[#0C0C0C] hover:bg-[#1E1E1E] text-white px-8 h-14 text-sm font-bold uppercase tracking-wider"
          >
            <Plus className="w-4 h-4 mr-2" />
            NEW APPOINTMENT
          </Button>
        </div>

        {/* Appointment Form */}
        {showAppointmentForm && (
          <Card className="mb-8 border-2 border-[#0C0C0C]">
            <CardHeader className="bg-white border-b-2 border-[#0C0C0C]">
              <CardTitle className="text-xl font-black uppercase tracking-tight">CREATE NEW APPOINTMENT</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleCreateAppointment} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="doctor" className="text-xs font-bold uppercase tracking-wider">Select Doctor *</Label>
                    <Select
                      value={appointment.doctor_id}
                      onValueChange={(value) => setAppointment({...appointment, doctor_id: value})}
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

                  <div>
                    <Label htmlFor="token" className="text-xs font-bold uppercase tracking-wider">Token Number *</Label>
                    <Input
                      id="token"
                      type="number"
                      required
                      value={appointment.token_number}
                      onChange={(e) => setAppointment({...appointment, token_number: e.target.value})}
                      placeholder="1"
                      className="border-2 border-gray-300"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="patient_name" className="text-xs font-bold uppercase tracking-wider">Patient Name *</Label>
                    <Input
                      id="patient_name"
                      required
                      value={appointment.patient_name}
                      onChange={(e) => setAppointment({...appointment, patient_name: e.target.value})}
                      placeholder="John Doe"
                      className="border-2 border-gray-300"
                    />
                  </div>

                  <div>
                    <Label htmlFor="patient_email" className="text-xs font-bold uppercase tracking-wider">Patient Email *</Label>
                    <Input
                      id="patient_email"
                      type="email"
                      required
                      value={appointment.patient_email}
                      onChange={(e) => setAppointment({...appointment, patient_email: e.target.value})}
                      placeholder="patient@email.com"
                      className="border-2 border-gray-300"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date" className="text-xs font-bold uppercase tracking-wider">Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      required
                      value={appointment.date}
                      onChange={(e) => setAppointment({...appointment, date: e.target.value})}
                      className="border-2 border-gray-300"
                    />
                  </div>

                  <div>
                    <Label htmlFor="time" className="text-xs font-bold uppercase tracking-wider">Time *</Label>
                    <Input
                      id="time"
                      type="time"
                      required
                      value={appointment.time}
                      onChange={(e) => setAppointment({...appointment, time: e.target.value})}
                      className="border-2 border-gray-300"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="reason" className="text-xs font-bold uppercase tracking-wider">Reason for Visit</Label>
                  <Textarea
                    id="reason"
                    value={appointment.reason}
                    onChange={(e) => setAppointment({...appointment, reason: e.target.value})}
                    placeholder="Brief description..."
                    rows={3}
                    className="border-2 border-gray-300"
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowAppointmentForm(false)}
                    className="border-2 border-[#0C0C0C]"
                  >
                    CANCEL
                  </Button>
                  <Button 
                    type="submit"
                    className="bg-[#0C0C0C] hover:bg-[#1E1E1E]"
                  >
                    CREATE APPOINTMENT
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Appointments List */}
        <Card className="border-2 border-[#0C0C0C]">
          <CardHeader className="bg-white border-b-2 border-[#0C0C0C]">
            <CardTitle className="flex items-center gap-2 text-xl font-black uppercase tracking-tight">
              <Calendar className="w-5 h-5" />
              ALL APPOINTMENTS
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {appointments.length === 0 ? (
              <div className="text-center py-12 text-[#4A4A4A]">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-[#E5E5E5]" />
                <p className="font-semibold">No appointments scheduled yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {appointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="p-4 bg-[#F9F7F3] border-2 border-[#E5E5E5] hover:border-[#0C0C0C] transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-black text-[#0C0C0C] uppercase">{apt.patient_name}</p>
                        <p className="text-sm text-[#4A4A4A]">
                          Doctor ID: {apt.doctor_id} | Token: <span className="font-bold">#{apt.token_number}</span>
                        </p>
                        <p className="text-sm text-[#4A4A4A]">
                          {apt.date} at {apt.time}
                        </p>
                        {apt.reason && (
                          <p className="text-sm text-[#4A4A4A] mt-1">Reason: {apt.reason}</p>
                        )}
                      </div>
                      <span className={`px-3 py-1 border-2 text-xs font-bold uppercase tracking-wider ${
                        apt.status === 'scheduled' ? 'bg-white border-[#0C0C0C] text-[#0C0C0C]' :
                        apt.status === 'completed' ? 'bg-green-100 border-green-600 text-green-700' :
                        'bg-gray-100 border-gray-400 text-gray-700'
                      }`}>
                        {apt.status}
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