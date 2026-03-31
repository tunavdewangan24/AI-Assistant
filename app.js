/* ================================================================
   SMARTDESK AI  –  app.js
   Full AI Engine: Intent Classification · Topic Routing · RAG
   ================================================================ */

'use strict';

// ── Knowledge Base (RAG store) ──────────────────────────────────
const KB = {
  it: {
    "password reset": {
      keywords: ["password","reset","forgot","can't log","cannot log","locked out","unlock","credentials","login","sign in","access denied","authentication failed"],
      response: `**Password Reset Instructions**\n\nHere's how to reset your password quickly:\n\n1. Go to **portal.company.com/reset** or click "Forgot Password" on the login screen.\n2. Enter your **company email address** and click "Send Reset Link".\n3. Check your inbox (and spam folder) — the link expires in **30 minutes**.\n4. Choose a strong password: at least 12 characters, one uppercase, one number, one symbol.\n5. After resetting, clear your browser cache and try logging in again.\n\n💡 **Tip:** If you don't receive the email within 5 minutes, contact IT at **it-support@company.com** or call ext. **4357**.`
    },
    "mfa": {
      keywords: ["mfa","2fa","two factor","authenticator","otp","verification code","two-factor","multi factor","google authenticator","microsoft authenticator"],
      response: `**Multi-Factor Authentication (MFA) Help**\n\nTo set up or reset your MFA:\n\n1. **New Setup:** Log into the IT portal → Security Settings → Enable MFA → Scan the QR code with your authenticator app.\n2. **Lost Access:** If you've lost your authenticator device, contact IT immediately at **it-support@company.com** — we'll verify your identity and reset MFA within 1 business hour.\n3. **Common Fix:** Make sure your phone clock is synchronized — OTP codes are time-sensitive.\n\n🔐 **Apps Supported:** Microsoft Authenticator, Google Authenticator, Authy.`
    },
    "vpn": {
      keywords: ["vpn","connect","remote","network","tunnel","cisco","global protect","remote access","work from home","wfh"],
      response: `**VPN Connection Guide**\n\nTo connect to the company VPN:\n\n1. Install **GlobalProtect VPN** from the IT Software Portal.\n2. Use gateway: **vpn.company.com**\n3. Login with your **company credentials + MFA code**.\n4. If the connection fails, try: Disconnect → Reconnect, or restart the GlobalProtect service.\n\n🌐 **Supported Systems:** Windows 10/11, macOS 12+, Ubuntu 20.04+\n\nStill having trouble? Submit a ticket with your error message and IT will respond within 2 hours.`
    },
    "software": {
      keywords: ["install","software","application","app","license","download","tool","permission","admin","elevated","it portal"],
      response: `**Software Installation Request**\n\nTo install software on your work device:\n\n1. Check the **IT Software Catalog** at portal.company.com/software for pre-approved apps.\n2. For approved apps: install directly through the **Company Portal** app — no admin rights needed.\n3. For new software requests: Submit a form at portal.company.com/software-request with:\n   - Software name & version\n   - Business justification\n   - License cost (if applicable)\n\n⏰ **SLA:** Standard requests are reviewed within **3 business days**.`
    },
    "email": {
      keywords: ["email","outlook","mail","calendar","inbox","exchange","smtp","pop","imap","mailbox","distribution"],
      response: `**Email & Outlook Support**\n\nCommon fixes for email issues:\n\n• **Not receiving emails:** Check your spam folder and Outlook rules. Run: File → Account Settings → Repair.\n• **Can't send:** Check your signature isn't too large and attachments are under 25MB.\n• **Calendar sync:** Go to File → Account Settings → Email tab → Repair your account.\n• **Mobile setup:** Use the **Outlook Mobile app** and sign in with your company email — it auto-configures.\n\n📧 IT Email Support: **it-email@company.com** | Response time: 4 hours.`
    },
    "default": {
      keywords: [],
      response: `**IT Support – Ticket Received**\n\nThank you for reaching out to IT Support. Your ticket has been logged and classified.\n\nFor urgent issues:\n• 📞 IT Helpdesk: **ext. 4357** (Mon–Fri, 8am–6pm)\n• 📧 Email: **it-support@company.com**\n• 💬 Live Chat: portal.company.com/chat\n\nFor non-urgent issues, we respond within **4 business hours**. You'll receive an email confirmation shortly.`
    }
  },
  hr: {
    "leave": {
      keywords: ["leave","vacation","pto","time off","annual leave","sick leave","days off","holiday","absence","holiday balance","remaining days"],
      response: `**Leave Balance & Requests**\n\nHere's how to check and request leave:\n\n1. **View Balance:** Log into **HRConnect** (hr.company.com) → My Leave → Leave Summary.\n2. **Request Leave:** Click "New Request" → Select dates → Choose leave type → Submit.\n3. **Approval:** Your manager receives an email and must approve within **2 business days**.\n\n📅 **Leave Policy Highlights:**\n• Annual Leave: 20 days/year (pro-rated for new joiners)\n• Sick Leave: 12 days/year (no carry-over)\n• Carry-over: Max 5 days to next year\n\n❓ Questions? Contact your HR Business Partner at **hr@company.com**.`
    },
    "payroll": {
      keywords: ["salary","payroll","payslip","pay","compensation","bonus","deduction","tax","w2","paycheck","reimbursement","expense"],
      response: `**Payroll & Compensation**\n\nFor payroll-related queries:\n\n• **Payslips:** Available by the **25th of each month** in HRConnect → Payroll → My Payslips.\n• **Salary queries:** Contact Payroll at **payroll@company.com** — include your employee ID.\n• **Expense reimbursement:** Submit receipts via **Concur** at expenses.company.com within **30 days** of the expense.\n• **Tax documents (W-2/W-4):** Available in HRConnect → Documents by Jan 31st each year.\n\n💰 Payroll cutoff: **15th of each month**.`
    },
    "benefits": {
      keywords: ["benefits","insurance","health","dental","vision","401k","retirement","pension","medical","coverage","enrollment","open enrollment"],
      response: `**Benefits & Enrollment**\n\nYour benefits information:\n\n• **Health Insurance:** Choose from 3 plans (Basic, Enhanced, Premium) via **BenefitsConnect** at benefits.company.com.\n• **Open Enrollment:** Typically runs each **November** for the following year.\n• **401(k):** Company matches up to **4% of your salary**. Enroll via Fidelity NetBenefits.\n• **Life Events:** Marriage, birth, adoption? You have **30 days** to update coverage in BenefitsConnect.\n\n📞 Benefits Hotline: **1-800-555-BENE** | Email: **benefits@company.com**`
    },
    "onboarding": {
      keywords: ["onboarding","new hire","joining","first day","orientation","offer letter","start date","background check","paperwork","welcome"],
      response: `**New Employee Onboarding**\n\nWelcome! Here's your onboarding checklist:\n\n✅ **Before Day 1:**\n• Complete e-signing of offer letter & contracts in **DocuSign**.\n• Submit ID documents to hr@company.com.\n• Complete background check via **HireRight** (link emailed to you).\n\n✅ **Day 1:**\n• Attend New Employee Orientation at 9am in Conference Room A.\n• Collect your laptop from IT (Building B, Floor 2).\n• Meet your assigned onboarding buddy.\n\nNeed help? Email: **onboarding@company.com**`
    },
    "performance": {
      keywords: ["performance","review","appraisal","evaluation","feedback","kpi","goal","objective","rating","promotion"],
      response: `**Performance Reviews & Goals**\n\nOur performance cycle:\n\n• **Mid-Year Check-in:** June/July — self-assessment + manager feedback in **Workday**.\n• **Annual Review:** January — full appraisal with ratings and compensation review.\n• **Goal Setting:** Set SMART goals in Workday by **February 1st** each year.\n\nTo access your review: Login to **Workday** → Performance → My Reviews.\n\n📊 Questions about your rating or promotion path? Book a session with your HR Business Partner via hr.company.com/book.`
    },
    "default": {
      keywords: [],
      response: `**HR Support – Request Received**\n\nThank you for contacting HR. Your request has been logged and will be handled by our team.\n\nFor urgent matters:\n• 📞 HR Direct Line: **ext. 5200** (Mon–Fri, 8:30am–5pm)\n• 📧 Email: **hr@company.com**\n• 🔗 HR Portal: **hr.company.com**\n\nWe aim to respond within **1 business day**.`
    }
  },
  general: {
    "office": {
      keywords: ["office","building","parking","desk","floor","facilities","badge","access card","visitor","reception","cafeteria","gym","pantry"],
      response: `**Office & Facilities Information**\n\n🏢 **Office Locations:**\n• HQ: 123 Innovation Drive, Suite 500\n• East Wing: 456 Tech Blvd\n\n🅿️ **Parking:** Corporate garage on Level B1-B3. Register your vehicle at facilities.company.com.\n\n🔑 **Access Cards:** Collect from Reception (Lobby) with your employee ID. Report lost cards to Security at **security@company.com** immediately.\n\n☕ **Cafeteria:** Open Mon–Fri, 7am–3pm. Cashless payment via your company ID card.\n\n🏋️ **Gym:** B2 level, open 6am–9pm. Register at facilities.company.com/gym.`
    },
    "policy": {
      keywords: ["policy","handbook","rule","guideline","procedure","compliance","code of conduct","remote work","wfh policy","dress code"],
      response: `**Company Policies & Handbook**\n\nAll company policies are available in the **Employee Handbook** at:\n👉 intranet.company.com/handbook\n\n**Key Policies:**\n• **Remote Work:** Up to 2 days/week WFH with manager approval.\n• **Dress Code:** Business casual Mon–Thu; Casual Friday.\n• **IT Security:** All company data must stay on approved devices.\n• **Code of Conduct:** Zero tolerance for harassment or discrimination.\n\nFor policy questions or exceptions, contact **compliance@company.com**.`
    },
    "travel": {
      keywords: ["travel","trip","flight","hotel","accommodation","business travel","expense","reimbursement","booking","conference"],
      response: `**Business Travel**\n\nFor company travel:\n\n1. **Book via Concur:** All flights & hotels must be booked through **Concur Travel** at travel.company.com for automatic expense integration.\n2. **Pre-approval:** Trips over $500 require manager approval before booking.\n3. **Per Diem:** $75/day for meals when traveling domestically.\n4. **Reimbursement:** Submit expense reports within **30 days** of returning.\n\n✈️ Travel Support: **travel@company.com** | 24/7 Concur Help: **1-800-555-TRIP**`
    },
    "default": {
      keywords: [],
      response: `**SmartDesk AI – General Inquiry**\n\nThank you for your message! Your request has been received and our team will help you shortly.\n\n🔍 **Self-Service Resources:**\n• Employee Intranet: **intranet.company.com**\n• IT Help Portal: **portal.company.com**\n• HR Portal: **hr.company.com**\n• Search the knowledge base: **kb.company.com**\n\nIf you need immediate assistance, please call the main helpdesk at **ext. 1000**.`
    }
  }
};

