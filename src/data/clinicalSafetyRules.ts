export interface ClinicalSafetyRule {
  id: string;
  category: 'anorectal' | 'urinary-genital' | 'sexual-health' | 'womens-intimate' | 'genital-skin';
  title: string;
  severity: 'emergency' | 'urgent_in_person';
  keywords: string[];
  plainExplanation: string;
  emergencyRecommendation: string;
  clinicalRationale: string;
}

export interface SafetyEvaluationInput {
  categoryId?: string;
  symptoms: string[];
  description: string;
  painScale?: number;
  duration?: string;
}

export interface SafetyEvaluationResult {
  isSafeForTelehealth: boolean;
  urgencyLevel: 'routine' | 'urgent_in_person' | 'emergency';
  triggeredRules: ClinicalSafetyRule[];
  emergencyReason: string | null;
  recommendedAction: string;
}

/**
 * Clinician-Reviewed Safety Screening Rules (Version 2.1)
 * Reviewed by Clinical Advisory Board for GuptCare Telehealth Protocols
 */
export const CLINICAL_SAFETY_RULES: ClinicalSafetyRule[] = [
  // 1. ANORECTAL / COLORECTAL RED FLAGS
  {
    id: 'anorectal-hemorrhage-massive',
    category: 'anorectal',
    title: 'Severe / Continuous Rectal Bleeding',
    severity: 'emergency',
    keywords: ['continuous bleeding', 'toilet bowl full of blood', 'passing large clots', 'dizzy', 'fainted', 'pale', 'black stool', 'tarry stool', 'khoon beh raha hai', 'chakkar'],
    plainExplanation: 'Heavy continuous rectal bleeding, passing large clots, or bleeding accompanied by dizziness and fainting suggests severe blood loss requiring rapid clinical stabilization.',
    emergencyRecommendation: 'Do not wait for an online appointment. Proceed immediately to your nearest hospital emergency department or dial 112.',
    clinicalRationale: 'Hemodynamic compromise risk from acute lower gastrointestinal hemorrhage or active arterial spurting.'
  },
  {
    id: 'anorectal-gangrene-abscess',
    category: 'anorectal',
    title: 'Perianal Spreading Abscess / Sepsis',
    severity: 'emergency',
    keywords: ['high fever with shivering', 'fever > 101', 'spreading swelling', 'rapidly spreading red', 'unable to sit or walk', 'foul smell pus', 'severe chills'],
    plainExplanation: 'A painful perianal swelling with high fever, spreading redness, and chills may indicate a deep ischiorectal abscess or severe infection requiring urgent surgical drainage.',
    emergencyRecommendation: 'Visit an urgent care centre or emergency surgical unit without delay.',
    clinicalRationale: 'Deep pelvic abscesses can rapidly progress to systemic bacteremia or necrotizing fasciitis if left undrained.'
  },

  // 2. URINARY & GENITAL RED FLAGS
  {
    id: 'urinary-acute-retention',
    category: 'urinary-genital',
    title: 'Complete Acute Urinary Retention',
    severity: 'emergency',
    keywords: ['cannot pass urine', 'unable to urinate for 8 hours', 'no urine coming out', 'bladder bursting', 'severe lower stomach pressure', 'peshab ruk gaya'],
    plainExplanation: 'Complete inability to pass any urine for more than 8 hours despite an overwhelming urge is a medical emergency that can damage the bladder and kidneys.',
    emergencyRecommendation: 'Go to an emergency room immediately for urinary catheterization to relieve bladder pressure.',
    clinicalRationale: 'Acute urinary retention causes severe detrusor strain, hydronephrosis, and post-renal acute kidney injury.'
  },
  {
    id: 'urinary-urosepsis-pyelo',
    category: 'urinary-genital',
    title: 'Severe Kidney Infection / Urosepsis Warning',
    severity: 'emergency',
    keywords: ['flank pain with fever', 'back pain with chills', 'vomiting with burning urine', 'shivering with urine burn', 'high fever cloudy urine'],
    plainExplanation: 'Burning urine accompanied by high fever, severe back/side flank pain, and shivering suggests an ascending kidney infection (pyelonephritis) that needs urgent IV antibiotics.',
    emergencyRecommendation: 'Seek in-person emergency hospital care immediately.',
    clinicalRationale: 'Ascending upper urinary tract infection carries high risk of septic shock and renal parenchyma damage.'
  },

  // 3. SEXUAL HEALTH & ANDROLOGY RED FLAGS
  {
    id: 'sexual-testicular-torsion',
    category: 'sexual-health',
    title: 'Suspected Acute Testicular Torsion',
    severity: 'emergency',
    keywords: ['sudden testicular pain', 'severe one-sided testicle pain', 'vomiting with groin pain', 'swollen high testicle', 'acute scrotal agony', 'sudden testis pain', 'andkosh me tez dard'],
    plainExplanation: 'Sudden, severe one-sided testicular pain often accompanied by nausea or vomiting is a surgical emergency. The blood supply to the testicle may be twisted and must be restored within 6 hours.',
    emergencyRecommendation: 'Do NOT delay. Head straight to the nearest hospital emergency room. Every hour matters.',
    clinicalRationale: 'Testicular ischemia from cord twisting leads to permanent testicular necrosis if detorsion is not performed within 6 hours.'
  },
  {
    id: 'sexual-priapism',
    category: 'sexual-health',
    title: 'Acute Ischemic Priapism',
    severity: 'emergency',
    keywords: ['erection lasting 4 hours', 'painful erection for hours', 'erection will not go away', 'priapism', 'erection > 4 hours'],
    plainExplanation: 'A rigid, painful erection lasting longer than 4 hours without sexual arousal is a medical emergency that can lead to permanent tissue damage if blood is not decompressed.',
    emergencyRecommendation: 'Proceed to an emergency room urology department immediately.',
    clinicalRationale: 'Ischemic stasis of corporal blood causes irreversible cavernosal fibrosis and permanent erectile impotence.'
  },

  // 4. WOMEN\'S INTIMATE HEALTH RED FLAGS
  {
    id: 'womens-ectopic-hemorrhage',
    category: 'womens-intimate',
    title: 'Acute Pelvic Agony with Bleeding / Fainting',
    severity: 'emergency',
    keywords: ['sudden sharp pelvic pain', 'sharp lower abdomen pain fainting', 'severe cramps dizziness', 'heavy bleeding soaking pads', 'shoulder tip pain with pelvic pain'],
    plainExplanation: 'Sudden agonizing lower abdominal pain with vaginal spotting or fainting can be a sign of a ruptured ovarian cyst or ruptured ectopic pregnancy requiring immediate surgical care.',
    emergencyRecommendation: 'Call 112 or go to the nearest emergency hospital maternity/gynaecology ward immediately.',
    clinicalRationale: 'Risk of catastrophic intra-abdominal hemorrhage and hemorrhagic shock.'
  },

  // 5. GENITAL SKIN RED FLAGS
  {
    id: 'skin-necrotizing-warning',
    category: 'genital-skin',
    title: 'Rapidly Spreading Necrotic Intimate Rash / Fournier\'s Warning',
    severity: 'emergency',
    keywords: ['skin turning black', 'blisters with dusky skin', 'severe pain out of proportion', 'crackling sound under skin', 'rapidly spreading darkness'],
    plainExplanation: 'Rapidly spreading darkening, blistering, or extreme agony in intimate skin is a dangerous soft-tissue emergency that must be treated immediately.',
    emergencyRecommendation: 'Seek urgent hospital surgical evaluation immediately.',
    clinicalRationale: 'Necrotizing soft tissue infection (Fournier\'s gangrene) requires urgent surgical debridement and broad-spectrum IV antibiotics.'
  }
];

