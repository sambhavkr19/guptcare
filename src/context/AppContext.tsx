import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Appointment, 
  ConsultationMode, 
  Doctor, 
  PrivacyPreferences, 
  SymptomIntakeData, 
  UserRole 
} from '../types';
import { INITIAL_APPOINTMENTS, MOCK_DOCTORS } from '../data/mockData';
import { 
  auth, 
  db, 
  googleProvider, 
  testConnection 
} from '../lib/firebase';
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { 
  collection, 
  query, 
  where, 
  onSnapshot 
} from 'firebase/firestore';
import { 
  getUserProfile, 
  createUserProfile, 
  updateUserAlias, 
  fetchDoctorProfiles, 
  bookAppointment as fsBookAppointment,
  cancelAppointment as fsCancelAppointment,
  createSymptomAssessment as fsCreateAssessment,
  submitDoctorVerificationRequest as fsSubmitVerification,
  purgePatientFirestoreData,
  UserProfileDoc,
  DoctorVerificationRequestDoc
} from '../services/firestoreService';

export type AppView =
  | 'landing'
  | 'categories'
  | 'intake'
  | 'doctors'
  | 'doctor-profile'
  | 'booking'
  | 'patient-dashboard'
  | 'doctor-dashboard'
  | 'auth'
  | 'privacy';

interface AppContextType {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  navigateTo: (view: AppView, params?: { doctorId?: string; categoryId?: string; conditionId?: string }) => void;
  
  // Selected items
  selectedDoctorId: string | null;
  setSelectedDoctorId: (id: string | null) => void;
  selectedCategoryId: string | null;
  setSelectedCategoryId: (id: string | null) => void;
  selectedConditionId: string | null;
  setSelectedConditionId: (id: string | null) => void;
  
  // Intake state
  intakeData: SymptomIntakeData;
  updateIntakeData: (partial: Partial<SymptomIntakeData>) => void;
  resetIntakeData: () => void;
  
  // Appointments
  appointments: Appointment[];
  doctors: Doctor[];
  addAppointment: (appointment: Appointment) => Promise<void>;
  cancelAppointment: (id: string) => Promise<void>;
  
  // Virtual Consultation Room
  activeConsultation: Appointment | null;
  openConsultationRoom: (appointment: Appointment) => void;
  closeConsultationRoom: () => void;
  
  // Real Firebase Auth
  currentUser: FirebaseUser | null;
  userProfile: UserProfileDoc | null;
  authLoading: boolean;
  signInGoogle: () => Promise<void>;
  signInEmail: (email: string, pass: string) => Promise<void>;
  registerEmail: (email: string, pass: string, role: 'patient' | 'doctor', alias: string) => Promise<void>;
  logOut: () => Promise<void>;
  
  // User & Role
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  patientAlias: string;
  setPatientAlias: (alias: string) => void;
  privacyPreferences: PrivacyPreferences;
  updatePrivacyPreferences: (prefs: Partial<PrivacyPreferences>) => void;
  
  // Doctor Verification
  submitVerificationRequest: (req: Omit<DoctorVerificationRequestDoc, 'id' | 'userId' | 'status' | 'submittedAt'>) => Promise<void>;
  
  // Account Data Purge
  purgeAccount: () => Promise<void>;
  
  // Notification Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;
  dismissToast: () => void;
}

const defaultIntake: SymptomIntakeData = {
  categoryId: 'anorectal',
  primaryConcern: '',
  selectedSymptoms: [],
  duration: '1 to 4 weeks',
  severity: 'moderate',
  painScale: 4,
  priorTreatments: '',
  additionalNotes: '',
  patientAlias: 'Patient Alex',
  preferredMode: 'chat',
  redFlagWarningTriggered: false
};

