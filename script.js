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
