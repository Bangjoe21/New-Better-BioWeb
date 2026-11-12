/* ══════════════════════════════════════════════════════
   main.js  — Interaksi Website Bio Data + EmailJS
══════════════════════════════════════════════════════ */

// ══════════════════════════════════════════════════════
// EMAILJS CONFIGURATION
// Ganti nilai berikut dengan credential dari akun EmailJS kamu:
// 1. PUBLIC KEY  : Akun EmailJS > Account > API Keys > Public Key
// 2. SERVICE ID  : Email Services > Service ID (contoh: 'service_xxxxxxx')
// 3. TEMPLATE ID : Email Templates > Template ID (contoh: 'template_xxxxxxx')
// ══════════════════════════════════════════════════════
const EMAILJS_CONFIG = {
  publicKey: "pkOvCzCLGhaRxy_uH",
  serviceId: "service_k5ucsnf",
  templateId: "template_moummih",
};

// Inisialisasi EmailJS jika kredensial sudah diatur
(function initEmailJS() {
  if (typeof emailjs !== "undefined" && EMAILJS_CONFIG.publicKey && EMAILJS_CONFIG.publicKey !== "YOUR_PUBLIC_KEY") {
    emailjs.init({
      publicKey: EMAILJS_CONFIG.publicKey,
    });
  }
})();

// ── Navbar scroll effect ──────────────────────────────
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ── Mobile menu toggle ────────────────────────────────
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.navbar__links');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const icon = navToggle.querySelector('i');
  icon.classList.toggle('fa-bars');
  icon.classList.toggle('fa-xmark');
});

// Close mobile menu when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    const icon = navToggle.querySelector('i');
    icon.classList.add('fa-bars');
    icon.classList.remove('fa-xmark');
  });
});

// ── Active nav link on scroll ─────────────────────────
const sections = document.querySelectorAll('section[id], header[id]');
const allNavLinks = document.querySelectorAll('.navbar__links a');

const observerOptions = {
  root: null,
  threshold: 0.4,
};

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      allNavLinks.forEach(a => a.classList.remove('active'));
      const active = document.querySelector(`.navbar__links a[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, observerOptions);

sections.forEach(sec => sectionObserver.observe(sec));

// ── Animate elements on scroll (Intersection Observer) ─
function initAnimObserver() {
  const animItems = document.querySelectorAll('[data-anim]');
  const animObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('anim--visible');
        animObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  animItems.forEach(el => animObserver.observe(el));
}

// Re-run observer when new sections are added dynamically
initAnimObserver();

// ── Skills progress bar animation ────────────────────
const skillsSection = document.querySelector('.skills__cards');
if (skillsSection) {
  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.skill-card__bar-fill').forEach(bar => {
          bar.style.width = bar.style.getPropertyValue('--pct') ||
            getComputedStyle(bar).getPropertyValue('--pct');
        });
        barObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  barObserver.observe(skillsSection);
}

// ── Language progress bar animation ──────────────────
const langSection = document.querySelector('.lang__cards');
if (langSection) {
  const langObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.lang__bar-fill').forEach(bar => {
          bar.style.width = bar.style.getPropertyValue('--pct') ||
            getComputedStyle(bar).getPropertyValue('--pct');
        });
        langObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  langObserver.observe(langSection);
}

// ── Contact Form Submission (EmailJS Integration) ────
function handleSubmit(event) {
  event.preventDefault();
  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const successBox = document.getElementById('formSuccess');
  const errorBox = document.getElementById('formError');
  const errorMsg = document.getElementById('formErrorMsg');

  // Reset alert status
  if (successBox) successBox.classList.remove('show');
  if (errorBox) errorBox.classList.remove('show');

  // Tombol status loading
  const originalContent = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>Mengirim...</span>';

  // Kumpulkan data input formulir (lengkap dengan semua alias yang umum di template EmailJS)
  const templateParams = {
    name: form.name.value,
    email: form.email.value,
    subject: form.subject.value,
    message: form.message.value,
    // Alias pengirim:
    from_name: form.name.value,
    from_email: form.email.value,
    user_name: form.name.value,
    user_email: form.email.value,
    reply_to: form.email.value,
    // Alias penerima (jika di template pakai variabel to_email / to_name):
    to_name: "Naufal Syadid.A",
    to_email: "Naufalsyd21@gmail.com",
    recipient: "Naufalsyd21@gmail.com"
  };

  // Cek apakah kredensial EmailJS sudah diisi
  const isConfigured =
    typeof emailjs !== 'undefined' &&
    EMAILJS_CONFIG.publicKey &&
    EMAILJS_CONFIG.publicKey !== 'YOUR_PUBLIC_KEY';

  if (!isConfigured) {
    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalContent;
      if (errorBox) {
        if (errorMsg) errorMsg.textContent = 'EmailJS SDK belum terhubung. Periksa koneksi internet kamu.';
        errorBox.classList.add('show');
      }
    }, 500);
    return;
  }

  // Kirim data melalui EmailJS
  emailjs
    .send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, templateParams, EMAILJS_CONFIG.publicKey)
    .then((response) => {
      console.log('EmailJS Berhasil!', response.status, response.text);
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalContent;
      form.reset();

      if (successBox) {
        successBox.classList.add('show');
        setTimeout(() => successBox.classList.remove('show'), 6000);
      }
    })
    .catch((error) => {
      console.error('EmailJS Gagal:', error);
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalContent;

      if (errorBox) {
        const errorDetail = error.text || error.message || (typeof error === 'string' ? error : JSON.stringify(error));
        if (errorMsg) {
          errorMsg.textContent = 'Gagal mengirim email: ' + errorDetail;
        }
        errorBox.classList.add('show');
      }
    });
}

// Pastikan fungsi handleSubmit terdaftar secara global
window.handleSubmit = handleSubmit;