// ── Intent Classification Engine ───────────────────────────────
const INTENT_PATTERNS = {
  it: {
    weight: 1,
    keywords: [
      "password","reset","login","log in","can't access","cannot access","locked","vpn",
      "software","install","computer","laptop","pc","monitor","printer","network","wifi",
      "internet","email","outlook","mfa","2fa","authenticator","otp","it","tech","device",
      "system","windows","mac","update","crash","error","bug","slow","not working","broken",
      "account","permission","admin","access denied","drive","storage","backup"
    ]
  },
  hr: {
    weight: 1,
    keywords: [
      "leave","vacation","pto","sick","holiday","time off","absence","salary","payroll",
      "payslip","pay","benefits","insurance","health","dental","401k","retirement","pension",
      "onboarding","new hire","joining","offer","performance","review","appraisal","feedback",
      "hr","human resources","policy","handbook","contract","termination","resignation","bonus",
      "compensation","reimbursement","expense","promotion","raise","increment","maternity","paternity"
    ]
  },
  general: {
    weight: 0.6,
    keywords: [
      "office","building","parking","cafeteria","gym","facilities","badge","visitor",
      "travel","trip","flight","hotel","booking","conference","policy","guideline",
      "question","help","support","information","how do","what is","where is","who is",
      "general","inquiry","procedure","process"
    ]
  }
};

