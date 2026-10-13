import React, { useState } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp, Phone } from 'lucide-react';

export const EmergencyDisclaimer: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const [expanded, setExpanded] = useState(false);

  if (compact) {
    return (
      <div className="bg-[#FFF8F0] border-y border-[#F3E5D8] px-4 py-2.5 text-xs text-[#8A4A1C]">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#C05621] shrink-0" />
            <span>
              <strong>Medical Safety Notice:</strong> GuptCare is not for acute medical emergencies. If you have severe bleeding, sudden acute scrotal/pelvic pain, or high fever, seek immediate in-person ER care.
            </span>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-[11px] underline font-medium whitespace-nowrap hover:text-[#5B290A]"
          >
            {expanded ? 'Hide Details' : 'Warning Symptoms'}
          </button>
        </div>
        {expanded && (
          <div className="max-w-6xl mx-auto mt-2 pt-2 border-t border-[#F3E5D8] text-[11px] text-[#703A12] grid sm:grid-cols-2 gap-2">
            <div>
              <strong>Emergency Red Flags (Go to ER immediately):</strong>
              <ul className="list-disc pl-4 mt-1 space-y-0.5">
                <li>Sudden severe one-sided testicular pain with vomiting (testicular torsion)</li>
                <li>Massive rectal blood loss causing dizziness, faintness, or pale clamminess</li>
              </ul>
            </div>
            <div>
              <ul className="list-disc pl-4 mt-1 space-y-0.5">
                <li>Severe acute lower abdominal agony with fever &gt; 101°F</li>
                <li>Inability to void urine for &gt; 8 hours with severe bladder pressure</li>
              </ul>
              <div className="mt-1 font-semibold flex items-center gap-1.5 text-[#A0350A]">
                <Phone className="w-3 h-3" />
                Emergency Helpline: Call 112 (India) or your local emergency number
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-[#FFF9F3] border border-[#F4DEC9] rounded-xl p-4 sm:p-5 text-sm text-[#743C16] my-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-[#C05621] shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-[#8C3E14] text-sm">
              Medical Disclaimer & Emergency Protocol
            </h4>
            <p className="text-xs text-[#7A4018] mt-1 leading-relaxed">
              GuptCare provides outpatient clinical telehealth for sensitive and intimate concerns. It does not replace emergency hospital services or acute surgical evaluation. Never delay seeking urgent physical care for acute, deteriorating symptoms.
            </p>
          </div>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs font-medium text-[#A04518] hover:text-[#682708] flex items-center gap-1 shrink-0 p-1"
        >
          {expanded ? 'Less' : 'View Red Flags'}
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-[#F2D7BF] text-xs text-[#6B3410] grid sm:grid-cols-2 gap-4">
          <div>
            <span className="font-semibold text-[#8C3E14]">Seek In-Person Emergency Care If:</span>
            <ul className="list-disc pl-4 mt-1.5 space-y-1">
              <li>Sudden acute testicular swelling/pain (time-critical risk of ischemic torsion)</li>
              <li>Continuous brisk rectal bleeding filling the toilet bowl or causing syncope</li>
              <li>Extreme lower quadrant pelvic pain with chills and high fever</li>
            </ul>
          </div>
          <div>
            <span className="font-semibold text-[#8C3E14]">Emergency Contacts:</span>
            <p className="mt-1.5">
              Call national emergency services immediately: <strong>112</strong> (National Unified Emergency) or visit your nearest hospital emergency department.
            </p>
            <p className="mt-1 text-[11px] text-[#8C461C]">
              Browsing conditions or completing a symptom questionnaire on this platform does not constitute an official diagnostic report until reviewed by a qualified doctor in a formal consultation.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
