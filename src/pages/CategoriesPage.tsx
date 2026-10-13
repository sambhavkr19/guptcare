import React, { useState, useMemo } from 'react';
import { Search, ShieldAlert, ArrowRight, AlertTriangle, CheckCircle2, ChevronRight, Stethoscope } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { HEALTH_CATEGORIES } from '../data/mockData';
import { HealthCondition } from '../types';

export const CategoriesPage: React.FC = () => {
  const { navigateTo, selectedCategoryId, setSelectedCategoryId } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<string>(selectedCategoryId || 'all');
  const [selectedConditionModal, setSelectedConditionModal] = useState<HealthCondition | null>(null);

  // Filter conditions based on category tab & search query
  const filteredConditions = useMemo(() => {
    let allConds: HealthCondition[] = [];
    HEALTH_CATEGORIES.forEach(cat => {
      if (activeTab === 'all' || cat.id === activeTab) {
        allConds = allConds.concat(cat.conditions);
      }
    });

    if (!searchQuery.trim()) return allConds;

    const q = searchQuery.toLowerCase().trim();
    return allConds.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.plainDescription.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q) ||
      c.commonSymptoms.some(s => s.toLowerCase().includes(q))
    );
  }, [activeTab, searchQuery]);

  const handleDiscussPrivately = (condition: HealthCondition) => {
    navigateTo('intake', {
      categoryId: condition.categoryId,
      conditionId: condition.id
    });
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#1E2E2B] py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Page Header */}
        <div className="max-w-2xl mb-8">
          <span className="text-xs font-semibold text-[#0E4D45] uppercase tracking-wider block mb-1">
            Clinical Knowledge Base
          </span>
          <h1 className="text-3xl font-bold text-[#112F2B] tracking-tight">
            Sensitive &amp; Intimate Health Concerns
          </h1>
          <p className="text-sm text-[#4E6761] mt-2 leading-relaxed">
            Understand your symptoms in clear, medical yet stigma-free terms. Discover how early clinical evaluation provides fast relief.
          </p>
        </div>

        {/* Mandatory Medical Safety Disclaimer */}
        <div className="bg-[#FFF9F3] border border-[#F3DFC9] rounded-2xl p-4 sm:p-5 mb-8 text-xs text-[#7B3D14] flex items-start gap-3.5">
          <ShieldAlert className="w-5 h-5 text-[#C05621] shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="font-semibold block text-[#8F3E0E] text-sm mb-0.5">
              Important Clinical Disclaimer:
            </strong>
            Browsing condition summaries, reading symptoms, or searching this library does <em>not</em> constitute a confirmed diagnosis or medical advice. A diagnosis requires a private consultation with a certified clinician who reviews your personal history.
          </div>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E3E0D6] shadow-xs mb-8 space-y-4">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#7A958E] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by symptom or condition (e.g., bleeding, itching, foreskin, painful intercourse, discharge)..."
              className="w-full bg-[#FAF9F6] border border-[#DDD9CE] rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-[#1B3833] placeholder-[#7E968F] focus:outline-none focus:ring-2 focus:ring-[#0E4D45]/30 focus:border-[#0E4D45]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#7A958E] hover:text-[#112F2B]"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Tabs (Clean button controls obeying zero-pill discipline) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => {
                setActiveTab('all');
                setSelectedCategoryId(null);
              }}
              className={`px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                activeTab === 'all'
                  ? 'bg-[#0E4D45] text-white shadow-xs font-semibold'
                  : 'bg-[#F2EFE8] text-[#3D554F] hover:bg-[#E5E1D5]'
              }`}
            >
              All Sensitive Concerns
            </button>

            {HEALTH_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveTab(cat.id);
                  setSelectedCategoryId(cat.id);
                }}
                className={`px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  activeTab === cat.id
                    ? 'bg-[#0E4D45] text-white shadow-xs font-semibold'
                    : 'bg-[#F2EFE8] text-[#3D554F] hover:bg-[#E5E1D5]'
                }`}
              >
                {cat.title}
              </button>
            ))}
          </div>
        </div>

        {/* Results Counter & Active Context */}
        <div className="flex items-center justify-between text-xs text-[#5C726C] mb-4 px-1">
          <span>Showing <strong className="text-[#112F2B] font-semibold">{filteredConditions.length}</strong> conditions</span>
          {activeTab !== 'all' && (
            <span className="text-[11px] text-[#0E4D45] font-medium">
              Filtered by: {HEALTH_CATEGORIES.find(c => c.id === activeTab)?.title}
            </span>
          )}
        </div>

        {/* Empty State */}
        {filteredConditions.length === 0 && (
          <div className="bg-white rounded-2xl p-10 border border-[#E3E0D6] text-center max-w-lg mx-auto">
            <Stethoscope className="w-10 h-10 text-[#7A958E] mx-auto mb-3" />
            <h3 className="text-base font-bold text-[#112F2B]">No exact condition found</h3>
            <p className="text-xs text-[#526B64] mt-1.5 leading-relaxed">
              We focus exclusively on anorectal, sexual, genital-urinary, and intimate skin concerns. We do not cover colds, fevers, or general medicine.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveTab('all');
              }}
              className="mt-4 px-4 py-2 text-xs font-semibold text-[#0E4D45] bg-[#EBF3F0] rounded-lg hover:bg-[#DFECE7]"
            >
              Reset Search &amp; Filters
            </button>
          </div>
        )}

        {/* Condition Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredConditions.map((condition) => (
            <div
              key={condition.id}
              className="bg-white rounded-2xl border border-[#E3E0D6] p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-[#637973] mb-2">
                  <span className="font-medium text-[#0E4D45]">{condition.category}</span>
                  <span>{condition.relevantSpeciality.split('&')[0]}</span>
                </div>

                <h3 className="text-lg font-bold text-[#112F2B] mb-2">
                  {condition.name}
                </h3>

                <p className="text-xs text-[#4E6761] leading-relaxed mb-4">
                  {condition.plainDescription}
                </p>

                {/* Common Symptoms List */}
                <div className="mb-4">
                  <span className="text-[11px] font-semibold text-[#23423C] uppercase tracking-wider block mb-1.5">
                    Frequent Symptoms:
                  </span>
                  <div className="space-y-1 text-xs text-[#35524B]">
                    {condition.commonSymptoms.map((sym, idx) => (
                      <div key={idx} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{sym}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* When to Seek Doctor */}
                <div className="bg-[#FAF9F5] p-3 rounded-xl border border-[#ECE9DF] text-[11px] text-[#465E58] mb-5">
                  <strong className="text-[#1B3833] block mb-0.5">When to consult:</strong>
                  {condition.whenToSeekDoctor}
                </div>
              </div>

              <div className="pt-4 border-t border-[#F2EFE8] flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedConditionModal(condition)}
                  className="text-xs font-medium text-[#465E58] hover:text-[#112F2B] cursor-pointer"
                >
                  View Red Flags
                </button>

                <button
                  onClick={() => handleDiscussPrivately(condition)}
                  className="px-3.5 py-2 text-xs font-semibold text-white bg-[#0E4D45] hover:bg-[#083630] rounded-xl transition-colors shadow-xs flex items-center gap-1 cursor-pointer"
                >
                  <span>Discuss Privately</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Condition Deep-Dive Modal (with red flag safety audit) */}
      {selectedConditionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-[#DDD9CE] space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold text-[#0E4D45] uppercase tracking-wider">
                  {selectedConditionModal.category}
                </span>
                <h3 className="text-xl font-bold text-[#112F2B] mt-0.5">
                  {selectedConditionModal.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedConditionModal(null)}
                className="text-[#7A958E] hover:text-[#112F2B] text-lg font-bold p-1"
              >
                ×
              </button>
            </div>

            <p className="text-xs text-[#445E57] leading-relaxed">
              {selectedConditionModal.plainDescription}
            </p>

            <div className="bg-[#FFF8F2] border border-[#F6E1D1] p-3.5 rounded-xl text-xs text-[#8C3F13]">
              <div className="flex items-center gap-1.5 font-bold mb-1 text-[#A14310]">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Emergency Warning Signs (Requires Immediate In-Person ER Care):</span>
              </div>
              <ul className="list-disc pl-4 space-y-1 text-[11px] text-[#7A360E]">
                {selectedConditionModal.redFlags.map((rf, idx) => (
                  <li key={idx}>{rf}</li>
                ))}
              </ul>
            </div>

            <div className="text-xs text-[#526B64] bg-[#F7F6F0] p-3 rounded-xl border border-[#EAE7DC]">
              <strong className="block text-[#112F2B] mb-0.5">Assigned Clinical Speciality:</strong>
              {selectedConditionModal.relevantSpeciality}
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setSelectedConditionModal(null)}
                className="px-4 py-2 text-xs font-medium text-[#465E58] hover:text-[#112F2B]"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const cond = selectedConditionModal;
                  setSelectedConditionModal(null);
                  handleDiscussPrivately(cond);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#0E4D45] hover:bg-[#083630] rounded-xl shadow-xs"
              >
                Start Private Intake for This
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