function classifyIntent(text) {
  const lower = text.toLowerCase();
  const scores = { it: 0, hr: 0, general: 0 };

  for (const [category, data] of Object.entries(INTENT_PATTERNS)) {
    for (const kw of data.keywords) {
      if (lower.includes(kw)) {
        scores[category] += data.weight;
      }
    }
  }

  // Find best category
  let best = 'general';
  let bestScore = 0;
  for (const [cat, score] of Object.entries(scores)) {
    if (score > bestScore) { bestScore = score; best = cat; }
  }

  // Compute confidence
  const total = Object.values(scores).reduce((a, b) => a + b, 0) || 1;
  const confidence = Math.min(0.99, Math.max(0.62, bestScore / total + 0.15));

  return { category: best, scores, confidence };
}

function findBestKBEntry(category, text) {
  const lower = text.toLowerCase();
  const entries = KB[category];
  let bestEntry = null;
  let bestMatches = 0;

  for (const [key, entry] of Object.entries(entries)) {
    if (key === 'default') continue;
    let matches = 0;
    for (const kw of entry.keywords) {
      if (lower.includes(kw)) matches++;
    }
    if (matches > bestMatches) { bestMatches = matches; bestEntry = entry; }
  }

  return bestEntry || entries.default;
}

function generateUrgency(text) {
  const urgent = ["urgent","asap","emergency","critical","immediately","cannot work","blocked","meeting","deadline","boss","manager"];
  const lower = text.toLowerCase();
  return urgent.some(u => lower.includes(u)) ? "High" : (text.length > 80 ? "Medium" : "Low");
}

