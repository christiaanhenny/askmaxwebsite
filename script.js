// ── Hero rotating noun ────────────────────────────────────────────────
// Cycles through the surfaces PortaVox covers, each in its platform colour.
const NOUNS = [
  { text: 'Emails',            color: '#ea4335' },
  { text: 'WhatsApp messages', color: '#25d366' },
  { text: 'Slack messages',    color: '#4a154b' },
  { text: 'iMessages',         color: '#0b93f6' },
  { text: 'LinkedIn posts',    color: '#0a66c2' },
  { text: 'YouTube comments',  color: '#ff0000' },
];

const nounEl = document.getElementById('noun');
if (nounEl) {
  let n = 0;
  nounEl.style.color = NOUNS[0].color;
  const fadeSwap = (el, applyChange) => {
    el.classList.add('fading');
    setTimeout(() => {
      applyChange();
      el.classList.remove('fading');
    }, 350);
  };
  setInterval(() => {
    n = (n + 1) % NOUNS.length;
    fadeSwap(nounEl, () => {
      nounEl.textContent = NOUNS[n].text;
      nounEl.style.color = NOUNS[n].color;
    });
  }, 4400);
}

// ── Beta signup ───────────────────────────────────────────────────────
// Posts directly to Supabase (table `beta_signups`, anon-insert RLS policy).
// The anon key is safe to ship in the client — RLS prevents reads.
const SUPABASE_URL = 'https://sqcyyrmfvvfzsahnplbv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNxY3l5cm1mdnZmenNhaG5wbGJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczNTgxMjEsImV4cCI6MjA5MjkzNDEyMX0.rglg5uNyGmZXITculZHo_oU8XcqFryrtBbr3A_yY2Uw';

const form = document.getElementById('beta-form');
const note = document.getElementById('form-note');
if (form) {
  const button = form.querySelector('button');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = form.email.value.trim();
    if (!email) return;

    button.disabled = true;
    const originalLabel = button.textContent;
    button.textContent = 'Sending…';
    note.hidden = true;

    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/beta_signups`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({
          email,
          user_agent: navigator.userAgent,
          source: 'portavox.ai/download',
        }),
      });

      if (res.ok || res.status === 409) {
        form.innerHTML = '<p class="form-success">You\'re on the list. We\'ll be in touch soon.</p>';
      } else {
        throw new Error(`HTTP ${res.status}`);
      }
    } catch (err) {
      button.disabled = false;
      button.textContent = originalLabel;
      note.hidden = false;
      note.textContent = 'Something went wrong. Try again or email chris@studysmart.ai.';
    }
  });
}
