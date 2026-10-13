import { Doctor, HealthCategory, Appointment } from '../types';

export const HEALTH_CATEGORIES: HealthCategory[] = [
  {
    id: 'anorectal',
    title: 'Anorectal & Perianal Health',
    shortDescription: 'Piles, haemorrhoids, anal fissures, perianal abscess, and chronic itching.',
    detailedDescription: 'Discreet medical evaluations for anorectal conditions. Avoid painful delays caused by embarrassment; early clinical grading avoids surgical intervention in over 85% of cases.',
    conditionsCount: 6,
    specialists: 'Colorectal Surgeons, Proctologists, Senior General Surgeons',
    conditions: [
      {
        id: 'piles-haemorrhoids',
        categoryId: 'anorectal',
        category: 'Anorectal Health',
        name: 'Haemorrhoids (Piles)',
        commonSymptoms: ['Painless bleeding during bowel movements', 'Prolapsed swelling/lump', 'Itching or irritation around the anus'],
        plainDescription: 'Swollen blood vessels in the lower rectum and anus. Often graded Grade I to IV, responding well to early conservative management and dietary adjustments.',
        whenToSeekDoctor: 'Persistent bleeding, severe pain, or a lump that does not retract.',
        redFlags: ['Copious dark clotted blood', 'Dizziness or lightheadedness', 'Fever with severe throbbing perianal swelling'],
        relevantSpeciality: 'Proctology & Colorectal Surgery'
      },
      {
        id: 'anal-fissure',
        categoryId: 'anorectal',
        category: 'Anorectal Health',
        name: 'Anal Fissure (Tears)',
        commonSymptoms: ['Sharp, glass-like pain during and after stools', 'Bright red blood on toilet paper', 'Visible crack in perianal skin'],
        plainDescription: 'A small cut or tear in the delicate mucosal lining of the anal canal. Acute spasms make bowel movements intensely painful.',
        whenToSeekDoctor: 'Pain lasting hours after a bowel movement or symptoms lasting over 10 days.',
        redFlags: ['Inability to pass bowel movement due to extreme pain', 'High fever', 'Spreading swelling'],
        relevantSpeciality: 'Proctology & General Surgery'
      },
      {
        id: 'anal-pruritus',
        categoryId: 'anorectal',
        category: 'Anorectal Health',
        name: 'Pruritus Ani (Rectal Itching)',
        commonSymptoms: ['Intense persistent itching around anus', 'Burning sensation aggravated at night', 'Skin thickening or redness'],
        plainDescription: 'Irritation and persistent itch around the anal orifice, often triggered by moisture, dermatitis, fungal overgrowth, or underlying fissures.',
        whenToSeekDoctor: 'Itching persisting over 2 weeks or skin becoming cracked and weeping.',
        redFlags: ['Discharge with foul odor', 'Systemic rash', 'Severe painful ulcerations'],
        relevantSpeciality: 'Dermatology & Proctology'
      },
      {
        id: 'anal-fistula',
        categoryId: 'anorectal',
        category: 'Anorectal Health',
        name: 'Anal Fistula & Perianal Drainage',
        commonSymptoms: ['Persistent or recurrent pus/blood discharge', 'Discomfort while sitting', 'Skin irritation'],
        plainDescription: 'An abnormal narrow tunnel connecting an infected gland inside the anus to an opening on the skin around the perianal area.',
        whenToSeekDoctor: 'Any intermittent fluid discharge, recurrent boils, or pain on sitting.',
        redFlags: ['Spreading perianal redness and cellulitis', 'High fever with chills', 'Incontinence'],
        relevantSpeciality: 'Colorectal Surgery'
      }
    ]
  },
  {
    id: 'sexual-health',
    title: 'Sexual Health & Intimate Function',
    shortDescription: 'Erectile dysfunction, premature ejaculation, low libido, and performance anxiety.',
    detailedDescription: 'Confidential, evidence-based consultations with certified andrologists, urologists, and sexual health consultants. Clear separation of physiological and psychological factors.',
    conditionsCount: 5,
    specialists: 'Andrologists, Urologists, Sexual Medicine Clinicians',
    conditions: [
      {
        id: 'erectile-dysfunction',
        categoryId: 'sexual-health',
        category: 'Sexual Health',
        name: 'Erectile Dysfunction (ED)',
        commonSymptoms: ['Difficulty achieving or maintaining rigidity', 'Reduced morning tumescence', 'Performance-related anticipatory distress'],
        plainDescription: 'Inability to achieve or sustain an erection firm enough for satisfactory sexual intercourse. Can indicate cardiovascular, metabolic, hormonal, or psychological factors.',
        whenToSeekDoctor: 'When the issue persists for more than 1–2 months or causes relationship strain.',
        redFlags: ['Sudden loss of sensation in genital or saddle area', 'Associated chest tightness during exertion'],
        relevantSpeciality: 'Andrology & Urology'
      },
      {
        id: 'premature-ejaculation',
        categoryId: 'sexual-health',
        category: 'Sexual Health',
        name: 'Premature Ejaculation (PE)',
        commonSymptoms: ['Ejaculating within 1–2 minutes of penetration', 'Inability to delay ejaculation', 'Frustration or avoidance of intimacy'],
        plainDescription: 'Persistent or recurrent ejaculation with minimal sexual stimulation before the person wishes it. Highly treatable via behavioral and pharmacological guidance.',
        whenToSeekDoctor: 'If causing personal distress, avoidance of intimacy, or partner friction.',
        redFlags: ['Severe penile pain during or after climax', 'Blood in semen (hematospermia)'],
        relevantSpeciality: 'Sexual Health Medicine'
      },
      {
        id: 'sti-concerns',
        categoryId: 'sexual-health',
        category: 'Sexual Health',
        name: 'STI Concerns & Post-Exposure Guidance',
        commonSymptoms: ['Anxiety after unprotected encounter', 'Discharge from urethra or vagina', 'Unusual sores, bumps, or burning'],
        plainDescription: 'Private assessment following possible exposure to sexually transmitted infections. Includes window period calculation, discreet diagnostic guidance, and empirical treatment.',
        whenToSeekDoctor: 'Promptly following suspected exposure or symptom onset.',
        redFlags: ['Severe pelvic pain', 'High fever with joint aches', 'Spreading skin ulcerations'],
        relevantSpeciality: 'Infectious Diseases & Sexual Health'
      },
      {
        id: 'hypoactive-libido',
        categoryId: 'sexual-health',
        category: 'Sexual Health',
        name: 'Low Sexual Desire (Hypoactive Desire)',
        commonSymptoms: ['Absence of sexual fantasies or desire', 'Emotional detachment from intimacy', 'Fatigue and mood changes'],
        plainDescription: 'Persistent lack of interest in sex causing personal distress, often linked to endocrine shifts (testosterone, thyroid, prolactin), medications, or stress.',
        whenToSeekDoctor: 'When lack of desire is persistent and distressing.',
        redFlags: ['Unexplained rapid weight gain/loss', 'Extreme lethargy', 'Visual field disturbances'],
        relevantSpeciality: 'Endocrinology & Sexual Medicine'
      }
    ]
  },
  {
    id: 'urinary-genital',
    title: 'Genital & Urinary Health',
    shortDescription: 'Burning urination, recurrent UTIs, phimosis, balanitis, and testicular discomfort.',
    detailedDescription: 'Expert evaluation of the lower urinary tract and external genitalia. Private diagnosis of discomfort without awkward clinical waits.',
    conditionsCount: 5,
    specialists: 'Urologists, Andrologists, Primary Care Clinicians',
    conditions: [
      {
        id: 'dysuria-uti',
        categoryId: 'urinary-genital',
        category: 'Genital & Urinary Health',
        name: 'Dysuria (Burning Urination) & UTIs',
        commonSymptoms: ['Stinging or burning while passing urine', 'Frequent urge with tiny output', 'Cloudy or pungent urine'],
        plainDescription: 'Discomfort, burning, or pain during urination, most commonly caused by bacterial infection in the bladder or urethra.',
        whenToSeekDoctor: 'Symptoms lasting over 24 hours or recurring frequently.',
        redFlags: ['Flank/back pain with chills (kidney involvement)', 'High fever above 101°F', 'Visible blood clots in urine'],
        relevantSpeciality: 'Urology'
      },
      {
        id: 'balanitis-phimosis',
        categoryId: 'urinary-genital',
        category: 'Genital & Urinary Health',
        name: 'Balanitis & Tight Foreskin (Phimosis)',
        commonSymptoms: ['Redness and swelling of the glans (penis head)', 'Painful foreskin retraction', 'Smegma buildup or itching'],
        plainDescription: 'Inflammation of the glans penis, often fungal or bacterial, frequently complicated by difficulty retracting foreskin in uncircumcised males.',
        whenToSeekDoctor: 'Inability to clean beneath the foreskin, cracking, or recurrent soreness.',
        redFlags: ['Paraphimosis (foreskin stuck behind the glans with swelling/blueness - medical emergency)'],
        relevantSpeciality: 'Urology & Dermatology'
      },
      {
        id: 'testicular-discomfort',
        categoryId: 'urinary-genital',
        category: 'Genital & Urinary Health',
        name: 'Testicular Heaviness & Dull Ache',
        commonSymptoms: ['Dull dragging ache in scrotum', 'Mild swelling or palpable fullness (varicocele/hydrocele)', 'Discomfort after standing'],
        plainDescription: 'Chronic or recurring dull discomfort in the scrotal sac, often related to dilated veins (varicocele), fluid collection, or mild epididymitis.',
        whenToSeekDoctor: 'Any scrotal lump, persistent dragging sensation, or size difference.',
        redFlags: ['Sudden, severe, acute one-sided scrotal pain with nausea (possible testicular torsion - MUST GO TO ER IMMEDIATELY)'],
        relevantSpeciality: 'Urology'
      }
    ]
  },
  {
    id: 'womens-intimate',
    title: "Women's Intimate & Reproductive Health",
    shortDescription: 'Vaginal infections, painful intercourse, vulvodynia, menstrual agony, and pelvic discomfort.',
    detailedDescription: 'Judgement-free consultations with empathetic female gynecologists and reproductive medicine doctors. Discuss intimate symptoms with absolute privacy.',
    conditionsCount: 6,
    specialists: 'Gynecologists, Obstetricians, Intimate Health Specialists',
    conditions: [
      {
        id: 'vaginal-infections',
        categoryId: 'womens-intimate',
        category: "Women's Intimate Health",
        name: 'Recurrent Vaginitis & Yeast / BV',
        commonSymptoms: ['Curdy white or watery greyish discharge', 'Fishy or abnormal odor', 'Intense vulvar itch or burning'],
        plainDescription: 'Disruption of the vaginal microbiome leading to overgrowth of Candida yeast or Gardnerella bacteria. Simple, targeted therapies restore normal vaginal flora.',
        whenToSeekDoctor: 'Recurrent episodes (3+ per year), over-the-counter treatment failure, or pregnancy.',
        redFlags: ['Fever with foul discharge', 'Severe lower abdominal tenderness', 'Abnormal bleeding between periods'],
        relevantSpeciality: 'Gynecology'
      },
      {
        id: 'dyspareunia-vulvodynia',
        categoryId: 'womens-intimate',
        category: "Women's Intimate Health",
        name: 'Painful Intercourse (Dyspareunia) & Vulvodynia',
        commonSymptoms: ['Sharp burning pain at vaginal entry', 'Deep pelvic aching during or post-intercourse', 'Involuntary muscle tightening (vaginismus)'],
        plainDescription: 'Persistent pain localized to the vulva or deep pelvis during intimacy. Often overlooked in conventional clinics due to shame, yet highly manageable with specialized guidance.',
        whenToSeekDoctor: 'Pain interfering with intimate life or physical examinations.',
        redFlags: ['Sudden acute severe pelvic cramping', 'Dizziness or syncope', 'Heavy bleeding'],
        relevantSpeciality: 'Gynecology & Pelvic Medicine'
      },
      {
        id: 'pcos-intimate-symptoms',
        categoryId: 'womens-intimate',
        category: "Women's Intimate Health",
        name: 'PCOS Intimate Symptoms & Cycle Irregularity',
        commonSymptoms: ['Missed or prolonged periods', 'Acne and androgenic facial hair', 'Hormonal mood shifts and vaginal dryness'],
        plainDescription: 'Polycystic Ovary Syndrome impacting cycle predictability, fertility, intimate comfort, and hormonal equilibrium.',
        whenToSeekDoctor: 'Irregular cycles exceeding 35 days or symptoms impacting quality of life.',
        redFlags: ['Heavy continuous bleeding soaking a pad an hour for multiple hours'],
        relevantSpeciality: 'Gynecological Endocrinology'
      }
    ]
  },
  {
    id: 'genital-skin',
    title: 'Genital-Area Skin & Dermatological Conditions',
    shortDescription: 'Genital bumps, Lichen Sclerosus, intimate area eczema, folliculitis, and fungal rashes.',
    detailedDescription: 'Specialized dermatological evaluation of intimate anatomy. Distinguish benign friction lesions and eczema from infectious conditions in complete privacy.',
    conditionsCount: 5,
    specialists: 'Dermato-Venereologists, Clinical Dermatologists',
    conditions: [
      {
        id: 'genital-rashes-eczema',
        categoryId: 'genital-skin',
        category: 'Genital Dermatology',
        name: 'Intimate Area Eczema & Jock Itch (Tinea Cruris)',
        commonSymptoms: ['Red, well-demarcated scaly rash in groin folds', 'Severe itching exacerbated by heat/sweat', 'Skin peeling or chafing'],
        plainDescription: 'Fungal infection or contact dermatitis affecting the warm, moist groin creases. Misuse of steroid creams can worsen fungal rashes.',
        whenToSeekDoctor: 'Rash expanding, peeling, or failing to clear with basic hygiene.',
        redFlags: ['Open oozing blisters with fever', 'Severe pain and warmth spreading rapidly'],
        relevantSpeciality: 'Dermatology'
      },
      {
        id: 'genital-bumps-warts',
        categoryId: 'genital-skin',
        category: 'Genital Dermatology',
        name: 'Genital Bumps, Warts & Molluscum',
        commonSymptoms: ['Small cauliflower-like flesh-toned bumps', 'Dome-shaped shiny papules with central dimple', 'Painless bumps on shaft or labia'],
        plainDescription: 'Benign viral manifestations (such as HPV-related warts or Molluscum Contagiosum). Prompt clinical differentiation avoids self-inflicted chemical burns.',
        whenToSeekDoctor: 'Any new unidentified growth, bump, or lesion in intimate zones.',
        redFlags: ['Rapidly ulcerating or bleeding growths', 'Firm painless fixed indurated ulcers (possible chancre)'],
        relevantSpeciality: 'Dermato-Venereology'
      },
      {
        id: 'lichen-sclerosus',
        categoryId: 'genital-skin',
        category: 'Genital Dermatology',
        name: 'Lichen Sclerosus & White Patches',
        commonSymptoms: ['Porcelain-white patches of thinned skin', 'Itching and easy bruising or tearing', 'Shrinking or anatomical tightening of labia/foreskin'],
        plainDescription: 'A chronic inflammatory skin condition primarily affecting the anogenital region. Early prescription treatment prevents irreversible scarring.',
        whenToSeekDoctor: 'Persistent white discoloration, architectural changes, or severe chronic itch.',
        redFlags: ['Non-healing ulcers in long-standing white plaques (requires biopsy)'],
        relevantSpeciality: 'Specialized Dermatology & Gynecology'
      }
    ]
  }
];

