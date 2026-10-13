import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MessageSquare, 
  Phone, 
  Video, 
  Lock, 
  FileText, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  User, 
  Settings, 
  ChevronRight,
  Shield,
  Trash2,
  Edit3
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Appointment } from '../types';

export const PatientDashboardPage: React.FC = () => {
  const { 
    appointments, 
    cancelAppointment, 
    openConsultationRoom, 
    patientAlias, 
    setPatientAlias, 
    navigateTo, 
    showToast,
    currentUser,
    userProfile 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'prescriptions' | 'settings'>('upcoming');
  const [selectedSummaryModal, setSelectedSummaryModal] = useState<Appointment | null>(null);

  // Edit name and pseudonym state
  const [editingName, setEditingName] = useState(userProfile?.displayName || '');
  const [editingAlias, setEditingAlias] = useState(patientAlias);
  const [profileSaved, setProfileSaved] = useState(false);

  const upcomingApts = appointments.filter(a => a.status === 'upcoming');
  const pastApts = appointments.filter(a => a.status === 'completed');

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setPatientAlias(editingAlias);
    setProfileSaved(true);
    if (currentUser) {
      try {
        const { updateUserProfileName } = await import('../services/firestoreService');
        await updateUserProfileName(currentUser.uid, editingName, editingAlias);
      } catch (err) {
        console.warn('Firestore profile update notice:', err);
      }
    }
    showToast('Profile name and consultation alias updated in Cloud Firestore.');
    setTimeout(() => setProfileSaved(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#1E2E2B] py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Dashboard Top Banner */}
        <div className="bg-white rounded-2xl p-6 border border-[#E3E0D6] shadow-xs mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#EBF3F0] text-[#0E4D45] flex items-center justify-center font-bold text-xl border border-[#D0E2DB]">
              {patientAlias.charAt(0) || 'P'}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-[#112F2B]">{patientAlias}</h1>
                <span className="text-[11px] bg-[#EBF3F0] text-[#0E4D45] font-semibold px-2 py-0.5 rounded border border-[#D0E2DB]">
                  Pseudonymous Profile
                </span>
                <button
                  onClick={() => setActiveTab('settings')}
                  className="text-xs text-[#0E4D45] hover:bg-[#EBF3F0] font-semibold flex items-center gap-1 cursor-pointer bg-white px-2.5 py-1 rounded-md border border-[#D0E2DB] shadow-2xs transition-colors"
                  title="Click to edit your legal name and consultation pseudonym"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Change Name / Pseudonym</span>
                </button>
              </div>
              <p className="text-xs text-[#526B64] mt-0.5">
                Private Health Vault · Encrypted Records · No Public Footprint
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateTo('intake')}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#0E4D45] hover:bg-[#083630] rounded-xl transition-colors shadow-xs"
            >
              New Symptom Intake
            </button>
            <button
              onClick={() => navigateTo('privacy')}
              className="px-3.5 py-2 text-xs font-medium text-[#294841] bg-[#FAF9F5] border border-[#DDD9CE] hover:bg-[#EFECE3] rounded-xl transition-colors"
            >
              Privacy Controls
            </button>
          </div>
        </div>

        {/* Demo Data Disclaimer */}
        <div className="bg-[#FFF9F3] border border-[#F2DECC] rounded-xl px-4 py-3 mb-8 text-xs text-[#8C3F13] flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#C05621] shrink-0" />
            <span>
              <strong>Demo Environment:</strong> The consultation records and clinical summaries shown below are fictional sample cases to illustrate the patient experience.
            </span>
          </div>
          <span className="text-[11px] text-[#A04518] whitespace-nowrap hidden sm:inline">Phase 1 Prototype</span>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-[#E3E0D6] pb-3 mb-6 text-xs font-medium">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-4 py-2 rounded-xl transition-colors cursor-pointer ${
              activeTab === 'upcoming'
                ? 'bg-[#0E4D45] text-white font-semibold'
                : 'text-[#445E57] hover:bg-[#EFECE3]'
            }`}
          >
            Upcoming Consultations ({upcomingApts.length})
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`px-4 py-2 rounded-xl transition-colors cursor-pointer ${
              activeTab === 'past'
                ? 'bg-[#0E4D45] text-white font-semibold'
                : 'text-[#445E57] hover:bg-[#EFECE3]'
            }`}
          >
            Past Consultations ({pastApts.length})
          </button>
          <button
            onClick={() => setActiveTab('prescriptions')}
            className={`px-4 py-2 rounded-xl transition-colors cursor-pointer ${
              activeTab === 'prescriptions'
                ? 'bg-[#0E4D45] text-white font-semibold'
                : 'text-[#445E57] hover:bg-[#EFECE3]'
            }`}
          >
            Clinical Summaries &amp; Rx
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-xl transition-colors cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-[#0E4D45] text-white font-semibold'
                : 'text-[#445E57] hover:bg-[#EFECE3]'
            }`}
          >
            Profile &amp; Pseudonym
          </button>
        </div>

        {/* TAB 1: UPCOMING APPOINTMENTS */}
        {activeTab === 'upcoming' && (
          <div className="space-y-4">
            {upcomingApts.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 border border-[#E3E0D6] text-center">
                <Calendar className="w-10 h-10 text-[#7A958E] mx-auto mb-3" />
                <h3 className="text-base font-bold text-[#112F2B]">No upcoming appointments</h3>
                <p className="text-xs text-[#526B64] mt-1">
                  You have no scheduled consultations. Book a slot when you are ready to discuss your concerns.
                </p>
                <button
                  onClick={() => navigateTo('doctors')}
                  className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-[#0E4D45] hover:bg-[#083630] rounded-xl"
                >
                  Find a Doctor
                </button>
              </div>
            ) : (
              upcomingApts.map(apt => (
                <div
                  key={apt.id}
                  className="bg-white rounded-2xl p-6 border border-[#E3E0D6] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#ECE8DE] shrink-0 border border-[#D5D0C2]">
                      {apt.doctorAvatar ? (
                        <img
                          src={apt.doctorAvatar}
                          alt={apt.doctorName}
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
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-base text-[#112F2B]">{apt.doctorName}</h3>
                        <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          Confirmed Slot
                        </span>
                      </div>
                      <p className="text-xs text-[#0E4D45] font-semibold">{apt.doctorSpeciality}</p>
                      <div className="flex items-center gap-3 text-xs text-[#526B64] mt-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-[#0E4D45]" />
                          {apt.date}
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[#0E4D45]" />
                          {apt.timeSlot}
                        </span>
                        <span>·</span>
                        <span className="capitalize font-medium text-[#112F2B]">
                          {apt.mode} consultation
                        </span>
                      </div>
                      <p className="text-[11px] text-[#637973] mt-2">
                        Reason: <strong className="text-[#2F4A44]">{apt.symptomSummary.concern}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                    <button
                      onClick={() => openConsultationRoom(apt)}
                      className="px-5 py-2.5 text-xs font-semibold text-white bg-[#0E4D45] hover:bg-[#083630] rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Join Private Room</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => cancelAppointment(apt.id)}
                      className="px-3.5 py-2.5 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-xl transition-colors cursor-pointer"
                    >
                      Cancel Discreetly
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 2: PAST CONSULTATIONS */}
        {activeTab === 'past' && (
          <div className="space-y-4">
            {pastApts.map(apt => (
              <div
                key={apt.id}
                className="bg-white rounded-2xl p-6 border border-[#E3E0D6] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-[#112F2B]">{apt.doctorName}</h3>
                    <span className="text-[10px] text-[#526B64] bg-[#F2EFE8] px-2 py-0.5 rounded">
                      Completed on {apt.date}
                    </span>
                  </div>
                  <p className="text-xs text-[#0E4D45] font-semibold">{apt.doctorSpeciality}</p>
                  <p className="text-xs text-[#526B64] mt-1.5">
                    Concern Evaluated: <span className="text-[#112F2B] font-medium">{apt.symptomSummary.concern}</span>
                  </p>
                  {apt.clinicalSummary && (
                    <p className="text-xs text-[#35524B] mt-2 italic bg-[#FAF9F5] p-2.5 rounded-lg border border-[#ECE9DF]">
                      &quot;{apt.clinicalSummary.diagnosisImpression}&quot;
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedSummaryModal(apt)}
                    className="px-4 py-2 text-xs font-semibold text-[#0E4D45] bg-[#EBF3F0] hover:bg-[#DFECE7] rounded-xl flex items-center gap-1.5 cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>View Doctor Summary &amp; Rx</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: CLINICAL SUMMARIES & PRESCRIPTIONS */}
        {activeTab === 'prescriptions' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-[#E3E0D6] shadow-xs">
              <h3 className="text-base font-bold text-[#112F2B] mb-2">
                Digital Prescriptions &amp; Clinical Management Notes
              </h3>
              <p className="text-xs text-[#526B64] mb-6">
                All clinical records generated on Nivara are issued under strict privacy. They do not leak into public health registries unless you explicitly export them.
              </p>

              {pastApts.map(apt => (
                <div key={apt.id} className="p-5 rounded-xl border border-[#E6E3DA] bg-[#FAF9F5] mb-4 space-y-3 text-xs">
                  <div className="flex items-center justify-between border-b border-[#EAE7DC] pb-3">
                    <div>
                      <span className="text-[10px] text-[#7A958E] uppercase tracking-wider block">Prescription ID</span>
                      <strong className="font-mono text-[#0E4D45] text-sm">
                        {apt.clinicalSummary?.discreetPrescriptionCode || 'GC-RX-9924-CONFIDENTIAL'}
                      </strong>
                    </div>
                    <span className="text-xs text-[#526B64]">{apt.date}</span>
                  </div>

                  <div>
                    <span className="font-semibold text-[#112F2B] block mb-0.5">Doctor Impression:</span>
                    <p className="text-[#3E5C54]">{apt.clinicalSummary?.diagnosisImpression}</p>
                  </div>

                  <div>
                    <span className="font-semibold text-[#112F2B] block mb-0.5">Clinical Advice:</span>
                    <p className="text-[#3E5C54]">{apt.clinicalSummary?.doctorAdvice}</p>
                  </div>

                  {apt.clinicalSummary?.lifestyleModifications && (
                    <div>
                      <span className="font-semibold text-[#112F2B] block mb-1">Recommended Adjustments:</span>
                      <ul className="list-disc pl-4 space-y-0.5 text-[#3E5C54]">
                        {apt.clinicalSummary.lifestyleModifications.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: PROFILE & PSEUDONYM SETTINGS */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E3E0D6] shadow-xs max-w-xl">
            <h3 className="text-base font-bold text-[#112F2B] mb-2">
              Profile Name &amp; Consultation Pseudonym
            </h3>
            <p className="text-xs text-[#526B64] mb-6">
              You have complete control over both your private account name and the pseudonymous alias displayed to clinicians in consultation rooms.
            </p>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-[#1B3833] uppercase tracking-wider block mb-1">
                  Account Name / Member Name:
                </label>
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  placeholder="e.g. Alex Sharma"
                  className="w-full bg-[#FAF9F6] border border-[#DDD9CE] rounded-xl px-3 py-2 text-xs text-[#1B3833] focus:outline-none focus:ring-2 focus:ring-[#0E4D45]/30 focus:border-[#0E4D45]"
                />
                <span className="text-[10px] text-[#7A958E] mt-1 block">
                  Private to your account record; kept confidential.
                </span>
              </div>

              <div>
                <label className="font-bold text-[#1B3833] uppercase tracking-wider block mb-1">
                  Active Consultation Alias (Pseudonym):
                </label>
                <input
                  type="text"
                  value={editingAlias}
                  onChange={(e) => setEditingAlias(e.target.value)}
                  placeholder="e.g. Patient Alex"
                  className="w-full bg-[#FAF9F6] border border-[#DDD9CE] rounded-xl px-3 py-2 text-xs text-[#1B3833] focus:outline-none focus:ring-2 focus:ring-[#0E4D45]/30 focus:border-[#0E4D45]"
                />
                <span className="text-[10px] text-[#7A958E] mt-1 block">
                  The screen name doctors see in private chat and prescription previews.
                </span>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-[#0E4D45] hover:bg-[#083630] rounded-xl transition-colors shadow-xs cursor-pointer"
                >
                  Save Profile Changes
                </button>
                {profileSaved && (
                  <span className="text-emerald-700 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Saved to Firestore!
                  </span>
                )}
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Clinical Summary Detail Modal */}
      {selectedSummaryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-[#DDD9CE] space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] text-[#7A958E] uppercase tracking-wider font-bold">
                  Official Consultation Summary
                </span>
                <h3 className="text-lg font-bold text-[#112F2B] mt-0.5">
                  {selectedSummaryModal.doctorName}
                </h3>
                <p className="text-xs text-[#0E4D45]">{selectedSummaryModal.doctorSpeciality}</p>
              </div>
              <button
                onClick={() => setSelectedSummaryModal(null)}
                className="text-[#7A958E] hover:text-[#112F2B] text-lg font-bold p-1"
              >
                ×
              </button>
            </div>

            <div className="bg-[#FAF9F5] p-4 rounded-xl border border-[#ECE9DF] text-xs space-y-3">
              <div>
                <strong className="block text-[#112F2B] mb-0.5">Clinical Impression:</strong>
                <p className="text-[#3E5C54]">{selectedSummaryModal.clinicalSummary?.diagnosisImpression}</p>
              </div>

              <div>
                <strong className="block text-[#112F2B] mb-0.5">Doctor Instructions:</strong>
                <p className="text-[#3E5C54]">{selectedSummaryModal.clinicalSummary?.doctorAdvice}</p>
              </div>

              <div>
                <strong className="block text-[#112F2B] mb-0.5">Prescription Reference Code:</strong>
                <span className="font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {selectedSummaryModal.clinicalSummary?.discreetPrescriptionCode}
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedSummaryModal(null)}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#0E4D45] hover:bg-[#083630] rounded-xl shadow-xs"
              >
                Close Summary
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
