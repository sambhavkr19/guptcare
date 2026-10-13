import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';
import { VirtualConsultationModal } from './components/VirtualConsultationModal';

// Pages
import { LandingPage } from './pages/LandingPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { GuidedIntakePage } from './pages/GuidedIntakePage';
import { DoctorsDirectoryPage } from './pages/DoctorsDirectoryPage';
import { DoctorProfilePage } from './pages/DoctorProfilePage';
import { AppointmentBookingPage } from './pages/AppointmentBookingPage';
import { PatientDashboardPage } from './pages/PatientDashboardPage';
import { DoctorDashboardPage } from './pages/DoctorDashboardPage';
import { AuthPage } from './pages/AuthPage';
import { PrivacyCentrePage } from './pages/PrivacyCentrePage';

const AppContent: React.FC = () => {
  const { currentView } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] text-[#1E2E2B]">
      <Header />

      <main className="flex-1">
        {currentView === 'landing' && <LandingPage />}
        {currentView === 'categories' && <CategoriesPage />}
        {currentView === 'intake' && <GuidedIntakePage />}
        {currentView === 'doctors' && <DoctorsDirectoryPage />}
        {currentView === 'doctor-profile' && <DoctorProfilePage />}
        {currentView === 'booking' && <AppointmentBookingPage />}
        {currentView === 'patient-dashboard' && <PatientDashboardPage />}
        {currentView === 'doctor-dashboard' && <DoctorDashboardPage />}
        {currentView === 'auth' && <AuthPage />}
        {currentView === 'privacy' && <PrivacyCentrePage />}
      </main>

      <Footer />
      <Toast />
      <VirtualConsultationModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