// ── State ──────────────────────────────────────────────────────
let tickets = [];
let ticketId = 1;
const SAMPLES = [
  "I forgot my password and can't log into my computer. Please help me reset it ASAP.",
  "I'm unable to log in to the company portal. It keeps saying my account is locked.",
  "Can you tell me my remaining leave balance for this year? I want to plan my vacation.",
  "I'm working from home and can't connect to the company VPN. It keeps timing out."
];

function loadSample(idx) {
  document.getElementById('ticket-input').value = SAMPLES[idx];
  document.getElementById('ticket-input').focus();
}

// ── Submit Ticket ──────────────────────────────────────────────
async function submitTicket() {
  const input = document.getElementById('ticket-input');
  const text = input.value.trim();
  if (!text) {
    input.focus();
    input.style.borderColor = 'var(--red)';
    input.style.boxShadow = '0 0 0 3px rgba(248,113,113,0.2)';
    setTimeout(() => {
      input.style.borderColor = '';
      input.style.boxShadow = '';
    }, 1500);
    return;
  }

  showOverlay();
  await sleep(600);

  // Step 1: NLP
  activateProcStep(1);
  await sleep(700);

  const intent = classifyIntent(text);

  // Step 2: Route
  completeProcStep(1);
  activateProcStep(2);
  await sleep(600);

  const urgency = generateUrgency(text);

  // Step 3: Generate
  completeProcStep(2);
  activateProcStep(3);
  await sleep(800);

  const kbEntry = findBestKBEntry(intent.category, text);
  const response = kbEntry.response;

  completeProcStep(3);
  await sleep(400);

  hideOverlay();

  // Create ticket
  const ticket = {
    id: ticketId++,
    text,
    category: intent.category,
    confidence: intent.confidence,
    urgency,
    response,
    timestamp: new Date()
  };
  tickets.push(ticket);
  addTicketCard(ticket);
  updateStats();

  input.value = '';
  resetProcSteps();
}

