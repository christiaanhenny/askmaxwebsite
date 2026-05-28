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
          source: document.body.dataset.pageSource || 'portavox.ai/download',
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

// ── Beta access gate ──────────────────────────────────────────────────
// Casual gate, not real security. The /beta/ page is invite-only — first
// visitors see a password card, returning visitors see the page directly
// (localStorage flag set on successful unlock, also added to <html> by
// the inline pre-paint script in beta/index.html <head> so the gate
// never flashes on returning visits). The password hash below is the
// SHA-256 of the access code given to testers. To rotate: pick a new
// code, run `echo -n "<new code>" | shasum -a 256`, paste below, and
// have testers re-enter on next visit. Existing unlocks survive a
// rotation since they're flagged in localStorage, not by hash.
//
// Anyone with the URL can technically open devtools, read the hash,
// and brute-force a weak password offline. That's fine — the actual
// download lives on a public GitHub Release URL anyway. The gate is
// "make casual visitors bounce", not "stop a motivated attacker."
const BETA_PASSWORD_HASH = 'bab374004eef4f01042356fd0bd5dc4600e38a3a9130fc14c917097416d11411';
const BETA_UNLOCK_KEY = 'portavox.beta.unlocked';

async function sha256Hex(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function isBetaUnlocked() {
  return localStorage.getItem(BETA_UNLOCK_KEY) === 'true';
}

(function setupBetaGate() {
  const gate = document.getElementById('beta-gate');
  if (!gate) return;
  if (isBetaUnlocked()) {
    // Returning visitor — pre-paint script in <head> already added the
    // unlocked class. Just fire the release fetch.
    loadLatestRelease();
    return;
  }
  const input = document.getElementById('gate-input');
  const submit = document.getElementById('gate-submit');
  const error = document.getElementById('gate-error');
  if (!input || !submit || !error) return;

  async function tryUnlock() {
    const candidate = (input.value || '').trim();
    if (!candidate) return;
    const hash = await sha256Hex(candidate);
    if (hash === BETA_PASSWORD_HASH) {
      localStorage.setItem(BETA_UNLOCK_KEY, 'true');
      document.documentElement.classList.add('beta-unlocked');
      loadLatestRelease();
    } else {
      error.textContent = "That code doesn't match. Try again or email chris@studysmart.ai for a fresh invite.";
      input.value = '';
      input.focus();
    }
  }

  submit.addEventListener('click', tryUnlock);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') tryUnlock();
  });
  // Focus a frame after first paint so the keyboard pops on mobile too.
  setTimeout(() => input.focus(), 50);
})();

// ── Latest release download CTA ───────────────────────────────────────
// Pulls the latest published release from the AskMax repo and points
// the download button at its .dmg asset. Falls back silently if the
// API call fails (button keeps its hardcoded href = releases page).
async function loadLatestRelease() {
  const section = document.getElementById('download-section');
  const cta = document.getElementById('download-cta');
  const title = document.getElementById('download-title');
  const meta = document.getElementById('download-meta');
  if (!section || !cta) return;
  try {
    const resp = await fetch('https://api.github.com/repos/christiaanhenny/AskMax/releases/latest');
    if (!resp.ok) {
      // 404 = no releases published yet. Keep section hidden.
      if (resp.status === 404) return;
      return;
    }
    const data = await resp.json();
    const dmg = (data.assets || []).find(a => a.name.toLowerCase().endsWith('.dmg'));
    if (!dmg) return;
    cta.href = dmg.browser_download_url;
    const version = data.tag_name || '';
    if (title) title.textContent = version ? `PortaVox ${version}` : 'PortaVox';
    if (meta) {
      const sizeMB = (dmg.size / 1024 / 1024).toFixed(1);
      const date = new Date(data.published_at).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'short', year: 'numeric',
      });
      meta.textContent = `${sizeMB} MB · Released ${date} · macOS 14+`;
    }
    section.classList.add('has-release');
  } catch (err) {
    // Network error — silently degrade. CTA still works (releases page).
    console.warn('Could not load latest release:', err);
  }
}
