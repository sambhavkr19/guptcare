import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ShieldCheck, 
  MessageSquare, 
  Phone, 
  Video, 
  Check, 
  ChevronRight, 
  UserCheck, 
  Award,
  Filter,
  Calendar
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Doctor } from '../types';

export const DoctorsDirectoryPage: React.FC = () => {
  const { doctors, navigateTo } = useApp();

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpeciality, setSelectedSpeciality] = useState('all');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [selectedMode, setSelectedMode] = useState<string>('all');
  const [availableTodayOnly, setAvailableTodayOnly] = useState(false);
  const [selectedGender, setSelectedGender] = useState('all');

  // Filter logic
  const filteredDoctors = useMemo(() => {
    return doctors.filter(doc => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = doc.name.toLowerCase().includes(q);
        const matchesSpec = doc.speciality.toLowerCase().includes(q);
        const matchesBio = doc.bio.toLowerCase().includes(q);
        const matchesFocus = doc.focusAreas.some(f => f.toLowerCase().includes(q));
        if (!matchesName && !matchesSpec && !matchesBio && !matchesFocus) return false;
      }

      // Speciality filter
      if (selectedSpeciality !== 'all') {
        if (!doc.speciality.toLowerCase().includes(selectedSpeciality.toLowerCase())) return false;
      }

      // Language filter
      if (selectedLanguage !== 'all') {
        if (!doc.languages.includes(selectedLanguage)) return false;
      }

      // Mode filter
      if (selectedMode !== 'all') {
        if (!doc.modes.includes(selectedMode as any)) return false;
      }

      // Available today
      if (availableTodayOnly && !doc.availableToday) {
        return false;
      }

      // Gender preference
      if (selectedGender !== 'all' && doc.gender !== selectedGender) {
        return false;
      }

      return true;
    });
  }, [doctors, searchQuery, selectedSpeciality, selectedLanguage, selectedMode, availableTodayOnly, selectedGender]);

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#1E2E2B] py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Page Heading & Trust Strip */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#0E4D45] uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4 text-[#0E4D45]" />
              <span>Verified Specialist Directory</span>
            </div>
            <h1 className="text-3xl font-bold text-[#112F2B] tracking-tight">
              Consult Qualified Doctors Privately
            </h1>
            <p className="text-xs sm:text-sm text-[#4E6761] mt-1.5 leading-relaxed">
              Every clinician is certified, verified against Medical Council of India / State registers, and committed to empathetic care.
            </p>
          </div>

          <div className="bg-[#EBF3F0] text-[#0E4D45] text-xs px-3.5 py-2 rounded-xl border border-[#D0E2DB] flex items-center gap-2 shrink-0">
            <Award className="w-4 h-4" />
            <span>Fictional sample clinicians for demonstration</span>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-white rounded-2xl p-5 border border-[#E3E0D6] shadow-xs mb-8 space-y-4">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#7A958E] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by doctor name, condition, or focus area (e.g., piles, ED, lichen sclerosus, burning urination)..."
              className="w-full bg-[#FAF9F6] border border-[#DDD9CE] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#1B3833] placeholder-[#7E968F] focus:outline-none focus:ring-2 focus:ring-[#0E4D45]/30 focus:border-[#0E4D45]"
            />
          </div>

          {/* Filter Dropdowns & Toggles */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
            {/* Speciality */}
            <div>
              <label className="text-[10px] font-bold text-[#637973] uppercase tracking-wider block mb-1">
                Speciality
              </label>
              <select
                value={selectedSpeciality}
                onChange={(e) => setSelectedSpeciality(e.target.value)}
                className="w-full bg-[#FAF9F6] border border-[#DDD9CE] rounded-lg px-2.5 py-2 text-xs text-[#1B3833] focus:outline-none"
              >
                <option value="all">All Specialities</option>
                <option value="Proctologist">Proctology (Piles/Fissures)</option>
                <option value="Urologist">Urology &amp; Andrology</option>
                <option value="Gynecologist">Gynecology (Intimate Health)</option>
                <option value="Dermato">Genital Dermatology</option>
              </select>
            </div>

            {/* Language */}
            <div>
              <label className="text-[10px] font-bold text-[#637973] uppercase tracking-wider block mb-1">
                Language
              </label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full bg-[#FAF9F6] border border-[#DDD9CE] rounded-lg px-2.5 py-2 text-xs text-[#1B3833] focus:outline-none"
              >
                <option value="all">Any Language</option>
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Bengali">Bengali</option>
                <option value="Marathi">Marathi</option>
                <option value="Kannada">Kannada</option>
                <option value="Malayalam">Malayalam</option>
              </select>
            </div>

            {/* Consultation Mode */}
            <div>
              <label className="text-[10px] font-bold text-[#637973] uppercase tracking-wider block mb-1">
                Consultation Mode
              </label>
              <select
                value={selectedMode}
                onChange={(e) => setSelectedMode(e.target.value)}
                className="w-full bg-[#FAF9F6] border border-[#DDD9CE] rounded-lg px-2.5 py-2 text-xs text-[#1B3833] focus:outline-none"
              >
                <option value="all">All Modes</option>
                <option value="chat">Private Chat</option>
                <option value="audio">Voice Audio</option>
                <option value="video">Discreet Video</option>
              </select>
            </div>

            {/* Gender Preference */}
            <div>
              <label className="text-[10px] font-bold text-[#637973] uppercase tracking-wider block mb-1">
                Doctor Gender
              </label>
              <select
                value={selectedGender}
                onChange={(e) => setSelectedGender(e.target.value)}
                className="w-full bg-[#FAF9F6] border border-[#DDD9CE] rounded-lg px-2.5 py-2 text-xs text-[#1B3833] focus:outline-none"
              >
                <option value="all">No Preference</option>
                <option value="Female">Female Doctor</option>
                <option value="Male">Male Doctor</option>
              </select>
            </div>

            {/* Available Today Check */}
            <div className="flex items-end">
              <label className="w-full flex items-center gap-2 p-2 rounded-lg bg-[#FAF9F6] border border-[#DDD9CE] cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={availableTodayOnly}
                  onChange={(e) => setAvailableTodayOnly(e.target.checked)}
                  className="accent-[#0E4D45] rounded"
                />
                <span className="font-medium text-[#1B3833]">Available Today</span>
              </label>
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between text-xs text-[#526B64] mb-4 px-1">
          <span>Found <strong className="text-[#112F2B] font-semibold">{filteredDoctors.length}</strong> qualified clinicians</span>
          <span className="text-[11px]">Next available slots shown in real time</span>
        </div>

        {/* Empty State */}
        {filteredDoctors.length === 0 && (
          <div className="bg-white rounded-2xl p-10 border border-[#E3E0D6] text-center max-w-md mx-auto">
            <UserCheck className="w-10 h-10 text-[#7A958E] mx-auto mb-3" />
            <h3 className="text-base font-bold text-[#112F2B]">No doctors match current filters</h3>
            <p className="text-xs text-[#526B64] mt-1.5">
              Try loosening your language, gender, or speciality filter criteria.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedSpeciality('all');
                setSelectedLanguage('all');
                setSelectedMode('all');
                setSelectedGender('all');
                setAvailableTodayOnly(false);
              }}
              className="mt-4 px-4 py-2 text-xs font-semibold text-[#0E4D45] bg-[#EBF3F0] rounded-lg"
            >
              Reset All Filters
            </button>
          </div>
        )}

        {/* Doctor Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredDoctors.map(doctor => (
            <div
              key={doctor.id}
              className="bg-white rounded-2xl border border-[#E3E0D6] p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-[#ECE8DE] shrink-0 border border-[#D7D2C4]">
                    {doctor.avatar ? (
                      <img
                        src={doctor.avatar}
                        alt={doctor.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-lg text-[#0E4D45]">
                        DR
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-base text-[#112F2B]">{doctor.name}</h3>
                      <span title="Verified Registration">
                        <ShieldCheck className="w-4 h-4 text-[#0E4D45]" />
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-[#0E4D45] mt-0.5">{doctor.speciality}</p>
                    <p className="text-[11px] text-[#637973] mt-0.5 font-mono">
                      Reg: {doctor.registrationNumber} ({doctor.medicalCouncil})
                    </p>
                    <div className="flex items-center gap-3 text-xs text-[#526B64] mt-1">
                      <span>{doctor.experienceYears} Years Exp</span>
                      <span>·</span>
                      <span>★ {doctor.rating}</span>
                      <span>·</span>
                      <span>{doctor.languages.join(', ')}</span>
                    </div>
                  </div>
                </div>

                {/* Doctor Bio Snippet */}
                <p className="text-xs text-[#445E57] mt-4 leading-relaxed line-clamp-2">
                  {doctor.bio}
                </p>

                {/* Focus Areas */}
                <div className="mt-3 flex flex-wrap gap-1 text-[11px]">
                  {doctor.focusAreas.map((area, idx) => (
                    <span key={idx} className="bg-[#FAF9F5] border border-[#E8E5DC] text-[#294B43] px-2 py-0.5 rounded text-[10px]">
                      {area}
                    </span>
                  ))}
                </div>

                {/* Supported Modes & Availability */}
                <div className="mt-4 pt-3 border-t border-[#F2EFE8] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-[#526B64]">
                    <span className="text-[10px] uppercase font-bold text-[#7E968F]">Modes:</span>
                    <div className="flex items-center gap-1.5">
                      {doctor.modes.includes('chat') && (
                        <span className="flex items-center gap-1 text-[11px] text-[#2D4E46]" title="Encrypted Chat">
                          <MessageSquare className="w-3 h-3 text-[#0E4D45]" /> Chat
                        </span>
                      )}
                      {doctor.modes.includes('audio') && (
                        <span className="flex items-center gap-1 text-[11px] text-[#2D4E46]" title="Private Audio">
                          <Phone className="w-3 h-3 text-[#0E4D45]" /> Audio
                        </span>
                      )}
                      {doctor.modes.includes('video') && (
                        <span className="flex items-center gap-1 text-[11px] text-[#2D4E46]" title="Optional Video">
                          <Video className="w-3 h-3 text-[#0E4D45]" /> Video
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-[11px] font-medium text-emerald-800 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{doctor.nextSlotTime}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Card Actions */}
              <div className="pt-4 mt-4 border-t border-[#F0EEE6] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#637973] uppercase tracking-wider block">Consultation Fee</span>
                  <span className="text-base font-bold text-[#112F2B]">₹{doctor.fee}</span>
                  <span className="text-[10px] text-[#7A958E] ml-1">all inclusive</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigateTo('doctor-profile', { doctorId: doctor.id })}
                    className="px-3 py-2 text-xs font-semibold text-[#1B3833] bg-[#FAF9F5] border border-[#DDD9CE] hover:bg-[#EFECE3] rounded-xl transition-colors cursor-pointer"
                  >
                    View Bio &amp; Reg
                  </button>
                  <button
                    onClick={() => navigateTo('booking', { doctorId: doctor.id })}
                    className="px-4 py-2 text-xs font-semibold text-white bg-[#0E4D45] hover:bg-[#083630] rounded-xl transition-colors shadow-xs flex items-center gap-1 cursor-pointer"
                  >
                    <span>Book Private Slot</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
