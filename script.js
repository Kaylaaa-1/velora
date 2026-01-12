/* ===== Helpers ===== */
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));

/* ===== Nama tamu dinamis ===== */
function getGuestFromURL() {
  try {
    const q = new URLSearchParams(location.search);
    for (const key of ['nama', 'to', 'guest', 'yth']) {
      if (q.has(key) && q.get(key).trim()) return decodeURIComponent(q.get(key));
    }
    const path = location.pathname.split('/').filter(Boolean);
    if (path.length) {
      const last = path[path.length - 1];
      const ignore = ['index.html', 'assets', 'img', 'css', 'js', 'images'];
      if (!ignore.includes(last)) return decodeURIComponent(last);
    }
  } catch (e) { }
  return null;
}

function cleanGuestName(str) {
  if (!str) return 'Bapak/Ibu/Saudara/i';
  return str.replace(/\+/g, ' ').replace(/_/g, ' ').trim();
}

function updateGuest(name) {
  const cleaned = cleanGuestName(name);
  $('#guestName').textContent = cleaned;
  document.title = `Wedding - Azka & Kayla | ${cleaned}`;
  try { localStorage.setItem('guestName', cleaned); } catch (e) { }
}

/* ===== Countdown ===== */
function startCountdown(targetDate) {
  const t = new Date(targetDate);

  function tick() {
    const now = new Date();
    let diff = Math.max(0, Math.floor((t - now) / 1000));

    const days = Math.floor(diff / 86400); diff %= 86400;
    const hours = Math.floor(diff / 3600); diff %= 3600;
    const mins = Math.floor(diff / 60);
    const secs = diff % 60;

    $('#cd-days').textContent = days;
    $('#cd-hours').textContent = String(hours).padStart(2, '0');
    $('#cd-mins').textContent = String(mins).padStart(2, '0');
    $('#cd-secs').textContent = String(secs).padStart(2, '0');
  }
  tick();
  setInterval(tick, 1000);
}

/* ===== Bottom Navigation (horizontal scrollable) ===== */
$$('.bottom-nav .nav-item').forEach(btn => {
  btn.addEventListener('click', () => {
    $$('.bottom-nav .nav-item').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const target = btn.dataset.target;
    const el = document.getElementById(target);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Auto geser nav agar tombol aktif berada di tengah
    btn.scrollIntoView({ behavior: "smooth", inline: "center" });
  });
});

/* ===== Lightbox Galeri ===== */
$$('.g-item').forEach(img => {
  img.addEventListener('click', () => {
    $('#lbImg').src = img.dataset.full || img.src;
    $('#lightbox').style.display = 'flex';
  });
});

$('#lbClose')?.addEventListener('click', () => {
  $('#lightbox').style.display = 'none';
});

$('#lightbox')?.addEventListener('click', e => {
  if (e.target === $('#lightbox')) {
    $('#lightbox').style.display = 'none';
  }
});

/* ===== Musik ===== */
const music = $('#bgMusic');
const musicBtn = $('#musicBtn');
let musicPlaying = false;

function setMusic(state) {
  musicPlaying = state;
  if (state) {
    music.play().catch(() => { });
    musicBtn.classList.add('playing');
  } else {
    music.pause();
    musicBtn.classList.remove('playing');
  }
}

musicBtn?.addEventListener('click', () => setMusic(!musicPlaying));

/* ===== Share Button ===== */
$('#shareBtn')?.addEventListener('click', () => {
  const guest = localStorage.getItem('guestName') || $('#guestName').textContent || '';
  const slug = encodeURIComponent(guest.replace(/\s+/g, '-'));
  const url = `${location.origin}/${slug}`;

  if (navigator.share) {
    navigator.share({
      title: 'Undangan Pernikahan',
      text: 'Undangan pernikahan Azka & Kayla',
      url
    }).catch(() => { });
  } else {
    window.open(`https://wa.me/?text=${encodeURIComponent('Undangan: ' + url)}`, '_blank');
  }
});

/* ===== Tombol Buka Undangan ===== */
$('#openBtn')?.addEventListener('click', () => {
  $('#cover').style.display = 'none';
  $('#main').classList.remove('hidden');
  setMusic(true);
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ===== Highlight menu saat scroll ===== */
document.addEventListener('scroll', () => {
  const scrollY = window.scrollY + 130;
  const sections = ['home', 'quotes', 'couple', 'akad', 'resepsi'];

  for (const id of sections) {
    const el = document.getElementById(id);
    if (!el) continue;

    const top = el.offsetTop;
    const height = el.offsetHeight;
    const btn = document.querySelector(`.nav-item[data-target="${id}"]`);

    if (scrollY >= top && scrollY < top + height) {
      btn?.classList.add('active');
    } else {
      btn?.classList.remove('active');
    }
  }
});

/* ===== INIT ===== */
document.addEventListener('DOMContentLoaded', () => {
  const fromURL = getGuestFromURL() || localStorage.getItem('guestName') || null;
  updateGuest(fromURL);

  const cd = $('#countdown');
  const target = cd?.dataset?.target || "2029-10-13T09:00:00+07:00";
  startCountdown(target);
});

const showGiftBtn = document.getElementById("showGiftBtn");
const giftBox = document.getElementById("giftBox");

// Tombol tampilkan/hidden gift box
showGiftBtn.addEventListener("click", () => {
  giftBox.classList.toggle("hidden");
});

// Ambil semua tombol copy dan rekening
const copyButtons = document.querySelectorAll(".copy-btn");

copyButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const rekening = btn.parentElement.querySelector(".rekeningNumber").innerText;
    navigator.clipboard.writeText(rekening);

    btn.innerHTML = '<i class="fa-solid fa-check"></i> Disalin!';
    setTimeout(() => {
      btn.innerHTML = '<i class="fa-solid fa-copy"></i> Salin Nomor';
    }, 2000);
  });
});