export const MOCK_DOCTORS: Doctor[] = [
  {
    id: 'doc-ananya-sharma',
    name: 'Dr. Ananya Sharma',
    avatar: '/src/assets/images/doctor_ananya_sharma_1791871949945.jpg',
    gender: 'Female',
    speciality: 'Proctologist & Senior Colorectal Surgeon',
    qualifications: 'MBBS, MS (General Surgery), Fellowship in Minimal Access Coloproctology (FMAS)',
    experienceYears: 14,
    registrationNumber: 'MCI-DEL-2010-44918',
    medicalCouncil: 'Delhi Medical Council',
    languages: ['English', 'Hindi', 'Punjabi'],
    modes: ['chat', 'audio', 'video'],
    fee: 650,
    rating: 4.95,
    totalConsultations: 3820,
    bio: 'Dr. Ananya Sharma has dedicated 14 years to helping patients with complex anorectal disorders. Known for her gentle, non-judgmental bedside manner, she specializes in laser proctology for piles, fissure pain management without surgery, and chronic rectal itching.',
    focusAreas: ['Piles & Haemorrhoids Grading', 'Anal Fissures', 'Chronic Rectal Itching', 'Conservative Non-Surgical Healing'],
    availableToday: true,
    nextSlotTime: 'Today, 4:30 PM',
    availableDays: ['Today', 'Tomorrow', 'Wednesday', 'Thursday'],
    timeSlots: ['11:00 AM', '02:30 PM', '04:30 PM', '06:00 PM', '08:15 PM']
  },
  {
    id: 'doc-vikram-mehta',
    name: 'Dr. Vikram Mehta',
    avatar: '/src/assets/images/doctor_vikram_mehta_1791871950320.jpg',
    gender: 'Male',
    speciality: 'Senior Urologist, Andrologist & Sexual Health Consultant',
    qualifications: 'MBBS, MS (Surgery), MCh (Urology), Fellowship in Andrology (ESAU)',
    experienceYears: 18,
    registrationNumber: 'MMC-MUM-2006-11842',
    medicalCouncil: 'Maharashtra Medical Council',
    languages: ['English', 'Hindi', 'Marathi', 'Gujarati'],
    modes: ['chat', 'audio', 'video'],
    fee: 750,
    rating: 4.98,
    totalConsultations: 5120,
    bio: 'Dr. Vikram Mehta is a board-certified urologist and andrologist with 18 years of clinical leadership. He is deeply committed to breaking the stigma around male sexual health, erectile dysfunction, urinary tract infections, and foreskin concerns.',
    focusAreas: ['Erectile Dysfunction', 'Premature Ejaculation', 'Balanitis & Phimosis', 'Testicular Discomfort', 'Male Infertility Workup'],
    availableToday: true,
    nextSlotTime: 'Today, 5:15 PM',
    availableDays: ['Today', 'Tomorrow', 'Friday', 'Saturday'],
    timeSlots: ['10:15 AM', '01:00 PM', '03:45 PM', '05:15 PM', '07:30 PM']
  },
  {
    id: 'doc-priya-nair',
    name: 'Dr. Priya Nair',
    avatar: '/src/assets/images/doctor_priya_nair_1791871949647.jpg',
    gender: 'Female',
    speciality: 'Consultant Obstetrician & Gynecologist, Sexual Medicine',
    qualifications: 'MBBS, DGO, DNB (Obstetrics & Gynecology), Fellowship in Cosmetic & Functional Gynecology',
    experienceYears: 12,
    registrationNumber: 'KMC-BLR-2012-78201',
    medicalCouncil: 'Karnataka Medical Council',
    languages: ['English', 'Hindi', 'Malayalam', 'Kannada'],
    modes: ['chat', 'audio', 'video'],
    fee: 600,
    rating: 4.96,
    totalConsultations: 2940,
    bio: 'Dr. Priya Nair provides a safe, highly private haven for women experiencing intimate discomfort, recurrent vaginal infections, painful intercourse (dyspareunia), and PCOS-related concerns. She emphasizes compassionate listening and tailored microbiome-friendly solutions.',
    focusAreas: ["Recurrent Vaginitis (Yeast / BV)", "Painful Intercourse & Vaginismus", "Vulvodynia", "PCOS Intimate Symptoms"],
    availableToday: true,
    nextSlotTime: 'Today, 6:00 PM',
    availableDays: ['Today', 'Tomorrow', 'Thursday', 'Friday'],
    timeSlots: ['11:30 AM', '03:00 PM', '04:45 PM', '06:00 PM', '08:00 PM']
  },
  {
    id: 'doc-kavita-sen',
    name: 'Dr. Kavita Sen',
    avatar: '',
    gender: 'Female',
    speciality: 'Consultant Dermato-Venereologist & Genital Skin Specialist',
    qualifications: 'MBBS, MD (Dermatology, Venereology & Leprosy - AIIMS Delhi)',
    experienceYears: 11,
    registrationNumber: 'WBMC-KOL-2013-55198',
    medicalCouncil: 'West Bengal Medical Council',
    languages: ['English', 'Hindi', 'Bengali'],
    modes: ['chat', 'audio', 'video'],
    fee: 550,
    rating: 4.92,
    totalConsultations: 2180,
    bio: 'Dr. Kavita Sen specializes strictly in mucosal and genital dermatoses, including Lichen Sclerosus, confidential STI lesion screenings, intimate area eczema, and benign genital bumps. Consultations can be conducted via photo evaluation and encrypted text.',
    focusAreas: ['Lichen Sclerosus', 'Genital Warts & Bumps Differentiation', 'Intimate Dermatitis', 'STI Rash Screenings'],
    availableToday: false,
    nextSlotTime: 'Tomorrow, 10:30 AM',
    availableDays: ['Tomorrow', 'Wednesday', 'Thursday', 'Saturday'],
    timeSlots: ['10:30 AM', '12:00 PM', '02:00 PM', '05:30 PM']
  },
  {
    id: 'doc-tariq-khan',
    name: 'Dr. Tariq Khan',
    avatar: '',
    gender: 'Male',
    speciality: 'Consultant Urologist & Men’s Intimate Health',
    qualifications: 'MBBS, MS, DNB (Urology), Member Royal College of Surgeons (MRCS Edinburgh)',
    experienceYears: 15,
    registrationNumber: 'UPMC-LKO-2009-32114',
    medicalCouncil: 'Uttar Pradesh Medical Council',
    languages: ['English', 'Hindi', 'Urdu'],
    modes: ['chat', 'audio', 'video'],
    fee: 700,
    rating: 4.91,
    totalConsultations: 3410,
    bio: 'Dr. Tariq Khan has guided thousands of patients through burning urination, chronic pelvic pain syndrome, premature climax, and foreskin problems. He is known for clear explanations without medical jargon.',
    focusAreas: ['Burning Urination (Dysuria)', 'Chronic Prostatitis / CPPS', 'Premature Ejaculation', 'Foreskin Tightness'],
    availableToday: true,
    nextSlotTime: 'Today, 7:00 PM',
    availableDays: ['Today', 'Tomorrow', 'Wednesday', 'Friday'],
    timeSlots: ['01:30 PM', '04:00 PM', '05:45 PM', '07:00 PM', '09:00 PM']
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'APT-849102',
    doctorId: 'doc-ananya-sharma',
    doctorName: 'Dr. Ananya Sharma',
    doctorSpeciality: 'Proctologist & Senior Colorectal Surgeon',
    doctorAvatar: '/src/assets/images/doctor_ananya_sharma_1791871949945.jpg',
    patientAlias: 'Patient Alex',
    date: 'Tomorrow, Oct 14',
    timeSlot: '04:30 PM',
    mode: 'video',
    fee: 650,
    status: 'upcoming',
    symptomSummary: {
      category: 'Anorectal Health',
      concern: 'Piles / Bleeding with bowel movement',
      duration: 'About 3 weeks',
      severity: 'moderate',
      symptoms: ['Bright red blood on tissue paper', 'Painful pressure while sitting', 'Mild external swelling']
    },
    meetingUrl: 'https://guptcare.private.room/apt-849102',
    createdAt: '2026-10-12'
  },
  {
    id: 'APT-732915',
    doctorId: 'doc-vikram-mehta',
    doctorName: 'Dr. Vikram Mehta',
    doctorSpeciality: 'Senior Urologist & Andrologist',
    doctorAvatar: '/src/assets/images/doctor_vikram_mehta_1791871950320.jpg',
    patientAlias: 'Patient Alex',
    date: 'Oct 04, 2026',
    timeSlot: '05:15 PM',
    mode: 'chat',
    fee: 750,
    status: 'completed',
    symptomSummary: {
      category: 'Sexual Health',
      concern: 'Performance Anxiety & Mild ED during intimacy',
      duration: '4 months',
      severity: 'moderate',
      symptoms: ['Loss of erection mid-intimacy', 'Racing heart & anticipatory dread', 'Normal morning erections']
    },
    clinicalSummary: {
      diagnosisImpression: 'Psychogenic Erectile Dysfunction secondary to situational performance anxiety; normal morning tumescence confirms intact neurovascular pathway.',
      doctorAdvice: 'Sensate focus techniques recommended for 2 weeks. Avoid alcohol prior to intercourse. Mild PDE5 inhibitor prescribed on low-dose as-needed basis to rebuild confidence.',
      recommendedFollowUpDays: 21,
      lifestyleModifications: ['Aerobic exercise 30 min 4x weekly', 'Mindful breathing 5 min before intimate encounters', 'Avoid nocturnal screen blue light'],
      discreetPrescriptionCode: 'GC-RX-9924-CONFIDENTIAL'
    },
    createdAt: '2026-10-04'
  }
];

