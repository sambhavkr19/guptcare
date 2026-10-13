import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const PORT = 3000;

// Deterministic Server-side Red Flag Keyword Screener
function evaluateServerSideSafety(text: string, symptoms: string[] = []): {
  isEmergency: boolean;
  isUrgent: boolean;
  emergencyReason: string | null;
  recommendedAction: string | null;
} {
  const combined = `${text} ${symptoms.join(' ')}`.toLowerCase();

  // Testicular torsion emergency
  if (
    (combined.includes('testic') || combined.includes('scrot') || combined.includes('andkosh')) &&
    (combined.includes('sudden') || combined.includes('vomit') || combined.includes('severe') || combined.includes('unbearable') || combined.includes('tez dard') || combined.includes('acute') || combined.includes('swelling'))
  ) {
    return {
      isEmergency: true,
      isUrgent: true,
      emergencyReason: 'Sudden acute one-sided testicular or scrotal pain may indicate testicular torsion, a critical surgical emergency where blood flow must be restored within 6 hours to prevent tissue necrosis.',
      recommendedAction: 'Do not wait for an online appointment. Proceed immediately to the nearest hospital emergency room.'
    };
  }

  // Massive continuous rectal bleeding
  if (
    (combined.includes('blood') || combined.includes('bleed') || combined.includes('khoon')) &&
    (combined.includes('continuous') || combined.includes('clot') || combined.includes('dizzy') || combined.includes('faint') || combined.includes('chakkar') || combined.includes('soaked') || combined.includes('massive') || combined.includes('black stool') || combined.includes('tarry'))
  ) {
    return {
      isEmergency: true,
      isUrgent: true,
      emergencyReason: 'Continuous rectal bleeding or passing large blood clots with dizziness suggests acute blood loss or hemodynamic instability that requires urgent in-person medical evaluation.',
      recommendedAction: 'Visit an emergency healthcare centre immediately or call 112.'
    };
  }

  // Acute perianal abscess with systemic infection / sepsis warning
  if (
    (combined.includes('perianal') || combined.includes('anal') || combined.includes('piles') || combined.includes('rectal')) &&
    (combined.includes('high fever') || combined.includes('chills') || combined.includes('shivering') || combined.includes('unable to sit') || combined.includes('foul smelling pus') || combined.includes('spreading red'))
  ) {
    return {
      isEmergency: true,
      isUrgent: true,
      emergencyReason: 'Perianal swelling accompanied by high fever, chills, and spreading redness indicates a potential ischiorectal or deep perianal abscess requiring urgent surgical drainage.',
      recommendedAction: 'Seek immediate evaluation at an emergency surgical unit or hospital.'
    };
  }

  // Acute urinary retention
  if (
    (combined.includes('urine') || combined.includes('peshab') || combined.includes('urinate')) &&
    (combined.includes('cannot pass') || combined.includes('unable to') || combined.includes('8 hours') || combined.includes('bursting') || combined.includes('ruk gaya') || combined.includes('blocked'))
  ) {
    return {
      isEmergency: true,
      isUrgent: true,
      emergencyReason: 'Inability to pass urine for hours despite the urge is acute urinary retention, requiring immediate emergency catheterization to protect bladder and kidney function.',
      recommendedAction: 'Go to your nearest hospital emergency department immediately.'
    };
  }

  // Priapism
  if (
    combined.includes('priapism') ||
    (combined.includes('erection') && (combined.includes('4 hours') || combined.includes('painful for hours') || combined.includes('not going away')))
  ) {
    return {
      isEmergency: true,
      isUrgent: true,
      emergencyReason: 'An erection lasting more than 4 hours is an ischemic emergency that can cause permanent cavernosal tissue fibrosis and impotence without prompt in-person urological decompression.',
      recommendedAction: 'Seek immediate emergency urological hospital care.'
    };
  }

  // Acute pelvic agony with fainting / bleeding (ectopic or ruptured cyst warning)
  if (
    (combined.includes('pelvic') || combined.includes('lower abdomen') || combined.includes('vaginal')) &&
    (combined.includes('faint') || combined.includes('dizzy') || combined.includes('shoulder pain') || combined.includes('severe sharp pain') || combined.includes('sudden agonizing'))
  ) {
    return {
      isEmergency: true,
      isUrgent: true,
      emergencyReason: 'Sudden severe pelvic pain with fainting or dizziness is a clinical emergency indicating potential internal hemorrhage or ruptured pelvic pathology.',
      recommendedAction: 'Proceed immediately to the nearest maternity/gynaecology emergency department or call 112.'
    };
  }

  return { isEmergency: false, isUrgent: false, emergencyReason: null, recommendedAction: null };
}

