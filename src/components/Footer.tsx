import React from 'react';
import { Shield, Lock, HeartHandshake, PhoneCall } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { navigateTo } = useApp();

  return (
    <footer className="bg-[#102421] text-[#CAD7D3] border-t border-[#1C3632] mt-20">
      {/* Upper discreet assurance strip */}
      <div className="border-b border-[#1C3632] py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-xs leading-relaxed">
          <div className="flex items-start gap-3">
            <Lock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white block mb-0.5">Discreet Billing & Pseudonymity</span>
              <span>All payment statements appear neutrally as &quot;GC Health Care&quot;. Consultations can be completed using a pseudonymous alias.</span>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Shield className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white block mb-0.5">Verified Medical Council Registrations</span>
              <span>Every clinician holds audited state or national medical council credentials (MS, MCh, MD, DNB) with open registration numbers.</span>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <HeartHandshake className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white block mb-0.5">Strict Intimate Health Specialization</span>
              <span>We do not treat general flu, fevers, or cough. We exclusively provide safe clinical care for sensitive and intimate medical concerns.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main navigation columns */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <Shield className="w-3.5 h-3.5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">Nivara</span>
            </div>
            <p className="text-sm text-[#A8BCB6] font-medium">
              &quot;Your Health. Your Privacy. No Judgment.&quot;
            </p>
            <p className="text-xs text-[#8BA49D] leading-relaxed max-w-sm">
              A private digital healthcare sanctuary connecting individuals suffering in silence with board-certified proctologists, urologists, and intimate health specialists.
            </p>
            <div className="pt-2 text-xs text-[#8BA49D] flex items-center gap-2">
              <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
              <span>Emergency Services: Call <strong>112</strong> if facing acute, life-threatening symptoms.</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Clinical Scopes</h4>
            <ul className="space-y-2 text-xs text-[#9BB3AC]">
              <li>
                <button onClick={() => navigateTo('categories', { categoryId: 'anorectal' })} className="hover:text-white transition-colors text-left">
                  Piles, Fissures &amp; Anorectal
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('categories', { categoryId: 'sexual-health' })} className="hover:text-white transition-colors text-left">
                  Erectile &amp; Sexual Function
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('categories', { categoryId: 'urinary-genital' })} className="hover:text-white transition-colors text-left">
                  Genital &amp; Urinary Health
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('categories', { categoryId: 'womens-intimate' })} className="hover:text-white transition-colors text-left">
                  Women&apos;s Intimate Health
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('categories', { categoryId: 'genital-skin' })} className="hover:text-white transition-colors text-left">
                  Genital Skin &amp; Lesions
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Patient Resources</h4>
            <ul className="space-y-2 text-xs text-[#9BB3AC]">
              <li>
                <button onClick={() => navigateTo('intake')} className="hover:text-white transition-colors text-left">
                  Guided Symptom Intake
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('doctors')} className="hover:text-white transition-colors text-left">
                  Verified Doctor Directory
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('patient-dashboard')} className="hover:text-white transition-colors text-left">
                  Patient Dashboard (Demo)
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('doctor-dashboard')} className="hover:text-white transition-colors text-left">
                  Clinician Portal (Demo)
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('privacy')} className="hover:text-white transition-colors text-left">
                  Privacy &amp; Data Deletion
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Privacy Standards</h4>
            <p className="text-xs text-[#8BA49D] leading-relaxed mb-3">
              We never sell or monetise health data. All consultations are encrypted end-to-end. Video cameras are optional.
            </p>
            <button
              onClick={() => navigateTo('privacy')}
              className="px-3 py-1.5 rounded text-xs bg-[#1A3A34] text-emerald-300 hover:bg-[#224841] transition-colors inline-block"
            >
              Review Privacy Centre
            </button>
          </div>
        </div>

        {/* Bottom copyright & disclaimer */}
        <div className="mt-12 pt-6 border-t border-[#1C3632] flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#7A958E] gap-4">
          <p>
            &copy; {new Date().getFullYear()} Nivara Telehealth Technologies. All clinical data presented are fictional sample scenarios for demonstration.
          </p>
          <div className="flex items-center gap-4">
            <button onClick={() => navigateTo('privacy')} className="hover:text-white">Confidentiality Policy</button>
            <span>·</span>
            <button onClick={() => navigateTo('privacy')} className="hover:text-white">Consent Framework</button>
            <span>·</span>
            <span>Telehealth Practice Guidelines</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
