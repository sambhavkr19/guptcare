export interface ChatDoctorContext {
  doctorName: string;
  doctorSpeciality: string;
  patientAlias: string;
  symptomBrief: string;
  history: Array<{ sender: 'doctor' | 'patient'; text: string }>;
}

let sessionTurnCounter = 0;

export async function generateDoctorResponse(
  userMessage: string,
  context: ChatDoctorContext
): Promise<string> {
  sessionTurnCounter++;
  // 1. Attempt to call server-side Gemini API route first
  try {
    const res = await fetch('/api/consultation-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: userMessage,
        doctorName: context.doctorName,
        doctorSpeciality: context.doctorSpeciality,
        patientAlias: context.patientAlias,
        symptomBrief: context.symptomBrief,
        history: context.history.slice(-6)
      })
    });

    if (res.ok) {
      const data = await res.json();
      if (data.reply && data.reply.trim() && !data.fallback) {
        return data.reply.trim();
      }
    }
  } catch (e) {
    // proceed to intelligent clinical engine
  }

  // 2. Intelligent, dynamic clinical dialogue fallback
  return generateDynamicClinicalReply(userMessage, context);
}

function generateDynamicClinicalReply(
  input: string,
  context: ChatDoctorContext
): string {
  const q = input.toLowerCase().trim();
  const docName = context.doctorName;
  const isSurgeon = docName.includes('Ananya') || context.doctorSpeciality.toLowerCase().includes('proctolog');
  const isUro = docName.includes('Vikram') || context.doctorSpeciality.toLowerCase().includes('uro') || context.doctorSpeciality.toLowerCase().includes('androlog');
  const isGyn = docName.includes('Priya') || context.doctorSpeciality.toLowerCase().includes('gynec');
  const isDerm = docName.includes('Kavita') || context.doctorSpeciality.toLowerCase().includes('derm');

  // Handle meta questions like "why are you giving the same answer" or "are you a bot"
  if (
    q.includes('same answer') || 
    q.includes('bot') || 
    q.includes('ai') || 
    q.includes('robot') || 
    q.includes('real') || 
    q.includes('why are u') || 
    q.includes('why do you repeat') ||
    q.includes('same thing')
  ) {
    const metaReplies = [
      `I hear you clearly, ${context.patientAlias}, and I apologize if my tone felt repetitive. Let's get straight to your specific problem: "${context.symptomBrief}". Tell me candidly—is the discomfort constant right now, or does it flare up during certain activities like sitting or walking?`,
      `Thank you for keeping me honest, ${context.patientAlias}. I am completely focused on your file. Looking at your report regarding "${context.symptomBrief}": how much is this interfering with your sleep or work today?`,
      `I appreciate you pointing that out. As a clinician, I want you to feel 100% heard. Let's reset: what is the most urgent question or worry you have about this condition right this second?`
    ];
    return metaReplies[sessionTurnCounter % metaReplies.length];
  }

  // Shame / Fear / Embarrassment
  if (
    q.includes('sharam') || 
    q.includes('embarrass') || 
    q.includes('ashamed') || 
    q.includes('shy') || 
    q.includes('hesitat') || 
    q.includes('darr') || 
    q.includes('scared') || 
    q.includes('nervous') ||
    q.includes('fear')
  ) {
    return `Please don't feel any embarrassment whatsoever, ${context.patientAlias}. In intimate health and proctology, I see hundreds of patients every month with exactly these symptoms. It is a normal part of human physiology, not a personal flaw. You took a brave first step by consulting today.`;
  }

  // Blood / bleeding / khoon
  if (q.includes('blood') || q.includes('bleed') || q.includes('khoon') || q.includes('red') || q.includes('lal')) {
    if (isSurgeon) {
      return `Seeing blood is naturally frightening, but let's break it down clinically. Is the blood bright fresh red—for example, drops in the toilet bowl or streaks on the tissue—or is it dark clotted blood? Bright red drops typically indicate a superficial anal fissure or internal hemorrhoid cushion rather than any internal gastrointestinal issue.`;
    }
    if (isUro) {
      return `Blood in the urine (hematuria) or semen must always be treated with careful clinical scrutiny. Did you notice the reddish tint at the very start of urination, or throughout the entire stream? Also, is there any fever or chills?`;
    }
    return `Seeing bleeding is always alarming. Is it happening during every single episode, and have you felt any lightheadedness or dizziness?`;
  }

  // Pain / hurting / stinging / burning / dard / jalan
  if (q.includes('pain') || q.includes('hurt') || q.includes('dard') || q.includes('burn') || q.includes('sting') || q.includes('sore') || q.includes('jalan') || q.includes('sharp')) {
    if (isSurgeon) {
      return `That sharp burning sensation usually points to an acute anal fissure spasm. When the delicate tissue stretches, the internal sphincter muscle goes into involuntary spasm, which restricts blood supply and delays healing. A warm sitz bath for 10 minutes relaxes that sphincter muscle significantly. Have you tried warm water soaks yet?`;
    }
    if (isUro) {
      return `Urethral burning and stinging typically indicate mucosal irritation or an ascending urinary tract infection. Are you also feeling like you have to rush to the bathroom frequently, even when only a few drops come out?`;
    }
    if (isGyn) {
      return `Intimate soreness and burning can stem from local flora disruption (like candidiasis or bacterial imbalance) or pelvic tissue strain. Is the discomfort primarily external or felt deeper internally?`;
    }
    return `I hear how uncomfortable that is. On a scale of 1 to 10, what is the pain level right now? And does it throb continuously or only trigger with pressure?`;
  }

  // Lump / swelling / mass / bump / piles / sujan / daane
  if (q.includes('lump') || q.includes('mass') || q.includes('swelling') || q.includes('bump') || q.includes('piles') || q.includes('wart') || q.includes('boil') || q.includes('sujan') || q.includes('ganth')) {
    if (isSurgeon) {
      return `If you feel a small swelling or lump that prolapses during bowel movements, that is characteristic of a grade 2 or 3 internal hemorrhoid cushion or an external skin tag. Does it slide back inside on its own when you stand up, or do you have to gently reduce it?`;
    }
    if (isDerm) {
      return `Intimate bumps and lesions range from harmless pearly papules and friction folliculitis to viral molluscum or HPV. Crucially: do NOT squeeze them or apply harsh generic face creams. Are the bumps itchy or tender to the touch?`;
    }
    return `A swelling in sensitive anatomy naturally causes concern. Has it grown noticeably over the last few days, and is there any fluid discharge from it?`;
  }

  // Sexual health / erection / premature ejaculation / ling / virya
  if (q.includes('erect') || q.includes('ed') || q.includes('ejaculat') || q.includes('premature') || q.includes('sex') || q.includes('hard') || q.includes('libido') || q.includes('penis') || q.includes('shighra')) {
    return `Thank you for being open with me, ${context.patientAlias}. Erectile health is essentially vascular and psychological health working together. A vital clinical clue: do you still experience spontaneous morning erections when you wake up? If morning erections are still present, it strongly confirms that your vascular and nerve pathways are healthy, and the issue is likely rooted in performance anxiety or stress.`;
  }

  // Itching / scratch / pruritus / khujli
  if (q.includes('itch') || q.includes('khujli') || q.includes('scratch') || q.includes('irritat')) {
    return `Intimate itching (pruritus) can become an exhausting itch-scratch cycle. Scratching causes microscopic epidermal fissures, allowing sweat and Candida flora to cause further irritation. Keep the region cool and dry, wear loose cotton, and avoid fragranced soaps. I will prescribe a mild soothing barrier formulation.`;
  }

  // Surgery / Operation / Surgery zaruri hai kya
  if (q.includes('surgery') || q.includes('operation') || q.includes('cut') || q.includes('laser')) {
    return `I want to reassure you: over 85% of early-to-moderate intimate conditions like fissures and grade 1-2 piles resolve completely with conservative medical management and dietary adjustments. Surgery is only considered as a last resort if medication fails over 6-8 weeks. So do not worry about surgery at this stage.`;
  }

  // Medicine / prescription / cure / dawai / ilaj
  if (q.includes('medicin') || q.includes('tablet') || q.includes('cream') || q.includes('cure') || q.includes('treatment') || q.includes('dawai') || q.includes('ilaj') || q.includes('prescription')) {
    return `Yes, absolutely. Once we conclude this private consultation, I am generating a tailored clinical summary for your dashboard. It will include specific non-steroidal ointments, stool softeners, and bioflavonoid support with precise dosage instructions and lifestyle habits.`;
  }

  // Diet / food / khana / constipation / kabz
  if (q.includes('food') || q.includes('diet') || q.includes('eat') || q.includes('constipat') || q.includes('water') || q.includes('fiber') || q.includes('kabz') || q.includes('khana')) {
    return `Diet is foundational for rapid healing. You want stool to pass smoothly without any straining. Drink 2.5 to 3 liters of water, include soluble fiber (like oats, papaya, and isabgol husk at bedtime), and strictly avoid spicy red chillies or excess fried food for the next 10 days.`;
  }

  // Duration statements
  if (q.includes('day') || q.includes('week') || q.includes('month') || q.includes('year') || q.includes('din') || q.includes('hafte') || q.includes('mahine')) {
    return `Understood. Knowing that timeframe helps me determine whether this is an acute sudden fissure or a subacute condition. Because it has persisted for this long, starting targeted therapy right away is the best path to prevent chronic scarring.`;
  }

  // Simple Yes / Haan
  if (q === 'yes' || q === 'yeah' || q === 'yup' || q === 'haan' || q === 'ha' || q === 'yes doctor') {
    return `Understood. That confirms my clinical assessment based on your intake notes. I am preparing your official clinical impression and a personalized prescription reference code in your dashboard. Do you have any known drug allergies I should keep in mind?`;
  }

  // Simple No / Nahi
  if (q === 'no' || q === 'nope' || q === 'not really' || q === 'nahi' || q === 'na') {
    return `That is actually very reassuring, as it rules out secondary complications. What is the main question or concern you would like me to answer before we finalize your treatment plan?`;
  }

  // Dynamic empathetic reply variations
  const generalReplies = [
    `I understand, ${context.patientAlias}. Dealing with "${context.symptomBrief}" is physically uncomfortable and mentally exhausting, but we will get this resolved. Have you noticed any fever, or does the discomfort worsen at specific times of day?`,
    `Thank you for giving me those details. Every piece of context helps me tailor the right clinical advice for you. Are you currently taking any other regular medications or supplements?`,
    `I am actively reviewing your responses. We are going to address this step by step. Tell me, has this issue occurred in the past, or is this the very first time you are experiencing it?`
  ];

  return generalReplies[sessionTurnCounter % generalReplies.length];
}
