// ── Hero animations ───────────────────────────────────────────────────
// "write" gets struck through, then "prompt" fades in beside it (one-shot
// on load — we want the conceptual swap to land, not loop).
const verbOld = document.getElementById('verb-old');
const verbNew = document.getElementById('verb-new');

setTimeout(() => verbOld.classList.add('struck'),  1500);
setTimeout(() => verbNew.classList.add('shown'),   2050);

// The platform noun keeps rotating — emails / Slack / WhatsApp / etc,
// each in its brand colour, so the multi-platform pitch reads visually.
const NOUNS = [
  { text: 'emails',            color: '#ea4335' },
  { text: 'Slack messages',    color: '#4a154b' },
  { text: 'WhatsApp messages', color: '#25d366' },
  { text: 'iMessages',         color: '#0b93f6' },
  { text: 'LinkedIn comments', color: '#0a66c2' },
  { text: 'YouTube comments',  color: '#ff0000' },
];

const nounEl = document.getElementById('noun');
let n = 0;
nounEl.style.color = NOUNS[0].color;

function fadeSwap(el, applyChange) {
  el.classList.add('fading');
  setTimeout(() => {
    applyChange();
    el.classList.remove('fading');
  }, 350);
}

setInterval(() => {
  n = (n + 1) % NOUNS.length;
  fadeSwap(nounEl, () => {
    nounEl.textContent = NOUNS[n].text;
    nounEl.style.color = NOUNS[n].color;
  });
}, 2200);

// ── Beta signup ───────────────────────────────────────────────────────
// No backend yet — open the user's mail client with a pre-filled message.
const form = document.getElementById('beta-form');
const note = document.getElementById('form-note');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = form.email.value.trim();
  if (!email) return;
  const subject = encodeURIComponent('Portavox private beta — sign me up');
  const body    = encodeURIComponent(`Please add me to the Portavox private beta.\n\nEmail: ${email}\n`);
  note.hidden = false;
  window.location.href = `mailto:chris@studysmart.ai?subject=${subject}&body=${body}`;
});
