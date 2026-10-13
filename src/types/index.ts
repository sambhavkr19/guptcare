export type ConsultationMode = 'chat' | 'audio' | 'video';

export type UserRole = 'patient' | 'doctor';

export interface HealthCondition {
  id: string;
  name: string;
  category: string;
  categoryId: 'anorectal' | 'sexual-health' | 'urinary-genital' | 'womens-intimate' | 'genital-skin';
  commonSymptoms: string[];
  plainDescription: string;
  whenToSeekDoctor: string;
  redFlags: string[];
  relevantSpeciality: string;
}

export interface HealthCategory {
  id: 'anorectal' | 'sexual-health' | 'urinary-genital' | 'womens-intimate' | 'genital-skin';
  title: string;
  shortDescription: string;
  detailedDescription: string;
  conditionsCount: number;
  conditions: HealthCondition[];
  specialists: string;
}

export interface Doctor {
  id: string;
  name: string;
  avatar: string;
  gender: 'Female' | 'Male';
  speciality: string;
  qualifications: string;
  experienceYears: number;
  registrationNumber: string;
  medicalCouncil: string;
  languages: string[];
  modes: ConsultationMode[];
  fee: number;
  rating: number;
  totalConsultations: number;
  bio: string;
  focusAreas: string[];
  availableToday: boolean;
  nextSlotTime: string;
  availableDays: string[];
  timeSlots: string[];
}

export interface SymptomIntakeData {
  categoryId: string;
  conditionId?: string;
  primaryConcern: string;
  selectedSymptoms: string[];
  duration: string;
  severity: 'mild' | 'moderate' | 'severe' | 'disruptive';
  painScale: number; // 0 to 10
  priorTreatments: string;
  additionalNotes: string;
  patientAlias: string;
  preferredMode: ConsultationMode;
  redFlagWarningTriggered?: boolean;
}

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  doctorSpeciality: string;
  doctorAvatar: string;
  patientAlias: string;
  date: string;
  timeSlot: string;
  mode: ConsultationMode;
  fee: number;
  status: 'upcoming' | 'completed' | 'cancelled';
  symptomSummary: {
    category: string;
    concern: string;
    duration: string;
    severity: string;
    symptoms: string[];
  };
  clinicalSummary?: {
    diagnosisImpression: string;
    doctorAdvice: string;
    recommendedFollowUpDays: number;
    lifestyleModifications: string[];
    discreetPrescriptionCode: string;
  };
  meetingUrl?: string;
  createdAt: string;
}

export interface PrivacyPreferences {
  discreetNotifications: boolean; // Masks health terms in SMS/Email
  maskedBillingDescription: boolean; // Bills as "GC Health Care"
  anonymousDisplayAlias: string;
  dataRetentionMonths: number;
  allowDeidentifiedClinicalResearch: boolean;
}
