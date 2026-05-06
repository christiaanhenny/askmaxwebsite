// ── Rotating words in the hero headline ───────────────────────────────
const VERBS = ['write', 'prompt'];
const NOUNS = [
  { text: 'emails',            color: '#ea4335' },
  { text: 'Slack messages',    color: '#4a154b' },
  { text: 'WhatsApp messages', color: '#25d366' },
  { text: 'iMessages',         color: '#0b93f6' },
  { text: 'LinkedIn comments', color: '#0a66c2' },
  { text: 'YouTube comments',  color: '#ff0000' },
];

const verbEl = document.getElementById('verb');
const nounEl = document.getElementById('noun');

let v = 0;
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
  v = (v + 1) % VERBS.length;
  fadeSwap(verbEl, () => { verbEl.textContent = VERBS[v]; });
}, 3500);

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
