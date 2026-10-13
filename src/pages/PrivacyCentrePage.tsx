import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Bell, 
  CreditCard, 
  Trash2, 
  Clock, 
  FileCheck, 
  AlertTriangle, 
  CheckCircle2,
  Eye,
  Info
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const PrivacyCentrePage: React.FC = () => {
  const { privacyPreferences, updatePrivacyPreferences, showToast, navigateTo, purgeAccount } = useApp();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [purgeSuccess, setPurgeSuccess] = useState(false);

  const handleToggle = (key: keyof typeof privacyPreferences) => {
    updatePrivacyPreferences({ [key]: !privacyPreferences[key] });
  };

  const handleRetentionChange = (months: number) => {
    updatePrivacyPreferences({ dataRetentionMonths: months });
    showToast(`Data retention period set to ${months} months.`);
  };

  const handleExecuteDataPurge = async () => {
    if (deleteConfirmText.toLowerCase() !== 'delete') {
      showToast('Please type DELETE to confirm data purge.');
      return;
    }

    try {
      await purgeAccount();
      setPurgeSuccess(true);
      setTimeout(() => {
        setDeleteModalOpen(false);
        setPurgeSuccess(false);
        setDeleteConfirmText('');
      }, 1500);
    } catch (err: any) {
      showToast('Error executing data purge.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#1E2E2B] py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Page Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#0E4D45] uppercase tracking-wider mb-1">
            <Lock className="w-4 h-4 text-[#0E4D45]" />
            <span>Confidentiality &amp; Consent</span>
          </div>
          <h1 className="text-3xl font-bold text-[#112F2B] tracking-tight">
            Nivara Privacy Centre
          </h1>
          <p className="text-xs sm:text-sm text-[#4E6761] mt-1.5 leading-relaxed">
            Transparent explanations of what data is collected, how it is handled, and practical controls to manage your privacy footprint.
          </p>
        </div>

        {/* Database Storage Architecture & Security Disclosure */}
        <div className="bg-[#EBF3F0] border border-[#CBDCD5] rounded-2xl p-4 sm:p-5 mb-8 text-xs text-[#0E4D45] flex items-start gap-3.5 shadow-2xs">
          <ShieldCheck className="w-5 h-5 text-[#0E4D45] shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="block text-[#0E4D45] text-sm font-bold mb-0.5">
              Where Is Your Database Stored?
            </strong>
            Your persistent user profiles, confidential symptom assessments, appointment bookings, and consultation summaries are securely stored in <strong>Google Cloud Firestore</strong>. Data is encrypted in transit (TLS 1.3) and at rest (AES-256), protected by role-based Firestore Security Rules that strictly deny unauthorized third-party access.
          </div>
        </div>

        {/* SECTION 1: WHAT WE COLLECT & WHY */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E3E0D6] shadow-xs mb-8 space-y-6">
          <h2 className="text-lg font-bold text-[#112F2B] pb-2 border-b border-[#F0EEE6]">
            1. Information We Collect and Exactly Why
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-[#FAF9F5] p-4 rounded-xl border border-[#ECE9DF] space-y-1.5">
              <span className="font-bold text-[#112F2B] block text-xs">Symptom &amp; Medical Intake Notes</span>
              <p className="text-[#4E6761] leading-relaxed">
                <strong>Why:</strong> Transmitted only to your matched consulting clinician so they can assess clinical severity, rule out red-flag emergencies, and recommend treatment.
              </p>
              <span className="text-[10px] text-[#7A958E] block pt-1">Never indexed by search engines or shared with third parties.</span>
            </div>

            <div className="bg-[#FAF9F5] p-4 rounded-xl border border-[#ECE9DF] space-y-1.5">
              <span className="font-bold text-[#112F2B] block text-xs">Pseudonymous Display Alias</span>
              <p className="text-[#4E6761] leading-relaxed">
                <strong>Why:</strong> Displayed in the consultation room and prescription preview to prevent embarrassment during sensitive medical discussions.
              </p>
              <span className="text-[10px] text-[#7A958E] block pt-1">Can be changed at any time in your dashboard.</span>
            </div>

            <div className="bg-[#FAF9F5] p-4 rounded-xl border border-[#ECE9DF] space-y-1.5">
              <span className="font-bold text-[#112F2B] block text-xs">Payment &amp; Transaction Logs</span>
              <p className="text-[#4E6761] leading-relaxed">
                <strong>Why:</strong> To remit consultation fees to verified medical practitioners.
              </p>
              <span className="text-[10px] text-[#7A958E] block pt-1">Bills under neutral descriptor &quot;GC Health Care&quot;.</span>
            </div>

            <div className="bg-[#FAF9F5] p-4 rounded-xl border border-[#ECE9DF] space-y-1.5">
              <span className="font-bold text-[#112F2B] block text-xs">Zero Third-Party Ad Trackers</span>
              <p className="text-[#4E6761] leading-relaxed">
                <strong>Why:</strong> We prohibit commercial advertising tracking pixels (e.g. Meta Pixel, TikTok Pixel) on sensitive health intake pages.
              </p>
              <span className="text-[10px] text-[#7A958E] block pt-1">No cross-site data harvesting.</span>
            </div>
          </div>
        </div>

        {/* SECTION 2: INTERACTIVE PRIVACY CONTROLS */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E3E0D6] shadow-xs mb-8 space-y-6">
          <h2 className="text-lg font-bold text-[#112F2B] pb-2 border-b border-[#F0EEE6]">
            2. Confidentiality &amp; Notification Controls
          </h2>

          <div className="space-y-4">
            {/* Control 1: Discreet Notification Masking */}
            <div className="flex items-start justify-between gap-4 p-4 rounded-xl bg-[#FAF9F5] border border-[#ECE9DF]">
              <div className="flex items-start gap-3">
                <Bell className="w-5 h-5 text-[#0E4D45] shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-xs sm:text-sm text-[#112F2B]">
                    Discreet Notification Masking
                  </h3>
                  <p className="text-xs text-[#4E6761] mt-0.5 leading-relaxed">
                    Automatically scrubs all sensitive medical terms (e.g., &quot;piles&quot;, &quot;fissures&quot;, &quot;ED&quot;, &quot;discharge&quot;) from appointment reminders and SMS/Email notifications. Displays only &quot;Your scheduled doctor appointment is confirmed&quot;.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleToggle('discreetNotifications')}
                className={`w-11 h-6 rounded-full transition-colors relative shrink-0 cursor-pointer ${
                  privacyPreferences.discreetNotifications ? 'bg-[#0E4D45]' : 'bg-[#D2CFC4]'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                    privacyPreferences.discreetNotifications ? 'left-6' : 'left-1'
                  }`}
                />
              </button>
            </div>

            {/* Control 2: Masked Billing Descriptor */}
            <div className="flex items-start justify-between gap-4 p-4 rounded-xl bg-[#FAF9F5] border border-[#ECE9DF]">
              <div className="flex items-start gap-3">
                <CreditCard className="w-5 h-5 text-[#0E4D45] shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-xs sm:text-sm text-[#112F2B]">
                    Masked Billing Descriptor (&quot;GC Health Care&quot;)
                  </h3>
                  <p className="text-xs text-[#4E6761] mt-0.5 leading-relaxed">
                    Ensures UPI, net banking, or debit card statements record consultations as generic administrative health management without detailing proctology or intimate specialities.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleToggle('maskedBillingDescription')}
                className={`w-11 h-6 rounded-full transition-colors relative shrink-0 cursor-pointer ${
                  privacyPreferences.maskedBillingDescription ? 'bg-[#0E4D45]' : 'bg-[#D2CFC4]'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                    privacyPreferences.maskedBillingDescription ? 'left-6' : 'left-1'
                  }`}
                />
              </button>
            </div>

            {/* Control 3: Data Retention Period */}
            <div className="p-4 rounded-xl bg-[#FAF9F5] border border-[#ECE9DF] space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#0E4D45]" />
                <h3 className="font-bold text-xs sm:text-sm text-[#112F2B]">
                  Automated Data Retention &amp; Expiry Window
                </h3>
              </div>
              <p className="text-xs text-[#4E6761]">
                Choose how long your consultation summaries and intake questionnaires remain stored before being automatically expired:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
                {[
                  { months: 3, label: '3 Months' },
                  { months: 6, label: '6 Months' },
                  { months: 12, label: '12 Months (Standard)' },
                  { months: 0, label: 'Auto-Purge on Exit' }
                ].map(item => (
                  <button
                    key={item.months}
                    onClick={() => handleRetentionChange(item.months)}
                    className={`py-2 px-3 rounded-lg border text-center transition-colors cursor-pointer ${
                      privacyPreferences.dataRetentionMonths === item.months
                        ? 'border-[#0E4D45] bg-[#EBF3F0] text-[#0E4D45] font-bold'
                        : 'border-[#DDD9CE] bg-white text-[#4E6761] hover:bg-[#F2EFE8]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: DATA PURGE & ACCOUNT DELETION UI */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-red-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-red-700">
            <Trash2 className="w-5 h-5" />
            <h2 className="text-lg font-bold">
              Account Deletion &amp; Data Purge
            </h2>
          </div>

          <p className="text-xs text-[#4E6761] leading-relaxed">
            You hold total control over your health profile. Clicking the button below provides immediate permanent deletion of all intake questionnaires, scheduled appointments, and saved preferences stored on this device.
          </p>

          <div className="pt-2">
            <button
              onClick={() => setDeleteModalOpen(true)}
              className="px-4 py-2.5 text-xs font-semibold text-white bg-red-700 hover:bg-red-800 rounded-xl transition-colors shadow-xs cursor-pointer"
            >
              Request Immediate Data Purge
            </button>
          </div>
        </div>
      </div>

      {/* Account Deletion Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-red-200 space-y-4">
            <div className="flex items-center gap-2.5 text-red-700">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <h3 className="font-bold text-base">Confirm Permanent Data Purge</h3>
            </div>

            <p className="text-xs text-[#445E57] leading-relaxed">
              This action will permanently erase your confidential intake history, scheduled slots, and clinical summaries. This action cannot be reversed.
            </p>

            {purgeSuccess ? (
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>All health data successfully purged from session.</span>
              </div>
            ) : (
              <div>
                <label className="text-[11px] font-bold text-[#112F2B] block mb-1">
                  Type &quot;DELETE&quot; to confirm:
                </label>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="DELETE"
                  className="w-full bg-[#FAF9F6] border border-[#DDD9CE] rounded-xl px-3 py-2 text-xs text-[#1B3833] focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                disabled={purgeSuccess}
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-[#4E6761] hover:text-[#112F2B]"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={purgeSuccess || deleteConfirmText.toLowerCase() !== 'delete'}
                onClick={handleExecuteDataPurge}
                className="px-4 py-2 text-xs font-semibold text-white bg-red-700 hover:bg-red-800 rounded-xl transition-colors shadow-xs disabled:opacity-40"
              >
                Purge All Records
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
