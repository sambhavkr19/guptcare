import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Award, 
  Clock, 
  Calendar, 
  CheckCircle, 
  MessageSquare, 
  Phone, 
  Video, 
  FileText,
  Lock,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const DoctorProfilePage: React.FC = () => {
  const { selectedDoctorId, doctors, navigateTo } = useApp();

  const doctor = doctors.find(d => d.id === selectedDoctorId) || doctors[0];
  const [selectedDay, setSelectedDay] = useState(doctor.availableDays[0] || 'Today');
  const [selectedSlot, setSelectedSlot] = useState(doctor.timeSlots[0] || '11:00 AM');
  const [selectedMode, setSelectedMode] = useState<'chat' | 'audio' | 'video'>('chat');

  const handleProceedToBooking = () => {
    navigateTo('booking', { doctorId: doctor.id });
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#1E2E2B] py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => navigateTo('doctors')}
            className="text-xs font-semibold text-[#0E4D45] hover:text-[#083630] flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Doctor Directory</span>
          </button>

          <div className="flex items-center gap-2 text-xs text-[#526B64]">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>Audited Medical Registration</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Doctor Bio & Verified Credentials */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E3E0D6] shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center gap-5 pb-6 border-b border-[#F0EEE6]">
                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-[#EAE8E0] shrink-0 border border-[#D5D1C4] shadow-xs">
                  {doctor.avatar ? (
                    <img
                      src={doctor.avatar}
                      alt={doctor.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-xl text-[#0E4D45]">
                      DR
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl sm:text-2xl font-bold text-[#112F2B]">{doctor.name}</h1>
                    <span title="Verified Registration">
                      <ShieldCheck className="w-5 h-5 text-[#0E4D45]" />
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-[#0E4D45] mt-1">{doctor.speciality}</p>
                  <p className="text-xs text-[#526B64] mt-1 font-mono">
                    Registration No: {doctor.registrationNumber}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-[#526B64] mt-2">
                    <span>{doctor.experienceYears} Years Clinical Exp</span>
                    <span>·</span>
                    <span>{doctor.languages.join(', ')}</span>
                  </div>
                </div>
              </div>

              {/* Verified Credentials Box */}
              <div className="my-6 bg-[#F8FAF9] p-4 rounded-xl border border-[#DCE8E3] text-xs text-[#2A4840] space-y-2">
                <div className="flex items-center gap-2 font-bold text-[#0E4D45]">
                  <Award className="w-4 h-4" />
                  <span>Verified Qualifications &amp; Registration Body</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
                  <div>
                    <span className="text-[#68827B] block uppercase tracking-wider text-[10px]">Degrees &amp; Fellowships</span>
                    <strong className="text-[#13302B]">{doctor.qualifications}</strong>
                  </div>
                  <div>
                    <span className="text-[#68827B] block uppercase tracking-wider text-[10px]">Medical Council Register</span>
                    <strong className="text-[#13302B]">{doctor.medicalCouncil}</strong>
                  </div>
                </div>
              </div>

              {/* Full Bio */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-[#112F2B]">Clinical Practice &amp; Philosophy</h3>
                <p className="text-xs sm:text-sm text-[#445E57] leading-relaxed">
                  {doctor.bio}
                </p>
                <p className="text-xs text-[#445E57] leading-relaxed">
                  Every consultation is conducted with high patient empathy. Patients may opt for text, audio, or discreet video with the camera switched off. No judgment, no moralizing questions—only medical science and clear treatment paths.
                </p>
              </div>

              {/* Special Interest & Focus Areas */}
              <div className="pt-6 border-t border-[#F0EEE6] mt-6">
                <h3 className="text-sm font-bold text-[#112F2B] mb-3">Conditions Treated &amp; Clinical Focus</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {doctor.focusAreas.map((area, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-[#FAF9F5] border border-[#EAE7DC] text-[#294B43]">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{area}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Appointment Booking Card */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl p-6 border border-[#E3E0D6] shadow-xs sticky top-24 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#F0EEE6]">
                <div>
                  <span className="text-xs font-semibold text-[#0E4D45] uppercase tracking-wider block">Consultation Fee</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-2xl font-bold text-[#112F2B]">₹{doctor.fee}</span>
                    <span className="text-xs text-[#637973]">all inclusive</span>
                  </div>
                </div>

                <div className="text-right text-[11px] text-emerald-800 bg-[#EBF3F0] px-2.5 py-1 rounded-md">
                  <span>Free 5-day Follow-up</span>
                </div>
              </div>

              {/* Select Mode */}
              <div>
                <label className="text-xs font-bold text-[#1B3833] uppercase tracking-wider block mb-2">
                  Select Consultation Mode:
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <button
                    onClick={() => setSelectedMode('chat')}
                    className={`p-2.5 rounded-xl border text-center transition-colors cursor-pointer ${
                      selectedMode === 'chat'
                        ? 'border-[#0E4D45] bg-[#EBF3F0] text-[#0E4D45] font-bold'
                        : 'border-[#E0DCD1] text-[#4E6761] hover:bg-[#FAF9F5]'
                    }`}
                  >
                    <MessageSquare className="w-4 h-4 mx-auto mb-1 text-[#0E4D45]" />
                    <span>Private Chat</span>
                  </button>

                  <button
                    onClick={() => setSelectedMode('audio')}
                    className={`p-2.5 rounded-xl border text-center transition-colors cursor-pointer ${
                      selectedMode === 'audio'
                        ? 'border-[#0E4D45] bg-[#EBF3F0] text-[#0E4D45] font-bold'
                        : 'border-[#E0DCD1] text-[#4E6761] hover:bg-[#FAF9F5]'
                    }`}
                  >
                    <Phone className="w-4 h-4 mx-auto mb-1 text-[#0E4D45]" />
                    <span>Voice Audio</span>
                  </button>

                  <button
                    onClick={() => setSelectedMode('video')}
                    className={`p-2.5 rounded-xl border text-center transition-colors cursor-pointer ${
                      selectedMode === 'video'
                        ? 'border-[#0E4D45] bg-[#EBF3F0] text-[#0E4D45] font-bold'
                        : 'border-[#E0DCD1] text-[#4E6761] hover:bg-[#FAF9F5]'
                    }`}
                  >
                    <Video className="w-4 h-4 mx-auto mb-1 text-[#0E4D45]" />
                    <span>Discreet Video</span>
                  </button>
                </div>
              </div>

              {/* Select Day */}
              <div>
                <label className="text-xs font-bold text-[#1B3833] uppercase tracking-wider block mb-2">
                  Select Day:
                </label>
                <div className="flex gap-2 overflow-x-auto pb-1 text-xs">
                  {doctor.availableDays.map(day => (
                    <button
                      key={day}
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

              {/* Select Slot */}
              <div>
                <label className="text-xs font-bold text-[#1B3833] uppercase tracking-wider block mb-2">
                  Available Slots ({selectedDay}):
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {doctor.timeSlots.map(slot => (
                    <button
                      key={slot}
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

              {/* Booking CTA Button */}
              <div className="pt-2">
                <button
                  onClick={handleProceedToBooking}
                  className="w-full py-3.5 text-xs font-semibold text-white bg-[#0E4D45] hover:bg-[#083630] rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Proceed with {selectedSlot} on {selectedDay}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
                <p className="text-[11px] text-[#7A958E] text-center mt-2 flex items-center justify-center gap-1.5">
                  <Lock className="w-3 h-3" />
                  <span>Instant confirmation · Discreet statement billing</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