// ── Overlay helpers ────────────────────────────────────────────
function showOverlay() {
  document.getElementById('overlay').classList.add('active');
}
function hideOverlay() {
  document.getElementById('overlay').classList.remove('active');
}
function activateProcStep(n) {
  const el = document.getElementById(`proc-${n}`);
  el.classList.remove('proc-step-dim');
  el.querySelector('.proc-dot').classList.add('proc-dot-active');
}
function completeProcStep(n) {
  const dot = document.getElementById(`proc-${n}`).querySelector('.proc-dot');
  dot.classList.remove('proc-dot-active');
  dot.classList.add('proc-dot-done');
}
function resetProcSteps() {
  for (let i = 1; i <= 3; i++) {
    const el = document.getElementById(`proc-${i}`);
    if (i > 1) el.classList.add('proc-step-dim');
    const dot = el.querySelector('.proc-dot');
    dot.classList.remove('proc-dot-active', 'proc-dot-done');
    if (i === 1) dot.classList.add('proc-dot-active');
  }
}

// ── Ticket Card ────────────────────────────────────────────────
const CAT_META = {
  it:      { label: '🔐 IT · Auth',        cls: 'tag-it',      fill: 'fill-it',      col: 'it' },
  hr:      { label: '🏢 HR · Benefits',    cls: 'tag-hr',      fill: 'fill-hr',      col: 'hr' },
  general: { label: '💬 General',          cls: 'tag-general', fill: 'fill-general', col: 'general' }
};

function addTicketCard(ticket) {
  const meta = CAT_META[ticket.category];
  const listEl = document.getElementById(`list-${meta.col}`);
  const emptyEl = document.getElementById(`empty-${meta.col}`);
  const badgeEl = document.getElementById(`badge-${meta.col}`);

  emptyEl.classList.add('hidden');

  const pct = Math.round(ticket.confidence * 100);
  const card = document.createElement('div');
  card.className = `ticket-card cat-${ticket.category}`;
  card.dataset.id = ticket.id;
  card.onclick = () => openModal(ticket);
  card.innerHTML = `
    <div class="card-number">#${String(ticket.id).padStart(4,'0')} · ${formatTime(ticket.timestamp)}</div>
    <div class="card-text">${escHtml(ticket.text)}</div>
    <div class="card-meta">
      <span class="card-tag ${meta.cls}">${meta.label}</span>
      <span class="card-tag" style="background:rgba(255,255,255,0.07);color:var(--text-muted)">⚡ ${ticket.urgency}</span>
      <div class="card-confidence">
        <div class="confidence-bar"><div class="confidence-fill ${meta.fill}" style="width:${pct}%"></div></div>
        <span class="confidence-pct">${pct}%</span>
      </div>
    </div>`;

  listEl.prepend(card);

  // Update badge
  const count = listEl.querySelectorAll('.ticket-card').length;
  badgeEl.textContent = `${count} ticket${count !== 1 ? 's' : ''}`;
}

function updateStats() {
  const counter = document.getElementById('ticket-counter');
  const total = tickets.length;
  counter.textContent = `${total} ticket${total !== 1 ? 's' : ''}`;

  if (total === 0) return;

  const statsBar = document.getElementById('stats-bar');
  statsBar.style.display = 'flex';

  document.getElementById('stat-resolved').textContent = total;
  const routed = tickets.filter(t => t.urgency === 'High').length;
  document.getElementById('stat-routed').textContent = routed;

  const avgMs = (Math.random() * 400 + 200).toFixed(0);
  document.getElementById('stat-avg').textContent = `~${avgMs}ms`;
}

function clearAll() {
  tickets = [];
  ticketId = 1;
  ['it','hr','general'].forEach(cat => {
    document.getElementById(`list-${cat}`).innerHTML = '';
    document.getElementById(`empty-${cat}`).classList.remove('hidden');
    document.getElementById(`badge-${cat}`).textContent = '0 tickets';
  });
  document.getElementById('ticket-counter').textContent = '0 tickets';
  document.getElementById('stats-bar').style.display = 'none';
}

