import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Edit3, 
  ArrowRight, 
  Sparkles, 
  Lock, 
  Info, 
  RefreshCw,
  Sliders,
  Check,
  UserCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { evaluateClinicalSafety, SafetyEvaluationResult } from '../data/clinicalSafetyRules';

export interface StructuredSymptomReport {
  symptom_summary: string;
  duration: string;
  severity_reported: 'mild' | 'moderate' | 'severe' | 'disruptive';
  pain_scale: number;
  associated_symptoms: string[];
  suggested_speciality: string;
  urgency_flag: 'routine' | 'urgent_in_person' | 'emergency';
  safety_message: string;
  is_ready_for_review: boolean;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
  time: string;
}

export const AISymptomCompanion: React.FC = () => {
  const { intakeData, updateIntakeData, navigateTo, showToast, doctors } = useApp();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      text: 'Namaste & Welcome to Nivara Confidential Intake. I am your private AI Symptom Companion. You can type in English, Hindi, or Hinglish without any embarrassment or fear of judgment. What discomfort or symptom have you been experiencing?',
      time: 'Just now'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKeyNotice, setApiKeyNotice] = useState<string | null>(null);

  // Structured Report state
  const [report, setReport] = useState<StructuredSymptomReport>({
    symptom_summary: intakeData.primaryConcern || '',
    duration: intakeData.duration || '1 to 4 weeks',
    severity_reported: intakeData.severity || 'moderate',
    pain_scale: intakeData.painScale || 4,
    associated_symptoms: intakeData.selectedSymptoms || [],
    suggested_speciality: 'Proctology & Colorectal Surgery',
    urgency_flag: 'routine',
    safety_message: 'Safe for confidential telehealth evaluation.',
    is_ready_for_review: false
  });

  // Edit Report Modal / Inline editing
  const [isEditingReport, setIsEditingReport] = useState(false);
  const [editedSummary, setEditedSummary] = useState(report.symptom_summary);
  const [editedDuration, setEditedDuration] = useState(report.duration);
  const [editedPain, setEditedPain] = useState(report.pain_scale);
  const [editedSpeciality, setEditedSpeciality] = useState(report.suggested_speciality);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Synchronize edit fields when report updates from AI
  useEffect(() => {
    setEditedSummary(report.symptom_summary);
    setEditedDuration(report.duration);
    setEditedPain(report.pain_scale);
    setEditedSpeciality(report.suggested_speciality);
  }, [report]);

  const quickStarters = [
    { label: 'Toilet me dard / blood aata hai', text: 'Mujhe toilet pass karte waqt dard hota hai aur tissue paper pe blood dikhta hai.' },
    { label: 'Burning urination / peshab me jalan', text: 'Peshab karte waqt tez jalan aur frequent urge mehsus hoti hai.' },
    { label: 'Sexual health / performance anxiety', text: 'Mujhe sexual performance aur erection maintain karne me problem aa rahi hai.' },
    { label: 'Itching / irritation in private area', text: 'Intimate skin area me bohot severe itching aur redness ho rahi hai.' },
    { label: 'Discharge / intimate cramps', text: 'Mujhe unusual discharge aur lower abdomen me dull cramps feel ho rahe hain.' }
  ];

  const handleSend = async (customMessage?: string) => {
    const textToSend = customMessage || inputText.trim();
    if (!textToSend || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/symptom-companion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          chatHistory: newHistory.map(m => ({ role: m.role, text: m.text })),
          currentReport: report
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.serviceNotice || data.apiKeyNotice) {
          setApiKeyNotice(data.serviceNotice || data.apiKeyNotice);
        }

        const assistantReplyText = data.assistantReply || 'Thank you for sharing. Could you tell me more about how long this has been happening?';
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            text: assistantReplyText,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);

        if (data.structuredReport) {
          // Double-check with client-side clinician-reviewed safety rules (Feature 2)
          const safetyEval: SafetyEvaluationResult = evaluateClinicalSafety({
            description: `${data.structuredReport.symptom_summary} ${textToSend}`,
            symptoms: data.structuredReport.associated_symptoms || [],
            painScale: data.structuredReport.pain_scale,
            duration: data.structuredReport.duration
          });

          const finalUrgency = !safetyEval.isSafeForTelehealth ? safetyEval.urgencyLevel : data.structuredReport.urgency_flag;
          const finalSafetyMessage = !safetyEval.isSafeForTelehealth && safetyEval.emergencyReason
            ? safetyEval.emergencyReason
            : data.structuredReport.safety_message;

          setReport({
            ...data.structuredReport,
            urgency_flag: finalUrgency,
            safety_message: finalSafetyMessage,
            is_ready_for_review: true
          });
        }
      }
    } catch (err) {
      console.warn('AI Symptom Companion network notice:', err);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: 'I noted your symptom details. Tell me candidly—how many days or weeks has this been going on?',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveEdits = () => {
    setReport(prev => ({
      ...prev,
      symptom_summary: editedSummary,
      duration: editedDuration,
      pain_scale: editedPain,
      suggested_speciality: editedSpeciality
    }));
    setIsEditingReport(false);
    showToast('Intake report draft updated.');
  };

  const handleApproveAndProceed = () => {
    // Map suggested speciality to category ID
    let catId: 'anorectal' | 'sexual-health' | 'urinary-genital' | 'womens-intimate' | 'genital-skin' = 'anorectal';
    const spec = report.suggested_speciality.toLowerCase();
    if (spec.includes('procto') || spec.includes('colorectal')) catId = 'anorectal';
    else if (spec.includes('uro') || spec.includes('androlog') || spec.includes('erectile')) catId = 'sexual-health';
    else if (spec.includes('gynec') || spec.includes('women')) catId = 'womens-intimate';
    else if (spec.includes('derm') || spec.includes('skin')) catId = 'genital-skin';

    // Save into global intakeData state
    updateIntakeData({
      categoryId: catId,
      primaryConcern: report.symptom_summary,
      selectedSymptoms: report.associated_symptoms,
      duration: report.duration,
      severity: report.severity_reported,
      painScale: report.pain_scale,
      redFlagWarningTriggered: report.urgency_flag === 'emergency'
    });

    showToast('AI symptom report securely attached. Proceeding to specialist selection.');

    // Find matching doctor
    const matched = doctors.find(d => d.speciality.toLowerCase().includes(catId.replace('-', ' '))) || doctors[0];
    navigateTo('booking', { doctorId: matched.id });
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E3E0D6] shadow-sm overflow-hidden flex flex-col lg:flex-row min-h-[640px]">
      {/* LEFT COLUMN: Conversational Intake Assistant */}
      <div className="flex-1 flex flex-col border-b lg:border-b-0 lg:border-r border-[#E3E0D6] bg-[#FCFBF8]">
        {/* Companion Header */}
        <div className="p-4 bg-[#F5F3EC] border-b border-[#E3E0D6] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0E4D45] flex items-center justify-center text-white shadow-xs">
              <Bot className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-[#112F2B]">Nivara AI Symptom Companion</h3>
                <span className="text-[10px] bg-emerald-100 text-[#0E4D45] font-semibold px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" />
                  Gemini-Powered
                </span>
              </div>
              <p className="text-xs text-[#526B64]">Multilingual (English, Hindi, Hinglish) · 100% Private</p>
            </div>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-[#526B64]">
            <Lock className="w-3.5 h-3.5 text-emerald-700" />
            <span className="hidden sm:inline">Zero Public Logs</span>
          </div>
        </div>

        {/* API Key info banner if running in local mode */}
        {apiKeyNotice && (
          <div className="bg-[#FFFBEB] border-b border-[#FDE68A] px-4 py-2 text-[11px] text-[#92400E] flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-[#B45309] shrink-0" />
              <span>{apiKeyNotice}</span>
            </div>
            <span className="text-[10px] underline font-medium">Add GEMINI_API_KEY in Secrets for live AI</span>
          </div>
        )}

        {/* Chat Stream (Scrollable) */}
        <div 
          className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs"
          style={{ minHeight: '340px', maxHeight: '480px', scrollbarWidth: 'thin', scrollbarColor: '#0E4D45 #EAE8E0' }}
        >
          {messages.map((m, idx) => (
            <div 
              key={idx} 
              className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 leading-relaxed text-xs shadow-2xs ${
                  m.role === 'user'
                    ? 'bg-[#0E4D45] text-white rounded-br-xs'
                    : 'bg-white border border-[#E2DFD5] text-[#1E332E] rounded-bl-xs'
                }`}
              >
                <p className="whitespace-pre-line">{m.text}</p>
                <span className={`block text-[10px] mt-1 text-right ${m.role === 'user' ? 'text-emerald-200/80' : 'text-[#7D948E]'}`}>
                  {m.time}
                </span>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-[#0E4D45] bg-white p-3 rounded-2xl border border-[#E2DFD5] w-fit">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Analyzing symptoms empathetically...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-2.5 bg-[#FAF9F5] border-t border-[#EAE7DC] overflow-x-auto flex gap-2 text-[11px] no-scrollbar">
          <span className="text-[10px] text-[#7A938C] self-center shrink-0 uppercase font-bold tracking-wider">
            Prompts:
          </span>
          {quickStarters.map((qs, i) => (
            <button
              key={i}
              onClick={() => handleSend(qs.text)}
              className="bg-white hover:bg-[#EBF3F0] text-[#1A3832] border border-[#DDD8CA] px-2.5 py-1 rounded-full whitespace-nowrap transition-colors cursor-pointer shrink-0"
            >
              {qs.label}
            </button>
          ))}
        </div>

        {/* Chat Input */}
        <div className="p-3 bg-white border-t border-[#E3E0D6] flex gap-2 items-center">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your symptoms comfortably in Hindi, Hinglish, or English..."
            className="flex-1 bg-[#FAF9F6] border border-[#DCD7CA] rounded-xl px-3.5 py-2.5 text-xs text-[#16302B] placeholder-[#7F9790] focus:outline-none focus:ring-2 focus:ring-[#0E4D45]/30 focus:border-[#0E4D45]"
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputText.trim() || isLoading}
            className="bg-[#0E4D45] hover:bg-[#083630] disabled:opacity-50 text-white p-2.5 rounded-xl transition-colors cursor-pointer shadow-xs flex items-center justify-center shrink-0"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* RIGHT COLUMN: Live Structured Clinical Report & Approval */}
      <div className="w-full lg:w-[380px] bg-white p-5 flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#ECE9E0]">
            <div>
              <span className="text-[10px] font-bold text-[#0E4D45] uppercase tracking-wider block">
                Structured Clinical Intake
              </span>
              <h4 className="font-bold text-sm text-[#112F2B]">CONFIDENTIAL ASSESSMENT</h4>
            </div>
            {report.is_ready_for_review && !isEditingReport && (
              <button
                onClick={() => setIsEditingReport(true)}
                className="text-xs text-[#0E4D45] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Edit3 className="w-3 h-3" />
                <span>Edit</span>
              </button>
            )}
          </div>

          {/* AI Clinical Disclaimer */}
          <div className="bg-[#FAF9F6] border border-[#E6E3D8] rounded-xl p-2.5 text-[11px] text-[#556E67] flex items-start gap-2">
            <Info className="w-4 h-4 text-[#0E4D45] shrink-0 mt-0.5" />
            <p className="leading-snug">
              This intake is an aid for doctor preparation, <strong>not a medical diagnosis</strong>. A verified clinician will review these notes.
            </p>
          </div>

          {/* Emergency Safety Alert if triggered */}
          {report.urgency_flag === 'emergency' && (
            <div className="bg-red-50 border-2 border-red-300 p-3.5 rounded-xl text-xs text-red-900 space-y-1.5 animate-pulse">
              <div className="flex items-center gap-1.5 font-bold text-red-800">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>CLINICAL SAFETY ALERT</span>
              </div>
              <p className="leading-relaxed text-[11px]">
                {report.safety_message || 'Reported symptoms indicate a potential acute surgical or vascular emergency.'}
              </p>
              <div className="pt-1 text-[11px] font-semibold text-red-900">
                ⚠️ Telehealth cannot replace an emergency room. Please call 112 or visit an emergency hospital immediately.
              </div>
            </div>
          )}

          {/* Report Content Card */}
          {!isEditingReport ? (
            <div className="space-y-3 bg-[#FCFBF8] border border-[#EAE7DC] rounded-xl p-4 text-xs">
              <div>
                <span className="text-[10px] text-[#7A958E] uppercase tracking-wider block font-medium">
                  Reported Concern Summary
                </span>
                <p className="text-[#132E28] font-medium mt-0.5 leading-snug">
                  {report.symptom_summary || 'Listening to your symptoms...'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#EAE7DC]">
                <div>
                  <span className="text-[10px] text-[#7A958E] uppercase tracking-wider block">Duration</span>
                  <span className="font-semibold text-[#112F2B]">{report.duration}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#7A958E] uppercase tracking-wider block">Pain Scale</span>
                  <span className="font-semibold text-[#112F2B]">{report.pain_scale} / 10</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#EAE7DC]">
                <span className="text-[10px] text-[#7A958E] uppercase tracking-wider block mb-1">
                  Associated Symptoms
                </span>
                <div className="flex flex-wrap gap-1">
                  {report.associated_symptoms.length > 0 ? (
                    report.associated_symptoms.map((s, idx) => (
                      <span key={idx} className="bg-white border border-[#D5D0C2] text-[#193A33] px-2 py-0.5 rounded text-[10px]">
                        {s}
                      </span>
                    ))
                  ) : (
                    <span className="text-[11px] text-[#869E97] italic">Extracting from your conversation...</span>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-[#EAE7DC]">
                <span className="text-[10px] text-[#7A958E] uppercase tracking-wider block">Suggested Speciality</span>
                <span className="font-bold text-[#0E4D45] text-xs mt-0.5 block">
                  {report.suggested_speciality}
                </span>
              </div>
            </div>
          ) : (
            /* Editing Mode */
            <div className="space-y-3 bg-[#FCFBF8] border border-[#0E4D45]/40 rounded-xl p-4 text-xs">
              <div>
                <label className="text-[10px] font-bold text-[#1B3833] uppercase tracking-wider block mb-1">
                  Edit Symptom Summary:
                </label>
                <textarea
                  value={editedSummary}
                  onChange={(e) => setEditedSummary(e.target.value)}
                  rows={2}
                  className="w-full bg-white border border-[#DDD9CE] rounded-lg p-2 text-xs text-[#132E28]"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-[#1B3833] uppercase tracking-wider block mb-1">
                  Duration:
                </label>
                <input
                  type="text"
                  value={editedDuration}
                  onChange={(e) => setEditedDuration(e.target.value)}
                  className="w-full bg-white border border-[#DDD9CE] rounded-lg p-1.5 text-xs"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-[#1B3833] uppercase tracking-wider block mb-1">
                  Pain Level (0-10): {editedPain}
                </label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={editedPain}
                  onChange={(e) => setEditedPain(parseInt(e.target.value))}
                  className="w-full accent-[#0E4D45]"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-[#1B3833] uppercase tracking-wider block mb-1">
                  Suggested Speciality:
                </label>
                <select
                  value={editedSpeciality}
                  onChange={(e) => setEditedSpeciality(e.target.value)}
                  className="w-full bg-white border border-[#DDD9CE] rounded-lg p-1.5 text-xs"
                >
                  <option value="Proctology & Colorectal Surgery">Proctology & Colorectal Surgery</option>
                  <option value="Urology & Andrology">Urology & Andrology</option>
                  <option value="Gynecology & Intimate Health">Gynecology & Intimate Health</option>
                  <option value="Genital Dermatology">Genital Dermatology</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setIsEditingReport(false)}
                  className="px-3 py-1.5 text-xs text-[#4E6761] hover:bg-gray-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdits}
                  className="px-3 py-1.5 text-xs font-semibold bg-[#0E4D45] text-white rounded-lg cursor-pointer shadow-2xs"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Action Button: Patient Approval & Proceed */}
        <div className="pt-4 border-t border-[#ECE9E0] space-y-2">
          <button
            onClick={handleApproveAndProceed}
            disabled={!report.symptom_summary && messages.length <= 1}
            className={`w-full py-3 rounded-xl font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer ${
              report.urgency_flag === 'emergency'
                ? 'bg-red-700 hover:bg-red-800 text-white'
                : 'bg-[#0E4D45] hover:bg-[#083630] text-white disabled:opacity-50'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Approve &amp; Match With Doctor</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <p className="text-[10px] text-center text-[#738C85]">
            Encrypted directly for your assigned clinician. Never made public.
          </p>
        </div>
      </div>
    </div>
  );
};