export const FREQUENTLY_ASKED_QUESTIONS = [
  {
    q: 'Will anyone find out about my consultation?',
    a: 'No. Nivara is engineered specifically for privacy. You can choose a pseudonymous display alias (e.g., "Patient Jordan"), and your financial statement will show a discreet medical charge ("Nivara Health Care") without naming sensitive conditions or specialties. Video consultations offer optional camera-off mode.'
  },
  {
    q: 'Are the doctors certified and registered?',
    a: 'Every clinician on Nivara holds active medical council registration (MCI/NMC or State Medical Councils) with verified postgraduate degrees (MS, MCh, MD, DNB) in colorectal surgery, urology, gynecology, or dermatology. Their registration numbers are openly auditable.'
  },
  {
    q: 'Can piles or fissures be treated without surgery?',
    a: 'Yes! In more than 85% of cases, early clinical intervention with medicated sitz baths, specific osmotic laxatives, topical calcium channel blockers (e.g. Diltiazem), and bioflavonoids successfully resolves fissures and early-stage piles without surgical procedures.'
  },
  {
    q: 'What if I am too embarrassed to show my face or body?',
    a: 'You have full control. You can choose Encrypted Text Chat or Voice Call where no camera is needed. If you choose Video, your camera can remain off until you feel completely comfortable, and visual examination is always optional and conducted with strict medical ethics.'
  },
  {
    q: 'How does Nivara differ from general doctor apps?',
    a: 'General platforms mix everything from coughs and colds to gym supplements. Nivara exclusively focuses 100% on sensitive and intimate health concerns. Our doctors are specially trained in empathetic, non-stigmatizing clinical communication so you never feel judged.'
  },
  {
    q: 'What should I do if my symptoms are an emergency?',
    a: 'Nivara is an outpatient telehealth platform and NOT an emergency service. If you experience massive bright red or dark blood loss, sudden severe scrotal pain with vomiting, inability to pass urine for over 8 hours, or fever above 102°F with severe pelvic pain, immediately go to an emergency hospital room or call 112 / 911.'
  }
];