const defaultPrivacy: PrivacyPreferences = {
  discreetNotifications: true,
  maskedBillingDescription: true,
  anonymousDisplayAlias: 'Patient Alex',
  dataRetentionMonths: 12,
  allowDeidentifiedClinicalResearch: false
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>('doc-ananya-sharma');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedConditionId, setSelectedConditionId] = useState<string | null>(null);

  // Auth State
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfileDoc | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Doctors & Appointments
  const [doctors, setDoctors] = useState<Doctor[]>(MOCK_DOCTORS);
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);

  // Intake State
  const [intakeData, setIntakeData] = useState<SymptomIntakeData>(() => {
    try {
      const saved = localStorage.getItem('guptcare_intake');
      return saved ? JSON.parse(saved) : defaultIntake;
    } catch {
      return defaultIntake;
    }
  });

  const [activeConsultation, setActiveConsultation] = useState<Appointment | null>(null);
  const [userRole, setUserRole] = useState<UserRole>('patient');
  const [patientAlias, setPatientAlias] = useState<string>('Patient Alex');

  const [privacyPreferences, setPrivacyPreferences] = useState<PrivacyPreferences>(() => {
    try {
      const saved = localStorage.getItem('guptcare_privacy');
      return saved ? JSON.parse(saved) : defaultPrivacy;
    } catch {
      return defaultPrivacy;
    }
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 1. Initial connection test and doctor directory load
  useEffect(() => {
    testConnection();
    fetchDoctorProfiles().then(docs => {
      if (docs && docs.length > 0) setDoctors(docs);
    });
  }, []);

  // 2. Firebase Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // Fetch or create Firestore user profile
        try {
          const profile = await getUserProfile(user.uid);
          if (profile) {
            setUserProfile(profile);
            setUserRole(profile.role === 'doctor' ? 'doctor' : 'patient');
            if (profile.displayAlias) {
              setPatientAlias(profile.displayAlias);
            }
          } else {
            // New user registration
            const newProfile: UserProfileDoc = {
              uid: user.uid,
              email: user.email || '',
              displayName: user.displayName || 'Confidential Member',
              displayAlias: user.displayName ? `Patient ${user.displayName.split(' ')[0]}` : 'Patient Alex',
              role: 'patient',
              doctorVerificationStatus: 'unverified',
              createdAt: new Date().toISOString()
            };
            await createUserProfile(newProfile);
            setUserProfile(newProfile);
            setPatientAlias(newProfile.displayAlias);
          }
        } catch (err) {
          console.warn('Profile sync notice:', err);
        }
      } else {
        setUserProfile(null);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 3. Real-time Firestore Appointments Sync
  useEffect(() => {
    if (!currentUser) return;

    // Listen to patient appointments
    const q = query(
      collection(db, 'appointments'),
      where(userRole === 'doctor' ? 'doctorId' : 'patientId', '==', currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const loaded: Appointment[] = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            doctorId: data.doctorId,
            doctorName: data.doctorName,
            doctorSpeciality: data.doctorSpeciality,
            doctorAvatar: data.doctorAvatar || '',
            patientAlias: data.patientAlias,
            date: data.date,
            timeSlot: data.timeSlot,
            mode: data.mode,
            fee: data.fee,
            status: data.status,
            symptomSummary: {
              category: data.category || 'Sensitive Health',
              concern: data.symptomSummaryBrief || 'Consultation request',
              duration: 'As reported',
              severity: 'Moderate',
              symptoms: []
            },
            createdAt: data.createdAt
          };
        });
        setAppointments(loaded);
      }
    }, (error) => {
      console.warn('Firestore snapshot listener notice (fallback to local state):', error);
    });

    return () => unsubscribe();
  }, [currentUser, userRole]);

  // Sync to LocalStorage for offline resilience
  useEffect(() => {
    try {
      localStorage.setItem('guptcare_intake', JSON.stringify(intakeData));
    } catch {}
  }, [intakeData]);

  useEffect(() => {
    try {
      localStorage.setItem('guptcare_privacy', JSON.stringify(privacyPreferences));
    } catch {}
  }, [privacyPreferences]);

  const updateIntakeData = (partial: Partial<SymptomIntakeData>) => {
    setIntakeData(prev => ({ ...prev, ...partial }));
  };

  const resetIntakeData = () => {
    setIntakeData(defaultIntake);
  };

  // Real Appointment Booking
  const addAppointment = async (newApt: Appointment) => {
    // 1. Optimistic update
    setAppointments(prev => [newApt, ...prev]);

    // 2. Persist to Firestore if authenticated
    if (currentUser) {
      try {
        // Save symptom assessment first if present
        let assessmentId = '';
        if (intakeData.primaryConcern) {
          assessmentId = await fsCreateAssessment({
            patientId: currentUser.uid,
            patientAlias: newApt.patientAlias,
            categoryId: intakeData.categoryId,
            conditionId: intakeData.conditionId,
            primaryConcern: intakeData.primaryConcern,
            selectedSymptoms: intakeData.selectedSymptoms,
            duration: intakeData.duration,
            severity: intakeData.severity,
            painScale: intakeData.painScale,
            priorTreatments: intakeData.priorTreatments,
            preferredMode: newApt.mode,
            redFlagWarningTriggered: !!intakeData.redFlagWarningTriggered,
            redFlagAcknowledged: true,
            patientConsentGiven: true,
            assignedDoctorId: newApt.doctorId,
            createdAt: new Date().toISOString()
          });
        }

        await fsBookAppointment({
          id: newApt.id,
          doctorId: newApt.doctorId,
          doctorName: newApt.doctorName,
          doctorSpeciality: newApt.doctorSpeciality,
          doctorAvatar: newApt.doctorAvatar,
          patientId: currentUser.uid,
          patientAlias: newApt.patientAlias,
          date: newApt.date,
          timeSlot: newApt.timeSlot,
          slotKey: `${newApt.date}_${newApt.timeSlot}`,
          mode: newApt.mode,
          fee: newApt.fee,
          status: 'confirmed',
          paymentStatus: 'simulated_success',
          paymentMethod: 'upi_simulated',
          symptomAssessmentId: assessmentId,
          symptomSummaryBrief: newApt.symptomSummary.concern,
          category: newApt.symptomSummary.category
        });
      } catch (err) {
        console.error('Error saving appointment to Firestore:', err);
      }
    }

    showToast(`Appointment confirmed with ${newApt.doctorName}. Added to your private dashboard.`);
  };

  // Real Appointment Cancellation
  const cancelAppointment = async (id: string) => {
    setAppointments(prev =>
      prev.map(a => (a.id === id ? { ...a, status: 'cancelled' as const } : a))
    );

    if (currentUser) {
      try {
        await fsCancelAppointment(id);
      } catch (err) {
        console.error('Error cancelling appointment in Firestore:', err);
      }
    }
    showToast('Appointment cancelled discreetly. No fee charged.');
  };

  const openConsultationRoom = (apt: Appointment) => {
    setActiveConsultation(apt);
  };

  const closeConsultationRoom = () => {
    setActiveConsultation(null);
  };

  const updatePrivacyPreferences = (prefs: Partial<PrivacyPreferences>) => {
    setPrivacyPreferences(prev => ({ ...prev, ...prefs }));
    showToast('Privacy preferences updated successfully.');
  };

  // Auth Operations
  const signInGoogle = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      showToast(`Welcome back, ${res.user.displayName || 'Member'}`);
    } catch (err) {
      console.error('Google Sign-In error:', err);
      showToast('Could not complete Google Sign-In.');
    }
  };

  const signInEmail = async (email: string, pass: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      showToast('Signed in successfully.');
    } catch (err: any) {
      // If Email Auth is not enabled in Firebase Console, explain clearly
      if (err?.code === 'auth/operation-not-allowed') {
        showToast('Email/Password provider is disabled in Firebase Console. Please use Google Sign-In or enable Email provider.');
      } else {
        showToast(err.message || 'Sign in failed. Check credentials.');
      }
      throw err;
    }
  };

  const registerEmail = async (email: string, pass: string, role: 'patient' | 'doctor', alias: string) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      const newProfile: UserProfileDoc = {
        uid: cred.user.uid,
        email: email,
        displayName: alias,
        displayAlias: alias,
        role: role,
        doctorVerificationStatus: role === 'doctor' ? 'pending' : 'unverified',
        createdAt: new Date().toISOString()
      };
      await createUserProfile(newProfile);
      setUserProfile(newProfile);
      setUserRole(role);
      setPatientAlias(alias);
      showToast(`Account created as ${role === 'doctor' ? 'Practitioner (Pending Verification)' : alias}`);
    } catch (err: any) {
      if (err?.code === 'auth/operation-not-allowed') {
        showToast('Email/Password provider is disabled in Firebase Console. Please use Google Sign-In or enable Email provider.');
      } else {
        showToast(err.message || 'Registration failed.');
      }
      throw err;
    }
  };

  const logOut = async () => {
    await signOut(auth);
    setUserProfile(null);
    showToast('Signed out of GuptCare safely.');
  };

  const submitVerificationRequest = async (req: Omit<DoctorVerificationRequestDoc, 'id' | 'userId' | 'status' | 'submittedAt'>) => {
    if (!currentUser) throw new Error('Must be logged in to submit verification.');
    await fsSubmitVerification({
      ...req,
      userId: currentUser.uid,
      status: 'pending',
      submittedAt: new Date().toISOString()
    });
    showToast('Verification application submitted for administrative review.');
  };

  const purgeAccount = async () => {
    if (currentUser) {
      await purgePatientFirestoreData(currentUser.uid);
    }
    try {
      localStorage.removeItem('guptcare_intake');
      localStorage.removeItem('guptcare_appointments');
      localStorage.removeItem('guptcare_privacy');
    } catch {}
    setAppointments([]);
    showToast('Account records and sensitive history purged from Cloud Firestore.');
    await signOut(auth);
    navigateTo('landing');
  };

  const navigateTo = (view: AppView, params?: { doctorId?: string; categoryId?: string; conditionId?: string }) => {
    if (params?.doctorId) setSelectedDoctorId(params.doctorId);
    if (params?.categoryId) setSelectedCategoryId(params.categoryId);
    if (params?.conditionId) setSelectedConditionId(params.conditionId);
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const dismissToast = () => setToastMessage(null);

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        navigateTo,
        selectedDoctorId,
        setSelectedDoctorId,
        selectedCategoryId,
        setSelectedCategoryId,
        selectedConditionId,
        setSelectedConditionId,
        intakeData,
        updateIntakeData,
        resetIntakeData,
        appointments,
        doctors,
        addAppointment,
        cancelAppointment,
        activeConsultation,
        openConsultationRoom,
        closeConsultationRoom,
        currentUser,
        userProfile,
        authLoading,
        signInGoogle,
        signInEmail,
        registerEmail,
        logOut,
        userRole,
        setUserRole,
        patientAlias,
        setPatientAlias,
        privacyPreferences,
        updatePrivacyPreferences,
        submitVerificationRequest,
        purgeAccount,
        toastMessage,
        showToast,
        dismissToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
