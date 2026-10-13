import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  getDocs, 
  addDoc,
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { Appointment, Doctor, ConsultationMode, UserRole } from '../types';
import { MOCK_DOCTORS } from '../data/mockData';

export interface UserProfileDoc {
  uid: string;
  email: string;
  displayName: string;
  displayAlias: string;
  role: 'patient' | 'doctor' | 'admin';
  doctorVerificationStatus: 'unverified' | 'pending' | 'verified' | 'rejected';
  createdAt: string;
  updatedAt?: string;
}

export interface DoctorVerificationRequestDoc {
  id?: string;
  userId: string;
  doctorName: string;
  medicalCouncil: string;
  registrationNumber: string;
  qualifications: string;
  speciality: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewNotes?: string;
}

export interface SymptomAssessmentDoc {
  id?: string;
  patientId: string;
  patientAlias: string;
  categoryId: string;
  conditionId?: string;
  primaryConcern: string;
  selectedSymptoms: string[];
  duration: string;
  severity: string;
  painScale: number;
  priorTreatments: string;
  preferredMode: ConsultationMode;
  redFlagWarningTriggered: boolean;
  redFlagAcknowledged: boolean;
  patientConsentGiven: boolean;
  assignedDoctorId?: string;
  createdAt: string;
}

export interface AppointmentDoc {
  id: string;
  doctorId: string;
  doctorName: string;
  doctorSpeciality: string;
  doctorAvatar: string;
  patientId: string;
  patientAlias: string;
  date: string;
  timeSlot: string;
  slotKey: string;
  mode: ConsultationMode;
  fee: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  paymentStatus: 'simulated_success' | 'pending' | 'failed';
  paymentMethod: 'upi_simulated' | 'card_simulated';
  symptomAssessmentId?: string;
  symptomSummaryBrief: string;
  category: string;
  createdAt: string;
}

export interface ConsultationSummaryDoc {
  id?: string;
  appointmentId: string;
  doctorId: string;
  patientId: string;
  patientAlias: string;
  diagnosisImpression: string;
  doctorAdvice: string;
  recommendedFollowUpDays: number;
  lifestyleModifications: string[];
  discreetPrescriptionCode: string;
  createdAt: string;
}

export interface ConsentRecordDoc {
  id?: string;
  patientId: string;
  doctorId: string;
  appointmentId?: string;
  assessmentId?: string;
  scope: string;
  consentedAt: string;
}

export interface AccessAuditLogDoc {
  id?: string;
  actorId: string;
  actorRole: string;
  targetPath: string;
  action: string;
  timestamp: string;
}

// 1. User Profile Management
export async function getUserProfile(uid: string): Promise<UserProfileDoc | null> {
  const path = `users/${uid}`;
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    if (snap.exists()) {
      return snap.data() as UserProfileDoc;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return null;
  }
}

