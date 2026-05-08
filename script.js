// ── Hero rotating noun ────────────────────────────────────────────────
// "Stop writing <X>." — X cycles through platforms in their brand colour.
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