// ── Modal ──────────────────────────────────────────────────────
function openModal(ticket) {
  const meta = CAT_META[ticket.category];
  const tagEl = document.getElementById('modal-category-tag');
  tagEl.textContent = meta.label;
  tagEl.className = `modal-category-tag ${meta.cls}`;

  document.getElementById('modal-title').textContent = `Ticket #${String(ticket.id).padStart(4,'0')}`;
  document.getElementById('modal-ticket-text').textContent = ticket.text;

  const pct = Math.round(ticket.confidence * 100);
  document.getElementById('modal-meta').innerHTML = `
    <div class="meta-chip"><span class="label">Category</span>&nbsp;<span class="val">${meta.label}</span></div>
    <div class="meta-chip"><span class="label">Confidence</span>&nbsp;<span class="val">${pct}%</span></div>
    <div class="meta-chip"><span class="label">Urgency</span>&nbsp;<span class="val">${ticket.urgency}</span></div>
    <div class="meta-chip"><span class="label">Time</span>&nbsp;<span class="val">${formatTime(ticket.timestamp)}</span></div>`;

  document.getElementById('modal-response').textContent = ticket.response;

  document.getElementById('modal-backdrop').classList.add('active');
  document.getElementById('modal').classList.add('active');
}
function closeModal() {
  document.getElementById('modal-backdrop').classList.remove('active');
  document.getElementById('modal').classList.remove('active');
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeModal(); closeChatPanel(); } });

// ── Utilities ──────────────────────────────────────────────────
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function escHtml(s) { return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function formatTime(d) { return d.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}); }

// ================================================================
//  AI CHAT ASSISTANT  —  Conversational Problem Solver
// ================================================================