// ==========================================
// FEATURE 1: AI SYMPTOM COMPANION (GEMINI)
// ==========================================
app.post('/api/symptom-companion', async (req, res) => {
  const { message = '', chatHistory = [], currentReport = {} } = req.body;
  const safetyCheck = evaluateServerSideSafety(message, currentReport.associated_symptoms || []);

  try {
    const apiKey = process.env.GEMINI_API_KEY;

    // If API key is missing or default placeholder, explain required setup truthfully
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      const fallbackResponse = generateClinicalCompanionFallback(message, chatHistory, currentReport, safetyCheck);
      return res.json({
        apiKeyMissing: true,
        serviceNotice: 'GEMINI_API_KEY is not configured in the server environment. To enable cloud Gemini API, configure a valid GEMINI_API_KEY secret in your server environment variables. The local clinical intake engine is active for fallback intake.',
        ...fallbackResponse
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    const systemPrompt = `You are the Nivara AI Symptom Intake Companion—a specialized, deeply empathetic clinical triage assistant for sensitive and intimate health concerns (anorectal issues like piles/fissures, sexual health, genital/urinary problems, women's intimate health, and genital dermatology).

CLINICAL GUIDELINES & SENSITIVITY:
1. Patients feel immense embarrassment, shame, and anxiety. Speak with maximum warmth, dignity, and clinical respect.
2. Accept and fluently understand English, Hindi, and Hinglish (e.g. "sharam aati hai", "dard hota hai", "blood aa raha hai", "khujli ho rahi hai"). Reply in the same language or friendly Hinglish/English that matches the patient's tone.
3. NEVER make a definitive medical diagnosis. You are an intake assistant helping prepare a confidential report for a board-certified doctor.
4. Ask 1-2 focused, non-leading follow-up questions to clarify duration, severity (mild/moderate/severe/disruptive), pain scale (0-10), and specific signs.
5. If emergency warning signs appear, acknowledge them gently and emphasize urgent in-person care.
6. Suggest the most appropriate medical speciality:
   - "Proctology & Colorectal Surgery" (piles, fissures, fistula, rectal itching, anal bleeding)
   - "Urology & Andrology" (erectile dysfunction, premature ejaculation, urinary burning, male intimate health)
   - "Gynecology & Intimate Health" (women's intimate discomfort, vaginal health, menstrual cramps, pelvic pain)
   - "Genital Dermatology" (bumps, intimate rashes, itching, skin lesions)

OUTPUT FORMAT REQUIREMENT:
You MUST respond with valid JSON ONLY (no markdown fences, no extra text) matching this schema:
{
  "assistantReply": "Empathetic, conversational response to the patient with follow-up or clarifying question.",
  "structuredReport": {
    "symptom_summary": "Clean, concise clinical summary in professional medical language",
    "duration": "e.g. 2 weeks, 3 months, 3 days, or 'Not yet specified'",
    "severity_reported": "mild | moderate | severe | disruptive",
    "pain_scale": number (0 to 10),
    "associated_symptoms": ["array of detected symptoms"],
    "suggested_speciality": "Proctology & Colorectal Surgery | Urology & Andrology | Gynecology & Intimate Health | Genital Dermatology",
    "urgency_flag": "routine | urgent_in_person | emergency",
    "safety_message": "Advice regarding safety and red flags",
    "is_ready_for_review": boolean (true if user has described symptoms and at least 1-2 exchanges occurred)
  }
}`;

    const formattedHistory = [
      { text: systemPrompt },
      ...chatHistory.slice(-6).map((h: any) => ({
        text: `${h.role === 'user' ? 'Patient' : 'Intake Companion'}: ${h.text}`
      })),
      { text: `Current Structured Report Draft: ${JSON.stringify(currentReport)}` },
      { text: `Patient's new message: "${message}"\nResponse JSON:` }
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [{ role: 'user', parts: formattedHistory }],
      config: {
        maxOutputTokens: 750,
        temperature: 0.3,
        responseMimeType: 'application/json'
      }
    });

    const rawText = response.text?.trim() || '';
    let parsed: any;
    try {
      // Clean possible markdown code fences if returned
      const cleanJson = rawText.replace(/^```json\s*/, '').replace(/\s*```$/, '').trim();
      parsed = JSON.parse(cleanJson);
    } catch (parseError) {
      console.warn('Failed to parse Gemini companion JSON, falling back:', parseError, rawText);
      parsed = generateClinicalCompanionFallback(message, chatHistory, currentReport, safetyCheck);
    }

    // Server-side safety rule enforcement: override if red-flag detected
    if (safetyCheck.isEmergency) {
      parsed.structuredReport = parsed.structuredReport || {};
      parsed.structuredReport.urgency_flag = 'emergency';
      parsed.structuredReport.safety_message = safetyCheck.emergencyReason;
      parsed.assistantReply = `${parsed.assistantReply} \n\n⚠️ IMPORTANT SAFETY NOTICE: ${safetyCheck.emergencyReason} ${safetyCheck.recommendedAction}`;
    }

    return res.json({
      apiKeyMissing: false,
      assistantReply: parsed.assistantReply,
      structuredReport: parsed.structuredReport
    });
  } catch (error: any) {
    console.error('Gemini symptom companion error:', error?.message || error);
    const errMsg = error?.message || '';
    const isModelUnavailable = errMsg.includes('503') || errMsg.includes('UNAVAILABLE') || errMsg.includes('404') || errMsg.includes('demand');
    const fallbackResponse = generateClinicalCompanionFallback(
      req.body.message || '',
      req.body.chatHistory || [],
      req.body.currentReport || {},
      safetyCheck
    );
    return res.json({
      apiKeyMissing: false,
      errorOccurred: true,
      serviceNotice: isModelUnavailable
        ? 'Gemini 3.8 Flash model is currently experiencing upstream high demand / temporary cloud rate limits. The local clinical intake engine is active so you can proceed smoothly without losing symptom data.'
        : `Upstream AI service status: ${errMsg || 'Temporary service error'}. Local clinical intake engine is active.`,
      ...fallbackResponse
    });
  }
});

// Helper for comprehensive clinical companion fallback
function generateClinicalCompanionFallback(
  userText: string,
  history: any[],
  currentReport: any,
  safetyCheck: any
) {
  const text = (userText || '').toLowerCase();
  let suggested_speciality = currentReport?.suggested_speciality || 'Proctology & Colorectal Surgery';
  let severity: 'mild' | 'moderate' | 'severe' | 'disruptive' = currentReport?.severity_reported || 'moderate';
  let painScale = currentReport?.pain_scale || 4;
  const symptoms: string[] = currentReport?.associated_symptoms ? [...currentReport.associated_symptoms] : [];

  let reply = '';

  // Detect symptoms and categories
  if (text.includes('blood') || text.includes('bleed') || text.includes('khoon') || text.includes('red')) {
    symptoms.push('Rectal / intimate bleeding');
    suggested_speciality = 'Proctology & Colorectal Surgery';
    reply = "I understand seeing blood can be frightening, but please rest assured that many conditions like fissures or internal hemorrhoids are very treatable. Is the blood bright red on the toilet paper, or darker? And does it occur mainly during or after bowel movements?";
  } else if (text.includes('erect') || text.includes('sex') || text.includes('ejaculat') || text.includes('ling') || text.includes('shighra')) {
    symptoms.push('Sexual health / intimacy concern');
    suggested_speciality = 'Urology & Andrology';
    reply = "Thank you for sharing that with me. Sexual health concerns are remarkably common and very often linked to stress, vascular health, or hormonal balance. How long have you been noticing this, and is it causing anxiety in your daily life?";
  } else if (text.includes('urine') || text.includes('burn') || text.includes('peshab') || text.includes('stinging') || text.includes('bladder')) {
    symptoms.push('Urinary discomfort / burning');
    suggested_speciality = 'Urology & Andrology';
    reply = "Urinary stinging and burning are uncomfortable but very treatable. Are you noticing a frequent urge to go, or any changes in color or odor? How many days has this been happening?";
  } else if (text.includes('itch') || text.includes('rash') || text.includes('bump') || text.includes('khujli') || text.includes('daane')) {
    symptoms.push('Intimate skin itching / rash / lesion');
    suggested_speciality = 'Genital Dermatology';
    reply = "Itching and intimate skin irritation can be very distressing. Please try not to scratch or apply harsh generic soaps. Have you noticed any small bumps, redness, or peeling? When did this first start?";
  } else if (text.includes('period') || text.includes('cramp') || text.includes('vagin') || text.includes('discharge') || text.includes('white')) {
    symptoms.push('Women\'s intimate / reproductive concern');
    suggested_speciality = 'Gynecology & Intimate Health';
    reply = "I hear you, and this is completely safe to discuss. Discomfort, abnormal discharge, or deep pelvic cramping should always be evaluated gently. Does this happen at specific points in your menstrual cycle?";
  } else {
    reply = "Thank you for sharing. Please tell me in your own words—how long has this been bothering you, and on a scale of 0 to 10, how intense is the discomfort?";
  }

  // Duration detection
  let duration = currentReport?.duration || '1 to 4 weeks';
  if (text.includes('today') || text.includes('yesterday') || text.includes('kal') || text.includes('aaj')) {
    duration = 'Less than 1 week';
  } else if (text.includes('month') || text.includes('mahine') || text.includes('saal') || text.includes('year')) {
    duration = 'More than 3 months';
    severity = 'disruptive';
  }

  // Pain / severity adjustment
  if (text.includes('severe') || text.includes('bohot dard') || text.includes('unbearable') || text.includes('agony')) {
    severity = 'severe';
    painScale = 8;
  }

  // Emergency safety override
  const urgency_flag = safetyCheck.isEmergency ? 'emergency' : (severity === 'severe' ? 'urgent_in_person' : 'routine');
  const safety_message = safetyCheck.isEmergency
    ? safetyCheck.emergencyReason
    : 'No acute life-threatening emergency detected. Suitable for private telehealth assessment.';

  if (safetyCheck.isEmergency) {
    reply = `⚠️ IMPORTANT MEDICAL NOTICE: ${safetyCheck.emergencyReason} ${safetyCheck.recommendedAction}`;
  }

  return {
    assistantReply: reply,
    structuredReport: {
      symptom_summary: userText.length > 20 ? userText.slice(0, 180) : 'Intimate health discomfort reported by patient',
      duration,
      severity_reported: severity,
      pain_scale: painScale,
      associated_symptoms: Array.from(new Set(symptoms)),
      suggested_speciality,
      urgency_flag,
      safety_message,
      is_ready_for_review: history.length >= 1
    }
  };
}

// ==========================================
// FEATURE 2: CLINICAL SAFETY SCREENING ROUTE
// ==========================================
app.post('/api/safety-screening', (req, res) => {
  const { description = '', text = '', message = '', symptoms = [], categoryId = '', painScale } = req.body;
  const combinedDesc = description || text || message || '';
  const safety = evaluateServerSideSafety(combinedDesc, symptoms);

  // Severe pain scale check
  const painNum = Number(painScale);
  const isExtremePain = !isNaN(painNum) && painNum >= 9;

  const isEmergency = safety.isEmergency;
  const isUrgent = isExtremePain || safety.isUrgent;

  let urgencyLevel: 'emergency' | 'urgent_in_person' | 'routine' = 'routine';
  let reason = safety.emergencyReason;
  let action = safety.recommendedAction;

  if (isEmergency) {
    urgencyLevel = 'emergency';
  } else if (isUrgent) {
    urgencyLevel = 'urgent_in_person';
    if (!reason && isExtremePain) {
      reason = 'Reported extreme pain intensity (scale 9-10/10) warrants physical palpation and urgent clinical evaluation.';
      action = 'Please visit an urgent in-person healthcare clinic for hands-on examination and acute pain management.';
    }
  }

  return res.json({
    isSafeForTelehealth: !isEmergency && !isUrgent,
    urgencyLevel,
    emergencyReason: reason,
    recommendedAction: action,
    safetyNotice: isEmergency || isUrgent
      ? reason
      : 'No acute emergency warning signs detected in current description. Routine clinician consultation can proceed, though virtual screening does not guarantee the absence of underlying conditions.'
  });
});

// ==========================================
// CONSULTATION ROOM DOCTOR CHAT API
// ==========================================
app.post('/api/consultation-chat', async (req, res) => {
  try {
    const { message, doctorName, doctorSpeciality, patientAlias, symptomBrief, history } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      return res.status(200).json({ fallback: true });
    }

    const ai = new GoogleGenAI({ apiKey });

    const systemPrompt = `You are ${doctorName || 'Dr. Ananya Sharma'}, a senior board-certified medical specialist in ${doctorSpeciality || 'Proctology & Intimate Health'} at Nivara.
You are in a live, highly confidential telehealth consultation with ${patientAlias || 'the patient'}.
Patient's reported clinical concern: "${symptomBrief || 'Intimate health discomfort'}".

Clinical communication instructions:
1. Speak as the actual compassionate doctor directly addressing the patient.
2. Be warm, empathetic, dignified, and scientifically precise. Never sound like a generic AI chatbot or boilerplate form letter.
3. Answer the patient's exact question or observation directly. If they write in Hindi or Hinglish, reply with natural fluency and reassurance.
4. If they report symptoms (like bleeding, pain, tears, discharge, or anxiety), ask targeted differential diagnostic questions (e.g. bright red vs dark, relation to stool/activity, duration).
5. If they ask a conversational question (e.g. "why are you saying the same thing", "is this normal", "can this be cured without surgery"), answer naturally and conversationally like an experienced specialist.
6. Keep replies concise and easy to read (2 to 4 sentences).
7. Do not repeat greeting intros if the conversation is already underway.`;

    // Construct conversation history
    const conversationParts = [{ text: systemPrompt }];
    if (Array.isArray(history)) {
      history.slice(-6).forEach((h: any) => {
        conversationParts.push({
          text: `${h.sender === 'patient' ? 'Patient' : 'Doctor'}: ${h.text}`
        });
      });
    }
    conversationParts.push({ text: `Patient: ${message}\nDoctor:` });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        {
          role: 'user',
          parts: conversationParts
        }
      ],
      config: {
        maxOutputTokens: 350,
        temperature: 0.7
      }
    });

    const reply = response.text?.trim() || '';
    return res.json({ reply });
  } catch (error) {
    console.error('Gemini chat proxy error:', error);
    return res.status(200).json({ fallback: true });
  }
});

// Dev vs Prod Vite Mounting
if (process.env.NODE_ENV !== 'production') {
  const { createServer } = await import('vite');
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'spa'
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Nivara server listening on port ${PORT}`);
});
