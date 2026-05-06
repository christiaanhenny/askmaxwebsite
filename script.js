// ── Hero rotating noun ────────────────────────────────────────────────
// "Stop writing <X>." — X cycles through platforms in their brand colour
// so the multi-platform pitch reads visually.
const NOUNS = [
  { text: 'emails',            color: '#ea4335' },
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
  }, 2200);
}

// ── Tabs (Real examples) ──────────────────────────────────────────────
// Click or arrow-key to switch. On mobile (< 600px) tabs are hidden via
// CSS and all panels render as a stack — no JS needed for that path.
const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
const panels = tabs.map(t => document.getElementById(t.getAttribute('aria-controls')));

function activateTab(idx) {
  tabs.forEach((t, i) => {
    const active = i === idx;
    t.setAttribute('aria-selected', active ? 'true' : 'false');
    t.tabIndex = active ? 0 : -1;
    panels[i].hidden = !active;
  });
  tabs[idx].focus();
}

tabs.forEach((tab, idx) => {
  tab.addEventListener('click', () => activateTab(idx));
  tab.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      activateTab((idx + 1) % tabs.length);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      activateTab((idx - 1 + tabs.length) % tabs.length);
    } else if (e.key === 'Home') {
      e.preventDefault();
      activateTab(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      activateTab(tabs.length - 1);
    }
  });
});

// ── Beta signup ───────────────────────────────────────────────────────
// No backend yet — open the user's mail client with a pre-filled message.
const form = document.getElementById('beta-form');
const note = document.getElementById('form-note');

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = form.email.value.trim();
    if (!email) return;
    const subject = encodeURIComponent('PortaVox private beta — sign me up');
    const body    = encodeURIComponent(`Please add me to the PortaVox private beta.\n\nEmail: ${email}\n`);
    note.hidden = false;
    window.location.href = `mailto:chris@studysmart.ai?subject=${subject}&body=${body}`;
  });
}
