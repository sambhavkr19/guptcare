import React, { useState, useRef, useEffect } from 'react';
import { Video, Mic, MicOff, VideoOff, Send, Lock, X, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const VirtualConsultationModal: React.FC = () => {
  const { activeConsultation, closeConsultationRoom, showToast } = useApp();
  const [micMuted, setMicMuted] = useState(false);
  const [videoActive, setVideoActive] = useState(false); // Default video off for privacy
  const [messages, setMessages] = useState<Array<{ sender: 'doctor' | 'patient'; text: string; time: string }>>([
    {
      sender: 'doctor',
      text: 'Hello. I have securely reviewed your symptom intake notes regarding your condition. You are in a safe, completely private consultation room. Please take your time—how long have you noticed this discomfort?',
      time: '10:02 AM'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [isDoctorTyping, setIsDoctorTyping] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isDoctorTyping]);

  if (!activeConsultation) return null;

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const userText = inputMessage.trim();
    if (!userText || isDoctorTyping) return;

    const newMsg = {
      sender: 'patient' as const,
      text: userText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedHistory = [...messages, newMsg];
    setMessages(updatedHistory);
    setInputMessage('');
    setIsDoctorTyping(true);

    try {
      const { generateDoctorResponse } = await import('../services/clinicalChatEngine');
      const docReply = await generateDoctorResponse(userText, {
        doctorName: activeConsultation.doctorName,
        doctorSpeciality: activeConsultation.doctorSpeciality,
        patientAlias: activeConsultation.patientAlias,
        symptomBrief: activeConsultation.symptomSummary.concern,
        history: updatedHistory
      });

      // Realistic typing settling delay
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            sender: 'doctor',
            text: docReply,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        setIsDoctorTyping(false);
      }, 900);
    } catch (err) {
      setIsDoctorTyping(false);
    }
  };

  const handleEndConsultation = () => {
    showToast('Consultation session concluded safely. Clinical summary archived to your private dashboard.');
    closeConsultationRoom();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#122421] text-white w-full max-w-4xl h-[92vh] max-h-[820px] rounded-2xl flex flex-col overflow-hidden shadow-2xl border border-emerald-950">
        {/* Room Header (Pinned top, shrink-0) */}
        <div className="shrink-0 px-4 sm:px-5 py-3 bg-[#0A1A18] border-b border-[#1A332F] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full overflow-hidden bg-emerald-900 border border-emerald-700/50 shrink-0">
              {activeConsultation.doctorAvatar ? (
                <img
                  src={activeConsultation.doctorAvatar}
                  alt={activeConsultation.doctorName}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs font-bold text-emerald-200">
                  DR
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm text-white">{activeConsultation.doctorName}</h3>
                <span className="text-[10px] text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/40">
                  Encrypted Session
                </span>
              </div>
              <p className="text-xs text-[#8BA49E]">{activeConsultation.doctorSpeciality}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-300 bg-[#0E2924] px-2.5 py-1 rounded-md">
              <Lock className="w-3.5 h-3.5" />
              <span>Patient: {activeConsultation.patientAlias} (Pseudonymous)</span>
            </div>
            <button
              onClick={handleEndConsultation}
              className="px-3 py-1.5 text-xs font-medium bg-red-600/90 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Leave Room</span>
            </button>
          </div>
        </div>

        {/* Room Body: Split between consultation feed & Patient intake brief */}
        <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-3 overflow-hidden">
          {/* Main Consultation Column (Must have min-h-0 to allow internal flex-1 child to scroll) */}
          <div className="md:col-span-2 flex flex-col min-h-0 h-full bg-[#0F211E] border-r border-[#1B3631]">
            {/* Top Stream Status View (Compact & shrink-0) */}
            <div className="shrink-0 h-32 sm:h-36 bg-[#091513] relative flex items-center justify-center p-3 border-b border-[#1A332F]">
              {videoActive ? (
                <div className="w-full h-full bg-[#162E29] rounded-xl flex items-center justify-center border border-emerald-800/40 relative overflow-hidden">
                  <div className="text-center text-emerald-200 text-xs">
                    <Video className="w-6 h-6 mx-auto mb-1 opacity-70" />
                    <span>Discreet Video Active (Camera preview active)</span>
                  </div>
                  <div className="absolute top-2 right-2 text-[10px] bg-black/60 px-2 py-0.5 rounded text-emerald-400">
                    HD Encrypted
                  </div>
                </div>
              ) : (
                <div className="text-center text-[#9BB3AC] max-w-sm px-4">
                  <div className="w-8 h-8 rounded-full bg-[#142D28] mx-auto flex items-center justify-center mb-1.5 text-emerald-300">
                    <VideoOff className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-semibold text-white">Privacy First: Video Camera is OFF</h4>
                  <p className="text-[11px] text-[#7A958E] mt-0.5">
                    Audio and encrypted text chat are active. Video camera is completely optional.
                  </p>
                </div>
              )}

              {/* In-Call Media Bar */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-[#081513]/90 backdrop-blur-md px-3 py-1 rounded-full border border-emerald-900/60 shadow-lg">
                <button
                  onClick={() => setMicMuted(!micMuted)}
                  className={`p-1.5 rounded-full text-xs transition-colors cursor-pointer ${
                    micMuted ? 'bg-red-900/80 text-white' : 'bg-emerald-900/60 text-emerald-200 hover:bg-emerald-800'
                  }`}
                  title={micMuted ? 'Unmute microphone' : 'Mute microphone'}
                >
                  {micMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => setVideoActive(!videoActive)}
                  className={`p-1.5 rounded-full text-xs transition-colors cursor-pointer ${
                    videoActive ? 'bg-emerald-800 text-white' : 'bg-[#1C3632] text-emerald-300 hover:bg-[#254641]'
                  }`}
                  title={videoActive ? 'Turn camera off' : 'Turn camera on (optional)'}
                >
                  {videoActive ? <Video className="w-3.5 h-3.5" /> : <VideoOff className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Encrypted Chat Stream (flex-1 min-h-0 with overflow-y-auto creates the active scrollbar!) */}
            <div 
              className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3 text-xs"
              style={{ scrollbarWidth: 'thin', scrollbarColor: '#10564D #091714' }}
            >
              <div className="text-center text-[10px] text-[#7B958E] bg-[#0A1A18]/70 py-1 px-3 rounded-full mx-auto w-fit border border-[#17332E]">
                End-to-End Encrypted Consultation Channel · No Recording Allowed
              </div>

              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex flex-col ${msg.sender === 'patient' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                      msg.sender === 'patient'
                        ? 'bg-[#0E4D45] text-white rounded-br-xs'
                        : 'bg-[#1A332F] text-emerald-50 rounded-bl-xs border border-emerald-800/30'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <span className="block text-[10px] text-emerald-300/70 text-right mt-1">
                      {msg.time}
                    </span>
                  </div>
                </div>
              ))}

              {isDoctorTyping && (
                <div className="flex flex-col items-start">
                  <div className="bg-[#1A332F] text-emerald-300 rounded-2xl rounded-bl-xs px-3.5 py-2 text-xs border border-emerald-800/30 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse [animation-delay:0.4s]" />
                    <span className="text-[11px] text-emerald-200/80 ml-1">{activeConsultation.doctorName} is typing...</span>
                  </div>
                </div>
              )}

              {/* Scroll anchor */}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input form (Always pinned at bottom with shrink-0) */}
            <form onSubmit={handleSendMessage} className="shrink-0 p-3 bg-[#0A1A18] border-t border-[#1B3631] flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={e => setInputMessage(e.target.value)}
                placeholder="Type your question or symptom in complete privacy..."
                className="flex-1 bg-[#132A26] border border-[#1E3F39] rounded-xl px-3.5 py-2 text-xs text-white placeholder-[#78958E] focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <button
                type="submit"
                className="px-3.5 py-2 bg-[#0E4D45] hover:bg-emerald-700 text-white rounded-xl transition-colors shrink-0 flex items-center justify-center cursor-pointer"
                aria-label="Send message"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* Right Sidebar: Patient Confidential Symptom File */}
          <div 
            className="hidden md:flex flex-col min-h-0 h-full bg-[#0C1C19] p-4 text-xs overflow-y-auto space-y-4"
            style={{ scrollbarWidth: 'thin', scrollbarColor: '#10564D #091714' }}
          >
            <div className="flex items-center gap-2 text-emerald-400 font-semibold border-b border-[#1A332F] pb-2">
              <FileText className="w-4 h-4" />
              <span>Confidential Intake Brief</span>
            </div>

            <div className="bg-[#122824] p-3 rounded-xl border border-emerald-900/30 space-y-2">
              <span className="text-[11px] text-[#7A968E] uppercase tracking-wider block">Reported Concern</span>
              <p className="font-medium text-white text-xs">{activeConsultation.symptomSummary.concern}</p>
              <div className="flex items-center justify-between text-[11px] text-emerald-200 pt-1 border-t border-emerald-900/40">
                <span>Category:</span>
                <span className="font-semibold">{activeConsultation.symptomSummary.category}</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-emerald-200">
                <span>Duration:</span>
                <span>{activeConsultation.symptomSummary.duration}</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-emerald-200">
                <span>Severity:</span>
                <span className="capitalize">{activeConsultation.symptomSummary.severity}</span>
              </div>
            </div>

            <div>
              <span className="text-[11px] text-[#7A968E] uppercase tracking-wider block mb-1.5">Key Symptoms</span>
              <ul className="space-y-1.5">
                {activeConsultation.symptomSummary.symptoms.map((s, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 text-emerald-100/90 text-xs bg-[#122824] p-2 rounded-lg">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[#162719] p-3 rounded-xl border border-emerald-800/40 text-[11px] text-emerald-200 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-emerald-300">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Doctor Note for Patient</span>
              </div>
              <p className="leading-relaxed">
                Remember that embarrassment causes severe delays in treatment. Today&apos;s evaluation is fully confidential and protected under clinical non-disclosure laws.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
