import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Calendar, 
  Clock, 
  CreditCard, 
  CheckCircle2, 
  Lock, 
  MessageSquare, 
  Phone, 
  Video, 
  AlertCircle,
  FileText,
  User,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ConsultationMode } from '../types';

export const AppointmentBookingPage: React.FC = () => {
  const { 
    selectedDoctorId, 
    doctors, 
    intakeData, 
    patientAlias, 
    setPatientAlias, 
    addAppointment, 
    navigateTo, 
    openConsultationRoom 
  } = useApp();

  const doctor = doctors.find(d => d.id === selectedDoctorId) || doctors[0];

  const [mode, setMode] = useState<ConsultationMode>(intakeData.preferredMode || 'chat');
  const [selectedDay, setSelectedDay] = useState(doctor.availableDays[0] || 'Today');
  const [selectedSlot, setSelectedSlot] = useState(doctor.timeSlots[0] || '11:00 AM');
  const [alias, setAlias] = useState(patientAlias || 'Patient Alex');
  const [symptomNote, setSymptomNote] = useState(intakeData.primaryConcern || 'Piles / Bleeding with bowel movement and sitting discomfort');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');

  // Confirmation state
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<any | null>(null);

  const calculateFee = () => {
    if (mode === 'chat') return doctor.fee - 50 > 500 ? doctor.fee - 50 : 550;
    if (mode === 'audio') return doctor.fee;
    return doctor.fee + 100;
  };

  const finalFee = calculateFee();

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const bookingId = `APT-${Math.floor(100000 + Math.random() * 900000)}`;
      const newApt = {
        id: bookingId,
        doctorId: doctor.id,
        doctorName: doctor.name,
        doctorSpeciality: doctor.speciality,
        doctorAvatar: doctor.avatar,
        patientAlias: alias,
        date: `${selectedDay}, Oct 15`,
        timeSlot: selectedSlot,
        mode: mode,
        fee: finalFee,
        status: 'upcoming' as const,
        symptomSummary: {
          category: intakeData.categoryId || 'Anorectal Health',
          concern: symptomNote,
          duration: intakeData.duration || '2 weeks',
          severity: intakeData.severity || 'moderate',
          symptoms: intakeData.selectedSymptoms.length > 0 ? intakeData.selectedSymptoms : ['Bleeding with bowel movement', 'Discomfort']
        },
        meetingUrl: `https://guptcare.private.room/${bookingId.toLowerCase()}`,
        createdAt: new Date().toISOString()
      };

      addAppointment(newApt);
      setPatientAlias(alias);
      setConfirmedBooking(newApt);
      setIsProcessing(false);
    }, 900);
  };

  // If appointment just confirmed, show the booking ticket
  if (confirmedBooking) {
    return (
      <div className="min-h-screen bg-[#FAF9F5] text-[#1E2E2B] py-12">
        <div className="max-w-xl mx-auto px-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DCD8CC] shadow-md text-center space-y-6">
            <div className="w-14 h-14 rounded-full bg-[#EBF3F0] text-[#0E4D45] mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-[#0E4D45]" />
            </div>

            <div>
              <span className="text-xs font-semibold text-[#0E4D45] uppercase tracking-wider block mb-1">
                Booking Confirmed (Demo Simulation)
              </span>
              <h1 className="text-2xl font-bold text-[#112F2B]">
                Your Private Slot is Reserved
              </h1>
              <p className="text-xs text-[#526B64] mt-1.5">
                Booking ID: <strong className="font-mono text-[#112F2B]">{confirmedBooking.id}</strong>
              </p>
            </div>

            {/* Ticket Card */}
            <div className="bg-[#FAF9F5] p-5 rounded-2xl border border-[#E6E3DA] text-left text-xs space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-[#E8E5DC]">
                <div>
                  <span className="text-[10px] text-[#7A958E] uppercase tracking-wider block">Doctor</span>
                  <strong className="text-[#112F2B] text-sm">{confirmedBooking.doctorName}</strong>
                  <span className="text-[11px] text-[#526B64] block">{confirmedBooking.doctorSpeciality}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-[#7A958E] uppercase tracking-wider block">Mode</span>
                  <strong className="capitalize text-[#0E4D45]">{confirmedBooking.mode} Consultation</strong>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pb-3 border-b border-[#E8E5DC]">
                <div>
                  <span className="text-[10px] text-[#7A958E] uppercase tracking-wider block">Date &amp; Slot</span>
                  <span className="font-bold text-[#112F2B]">{confirmedBooking.date} at {confirmedBooking.timeSlot}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#7A958E] uppercase tracking-wider block">Pseudonym / Alias</span>
                  <span className="font-bold text-[#112F2B]">{confirmedBooking.patientAlias}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[#526B64]">Total Simulated Charge:</span>
                <span className="font-bold text-[#112F2B] text-sm">₹{confirmedBooking.fee} (Billed as &quot;GC Health Care&quot;)</span>
              </div>
            </div>

            {/* Reassurance text */}
            <div className="bg-[#FFF9F3] p-3.5 rounded-xl border border-[#F2DECC] text-[11px] text-[#8C3F13] text-left flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-[#C05621] mt-0.5" />
              <div>
                <strong>Simulation Notice:</strong> No real money has been charged. This appointment is saved in your local session and can be tested live in the private consultation room right now.
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => openConsultationRoom(confirmedBooking)}
                className="flex-1 py-3 text-xs font-semibold text-white bg-[#0E4D45] hover:bg-[#083630] rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Enter Private Room Now</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => navigateTo('patient-dashboard')}
                className="flex-1 py-3 text-xs font-semibold text-[#1B3833] bg-[#EFECE3] hover:bg-[#E2DFD5] rounded-xl transition-colors cursor-pointer"
              >
                Go to Patient Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#1E2E2B] py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => navigateTo('doctors')}
            className="text-xs font-semibold text-[#0E4D45] hover:text-[#083630] flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Choose Different Doctor</span>
          </button>

          <div className="flex items-center gap-2 text-xs text-[#526B64]">
            <Lock className="w-3.5 h-3.5 text-emerald-700" />
            <span>Discreet Booking Protection</span>
          </div>
        </div>

        {/* Doctor Summary Header */}
        <div className="bg-white rounded-2xl p-5 border border-[#E3E0D6] shadow-xs mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#ECE8DF] shrink-0 border border-[#D7D2C5]">
              {doctor.avatar ? (
                <img
                  src={doctor.avatar}
                  alt={doctor.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-bold text-[#0E4D45]">
                  DR
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="font-bold text-base text-[#112F2B]">{doctor.name}</h2>
                <ShieldCheck className="w-4 h-4 text-[#0E4D45]" />
              </div>
              <p className="text-xs text-[#0E4D45] font-semibold">{doctor.speciality}</p>
              <p className="text-[11px] text-[#637973] font-mono">Reg: {doctor.registrationNumber} ({doctor.medicalCouncil})</p>
            </div>
          </div>

          <div className="sm:text-right">
            <span className="text-[10px] text-[#7A958E] uppercase tracking-wider block">Consultation Fee</span>
            <span className="text-xl font-bold text-[#112F2B]">₹{finalFee}</span>
            <span className="text-[10px] text-emerald-700 block">No platform or booking surcharge</span>
          </div>
        </div>

        <form onSubmit={handleConfirmBooking} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Booking Options */}
          <div className="lg:col-span-7 space-y-6">
            {/* Consultation Mode */}
            <div className="bg-white rounded-2xl p-6 border border-[#E3E0D6] shadow-xs space-y-3">
              <label className="text-xs font-bold text-[#1B3833] uppercase tracking-wider block">
                1. Select Consultation Mode:
              </label>
              <div className="grid grid-cols-3 gap-2.5 text-xs">
                <button
                  type="button"
                  onClick={() => setMode('chat')}
                  className={`p-3 rounded-xl border text-center transition-colors cursor-pointer ${
                    mode === 'chat'
                      ? 'border-[#0E4D45] bg-[#EBF3F0] text-[#0E4D45] font-bold'
                      : 'border-[#E0DCD1] text-[#4E6761] hover:bg-[#FAF9F5]'
                  }`}
                >
                  <MessageSquare className="w-4 h-4 mx-auto mb-1 text-[#0E4D45]" />
                  <span className="block font-semibold">Private Chat</span>
                  <span className="text-[10px] text-[#7A958E]">Text exchange</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMode('audio')}
                  className={`p-3 rounded-xl border text-center transition-colors cursor-pointer ${
                    mode === 'audio'
                      ? 'border-[#0E4D45] bg-[#EBF3F0] text-[#0E4D45] font-bold'
                      : 'border-[#E0DCD1] text-[#4E6761] hover:bg-[#FAF9F5]'
                  }`}
                >
                  <Phone className="w-4 h-4 mx-auto mb-1 text-[#0E4D45]" />
                  <span className="block font-semibold">Voice Audio</span>
                  <span className="text-[10px] text-[#7A958E]">Camera off</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMode('video')}
                  className={`p-3 rounded-xl border text-center transition-colors cursor-pointer ${
                    mode === 'video'
                      ? 'border-[#0E4D45] bg-[#EBF3F0] text-[#0E4D45] font-bold'
                      : 'border-[#E0DCD1] text-[#4E6761] hover:bg-[#FAF9F5]'
                  }`}
                >
                  <Video className="w-4 h-4 mx-auto mb-1 text-[#0E4D45]" />
                  <span className="block font-semibold">Discreet Video</span>
                  <span className="text-[10px] text-[#7A958E]">Visual optional</span>
                </button>
              </div>
            </div>

            {/* Date & Slot */}
            <div className="bg-white rounded-2xl p-6 border border-[#E3E0D6] shadow-xs space-y-4">
              <label className="text-xs font-bold text-[#1B3833] uppercase tracking-wider block">
                2. Select Date &amp; Time Slot:
              </label>

              <div>
                <span className="text-[11px] text-[#637973] block mb-1.5">Choose Day:</span>
                <div className="flex gap-2 overflow-x-auto pb-1 text-xs">
                  {doctor.availableDays.map(day => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => setSelectedDay(day)}
                      className={`px-3 py-2 rounded-xl border text-center transition-colors shrink-0 cursor-pointer ${
                        selectedDay === day
                          ? 'border-[#0E4D45] bg-[#EBF3F0] text-[#0E4D45] font-bold'
                          : 'border-[#E0DCD1] text-[#4E6761] hover:bg-[#FAF9F5]'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[11px] text-[#637973] block mb-1.5">Available Slots on {selectedDay}:</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  {doctor.timeSlots.map(slot => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={`p-2 rounded-lg border text-center transition-colors cursor-pointer ${
                        selectedSlot === slot
                          ? 'border-[#0E4D45] bg-[#0E4D45] text-white font-bold'
                          : 'border-[#E0DCD1] text-[#3D554F] hover:bg-[#FAF9F5]'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Privacy Alias & Symptom Context */}
            <div className="bg-white rounded-2xl p-6 border border-[#E3E0D6] shadow-xs space-y-4">
              <label className="text-xs font-bold text-[#1B3833] uppercase tracking-wider block">
                3. Privacy Alias &amp; Clinical Notes:
              </label>

              <div>
                <label className="text-xs font-medium text-[#2F4A44] block mb-1">
                  Patient Display Alias (For clinician greeting):
                </label>
                <input
                  type="text"
                  value={alias}
                  onChange={(e) => setAlias(e.target.value)}
                  placeholder="e.g. Patient Jordan, Alex, Anonymous..."
                  className="w-full bg-[#FAF9F6] border border-[#DDD9CE] rounded-xl px-3 py-2 text-xs text-[#1B3833] focus:outline-none focus:ring-2 focus:ring-[#0E4D45]/30 focus:border-[#0E4D45]"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[#2F4A44] block mb-1">
                  Symptom Brief (Encrypted for clinician review):
                </label>
                <textarea
                  value={symptomNote}
                  onChange={(e) => setSymptomNote(e.target.value)}
                  rows={2}
                  className="w-full bg-[#FAF9F6] border border-[#DDD9CE] rounded-xl p-3 text-xs text-[#1B3833] focus:outline-none focus:ring-2 focus:ring-[#0E4D45]/30 focus:border-[#0E4D45]"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Transparent Fee & Mock Payment */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-[#E3E0D6] shadow-xs space-y-5">
              <h3 className="text-sm font-bold text-[#112F2B] pb-3 border-b border-[#F0EEE6]">
                Billing Summary
              </h3>

              <div className="space-y-2.5 text-xs text-[#445E57]">
                <div className="flex justify-between">
                  <span>Specialist Consultation Fee</span>
                  <span className="font-semibold text-[#112F2B]">₹{finalFee}</span>
                </div>
                <div className="flex justify-between">
                  <span>GuptCare Privacy Encryption</span>
                  <span className="font-semibold text-emerald-800">Free</span>
                </div>
                <div className="flex justify-between">
                  <span>5-Day Digital Follow-up</span>
                  <span className="font-semibold text-emerald-800">Included</span>
                </div>
                <div className="pt-2 border-t border-[#F0EEE6] flex justify-between text-sm font-bold text-[#112F2B]">
                  <span>Total Amount</span>
                  <span>₹{finalFee}</span>
                </div>
              </div>

              {/* Discreet Billing Notice */}
              <div className="bg-[#FAF9F5] p-3 rounded-xl border border-[#EAE7DC] text-[11px] text-[#526B64] space-y-1">
                <span className="font-bold text-[#112F2B] block">Bank Statement Privacy:</span>
                <span>
                  Charges will appear as <strong>&quot;GC Health Care&quot;</strong>. Neither doctor specialty nor medical terms will appear on your banking logs.
                </span>
              </div>

              {/* Mock Payment Simulation Selector */}
              <div>
                <span className="text-xs font-bold text-[#1B3833] uppercase tracking-wider block mb-2">
                  Payment Simulation Mode:
                </span>
                <div className="space-y-2 text-xs">
                  <label className="flex items-center gap-2 p-2.5 rounded-xl border border-[#DDD9CE] bg-[#FAF9F6] cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'upi'}
                      onChange={() => setPaymentMethod('upi')}
                      className="accent-[#0E4D45]"
                    />
                    <span className="font-semibold text-[#112F2B]">UPI / QR (Demo Simulation)</span>
                  </label>
                  <label className="flex items-center gap-2 p-2.5 rounded-xl border border-[#DDD9CE] bg-[#FAF9F6] cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      className="accent-[#0E4D45]"
                    />
                    <span className="font-semibold text-[#112F2B]">Credit / Debit Card (Demo Simulation)</span>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3.5 text-xs font-semibold text-white bg-[#0E4D45] hover:bg-[#083630] rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <span>Securing Private Consultation Slot...</span>
                ) : (
                  <>
                    <span>Confirm &amp; Book Appointment</span>
                    <Lock className="w-3.5 h-3.5" />
                  </>
                )}
              </button>

              <p className="text-[10px] text-[#7A958E] text-center">
                Phase 1 Prototype: Mock payment processed instantly with realistic confirmation records.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
