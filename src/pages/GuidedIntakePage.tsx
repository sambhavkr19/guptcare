import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ArrowLeft, 
  ArrowRight, 
  AlertTriangle, 
  CheckCircle2, 
  Lock, 
  User, 
  Check, 
  HelpCircle,
  FileCheck2,
  Sparkles,
  ListOrdered
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { HEALTH_CATEGORIES } from '../data/mockData';
import { EmergencyDisclaimer } from '../components/EmergencyDisclaimer';
import { AISymptomCompanion } from '../components/AISymptomCompanion';
import { evaluateClinicalSafety, SafetyEvaluationResult } from '../data/clinicalSafetyRules';

export const GuidedIntakePage: React.FC = () => {
  const { 
    intakeData, 
    updateIntakeData, 
    navigateTo, 
    showToast,
    doctors 
  } = useApp();

  // Intake Mode: AI Companion vs Structured 5-Step Form
  const [intakeMode, setIntakeMode] = useState<'ai' | 'form'>('ai');

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  // Selected category helper
  const currentCategory = HEALTH_CATEGORIES.find(c => c.id === intakeData.categoryId) || HEALTH_CATEGORIES[0];

  // Red-flag symptom check trigger
  const [redFlagAcknowledged, setRedFlagAcknowledged] = useState(false);
  const [hasEmergencyRedFlags, setHasEmergencyRedFlags] = useState(false);

  // Evaluate clinical safety rules in real time
  const safetyEvaluation: SafetyEvaluationResult = evaluateClinicalSafety({
    categoryId: intakeData.categoryId,
    symptoms: intakeData.selectedSymptoms,
    description: intakeData.primaryConcern,
    painScale: intakeData.painScale,
    duration: intakeData.duration
  });

  const toggleSymptom = (symptom: string) => {
    const exists = intakeData.selectedSymptoms.includes(symptom);
    if (exists) {
      updateIntakeData({
        selectedSymptoms: intakeData.selectedSymptoms.filter(s => s !== symptom)
      });
    } else {
      updateIntakeData({
        selectedSymptoms: [...intakeData.selectedSymptoms, symptom]
      });
    }
  };

  const handleNext = () => {
    if (currentStep === 1 && !intakeData.categoryId) {
      showToast('Please select a health concern category to continue.');
      return;
    }
    if (currentStep === 4 && (!safetyEvaluation.isSafeForTelehealth || hasEmergencyRedFlags) && !redFlagAcknowledged) {
      showToast('Please read and acknowledge the clinical safety warning to proceed.');
      return;
    }
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleFinishAndMatch = () => {
    showToast('Intake summary prepared securely. Match with your preferred specialist.');
    // Find specialist corresponding to category
    let matchedDoc = doctors[0];
    if (intakeData.categoryId === 'anorectal') {
      matchedDoc = doctors.find(d => d.id === 'doc-ananya-sharma') || doctors[0];
    } else if (intakeData.categoryId === 'sexual-health' || intakeData.categoryId === 'urinary-genital') {
      matchedDoc = doctors.find(d => d.id === 'doc-vikram-mehta') || doctors[1];
    } else if (intakeData.categoryId === 'womens-intimate') {
      matchedDoc = doctors.find(d => d.id === 'doc-priya-nair') || doctors[2];
    } else if (intakeData.categoryId === 'genital-skin') {
      matchedDoc = doctors.find(d => d.id === 'doc-kavita-sen') || doctors[3];
    }

    navigateTo('booking', { doctorId: matchedDoc.id });
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#1E2E2B] py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Navigation Breadcrumb / Header */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => navigateTo('landing')}
            className="text-xs font-semibold text-[#0E4D45] hover:text-[#083630] flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Overview</span>
          </button>

          <div className="flex items-center gap-2 text-xs text-[#526B64]">
            <Lock className="w-3.5 h-3.5 text-emerald-700" />
            <span>Encrypted &amp; Confidential Intake</span>
          </div>
        </div>

        {/* Mode Selector Toggle: AI Symptom Companion vs Step-by-Step Form */}
        <div className="bg-white rounded-2xl p-2 border border-[#E3E0D6] shadow-2xs mb-8 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIntakeMode('ai')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              intakeMode === 'ai'
                ? 'bg-[#0E4D45] text-white shadow-xs'
                : 'text-[#47605A] hover:bg-[#FAF9F6]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span>AI Symptom Companion (Conversational)</span>
            <span className="text-[10px] hidden sm:inline opacity-80">(Hindi, Hinglish, English)</span>
          </button>

          <button
            type="button"
            onClick={() => setIntakeMode('form')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              intakeMode === 'form'
                ? 'bg-[#0E4D45] text-white shadow-xs'
                : 'text-[#47605A] hover:bg-[#FAF9F6]'
            }`}
          >
            <ListOrdered className="w-3.5 h-3.5" />
            <span>Guided Step-by-Step Form</span>
            <span className="text-[10px] hidden sm:inline opacity-80">(5 Steps)</span>
          </button>
        </div>

        {/* IF AI COMPANION MODE */}
        {intakeMode === 'ai' && (
          <div className="space-y-6">
            <AISymptomCompanion />
            <EmergencyDisclaimer compact />
          </div>
        )}

        {/* IF STEP-BY-STEP FORM MODE */}
        {intakeMode === 'form' && (
          <div className="space-y-8">
            {/* Progress Tracker */}
            <div className="bg-white rounded-2xl p-5 border border-[#E3E0D6] shadow-xs">
              <div className="flex items-center justify-between text-xs text-[#526B64] mb-2 font-medium">
                <span>Step {currentStep} of {totalSteps}: {
                  currentStep === 1 ? 'Select Concern Category' :
                  currentStep === 2 ? 'Symptoms & Plain-Language Description' :
                  currentStep === 3 ? 'Duration & Discomfort Level' :
                  currentStep === 4 ? 'Clinician Safety & Red-Flag Audit' :
                  'Review Your Confidential Summary'
                }</span>
                <span className="font-semibold text-[#0E4D45]">{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
              </div>
              <div className="w-full bg-[#EAE8E0] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#0E4D45] h-full transition-all duration-300 rounded-full"
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                />
              </div>
            </div>

            {/* STEP 1: CATEGORY SELECTION */}
            {currentStep === 1 && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E3E0D6] shadow-xs space-y-6">
                <div>
                  <span className="text-xs font-semibold text-[#0E4D45] uppercase tracking-wider block mb-1">
                    Step 1 of 5
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#112F2B]">
                    Which area is troubling you?
                  </h2>
                  <p className="text-xs sm:text-sm text-[#4E6761] mt-1.5 leading-relaxed">
                    Choose the intimate area where you are experiencing symptoms. You can refine the specific details on the next step.
                  </p>
                </div>

                <div className="space-y-3">
                  {HEALTH_CATEGORIES.map(cat => {
                    const isSelected = intakeData.categoryId === cat.id;
                    return (
                      <div
                        key={cat.id}
                        onClick={() => updateIntakeData({ categoryId: cat.id })}
                        className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                          isSelected
                            ? 'border-[#0E4D45] bg-[#EBF3F0] ring-1 ring-[#0E4D45]'
                            : 'border-[#E4E1D7] hover:border-[#CBDCD5] bg-white'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full border mt-0.5 flex items-center justify-center shrink-0 ${
                          isSelected ? 'border-[#0E4D45] bg-[#0E4D45] text-white' : 'border-[#B4C5BF]'
                        }`}>
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-bold text-sm text-[#112F2B]">{cat.title}</h3>
                            <span className="text-[11px] text-[#637973] hidden sm:inline">{cat.specialists.split(',')[0]}</span>
                          </div>
                          <p className="text-xs text-[#4E6761] mt-1">{cat.shortDescription}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={handleNext}
                    className="px-6 py-2.5 text-xs font-semibold text-white bg-[#0E4D45] hover:bg-[#083630] rounded-xl transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Continue to Symptoms</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: SPECIFIC SYMPTOMS & PLAIN LANGUAGE DESCRIPTION */}
            {currentStep === 2 && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E3E0D6] shadow-xs space-y-6">
                <div>
                  <span className="text-xs font-semibold text-[#0E4D45] uppercase tracking-wider block mb-1">
                    Step 2 of 5 · {currentCategory.title}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#112F2B]">
                    What specific signs have you noticed?
                  </h2>
                  <p className="text-xs sm:text-sm text-[#4E6761] mt-1.5 leading-relaxed">
                    Select any that apply, and describe what it feels like in your own plain words.
                  </p>
                </div>

                {/* Quick Checkboxes for Common Symptoms in this category */}
                <div>
                  <label className="text-xs font-bold text-[#1B3833] uppercase tracking-wider block mb-2.5">
                    Common Signs (Select all that match):
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {currentCategory.conditions.flatMap(c => c.commonSymptoms).slice(0, 8).map((sym, idx) => {
                      const active = intakeData.selectedSymptoms.includes(sym);
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => toggleSymptom(sym)}
                          className={`text-left p-3 rounded-xl border text-xs transition-colors flex items-center gap-2.5 cursor-pointer ${
                            active
                              ? 'border-[#0E4D45] bg-[#EBF3F0] text-[#0E4D45] font-semibold'
                              : 'border-[#E0DCD1] text-[#3D554F] hover:bg-[#FAF9F5]'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                            active ? 'border-[#0E4D45] bg-[#0E4D45] text-white' : 'border-[#CBD7D2]'
                          }`}>
                            {active && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                          </div>
                          <span className="leading-snug">{sym}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Plain language text box */}
                <div>
                  <label className="text-xs font-bold text-[#1B3833] uppercase tracking-wider block mb-1.5">
                    Describe in Your Own Words (Optional but very helpful):
                  </label>
                  <textarea
                    value={intakeData.primaryConcern}
                    onChange={(e) => updateIntakeData({ primaryConcern: e.target.value })}
                    rows={3}
                    placeholder="Example: 'It stings when passing stool, like a small cut, and I notice bright blood on the tissue' or 'Difficulty with erections during intimacy'..."
                    className="w-full bg-[#FAF9F6] border border-[#DDD9CE] rounded-xl p-3 text-xs text-[#1B3833] placeholder-[#7E968F] focus:outline-none focus:ring-2 focus:ring-[#0E4D45]/30 focus:border-[#0E4D45]"
                  />
                  <span className="text-[11px] text-[#7A958E] mt-1 block">
                    No medical jargon needed. English, Hindi, and Hinglish are all understood.
                  </span>
                </div>

                <div className="pt-4 border-t border-[#F2EFE8] flex items-center justify-between">
                  <button
                    onClick={handlePrev}
                    className="px-4 py-2 text-xs font-semibold text-[#4E6761] hover:text-[#112F2B] flex items-center gap-1 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                  <button
                    onClick={handleNext}
                    className="px-6 py-2.5 text-xs font-semibold text-white bg-[#0E4D45] hover:bg-[#083630] rounded-xl transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Next: Duration &amp; Discomfort</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: DURATION & SEVERITY */}
            {currentStep === 3 && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E3E0D6] shadow-xs space-y-6">
                <div>
                  <span className="text-xs font-semibold text-[#0E4D45] uppercase tracking-wider block mb-1">
                    Step 3 of 5
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#112F2B]">
                    Duration &amp; Severity
                  </h2>
                  <p className="text-xs sm:text-sm text-[#4E6761] mt-1.5 leading-relaxed">
                    Helps the clinician determine whether this is an acute sudden flare-up or chronic condition.
                  </p>
                </div>

                {/* Duration Selector */}
                <div>
                  <label className="text-xs font-bold text-[#1B3833] uppercase tracking-wider block mb-2">
                    How long have you experienced this?
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    {['Less than 1 week', '1 to 4 weeks', '1 to 3 months', 'More than 3 months'].map(dur => (
                      <button
                        key={dur}
                        type="button"
                        onClick={() => updateIntakeData({ duration: dur })}
                        className={`p-3 rounded-xl border text-center transition-colors cursor-pointer ${
                          intakeData.duration === dur
                            ? 'border-[#0E4D45] bg-[#EBF3F0] text-[#0E4D45] font-bold'
                            : 'border-[#E0DCD1] text-[#3D554F] hover:bg-[#FAF9F5]'
                        }`}
                      >
                        {dur}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pain / Discomfort Scale */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-[#1B3833] uppercase tracking-wider">
                      Discomfort / Pain Level (0 to 10):
                    </label>
                    <span className="text-sm font-bold text-[#0E4D45]">
                      {intakeData.painScale} / 10 ({
                        intakeData.painScale === 0 ? 'No Pain' :
                        intakeData.painScale <= 3 ? 'Mild Discomfort' :
                        intakeData.painScale <= 6 ? 'Moderate Discomfort' :
                        intakeData.painScale <= 8 ? 'Severe Discomfort' : 'Extreme Agony'
                      })
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={intakeData.painScale}
                    onChange={(e) => updateIntakeData({ painScale: parseInt(e.target.value) })}
                    className="w-full accent-[#0E4D45] cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-[#7A958E] mt-1 font-mono">
                    <span>0 (None)</span>
                    <span>5 (Moderate)</span>
                    <span>10 (Worst Possible)</span>
                  </div>
                </div>

                {/* Previous Home Remedies or Treatments */}
                <div>
                  <label className="text-xs font-bold text-[#1B3833] uppercase tracking-wider block mb-1.5">
                    Have you tried any creams, pills, or home remedies? (Optional)
                  </label>
                  <input
                    type="text"
                    value={intakeData.priorTreatments}
                    onChange={(e) => updateIntakeData({ priorTreatments: e.target.value })}
                    placeholder="Example: 'Tried warm sitz bath and over-the-counter soothing ointment'..."
                    className="w-full bg-[#FAF9F6] border border-[#DDD9CE] rounded-xl px-3 py-2 text-xs text-[#1B3833] placeholder-[#7E968F] focus:outline-none focus:ring-2 focus:ring-[#0E4D45]/30 focus:border-[#0E4D45]"
                  />
                </div>

                <div className="pt-4 border-t border-[#F2EFE8] flex items-center justify-between">
                  <button
                    onClick={handlePrev}
                    className="px-4 py-2 text-xs font-semibold text-[#4E6761] hover:text-[#112F2B] flex items-center gap-1 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                  <button
                    onClick={handleNext}
                    className="px-6 py-2.5 text-xs font-semibold text-white bg-[#0E4D45] hover:bg-[#083630] rounded-xl transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Next: Safety Screener</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: CLINICAL SAFETY SCREENER & PRIVACY PREFERENCES */}
            {currentStep === 4 && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E3E0D6] shadow-xs space-y-6">
                <div>
                  <span className="text-xs font-semibold text-[#0E4D45] uppercase tracking-wider block mb-1">
                    Step 4 of 5 · Clinician Safety Protocol
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#112F2B]">
                    Medical Safety Screening Layer
                  </h2>
                  <p className="text-xs sm:text-sm text-[#4E6761] mt-1.5 leading-relaxed">
                    Evaluated against clinician-reviewed guidelines to ensure symptoms do not indicate an acute surgical or hemorrhagic emergency.
                  </p>
                </div>

                {/* Automated Clinician Rules Evaluation Output */}
                {!safetyEvaluation.isSafeForTelehealth ? (
                  <div className="bg-red-50 border-2 border-red-300 p-5 rounded-xl text-xs text-red-950 space-y-3">
                    <div className="flex items-center gap-2 font-bold text-red-800 text-sm">
                      <AlertTriangle className="w-5 h-5 shrink-0 text-red-600" />
                      <span>URGENT CLINICAL WARNING DETECTED</span>
                    </div>
                    <div className="bg-white p-3.5 rounded-lg border border-red-200 text-xs text-red-900 space-y-2">
                      <strong className="block text-[#7A1E1E]">Reason for In-Person Medical Advisory:</strong>
                      <p className="leading-relaxed">{safetyEvaluation.emergencyReason}</p>
                      <div className="pt-1.5 border-t border-red-100 flex items-center gap-2 text-red-800 font-semibold">
                        <span>Emergency Instruction:</span>
                        <span>{safetyEvaluation.recommendedAction}</span>
                      </div>
                    </div>
                    <div className="text-[11px] text-red-800 leading-relaxed">
                      Telehealth consultations are not equipped for active blood transfusions, emergency catheterization, or surgical detorsion.
                    </div>
                  </div>
                ) : (
                  <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-xs text-emerald-900 flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                    <div>
                      <strong className="block font-semibold">Clinical Rules Screen Passed:</strong>
                      <span className="text-[11px] text-emerald-800">
                        No acute life-threatening emergency flags detected in your reported profile. Suitable for confidential outpatient telehealth.
                      </span>
                    </div>
                  </div>
                )}

                {/* Manual Red Flag Self-Check Checklist */}
                <div className="bg-[#FFF8F2] border border-[#F6E1D1] p-4.5 rounded-xl text-xs text-[#8C3F13] space-y-3">
                  <div className="flex items-center gap-2 font-bold text-[#A14310]">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>Please confirm if ANY of these apply right now:</span>
                  </div>
                  <ul className="list-disc pl-4 space-y-1 text-[11px] text-[#7A360E]">
                    <li>Continuous bleeding soaking toilet bowl or accompanied by fainting / cold sweats</li>
                    <li>Sudden agonizing one-sided testicular pain with vomiting</li>
                    <li>Unable to pass any urine for more than 8 hours</li>
                    <li>High fever (&gt;101°F) with shaking chills or spreading dusky skin discoloration</li>
                  </ul>

                  <div className="pt-2 border-t border-[#F2D7BF]">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hasEmergencyRedFlags}
                        onChange={(e) => {
                          setHasEmergencyRedFlags(e.target.checked);
                          if (e.target.checked) {
                            updateIntakeData({ redFlagWarningTriggered: true });
                          }
                        }}
                        className="accent-red-600 rounded cursor-pointer"
                      />
                      <span className="font-semibold text-red-900 text-xs">
                        Yes, I am experiencing one or more of these urgent symptoms.
                      </span>
                    </label>
                  </div>
                </div>

                {/* Acknowledgment checkbox if warnings exist */}
                {(!safetyEvaluation.isSafeForTelehealth || hasEmergencyRedFlags) && (
                  <div className="bg-amber-50 border border-amber-300 p-3.5 rounded-xl">
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={redFlagAcknowledged}
                        onChange={(e) => setRedFlagAcknowledged(e.target.checked)}
                        className="accent-[#0E4D45] rounded mt-0.5 cursor-pointer"
                      />
                      <span className="text-xs font-semibold text-amber-950">
                        I understand that Nivara strongly recommends immediate in-person emergency medical care for these symptoms, and I acknowledge this warning before consulting online.
                      </span>
                    </label>
                  </div>
                )}

                {/* Privacy Alias & Preference Setup */}
                <div className="border-t border-[#F0EEE6] pt-5 space-y-4">
                  <h3 className="text-sm font-bold text-[#112F2B] flex items-center gap-2">
                    <User className="w-4 h-4 text-[#0E4D45]" />
                    <span>Consultation Privacy Settings</span>
                  </h3>

                  <div>
                    <label className="text-xs font-bold text-[#1B3833] uppercase tracking-wider block mb-1">
                      Choose a Display Alias (Pseudonym):
                    </label>
                    <input
                      type="text"
                      value={intakeData.patientAlias}
                      onChange={(e) => updateIntakeData({ patientAlias: e.target.value })}
                      placeholder="e.g., Patient Alex, Rohan S, Anonymous..."
                      className="w-full bg-[#FAF9F6] border border-[#DDD9CE] rounded-xl px-3 py-2 text-xs text-[#1B3833] focus:outline-none focus:ring-2 focus:ring-[#0E4D45]/30 focus:border-[#0E4D45]"
                    />
                    <span className="text-[11px] text-[#637973] mt-1 block">
                      This alias protects your personal anonymity in the consultation room.
                    </span>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#1B3833] uppercase tracking-wider block mb-1">
                      Preferred Consultation Format:
                    </label>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      {[
                        { mode: 'chat', label: 'Private Chat', desc: 'Text only' },
                        { mode: 'audio', label: 'Voice Call', desc: 'Audio only' },
                        { mode: 'video', label: 'Discreet Video', desc: 'Camera optional' }
                      ].map(item => (
                        <button
                          key={item.mode}
                          type="button"
                          onClick={() => updateIntakeData({ preferredMode: item.mode as any })}
                          className={`p-2.5 rounded-xl border text-center transition-colors cursor-pointer ${
                            intakeData.preferredMode === item.mode
                              ? 'border-[#0E4D45] bg-[#EBF3F0] text-[#0E4D45] font-bold'
                              : 'border-[#E0DCD1] text-[#3D554F] hover:bg-[#FAF9F5]'
                          }`}
                        >
                          <span className="block font-semibold">{item.label}</span>
                          <span className="text-[10px] text-[#7A958E]">{item.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#F2EFE8] flex items-center justify-between">
                  <button
                    onClick={handlePrev}
                    className="px-4 py-2 text-xs font-semibold text-[#4E6761] hover:text-[#112F2B] flex items-center gap-1 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                  <button
                    onClick={handleNext}
                    className="px-6 py-2.5 text-xs font-semibold text-white bg-[#0E4D45] hover:bg-[#083630] rounded-xl transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Review Summary</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 5: REVIEW SCREEN */}
            {currentStep === 5 && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E3E0D6] shadow-xs space-y-6">
                <div>
                  <span className="text-xs font-semibold text-[#0E4D45] uppercase tracking-wider block mb-1">
                    Step 5 of 5 · Final Verification
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#112F2B]">
                    Review Before Sharing with Clinician
                  </h2>
                  <p className="text-xs sm:text-sm text-[#4E6761] mt-1.5 leading-relaxed">
                    Confirm your intake details. You can freely edit any answer before it is securely encrypted for your doctor.
                  </p>
                </div>

                {/* Summary Card */}
                <div className="bg-[#FAF9F5] border border-[#E6E4DC] rounded-xl p-5 space-y-4 text-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-[#E8E5DC]">
                    <div>
                      <span className="text-[11px] text-[#7A958E] uppercase tracking-wider block">Health Category</span>
                      <span className="font-bold text-sm text-[#112F2B]">{currentCategory.title}</span>
                    </div>
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="text-xs text-[#0E4D45] underline font-medium cursor-pointer"
                    >
                      Edit
                    </button>
                  </div>

                  <div className="flex items-start justify-between pb-3 border-b border-[#E8E5DC]">
                    <div>
                      <span className="text-[11px] text-[#7A958E] uppercase tracking-wider block mb-1">Selected Symptoms</span>
                      <div className="flex flex-wrap gap-1.5">
                        {intakeData.selectedSymptoms.length > 0 ? (
                          intakeData.selectedSymptoms.map((s, idx) => (
                            <span key={idx} className="bg-white border border-[#DDD9CE] px-2 py-0.5 rounded text-[11px] text-[#294B43]">
                              {s}
                            </span>
                          ))
                        ) : (
                          <span className="text-[#899E97] italic">None selected; using description below</span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="text-xs text-[#0E4D45] underline font-medium cursor-pointer"
                    >
                      Edit
                    </button>
                  </div>

                  {intakeData.primaryConcern && (
                    <div className="pb-3 border-b border-[#E8E5DC]">
                      <span className="text-[11px] text-[#7A958E] uppercase tracking-wider block mb-1">Your Description</span>
                      <p className="bg-white p-3 rounded-lg border border-[#DDD9CE] text-[#1E3B35]">
                        &quot;{intakeData.primaryConcern}&quot;
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pb-3 border-b border-[#E8E5DC]">
                    <div>
                      <span className="text-[11px] text-[#7A958E] uppercase tracking-wider block">Duration</span>
                      <span className="font-semibold text-[#112F2B]">{intakeData.duration}</span>
                    </div>
                    <div>
                      <span className="text-[11px] text-[#7A958E] uppercase tracking-wider block">Pain Scale</span>
                      <span className="font-semibold text-[#112F2B]">{intakeData.painScale} / 10</span>
                    </div>
                    <div>
                      <span className="text-[11px] text-[#7A958E] uppercase tracking-wider block">Display Alias</span>
                      <span className="font-semibold text-[#112F2B]">{intakeData.patientAlias}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-emerald-800 text-[11px]">
                    <FileCheck2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Ready to attach to your private appointment booking. No data shared publicly.</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#F2EFE8] flex items-center justify-between">
                  <button
                    onClick={handlePrev}
                    className="px-4 py-2 text-xs font-semibold text-[#4E6761] hover:text-[#112F2B] flex items-center gap-1 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                  <button
                    onClick={handleFinishAndMatch}
                    className="px-6 py-3 text-xs font-semibold text-white bg-[#0E4D45] hover:bg-[#083630] rounded-xl transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
                  >
                    <span>Select Doctor &amp; Book Private Slot</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