export async function createUserProfile(profile: UserProfileDoc): Promise<void> {
  const path = `users/${profile.uid}`;
  try {
    await setDoc(doc(db, 'users', profile.uid), {
      ...profile,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function updateUserAlias(uid: string, newAlias: string): Promise<void> {
  const path = `users/${uid}`;
  try {
    await updateDoc(doc(db, 'users', uid), {
      displayAlias: newAlias,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function updateUserProfileName(uid: string, newName: string, newAlias: string): Promise<void> {
  const path = `users/${uid}`;
  try {
    await updateDoc(doc(db, 'users', uid), {
      displayName: newName,
      displayAlias: newAlias,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

// 2. Doctor Profiles (Directory)
export async function fetchDoctorProfiles(): Promise<Doctor[]> {
  const path = 'doctorProfiles';
  try {
    const snap = await getDocs(collection(db, 'doctorProfiles'));
    if (!snap.empty) {
      return snap.docs.map(d => ({ ...d.data(), id: d.id } as Doctor));
    }
    // If Firestore collection is empty, seed verified demo doctors
    return await seedDoctorProfilesIfEmpty();
  } catch (error) {
    console.warn('Could not read doctorProfiles from Firestore, falling back to verified seed catalog:', error);
    return MOCK_DOCTORS;
  }
}

export async function seedDoctorProfilesIfEmpty(): Promise<Doctor[]> {
  const path = 'doctorProfiles';
  try {
    for (const docData of MOCK_DOCTORS) {
      await setDoc(doc(db, 'doctorProfiles', docData.id), {
        ...docData,
        userId: `verified-clinician-${docData.id}`,
        isVerified: true,
        createdAt: new Date().toISOString()
      }, { merge: true });
    }
    return MOCK_DOCTORS;
  } catch (err) {
    console.warn('Doctor seeding notice:', err);
    return MOCK_DOCTORS;
  }
}

// 3. Doctor Verification Request (Formal onboarding)
export async function submitDoctorVerificationRequest(req: Omit<DoctorVerificationRequestDoc, 'id'>): Promise<string> {
  const path = 'doctorVerificationRequests';
  try {
    const docRef = await addDoc(collection(db, 'doctorVerificationRequests'), {
      ...req,
      status: 'pending',
      submittedAt: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    throw error;
  }
}

// 4. Symptom Assessment
export async function createSymptomAssessment(assessment: Omit<SymptomAssessmentDoc, 'id'>): Promise<string> {
  const path = 'symptomAssessments';
  try {
    const docRef = await addDoc(collection(db, 'symptomAssessments'), {
      ...assessment,
      createdAt: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    throw error;
  }
}

export async function getSymptomAssessment(assessmentId: string): Promise<SymptomAssessmentDoc | null> {
  const path = `symptomAssessments/${assessmentId}`;
  try {
    const snap = await getDoc(doc(db, 'symptomAssessments', assessmentId));
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() } as SymptomAssessmentDoc;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return null;
  }
}

// 5. Appointments & Double-Booking Prevention
export async function bookAppointment(data: Omit<AppointmentDoc, 'createdAt'>): Promise<void> {
  const path = `appointments/${data.id}`;
  try {
    // Check if slot is already booked for this doctor
    const slotQuery = query(
      collection(db, 'appointments'),
      where('doctorId', '==', data.doctorId),
      where('slotKey', '==', data.slotKey),
      where('status', 'in', ['pending', 'confirmed'])
    );
    const existing = await getDocs(slotQuery);
    if (!existing.empty) {
      throw new Error(`The selected slot (${data.timeSlot} on ${data.date}) was just reserved by another patient. Please choose an adjacent slot.`);
    }

    // Save appointment
    await setDoc(doc(db, 'appointments', data.id), {
      ...data,
      createdAt: new Date().toISOString()
    });

    // Record explicit consent
    await logConsentRecord({
      patientId: data.patientId,
      doctorId: data.doctorId,
      appointmentId: data.id,
      assessmentId: data.symptomAssessmentId,
      scope: 'Patient consented to share confidential symptom brief for intimate health evaluation',
      consentedAt: new Date().toISOString()
    });

    // Audit log
    await logAccessAudit({
      actorId: data.patientId,
      actorRole: 'patient',
      targetPath: `appointments/${data.id}`,
      action: 'create_appointment',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function cancelAppointment(appointmentId: string): Promise<void> {
  const path = `appointments/${appointmentId}`;
  try {
    await updateDoc(doc(db, 'appointments', appointmentId), {
      status: 'cancelled'
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function updateAppointmentStatusByDoctor(appointmentId: string, status: 'confirmed' | 'completed' | 'cancelled'): Promise<void> {
  const path = `appointments/${appointmentId}`;
  try {
    await updateDoc(doc(db, 'appointments', appointmentId), {
      status
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

// 6. Consultation Summaries (Doctor clinical impression & e-prescription)
export async function createConsultationSummary(summary: Omit<ConsultationSummaryDoc, 'id'>): Promise<string> {
  const path = 'consultationSummaries';
  try {
    const docRef = await addDoc(collection(db, 'consultationSummaries'), {
      ...summary,
      createdAt: new Date().toISOString()
    });

    // Mark appointment as completed
    await updateAppointmentStatusByDoctor(summary.appointmentId, 'completed');
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    throw error;
  }
}

export async function getConsultationSummaries(patientId: string): Promise<ConsultationSummaryDoc[]> {
  const path = 'consultationSummaries';
  try {
    const q = query(
      collection(db, 'consultationSummaries'),
      where('patientId', '==', patientId)
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as ConsultationSummaryDoc));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

// 7. Consent Records & Auditing
export async function logConsentRecord(consent: ConsentRecordDoc): Promise<void> {
  const path = 'consentRecords';
  try {
    await addDoc(collection(db, 'consentRecords'), consent);
  } catch (error) {
    console.warn('Consent recording error:', error);
  }
}

export async function logAccessAudit(audit: AccessAuditLogDoc): Promise<void> {
  const path = 'accessAuditLogs';
  try {
    await addDoc(collection(db, 'accessAuditLogs'), audit);
  } catch (error) {
    console.warn('Audit logging error:', error);
  }
}

// 8. Account Deletion & Data Purge
export async function purgePatientFirestoreData(patientId: string): Promise<void> {
  try {
    // 1. Delete user profile
    await deleteDoc(doc(db, 'users', patientId));

    // 2. Cancel and delete patient appointments
    const aptSnap = await getDocs(query(collection(db, 'appointments'), where('patientId', '==', patientId)));
    for (const d of aptSnap.docs) {
      await deleteDoc(d.ref);
    }

    // 3. Delete symptom assessments
    const intakeSnap = await getDocs(query(collection(db, 'symptomAssessments'), where('patientId', '==', patientId)));
    for (const d of intakeSnap.docs) {
      await deleteDoc(d.ref);
    }
  } catch (error) {
    console.warn('Purge notice:', error);
  }
}
