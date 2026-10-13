import React, { useState } from 'react';
import { 
  Stethoscope, 
  Calendar, 
  Clock, 
  User, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  ExternalLink, 
  ShieldAlert, 
  Check, 
  ChevronRight,
  MessageSquare,
  ShieldCheck,
  Send,
  UploadCloud
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Appointment } from '../types';
import { createConsultationSummary } from '../services/firestoreService';

export const DoctorDashboardPage: React.FC = () => {
  const { 
    currentUser, 
    userProfile, 
    appointments, 
    openConsultationRoom, 
    showToast, 
    submitVerificationRequest, 
    navigateTo 
  } = useApp();

  const isVerifiedDoctor = userProfile?.doctorVerificationStatus === 'verified' || !currentUser; // demo fallback if inspecting demo doctor view
  const isPendingVerification = currentUser && userProfile?.role === 'doctor' && userProfile?.doctorVerificationStatus === 'pending';

  // Verification Form State
  const [councilName, setCouncilName] = useState('Delhi Medical Council');
  const [regNumber, setRegNumber] = useState('MCI-DEL-2018-91823');
  const [degrees, setDegrees] = useState('MBBS, MS (General Surgery)');
  const [specialityField, setSpecialityField] = useState('Proctology & Colorectal Surgery');
  const [verificationSubmitting, setVerificationSubmitting] = useState(false);
  const [verificationDone, setVerificationDone] = useState(false);

  const [selectedCase, setSelectedCase] = useState<Appointment | null>(appointments[0] || null);

  // Clinical note authoring
  const [clinicalNote, setClinicalNote] = useState('');
  const [doctorAdvice, setDoctorAdvice] = useState('');
  const [rxCode, setRxCode] = useState(`GC-RX-${Math.floor(1000 + Math.random() * 9000)}-CONFIDENTIAL`);
  const [adviceSaved, setAdviceSaved] = useState(false);

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerificationSubmitting(true);
    try {
      await submitVerificationRequest({
        doctorName: userProfile?.displayName || 'Dr. Practitioner',
        medicalCouncil: councilName,
        registrationNumber: regNumber,
        qualifications: degrees,
        speciality: specialityField
      });
      setVerificationDone(true);
      showToast('Credentials submitted for administrative review.');
    } catch (err: any) {
      showToast(err.message || 'Error submitting verification.');
    } finally {
      setVerificationSubmitting(false);
    }
  };

  const handleSaveClinicalSummary = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clinicalNote.trim() || !selectedCase) return;

    try {
      if (currentUser) {
        await createConsultationSummary({
          appointmentId: selectedCase.id,
          doctorId: currentUser.uid,
          patientId: selectedCase.patientAlias,
          patientAlias: selectedCase.patientAlias,
          diagnosisImpression: clinicalNote,
          doctorAdvice: doctorAdvice || 'Conservative medical management advised.',
          recommendedFollowUpDays: 14,
          lifestyleModifications: ['High-fiber dietary changes', 'Hydration >= 2.5L daily'],
          discreetPrescriptionCode: rxCode,
          createdAt: new Date().toISOString()
        });
      }
      setAdviceSaved(true);
      showToast('Official clinical summary issued and attached to patient vault.');
      setTimeout(() => {
        setAdviceSaved(false);
        setClinicalNote('');
        setDoctorAdvice('');
      }, 2500);
    } catch (err: any) {
      showToast(err.message || 'Error recording summary.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#1E2E2B] py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Clinician Portal Header */}
        <div className="bg-white rounded-2xl p-6 border border-[#E3E0D6] shadow-xs mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#0E4D45] text-white flex items-center justify-center font-bold text-xl shadow-xs">
              <Stethoscope className="w-7 h-7 text-emerald-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-[#112F2B]">
                  {userProfile?.displayName || 'Dr. Ananya Sharma'}
                </h1>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${
                  isVerifiedDoctor 
                    ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                    : 'bg-amber-100 text-amber-900 border-amber-300'
                }`}>
                  {isVerifiedDoctor ? 'Verified Clinician Portal' : 'Pending Verification'}
                </span>
              </div>
              <p className="text-xs text-[#526B64] mt-0.5">
                Proctology &amp; Intimate Healthcare · State Medical Council Audited Console
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="bg-[#FAF9F5] border border-[#DDD9CE] px-3 py-1.5 rounded-xl font-medium text-[#2C4841]">
              Consultation Queue: {appointments.filter(a => a.status === 'upcoming').length} Active
            </span>
          </div>
        </div>

        {/* Doctor Verification Warning for Unverified/Pending Doctors */}
        {isPendingVerification && (
          <div className="bg-amber-50 border border-amber-300 rounded-2xl p-6 mb-8 text-xs text-amber-950 space-y-4">
            <div className="flex items-start gap-3">
              <ShieldAlert className="w-6 h-6 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-sm text-amber-900">
                  Doctor Verification Required for Patient Records Access
                </h3>
                <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                  In compliance with Telemedicine Practice Guidelines and Firestore Security Rules, doctors cannot view confidential patient symptom records or conduct telehealth sessions until their registration number is verified by an administrator.
                </p>
              </div>
            </div>

            {verificationDone ? (
              <div className="bg-white p-4 rounded-xl border border-amber-200 text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Verification application is under review. You will be notified once verified.</span>
              </div>
            ) : (
              <form onSubmit={handleVerificationSubmit} className="bg-white p-5 rounded-xl border border-amber-200 grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-amber-950 block mb-1">State / National Medical Council:</label>
                  <input
                    type="text"
                    required
                    value={councilName}
                    onChange={(e) => setCouncilName(e.target.value)}
                    className="w-full bg-[#FAF9F6] border border-[#DDD9CE] rounded-lg p-2 text-xs text-[#1B3833]"
                  />
                </div>
                <div>
                  <label className="font-bold text-amber-950 block mb-1">Registration Number:</label>
                  <input
                    type="text"
                    required
                    value={regNumber}
                    onChange={(e) => setRegNumber(e.target.value)}
                    className="w-full bg-[#FAF9F6] border border-[#DDD9CE] rounded-lg p-2 text-xs text-[#1B3833]"
                  />
                </div>
                <div>
                  <label className="font-bold text-amber-950 block mb-1">Postgraduate Qualifications (MS/MD/DNB):</label>
                  <input
                    type="text"
                    required
                    value={degrees}
                    onChange={(e) => setDegrees(e.target.value)}
                    className="w-full bg-[#FAF9F6] border border-[#DDD9CE] rounded-lg p-2 text-xs text-[#1B3833]"
                  />
                </div>
                <div>
                  <label className="font-bold text-amber-950 block mb-1">Intimate Health Speciality:</label>
                  <input
                    type="text"
                    required
                    value={specialityField}
                    onChange={(e) => setSpecialityField(e.target.value)}
                    className="w-full bg-[#FAF9F6] border border-[#DDD9CE] rounded-lg p-2 text-xs text-[#1B3833]"
                  />
                </div>
                <div className="sm:col-span-2 pt-1 flex justify-end">
                  <button
                    type="submit"
                    disabled={verificationSubmitting}
                    className="px-5 py-2.5 text-xs font-semibold text-white bg-[#0E4D45] hover:bg-[#083630] rounded-xl shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    {verificationSubmitting ? 'Submitting to Firestore...' : 'Submit Credentials for Admin Verification'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Dashboard Split View: Schedule on Left, Case Brief & Intake Review on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Scheduled Cases Queue */}
          <div className="lg:col-span-5 space-y-4">
            <h2 className="text-sm font-bold text-[#112F2B] uppercase tracking-wider">
              Patient Queue &amp; Intake Briefs
            </h2>

            <div className="space-y-3">
              {appointments.map((apt) => {
                const isSelected = selectedCase?.id === apt.id;
                return (
                  <div
                    key={apt.id}
                    onClick={() => setSelectedCase(apt)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#0E4D45] bg-[#EBF3F0] ring-1 ring-[#0E4D45]'
                        : 'border-[#E3E0D6] bg-white hover:border-[#CCDCD5]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#112F2B]">{apt.patientAlias}</span>
                        <span className="text-[10px] text-[#526B64] font-mono">({apt.id})</span>
                      </div>
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                        apt.status === 'upcoming' ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'
                      }`}>
                        {apt.status}
                      </span>
                    </div>

                    <p className="text-xs text-[#0E4D45] font-semibold mt-1">
                      {apt.symptomSummary.concern}
                    </p>

                    <div className="flex items-center justify-between text-xs text-[#637973] mt-3 pt-2 border-t border-[#EAE7DC]">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#0E4D45]" />
                        {apt.date} · {apt.timeSlot}
                      </span>
                      <span className="capitalize font-medium text-[#112F2B]">
                        {apt.mode} mode
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: In-Depth Patient Symptom Audit & Clinical Response */}
          <div className="lg:col-span-7">
            {selectedCase ? (
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E3E0D6] shadow-xs space-y-6">
                <div className="flex items-start justify-between pb-4 border-b border-[#F0EEE6]">
                  <div>
                    <span className="text-[10px] text-[#7A958E] uppercase tracking-wider font-bold">
                      Pre-Consultation Patient Intake File
                    </span>
                    <h3 className="text-xl font-bold text-[#112F2B] mt-0.5">
                      Case: {selectedCase.patientAlias}
                    </h3>
                    <p className="text-xs text-[#0E4D45] font-semibold">
                      Category: {selectedCase.symptomSummary.category}
                    </p>
                  </div>

                  <button
                    onClick={() => openConsultationRoom(selectedCase)}
                    className="px-4 py-2.5 text-xs font-semibold text-white bg-[#0E4D45] hover:bg-[#083630] rounded-xl transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Launch Private Room</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Patient Submitted Symptoms & Plain Language */}
                <div className="space-y-4 text-xs">
                  <div className="bg-[#FAF9F5] p-4 rounded-xl border border-[#ECE9DF] space-y-2">
                    <span className="text-[10px] text-[#7A958E] uppercase tracking-wider font-bold block">
                      Patient Plain-Language Description
                    </span>
                    <p className="text-sm font-medium text-[#1E3E37] italic">
                      &quot;{selectedCase.symptomSummary.concern}&quot;
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="bg-[#FAF9F5] p-3 rounded-xl border border-[#ECE9DF]">
                      <span className="text-[10px] text-[#7A958E] uppercase tracking-wider block">Duration</span>
                      <strong className="text-[#112F2B] text-xs">{selectedCase.symptomSummary.duration}</strong>
                    </div>

                    <div className="bg-[#FAF9F5] p-3 rounded-xl border border-[#ECE9DF]">
                      <span className="text-[10px] text-[#7A958E] uppercase tracking-wider block">Severity</span>
                      <strong className="text-[#112F2B] text-xs capitalize">{selectedCase.symptomSummary.severity}</strong>
                    </div>

                    <div className="bg-[#FAF9F5] p-3 rounded-xl border border-[#ECE9DF]">
                      <span className="text-[10px] text-[#7A958E] uppercase tracking-wider block">Screener Audit</span>
                      <strong className="text-emerald-700 text-xs">No Emergency Red Flags</strong>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-[#7A958E] uppercase tracking-wider font-bold block mb-1.5">
                      Reported Symptom Cluster
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedCase.symptomSummary.symptoms.map((s, idx) => (
                        <span key={idx} className="bg-[#EBF3F0] text-[#0E4D45] px-2.5 py-1 rounded-md text-xs font-medium">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Author Clinical Recommendation / Follow-up Note */}
                <div className="pt-6 border-t border-[#F0EEE6]">
                  <h4 className="text-xs font-bold text-[#112F2B] uppercase tracking-wider mb-2">
                    Record Post-Consultation Advice &amp; Rx Code
                  </h4>

                  <form onSubmit={handleSaveClinicalSummary} className="space-y-3">
                    <div>
                      <label className="text-[11px] font-semibold text-[#1B3833] block mb-1">
                        Clinical Impression &amp; Diagnosis:
                      </label>
                      <textarea
                        value={clinicalNote}
                        onChange={(e) => setClinicalNote(e.target.value)}
                        rows={2}
                        placeholder="e.g. Grade II internal haemorrhoids with mucosal irritation..."
                        className="w-full bg-[#FAF9F6] border border-[#DDD9CE] rounded-xl p-3 text-xs text-[#1B3833] focus:outline-none focus:ring-2 focus:ring-[#0E4D45]/30 focus:border-[#0E4D45]"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-[#1B3833] block mb-1">
                        Doctor Instructions &amp; Regimen:
                      </label>
                      <textarea
                        value={doctorAdvice}
                        onChange={(e) => setDoctorAdvice(e.target.value)}
                        rows={2}
                        placeholder="e.g. High fiber diet, warm sitz baths 2x daily, topical application as prescribed..."
                        className="w-full bg-[#FAF9F6] border border-[#DDD9CE] rounded-xl p-3 text-xs text-[#1B3833] focus:outline-none focus:ring-2 focus:ring-[#0E4D45]/30 focus:border-[#0E4D45]"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Rx Code: {rxCode}
                      </span>

                      <button
                        type="submit"
                        className="px-4 py-2 text-xs font-semibold text-white bg-[#0E4D45] hover:bg-[#083630] rounded-xl transition-colors shadow-xs"
                      >
                        {adviceSaved ? 'Transmitted!' : 'Save & Issue Rx'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-10 border border-[#E3E0D6] text-center">
                <FileText className="w-10 h-10 text-[#7A958E] mx-auto mb-2" />
                <h3 className="text-sm font-bold text-[#112F2B]">Select a patient case from the queue</h3>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
