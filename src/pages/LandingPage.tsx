import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  EyeOff, 
  Clock, 
  CheckCircle, 
  ChevronRight, 
  HelpCircle, 
  ArrowRight,
  Sparkles,
  PhoneCall,
  CalendarCheck,
  Stethoscope,
  HeartHandshake
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { HEALTH_CATEGORIES, MOCK_DOCTORS, FREQUENTLY_ASKED_QUESTIONS } from '../data/mockData';
import { EmergencyDisclaimer } from '../components/EmergencyDisclaimer';

export const LandingPage: React.FC = () => {
  const { navigateTo } = useApp();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const heroImage = '/src/assets/images/hero_telehealth_private_1791871947911.jpg';

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#1E2E2B]">
      {/* 1. HERO SECTION */}
      <section className="relative pt-10 pb-16 lg:pt-16 lg:pb-24 border-b border-[#E8E6DF] overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Value Proposition */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#0E4D45] uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-[#0E4D45]" />
                <span>100% Confidential Intimate Healthcare</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-bold leading-[1.15] text-[#112F2B] tracking-tight text-balance">
                Some Health Problems Are Hard to Talk About. Getting Help Shouldn&apos;t Be.
              </h1>

              <p className="text-base sm:text-lg text-[#3E524D] leading-relaxed max-w-xl">
                Consult verified proctologists, urologists, and intimate health specialists from the privacy of your home. Encrypted chat, optional voice, or video with cameras strictly off. No awkward clinic waits, no judgmental questions.
              </p>

              {/* CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  onClick={() => navigateTo('intake')}
                  className="px-6 py-3.5 text-sm font-semibold text-white bg-[#0E4D45] hover:bg-[#083630] rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span>Get Private Consultation</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>

                <button
                  onClick={() => navigateTo('categories')}
                  className="px-6 py-3.5 text-sm font-semibold text-[#1B3E38] bg-[#EAE8E0] hover:bg-[#DFDCD2] rounded-xl transition-colors flex items-center justify-center cursor-pointer"
                >
                  Explore Health Concerns
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-[#E8E6DF] grid grid-cols-3 gap-4 text-xs text-[#4F645F]">
                <div>
                  <strong className="block text-base font-bold text-[#112F2B]">100% Discreet</strong>
                  <span>Billed neutrally as GC Health Care</span>
                </div>
                <div>
                  <strong className="block text-base font-bold text-[#112F2B]">Camera-Off</strong>
                  <span>Private text or voice option</span>
                </div>
                <div>
                  <strong className="block text-base font-bold text-[#112F2B]">MCI / State</strong>
                  <span>100% Verified Medical Registrations</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Container with Fallback */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden shadow-lg border border-[#DDD9CE] bg-[#F1EFE8]">
                <img
                  src={heroImage}
                  alt="Compassionate private telehealth consultation"
                  className="w-full h-80 sm:h-96 object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    // Styled graceful fallback container
                    e.currentTarget.style.display = 'none';
                    const fallback = e.currentTarget.nextElementSibling;
                    if (fallback) fallback.classList.remove('hidden');
                  }}
                />
                <div className="hidden p-8 text-center bg-[#EAE7DC] text-[#24423C] h-80 sm:h-96 flex flex-col items-center justify-center">
                  <Stethoscope className="w-12 h-12 text-[#0E4D45] mb-3" />
                  <h3 className="font-semibold text-base">Private & Dignified Clinical Care</h3>
                  <p className="text-xs text-[#4E6761] mt-1 max-w-xs">
                    Experienced clinicians ready to assist your intimate medical questions with absolute discretion.
                  </p>
                </div>

                {/* Overlaid Discreet Note */}
                <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-sm p-3 rounded-xl border border-[#D5D0C2] text-xs text-[#28443E] shadow-xs flex items-center gap-2.5">
                  <Lock className="w-4 h-4 text-[#0E4D45] shrink-0" />
                  <p className="leading-tight">
                    <strong className="font-semibold text-[#112F2B]">Pseudonymous Alias Mode:</strong> You can discuss symptoms using a chosen screen name without disclosing your full identity.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Disclaimer Banner */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <EmergencyDisclaimer />
      </div>

      {/* AI Symptom Companion Feature Callout */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
        <div className="bg-linear-to-r from-[#0E4D45] to-[#163E38] rounded-2xl p-6 sm:p-8 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-2 max-w-xl z-10">
            <div className="inline-flex items-center gap-1.5 bg-emerald-900/80 border border-emerald-500/40 text-emerald-200 px-3 py-1 rounded-full text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
              <span>Feature 1: AI Symptom Intake Companion</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Hard to Put Your Discomfort into Words?
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              Describe your symptoms naturally in <strong>Hindi, Hinglish, or English</strong> without judgment. Our AI companion organizes your signs into a confidential, structured clinical intake report that you can review and approve before sharing with your verified doctor.
            </p>
          </div>

          <div className="shrink-0 z-10">
            <button
              onClick={() => navigateTo('intake')}
              className="bg-white hover:bg-emerald-50 text-[#0E4D45] font-bold text-xs sm:text-sm px-6 py-3.5 rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#0E4D45]" />
              <span>Talk to AI Symptom Companion</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. STRICT SENSITIVE HEALTH CATEGORIES SECTION */}
      <section className="py-16 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-semibold text-[#0E4D45] uppercase tracking-wider mb-2">
            Specialized Scope
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#112F2B] tracking-tight">
            Comprehensive Care for Sensitive Concerns
          </h2>
          <p className="text-sm text-[#4E6761] mt-2">
            Nivara is focused 100% on conditions that carry unfair social stigma. We do not dilute our expertise with general colds, fevers, or unrelated clinical categories.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {HEALTH_CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-2xl p-6 border border-[#E4E1D7] shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-[#5D736D] mb-3">
                  <span className="font-medium text-[#0E4D45]">{cat.specialists.split(',')[0]}</span>
                  <span>{cat.conditions.length} conditions covered</span>
                </div>

                <h3 className="text-lg font-bold text-[#112F2B] mb-2">
                  {cat.title}
                </h3>

                <p className="text-xs text-[#4E6761] leading-relaxed mb-4">
                  {cat.shortDescription}
                </p>

                <div className="space-y-1.5 text-xs text-[#2A443F] mb-6">
                  {cat.conditions.slice(0, 3).map((cond) => (
                    <div key={cond.id} className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#0E4D45]" />
                      <span className="font-medium">{cond.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#F0EEE6] flex items-center justify-between">
                <button
                  onClick={() => navigateTo('categories', { categoryId: cat.id })}
                  className="text-xs font-semibold text-[#0E4D45] hover:text-[#083630] flex items-center gap-1 cursor-pointer"
                >
                  <span>View Details & Treatments</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => {
                    navigateTo('intake', { categoryId: cat.id });
                  }}
                  className="px-3 py-1.5 text-xs font-medium bg-[#EBF3F0] hover:bg-[#DCEAE5] text-[#0E4D45] rounded-lg transition-colors cursor-pointer"
                >
                  Discuss Privately
                </button>
              </div>
            </div>
          ))}

          {/* Reassurance Card */}
          <div className="bg-[#EBF3F0] rounded-2xl p-6 border border-[#CDE0D9] flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#0E4D45] flex items-center justify-center text-white mb-4">
                <HeartHandshake className="w-5 h-5 text-emerald-200" />
              </div>
              <h3 className="text-lg font-bold text-[#0E4D45] mb-2">
                Unsure Where Your Concern Fits?
              </h3>
              <p className="text-xs text-[#32524A] leading-relaxed">
                Take our confidential 2-minute Guided Symptom Intake. You can describe what you feel in plain language without knowing medical terminology, and we will guide you to the right specialist.
              </p>
            </div>

            <button
              onClick={() => navigateTo('intake')}
              className="mt-6 w-full py-2.5 text-xs font-semibold text-white bg-[#0E4D45] hover:bg-[#083630] rounded-xl transition-colors shadow-xs"
            >
              Start Guided Symptom Intake
            </button>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS IN THREE STEPS */}
      <section className="py-16 bg-[#F3F1E9] border-y border-[#E4E0D5]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-semibold text-[#0E4D45] uppercase tracking-wider block mb-1">
              Simple &amp; Confidential
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#112F2B]">
              How Private Consultation Works
            </h2>
            <p className="text-sm text-[#4E6761] mt-2">
              Three quiet, dignified steps from uncertainty to medical clarity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white rounded-2xl p-6 border border-[#E0DCD1] relative">
              <div className="text-xs font-mono font-bold text-[#0E4D45] bg-[#E8F0EC] w-8 h-8 rounded-lg flex items-center justify-center mb-4">
                01
              </div>
              <h3 className="text-base font-bold text-[#112F2B] mb-2">
                Share Symptoms Discreetly
              </h3>
              <p className="text-xs text-[#4E6761] leading-relaxed">
                Answer a structured, guided questionnaire in your own plain words. No unnecessary questions, no sharing of your real name if you prefer an alias.
              </p>
              <div className="mt-4 pt-3 border-t border-[#F2EFE8] text-[11px] text-[#2F534C] flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Takes under 3 minutes</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl p-6 border border-[#E0DCD1] relative">
              <div className="text-xs font-mono font-bold text-[#0E4D45] bg-[#E8F0EC] w-8 h-8 rounded-lg flex items-center justify-center mb-4">
                02
              </div>
              <h3 className="text-base font-bold text-[#112F2B] mb-2">
                Select a Verified Specialist
              </h3>
              <p className="text-xs text-[#4E6761] leading-relaxed">
                Choose a certified proctologist, urologist, or female gynecologist. Filter by language, consultation fee, and available slots for today or tomorrow.
              </p>
              <div className="mt-4 pt-3 border-t border-[#F2EFE8] text-[11px] text-[#2F534C] flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Audited Medical Council Registrations</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl p-6 border border-[#E0DCD1] relative">
              <div className="text-xs font-mono font-bold text-[#0E4D45] bg-[#E8F0EC] w-8 h-8 rounded-lg flex items-center justify-center mb-4">
                03
              </div>
              <h3 className="text-base font-bold text-[#112F2B] mb-2">
                Consult in Your Comfort Zone
              </h3>
              <p className="text-xs text-[#4E6761] leading-relaxed">
                Connect via encrypted text chat, private voice call, or video with camera turned off. Receive an official digital prescription and customized care plan.
              </p>
              <div className="mt-4 pt-3 border-t border-[#F2EFE8] text-[11px] text-[#2F534C] flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Free 5-day chat follow-up included</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PRIVACY & CONFIDENTIALITY SECTION */}
      <section className="py-16 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-[#112723] rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-300 uppercase tracking-wider mb-3">
                <Lock className="w-4 h-4 text-emerald-400" />
                <span>Non-Negotiable Privacy Architecture</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-4">
                Designed From Scratch for Complete Confidentiality
              </h2>
              <p className="text-sm text-[#9BB5AD] leading-relaxed mb-6">
                Most people delay seeking help for piles, sexual concerns, or intimate rashes for months or years due to shame. We engineered Nivara so you never have to choose between your dignity and your health.
              </p>

              <div className="space-y-3 text-xs text-[#BDD3CC]">
                <div className="flex items-start gap-3 bg-[#193631] p-3 rounded-xl border border-emerald-900/40">
                  <EyeOff className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Camera-Off Guarantee</strong>
                    <span>You are never forced to show your face or intimate body parts. Voice or encrypted text is fully respected.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-[#193631] p-3 rounded-xl border border-emerald-900/40">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Pseudonymous Display Alias</strong>
                    <span>Your clinical consultation can be registered under a private alias to safeguard your comfort.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-[#193631] p-3 rounded-xl border border-emerald-900/40">
                  <Lock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Discreet Billing Descriptor</strong>
                    <span>Bank statements and UPI notifications show only &quot;GC Health Care&quot;—no medical details are ever revealed.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#17332D] p-6 rounded-2xl border border-emerald-800/40 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Our Clinical Promise</span>
              </h3>
              <p className="text-xs text-[#9BB5AD] leading-relaxed">
                Medical conditions in intimate regions are biological facts—not personal shortcomings, moral failures, or reasons for embarrassment.
              </p>
              <div className="p-4 bg-[#0E231F] rounded-xl border border-emerald-900/60 text-xs text-emerald-100">
                <blockquote className="italic leading-relaxed">
                  &quot;Over 60% of adults experience an anorectal or intimate health concern during their lifetime. Early medical intervention prevents painful complications in the vast majority of cases.&quot;
                </blockquote>
                <span className="block text-[11px] text-emerald-300/80 font-medium mt-2">
                  — Nivara Clinical Board
                </span>
              </div>
              <button
                onClick={() => navigateTo('privacy')}
                className="w-full py-2.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-600 rounded-xl transition-colors"
              >
                Learn More at Privacy Centre
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. VERIFIED DOCTOR & TRUST SECTION */}
      <section className="py-16 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-semibold text-[#0E4D45] uppercase tracking-wider block mb-1">
              Qualified &amp; Empathetic
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#112F2B]">
              Meet Our Verified Clinicians
            </h2>
            <p className="text-sm text-[#4E6761] mt-1">
              Every clinician is vetted with national/state medical councils and specially trained in non-judgmental dialogue.
            </p>
          </div>
          <button
            onClick={() => navigateTo('doctors')}
            className="text-xs font-semibold text-[#0E4D45] hover:text-[#083630] flex items-center gap-1 shrink-0"
          >
            <span>View All Clinicians</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MOCK_DOCTORS.slice(0, 3).map((doctor) => (
            <div
              key={doctor.id}
              className="bg-white rounded-2xl border border-[#E4E1D7] overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col"
            >
              <div className="p-5 flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#EAE8E0] shrink-0 border border-[#D5D1C4]">
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
                    <h3 className="font-bold text-sm text-[#112F2B]">{doctor.name}</h3>
                    <span title="Verified Medical Registration">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#0E4D45]" />
                    </span>
                  </div>
                  <p className="text-xs font-medium text-[#0E4D45] mt-0.5">{doctor.speciality.split('&')[0]}</p>
                  <p className="text-[11px] text-[#637973]">{doctor.experienceYears} Years Exp · {doctor.medicalCouncil}</p>
                </div>
              </div>

              <div className="px-5 pb-4 flex-1">
                <p className="text-xs text-[#4E6761] line-clamp-2 leading-relaxed">
                  {doctor.bio}
                </p>
                <div className="mt-3 flex flex-wrap gap-1 text-[11px] text-[#294B43]">
                  {doctor.focusAreas.slice(0, 2).map((fa, idx) => (
                    <span key={idx} className="bg-[#F0EEE6] px-2 py-0.5 rounded text-[10px]">
                      {fa}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-[#FAF8F3] border-t border-[#EAE7DC] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#637973] block uppercase tracking-wider">Consultation Fee</span>
                  <span className="text-sm font-bold text-[#112F2B]">₹{doctor.fee}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigateTo('doctor-profile', { doctorId: doctor.id })}
                    className="px-2.5 py-1.5 text-xs font-medium text-[#112F2B] bg-white border border-[#D6D2C4] hover:bg-[#F2EFE8] rounded-lg transition-colors cursor-pointer"
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => navigateTo('booking', { doctorId: doctor.id })}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-[#0E4D45] hover:bg-[#083630] rounded-lg transition-colors cursor-pointer"
                  >
                    Book Slot
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. AFFORDABLE & TRANSPARENT CONSULTATION SECTION */}
      <section className="py-16 bg-[#F3F1E9] border-t border-[#E4E0D5]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mx-auto text-center mb-10">
            <span className="text-xs font-semibold text-[#0E4D45] uppercase tracking-wider block mb-1">
              Transparent Pricing
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#112F2B]">
              Care Within Reach. Zero Hidden Costs.
            </h2>
            <p className="text-sm text-[#4E6761] mt-2">
              Quality specialist healthcare should be accessible to all without exploitative package pricing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-[#E0DCD1] flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-[#0E4D45] uppercase">Text Consultation</span>
                <div className="mt-2 mb-3">
                  <span className="text-3xl font-bold text-[#112F2B]">₹550</span>
                  <span className="text-xs text-[#637973] ml-1">flat fee</span>
                </div>
                <p className="text-xs text-[#4E6761] mb-4">
                  For patients who prefer writing over speaking. Upload symptom details and discuss via encrypted chat.
                </p>
                <ul className="space-y-2 text-xs text-[#2A443F]">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Complete questionnaire review</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Digital certified prescription</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>3-day chat query window</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => navigateTo('doctors')}
                className="mt-6 w-full py-2.5 text-xs font-semibold text-[#0E4D45] bg-[#EBF3F0] hover:bg-[#DCEAE5] rounded-xl transition-colors"
              >
                Select Doctor
              </button>
            </div>

            <div className="bg-white rounded-2xl p-6 border-2 border-[#0E4D45] relative flex flex-col justify-between shadow-sm">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0E4D45] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full">
                Most Chosen
              </div>
              <div>
                <span className="text-xs font-semibold text-[#0E4D45] uppercase">Voice / Audio Consultation</span>
                <div className="mt-2 mb-3">
                  <span className="text-3xl font-bold text-[#112F2B]">₹650</span>
                  <span className="text-xs text-[#637973] ml-1">flat fee</span>
                </div>
                <p className="text-xs text-[#4E6761] mb-4">
                  Direct voice conversation with senior specialist. No camera required; zero face-to-face anxiety.
                </p>
                <ul className="space-y-2 text-xs text-[#2A443F]">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>20-minute private audio session</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Detailed clinical impression</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Free 5-day follow-up messaging</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => navigateTo('doctors')}
                className="mt-6 w-full py-2.5 text-xs font-semibold text-white bg-[#0E4D45] hover:bg-[#083630] rounded-xl transition-colors shadow-xs"
              >
                Book Audio Slot
              </button>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#E0DCD1] flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-[#0E4D45] uppercase">Discreet Video Session</span>
                <div className="mt-2 mb-3">
                  <span className="text-3xl font-bold text-[#112F2B]">₹750</span>
                  <span className="text-xs text-[#637973] ml-1">flat fee</span>
                </div>
                <p className="text-xs text-[#4E6761] mb-4">
                  For skin/mucosal conditions where visual review is helpful. Camera can be toggled on/off at any second.
                </p>
                <ul className="space-y-2 text-xs text-[#2A443F]">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>25-minute comprehensive slot</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Differential diagnosis report</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>7-day follow-up continuity</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => navigateTo('doctors')}
                className="mt-6 w-full py-2.5 text-xs font-semibold text-[#0E4D45] bg-[#EBF3F0] hover:bg-[#DCEAE5] rounded-xl transition-colors"
              >
                Select Specialist
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FREQUENTLY ASKED QUESTIONS */}
      <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <span className="text-xs font-semibold text-[#0E4D45] uppercase tracking-wider block mb-1">
            Questions &amp; Concerns
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#112F2B]">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-[#4E6761] mt-1">
            Answers to common questions regarding privacy, consultations, and medical safety.
          </p>
        </div>

        <div className="space-y-3">
          {FREQUENTLY_ASKED_QUESTIONS.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-[#E4E1D7] overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full text-left p-4.5 sm:p-5 flex items-center justify-between gap-4 font-semibold text-sm text-[#112F2B] hover:text-[#0E4D45] transition-colors"
              >
                <span className="flex items-center gap-2.5">
                  <HelpCircle className="w-4 h-4 text-[#0E4D45] shrink-0" />
                  {faq.q}
                </span>
                <span className="text-[#637973] text-lg font-normal shrink-0">
                  {openFaq === index ? '−' : '+'}
                </span>
              </button>
              {openFaq === index && (
                <div className="px-5 pb-5 pt-1 text-xs text-[#445E58] leading-relaxed border-t border-[#F1EFE8]">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="py-14 bg-[#0E4D45] text-white">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Take the First Step Toward Relief Today
          </h2>
          <p className="text-sm text-emerald-100 max-w-xl mx-auto leading-relaxed">
            Suffering silently with piles, sexual concerns, or intimate discomfort only causes unnecessary pain and anxiety. Safe, compassionate help is one click away.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigateTo('intake')}
              className="px-6 py-3 text-xs font-semibold bg-white text-[#0E4D45] hover:bg-emerald-50 rounded-xl transition-colors shadow-sm"
            >
              Start Guided Symptom Intake
            </button>
            <button
              onClick={() => navigateTo('doctors')}
              className="px-6 py-3 text-xs font-semibold bg-[#175F56] text-white hover:bg-[#1E6E64] rounded-xl transition-colors"
            >
              Browse Verified Clinicians
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