/**
 * Deterministic safety evaluator running against clinician rules
 */
export function evaluateClinicalSafety(input: SafetyEvaluationInput): SafetyEvaluationResult {
  const triggered: ClinicalSafetyRule[] = [];
  const combinedText = `
    ${input.description || ''} 
    ${input.symptoms.join(' ')}
  `.toLowerCase();

  for (const rule of CLINICAL_SAFETY_RULES) {
    // If category is specified, prioritize matching category or universal red flags
    const categoryMatches = !input.categoryId || rule.category === input.categoryId;

    const hasKeyword = rule.keywords.some(kw => combinedText.includes(kw.toLowerCase()));
    
    if (hasKeyword && (categoryMatches || rule.severity === 'emergency')) {
      triggered.push(rule);
    }
  }

  // Extreme pain scale check
  if (input.painScale && input.painScale >= 9 && !triggered.some(r => r.title.includes('Agony'))) {
    triggered.push({
      id: 'extreme-pain-warning',
      category: (input.categoryId as any) || 'anorectal',
      title: 'Extreme Unbearable Agony (Pain Scale 9-10/10)',
      severity: 'urgent_in_person',
      keywords: ['extreme pain'],
      plainExplanation: 'You reported an extreme pain rating of 9 or 10 out of 10. Such severe acute pain requires immediate physical clinical palpation and potential pain relief.',
      emergencyRecommendation: 'Please visit an urgent in-person healthcare clinic for immediate diagnostic examination.',
      clinicalRationale: 'Severe pain scale >= 9 exceeds safe outpatient virtual management threshold.'
    });
  }

  const hasEmergency = triggered.some(t => t.severity === 'emergency');
  const hasUrgent = triggered.some(t => t.severity === 'urgent_in_person');

  if (hasEmergency) {
    return {
      isSafeForTelehealth: false,
      urgencyLevel: 'emergency',
      triggeredRules: triggered,
      emergencyReason: triggered[0].plainExplanation,
      recommendedAction: triggered[0].emergencyRecommendation
    };
  }

  if (hasUrgent) {
    return {
      isSafeForTelehealth: false,
      urgencyLevel: 'urgent_in_person',
      triggeredRules: triggered,
      emergencyReason: triggered[0].plainExplanation,
      recommendedAction: triggered[0].emergencyRecommendation
    };
  }

  return {
    isSafeForTelehealth: true,
    urgencyLevel: 'routine',
    triggeredRules: [],
    emergencyReason: null,
    recommendedAction: 'Safe for confidential telehealth evaluation with a verified clinician.'
  };
}