const CHAT_KB = {
  greetings: {
    patterns: [/^(hi|hello|hey|good\s*(morning|afternoon|evening)|what'?s up|howdy)/i],
    responses: [
      "Hello! 👋 I'm **SmartDesk AI**, your intelligent support assistant. How can I help you today?",
      "Hi there! 😊 I'm here to help solve your IT, HR, or general workplace queries. What's on your mind?",
      "Hey! Welcome to SmartDesk AI. I can help with password resets, leave requests, benefits, and much more. What do you need?"
    ]
  },
  thanks: {
    patterns: [/thank|thanks|ty|appreciated|great help|helpful/i],
    responses: [
      "You're welcome! 🎉 Is there anything else I can help you with?",
      "Happy to help! Let me know if you have any other questions.",
      "Glad that was useful! Feel free to ask anything else anytime. 😊"
    ]
  },
  bye: {
    patterns: [/^(bye|goodbye|see you|take care|cya|later)/i],
    responses: [
      "Goodbye! 👋 Have a great day! Don't hesitate to come back if you need anything.",
      "Take care! SmartDesk AI is always here when you need help. 🤖",
      "See you later! Remember, IT support is also available at ext. 4357 for urgent issues."
    ]
  }
};

const CHAT_CONTEXT = {
  history: [],
  currentCategory: null,
  followUpCount: 0
};

function generateChatResponse(userMsg) {
  const lower = userMsg.toLowerCase();

  // Check greeting/thanks/bye patterns
  for (const [type, data] of Object.entries(CHAT_KB)) {
    if (data.patterns.some(p => p.test(lower))) {
      const arr = data.responses;
      return { text: arr[Math.floor(Math.random() * arr.length)], isMarkdown: true };
    }
  }

  // Classify intent
  const intent = classifyIntent(userMsg);
  const kbEntry = findBestKBEntry(intent.category, userMsg);
  const urgency = generateUrgency(userMsg);

  CHAT_CONTEXT.currentCategory = intent.category;

  // Generate conversational prefix
  const prefixes = {
    it: ["I can help you with that IT issue! 🔧", "Let me pull up the tech support info for you! 💻", "Got it — here's what you need for this IT matter:"],
    hr: ["I can assist with your HR query! 🏢", "Here's the HR information you need:", "Let me help you with that HR matter! 📋"],
    general: ["Happy to help! Here's what I found:", "Great question! Here's the information:", "I can help with that! Here's what you need to know:"]
  };

  const pfxArr = prefixes[intent.category] || prefixes.general;
  const prefix = pfxArr[Math.floor(Math.random() * pfxArr.length)];

  const confidence = Math.round(intent.confidence * 100);
  const footer = `\n\n---\n🤖 *AI Confidence: ${confidence}% · Category: ${CAT_META[intent.category].label} · Urgency: ${urgency}*`;

  return {
    text: `${prefix}\n\n${kbEntry.response}${footer}`,
    isMarkdown: true,
    category: intent.category,
    confidence
  };
}

// ── Chat UI ────────────────────────────────────────────────────
let chatOpen = false;
let isTyping = false;

function toggleChat() {
  chatOpen = !chatOpen;
  const panel = document.getElementById('chat-panel');
  const fab = document.getElementById('chat-fab');
  if (chatOpen) {
    panel.classList.add('active');
    fab.classList.add('chat-open');
    // Show welcome message if first time
    const msgs = document.getElementById('chat-messages');
    if (msgs.children.length === 0) {
      setTimeout(() => addChatMessage('bot', "👋 Hello! I'm **SmartDesk AI**, your intelligent problem-solving assistant.\n\nI can help you with:\n• 🔐 **IT issues** — passwords, VPN, software, email\n• 🏢 **HR queries** — leave, payroll, benefits, onboarding\n• 💬 **General info** — office, policies, travel\n\nJust describe your problem and I'll solve it!"), 300);
    }
    setTimeout(() => document.getElementById('chat-input').focus(), 350);
  } else {
    panel.classList.remove('active');
    fab.classList.remove('chat-open');
  }
}

function closeChatPanel() {
  chatOpen = false;
  document.getElementById('chat-panel').classList.remove('active');
  document.getElementById('chat-fab').classList.remove('chat-open');
}

function addChatMessage(role, text, meta) {
  const msgs = document.getElementById('chat-messages');
  const div = document.createElement('div');
  div.className = `chat-msg chat-msg-${role}`;

  const bubble = document.createElement('div');
  bubble.className = `chat-bubble chat-bubble-${role}`;
  bubble.innerHTML = renderMarkdown(text);

  if (meta) {
    const metaDiv = document.createElement('div');
    metaDiv.className = 'chat-meta-tag';
    metaDiv.innerHTML = `${CAT_META[meta.category]?.label || ''} · ${meta.confidence}% confidence`;
    bubble.appendChild(metaDiv);
  }

  div.appendChild(bubble);
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function showTypingIndicator() {
  const msgs = document.getElementById('chat-messages');
  const div = document.createElement('div');
  div.className = 'chat-msg chat-msg-bot';
  div.id = 'typing-indicator';
  div.innerHTML = `<div class="chat-bubble chat-bubble-bot typing-bubble">
    <span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>
  </div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function removeTypingIndicator() {
  const el = document.getElementById('typing-indicator');
  if (el) el.remove();
}

async function sendChatMessage() {
  if (isTyping) return;
  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  if (!text) return;

  input.value = '';
  input.style.height = 'auto';
  addChatMessage('user', text);

  isTyping = true;
  showTypingIndicator();

  // Simulate AI thinking time
  const thinkTime = 800 + Math.random() * 700;
  await sleep(thinkTime);

  removeTypingIndicator();
  const result = generateChatResponse(text);
  addChatMessage('bot', result.text, result.category ? { category: result.category, confidence: result.confidence } : null);

  isTyping = false;
}

// ── Inject suggestion into chat and send ──────────────────────
function injectSuggestion(text) {
  const input = document.getElementById('chat-input');
  input.value = text;
  sendChatMessage();
}

// Handle Enter key in chat input
document.addEventListener('DOMContentLoaded', () => {
  const chatInput = document.getElementById('chat-input');
  if (chatInput) {
    chatInput.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendChatMessage();
      }
    });
    // Auto resize
    chatInput.addEventListener('input', () => {
      chatInput.style.height = 'auto';
      chatInput.style.height = Math.min(chatInput.scrollHeight, 120) + 'px';
    });
  }
});

// ── Simple Markdown Renderer ───────────────────────────────────
function renderMarkdown(text) {
  return text
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/^---$/gm, '<hr style="border-color:rgba(255,255,255,0.1);margin:8px 0">')
    .replace(/^• (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
    .replace(/\n/g, '<br>');
}
