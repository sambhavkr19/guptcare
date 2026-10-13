import React, { useState } from 'react';
import { Shield, Lock, Menu, X, User, Stethoscope } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Header: React.FC = () => {
  const { currentView, navigateTo, userRole, setUserRole, patientAlias, currentUser, userProfile } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (view: any) => {
    navigateTo(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F5]/95 backdrop-blur-md border-b border-[#E6E4DD]">
      {/* Discreet Banner for Patient Comfort */}
      <div className="bg-[#0E4D45] text-white text-xs py-1.5 px-4 text-center">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 mx-auto sm:mx-0">
            <Lock className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
            <span className="font-normal text-emerald-50">
              100% Confidential Intimate Healthcare · Discreet billing as <strong className="font-semibold text-white">GC Health Care</strong>
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-[11px] text-emerald-200">
            <span>No Video Required</span>
            <span>·</span>
            <span>Pseudonymous Consultations</span>
          </div>
        </div>
      </div>

      {/* Strict Top Bar Contract: Zone 1 (Wordmark) — Zone 2 (4-5 Nav Links) — Zone 3 (1 Primary Action) */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => handleNav('landing')}
          className="flex items-center gap-2.5 text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0E4D45] rounded-md"
        >
          <div className="w-8 h-8 rounded-lg bg-[#0E4D45] flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
            <Shield className="w-4 h-4 text-emerald-200" />
          </div>
          <span className="text-xl font-bold tracking-tight text-[#133832] whitespace-nowrap shrink-0">
            GuptCare
          </span>
        </button>

        {/* Zone 2: 4–5 single-line clean nav links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#384C47]">
          <button
            onClick={() => handleNav('categories')}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              currentView === 'categories' ? 'text-[#0E4D45] font-semibold underline underline-offset-4 decoration-2' : 'hover:text-[#0E4D45]'
            }`}
          >
            Sensitive Concerns
          </button>
          <button
            onClick={() => handleNav('intake')}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              currentView === 'intake' ? 'text-[#0E4D45] font-semibold underline underline-offset-4 decoration-2' : 'hover:text-[#0E4D45]'
            }`}
          >
            Symptom Intake
          </button>
          <button
            onClick={() => handleNav('doctors')}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              currentView === 'doctors' || currentView === 'doctor-profile' ? 'text-[#0E4D45] font-semibold underline underline-offset-4 decoration-2' : 'hover:text-[#0E4D45]'
            }`}
          >
            Verified Doctors
          </button>
          <button
            onClick={() => handleNav('privacy')}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              currentView === 'privacy' ? 'text-[#0E4D45] font-semibold underline underline-offset-4 decoration-2' : 'hover:text-[#0E4D45]'
            }`}
          >
            Privacy Centre
          </button>
          <button
            onClick={() => handleNav(userRole === 'doctor' ? 'doctor-dashboard' : 'patient-dashboard')}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              currentView === 'patient-dashboard' || currentView === 'doctor-dashboard' ? 'text-[#0E4D45] font-semibold underline underline-offset-4 decoration-2' : 'hover:text-[#0E4D45]'
            }`}
          >
            {userRole === 'doctor' ? 'Doctor Portal' : 'My Dashboard'}
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action Area */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          {/* Auth State Button */}
          {currentUser ? (
            <button
              onClick={() => handleNav('auth')}
              className="text-xs font-semibold text-[#0E4D45] bg-[#EBF3F0] hover:bg-[#DCEAE5] px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <User className="w-3.5 h-3.5" />
              <span>{userProfile?.displayAlias || currentUser.email?.split('@')[0]}</span>
            </button>
          ) : (
            <button
              onClick={() => handleNav('auth')}
              className="text-xs font-medium text-[#465A54] hover:text-[#0E4D45] px-2.5 py-1.5 cursor-pointer whitespace-nowrap"
            >
              Sign In
            </button>
          )}

          {/* Quick Role Switcher for Testing/Demonstrating Patient vs Doctor Views */}
          <div className="flex items-center rounded-lg bg-[#EFECE3] p-0.5 text-xs font-medium text-[#465A54]">
            <button
              onClick={() => setUserRole('patient')}
              className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1.5 ${
                userRole === 'patient' ? 'bg-white text-[#133832] shadow-xs font-semibold' : 'hover:text-[#133832]'
              }`}
              title="View app as patient"
            >
              <User className="w-3 h-3" />
              Patient
            </button>
            <button
              onClick={() => {
                setUserRole('doctor');
                navigateTo('doctor-dashboard');
              }}
              className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1.5 ${
                userRole === 'doctor' ? 'bg-white text-[#133832] shadow-xs font-semibold' : 'hover:text-[#133832]'
              }`}
              title="View app as verified clinician"
            >
              <Stethoscope className="w-3 h-3" />
              Doctor
            </button>
          </div>

          <button
            onClick={() => handleNav('intake')}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#0E4D45] hover:bg-[#093933] rounded-lg transition-colors shadow-xs whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0E4D45]"
          >
            Get Private Consultation
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-[#384C47] hover:text-[#0E4D45] rounded-md focus-visible:outline-none"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E6E4DD] bg-[#FAF9F5] px-4 py-4 space-y-3">
          <div className="flex flex-col space-y-2 text-sm font-medium text-[#2E423E]">
            <button
              onClick={() => handleNav('landing')}
              className="text-left py-2 px-3 rounded-md hover:bg-[#EFECE3]"
            >
              Home
            </button>
            <button
              onClick={() => handleNav('categories')}
              className="text-left py-2 px-3 rounded-md hover:bg-[#EFECE3]"
            >
              Sensitive Health Categories
            </button>
            <button
              onClick={() => handleNav('intake')}
              className="text-left py-2 px-3 rounded-md hover:bg-[#EFECE3]"
            >
              Guided Symptom Intake
            </button>
            <button
              onClick={() => handleNav('doctors')}
              className="text-left py-2 px-3 rounded-md hover:bg-[#EFECE3]"
            >
              Find Verified Doctors
            </button>
            <button
              onClick={() => handleNav('privacy')}
              className="text-left py-2 px-3 rounded-md hover:bg-[#EFECE3]"
            >
              Privacy & Consent Centre
            </button>
            <button
              onClick={() => handleNav(userRole === 'doctor' ? 'doctor-dashboard' : 'patient-dashboard')}
              className="text-left py-2 px-3 rounded-md hover:bg-[#EFECE3]"
            >
              {userRole === 'doctor' ? 'Doctor Portal (Demo)' : `Patient Dashboard (${patientAlias})`}
            </button>
          </div>

          <div className="pt-3 border-t border-[#E6E4DD] flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs text-[#526862] pb-1">
              <span>View Mode:</span>
              <div className="flex gap-1">
                <button
                  onClick={() => setUserRole('patient')}
                  className={`px-2.5 py-1 rounded text-xs ${userRole === 'patient' ? 'bg-[#0E4D45] text-white' : 'bg-[#EFECE3]'}`}
                >
                  Patient
                </button>
                <button
                  onClick={() => {
                    setUserRole('doctor');
                    handleNav('doctor-dashboard');
                  }}
                  className={`px-2.5 py-1 rounded text-xs ${userRole === 'doctor' ? 'bg-[#0E4D45] text-white' : 'bg-[#EFECE3]'}`}
                >
                  Doctor
                </button>
              </div>
            </div>

            <button
              onClick={() => handleNav('intake')}
              className="w-full py-2.5 text-center text-xs font-semibold text-white bg-[#0E4D45] hover:bg-[#093933] rounded-lg"
            >
              Start Private Intake
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
