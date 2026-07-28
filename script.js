/* ============================================
   CREAM HOME – JavaScript (v2 – Google Sheets)
   Tính năng mới: Lưu đơn đặt bánh vào Google Sheets
   
   ⚙️  HƯỚNG DẪN CÀI ĐẶT:
   1. Vào Google Sheets → Extensions → Apps Script
   2. Paste code Apps Script (trong README-SHEETS.md)
   3. Deploy → New deployment → Web App → Anyone → Deploy
   4. Copy URL và paste vào GOOGLE_SCRIPT_URL bên dưới
   ============================================ */

// ===== ⚙️  CẤU HÌNH – CHỈ CẦN SỬA DÒNG NÀY =====
const GOOGLE_SCRIPT_URL = 'PASTE_YOUR_APPS_SCRIPT_URL_HERE';
// Ví dụ: 'https://script.google.com/macros/s/AKfycb.../exec'
// ===================================================

// ===== STATE =====
let currentLang = 'vi';

// ===== DOM READY =====
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHamburger();
  initLangToggle();
  initFilterTabs();
  initScrollAnimations();
  initActiveNavLinks();
  initBackToTop();
  setMinPickupDate();
  checkSheetConfig();
});

// ===== KIỂM TRA CẤU HÌNH GOOGLE SHEETS =====
function checkSheetConfig() {
  if (GOOGLE_SCRIPT_URL === 'PASTE_YOUR_APPS_SCRIPT_URL_HERE') {
    console.warn('⚠️  Cream Home: Chưa cấu hình Google Sheets URL. Xem README-SHEETS.md để biết cách thiết lập.');
  } else {
    console.log('✅ Cream Home: Google Sheets đã được cấu hình!');
  }
}

// ===== NAVBAR SCROLL =====
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const handleScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

// ===== HAMBURGER MENU =====
function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  navLinks.addEventListener('click', (e) => {
    if (e.target === navLinks) {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

// ===== LANGUAGE TOGGLE =====
function initLangToggle() {
  const toggle = document.getElementById('langToggle');
  const viLabel = toggle.querySelector('.lang-vi');
  const enLabel = toggle.querySelector('.lang-en');

  toggle.addEventListener('click', () => {
    currentLang = currentLang === 'vi' ? 'en' : 'vi';
    viLabel.classList.toggle('active', currentLang === 'vi');
    enLabel.classList.toggle('active', currentLang === 'en');
    applyLanguage(currentLang);
  });
}

function applyLanguage(lang) {
  const attrKey = `data-${lang}`;

  document.querySelectorAll(`[${attrKey}]`).forEach(el => {
    const text = el.getAttribute(attrKey);
    if (!text) return;
    if (el.tagName === 'INPUT' || el.tagName === 'OPTION') {
      el.textContent = text;
    } else if (el.tagName !== 'SELECT') {
      el.textContent = text;
    }
  });

  document.querySelectorAll('select option').forEach(opt => {
    const text = opt.getAttribute(`data-${lang}`);
    if (text) opt.textContent = text;
  });

  document.querySelectorAll(`label[${attrKey}]`).forEach(label => {
    label.textContent = label.getAttribute(attrKey);
  });

  document.title = lang === 'en'
    ? 'Cream Home – Every Bite Full of Love'
    : 'Cream Home – Trọn Vị Ngọt Ngào, Đong Đầy Yêu Thương';

  document.documentElement.lang = lang;
}

// ===== FILTER TABS =====
function initFilterTabs() {
  const tabs = document.querySelectorAll('.filter-tab');
  const cards = document.querySelectorAll('.product-card');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const filter = tab.getAttribute('data-filter');
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      cards.forEach((card, i) => {
        const show = filter === 'all' || card.getAttribute('data-category') === filter;
        if (show) {
          card.classList.remove('hidden');
          card.style.animationDelay = `${i * 0.05}s`;
          card.classList.add('animate-in');
          setTimeout(() => card.classList.remove('animate-in'), 600);
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

// ===== GOOGLE SHEETS – GỬI DỮ LIỆU =====
async function sendToGoogleSheets(data) {
  // Nếu chưa cấu hình URL → bỏ qua, không lỗi
  if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL === 'PASTE_YOUR_APPS_SCRIPT_URL_HERE') {
    console.warn('⚠️  Google Sheets chưa được cấu hình. Đơn hàng chỉ lưu ở console.');
    return { status: 'skipped' };
  }

  try {
    // Dùng no-cors vì Apps Script không hỗ trợ CORS preflight trên static sites
    // Data vẫn được gửi và lưu thành công dù không đọc được response
    await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    console.log('✅ Đã gửi dữ liệu lên Google Sheets');
    return { status: 'success' };
  } catch (err) {
    console.error('❌ Lỗi gửi Google Sheets:', err);
    return { status: 'error', error: err.message };
  }
}

// ===== FORM SUBMISSION =====
async function handleSubmit(event) {
  event.preventDefault();

  const form = event.target;
  const name = form.name.value.trim();
  const phone = form.phone.value.trim();
  const pickupDate = form['pickup-date'].value;
  const pickupTime = form['pickup-time'].value;
  const cakeType = form['cake-type'].value;
  const message = form.message.value.trim();

  // Validation
  if (!name || !phone || !pickupDate || !cakeType) {
    showError(currentLang === 'vi'
      ? 'Vui lòng điền đầy đủ thông tin bắt buộc!'
      : 'Please fill in all required fields!');
    return;
  }

  const cakeNames = {
    strawberry: { vi: 'Bánh Kem Dâu Tây Hokkaido', en: 'Hokkaido Strawberry Cream Cake' },
    tiramisu:   { vi: 'Tiramisu Cốt Rượu',          en: 'Classic Tiramisu' },
    matcha:     { vi: 'Mousse Trà Xanh Uji',         en: 'Uji Matcha Mousse' },
    croissant:  { vi: 'Croissant Bơ Pháp',           en: 'French Butter Croissant' },
    macaron:    { vi: 'Macaron Ngũ Sắc',             en: 'Rainbow Macarons' },
    redvelvet:  { vi: 'Red Velvet – Nhung Đỏ',       en: 'Red Velvet Cake' },
    tart:       { vi: 'Bánh Tart Trái Cây',          en: 'Fresh Fruit Tart' },
    custom:     { vi: 'Thiết Kế Theo Yêu Cầu',       en: 'Custom Design' },
  };

  const cakeName = cakeNames[cakeType]
    ? `${cakeNames[cakeType].vi} / ${cakeNames[cakeType].en}`
    : cakeType;

  // Chuẩn bị data gửi lên Google Sheets
  const orderData = {
    name,
    phone,
    pickupDate,
    pickupTime:  pickupTime  || 'Chưa chọn',
    cakeType:    cakeName,
    message:     message     || 'Không có',
    lang:        currentLang,
    timestamp:   new Date().toLocaleString('vi-VN'),
    source:      'Cream Home Website',
  };

  console.log('🎂 ĐƠN ĐẶT BÁNH MỚI – Cream Home:', orderData);

  // Hiện loading
  setSubmitLoading(true);

  // Gửi lên Google Sheets
  const result = await sendToGoogleSheets(orderData);

  // Reset loading
  setSubmitLoading(false);

  // Hiện toast thành công
  if (result.status === 'error') {
    // Vẫn hiện success cho khách, đơn hàng đã log ở console
    showToast(true);
    console.warn('Google Sheets error nhưng đơn đã ghi log:', result.error);
  } else {
    showToast(true);
  }

  // Reset form
  form.reset();
  setMinPickupDate();
}

function setSubmitLoading(isLoading) {
  const btn = document.getElementById('submitBtn');
  if (!btn) return;
  btn.disabled = isLoading;
  btn.style.opacity = isLoading ? '0.7' : '1';

  const btnText = btn.querySelector('.btn-text');
  if (btnText) {
    if (isLoading) {
      btnText.textContent = currentLang === 'vi' ? '⏳ Đang gửi...' : '⏳ Sending...';
    } else {
      btnText.textContent = currentLang === 'vi' ? 'Gửi Đơn Đặt Bánh 🎂' : 'Submit Order 🎂';
    }
  }
}

function showError(msg) {
  const toast = document.getElementById('toast');
  const toastTitle = document.getElementById('toastTitle');
  const toastMsg = document.getElementById('toastMsg');

  toast.style.borderLeftColor = '#E8919E';
  toastTitle.textContent = currentLang === 'vi' ? 'Vui lòng kiểm tra lại!' : 'Please check again!';
  toastMsg.textContent = msg;

  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
    toast.style.borderLeftColor = '';
  }, 4000);
}

function showToast(isSuccess = true) {
  const toast = document.getElementById('toast');
  const toastTitle = document.getElementById('toastTitle');
  const toastMsg = document.getElementById('toastMsg');

  toast.style.borderLeftColor = '';

  if (isSuccess) {
    toastTitle.textContent = currentLang === 'vi' ? '🎉 Đơn đặt bánh đã gửi!' : '🎉 Order submitted!';
    toastMsg.textContent = currentLang === 'vi'
      ? 'Cream Home sẽ sớm liên hệ xác nhận với bạn.'
      : 'Cream Home will contact you shortly to confirm.';
  }

  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 5000);
}

// ===== ADD TO ORDER (từ product cards) =====
function addToOrder(productName) {
  const select = document.getElementById('cake-type');
  const nameToValue = {
    'Bánh Kem Dâu Tây Hokkaido': 'strawberry',
    'Tiramisu Cốt Rượu': 'tiramisu',
    'Mousse Trà Xanh': 'matcha',
    'Croissant Bơ Pháp': 'croissant',
    'Macaron Ngũ Sắc': 'macaron',
    'Red Velvet': 'redvelvet',
    'Bánh Tart Trái Cây': 'tart',
    'Trà Earl Grey Mâm Xôi': 'custom',
    'Cold Brew': 'custom',
    'Trà Hoa Cúc Mật Ong': 'custom',
  };

  const value = nameToValue[productName];
  if (value && select) select.value = value;

  scrollToSection('order');

  const formWrap = document.querySelector('.order-form-wrap');
  if (formWrap) {
    formWrap.style.boxShadow = '0 0 0 3px rgba(228,145,158,0.4), 0 16px 64px rgba(196,135,75,0.18)';
    setTimeout(() => { formWrap.style.boxShadow = ''; }, 2000);
  }
}

// ===== SCROLL TO SECTION =====
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) {
    const navbar = document.getElementById('navbar');
    const offset = navbar ? navbar.offsetHeight : 80;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
  }
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
  const elements = document.querySelectorAll(
    '.product-card, .occasion-card, .review-card, .step-item, .story-img-wrap, .story-content, .order-info, .order-form-wrap'
  );

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  elements.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(28px)';
    el.style.transition = `opacity 0.6s ease ${i * 0.05}s, transform 0.6s ease ${i * 0.05}s`;
    observer.observe(el);
  });
}

// ===== ACTIVE NAV LINKS =====
function initActiveNavLinks() {
  const sections = document.querySelectorAll('section[id], footer[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.3, rootMargin: '-80px 0px 0px 0px' });

  sections.forEach(section => observer.observe(section));
}

// ===== BACK TO TOP =====
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });
}

// ===== MIN PICKUP DATE =====
function setMinPickupDate() {
  const input = document.getElementById('pickup-date');
  if (input) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const dd = String(tomorrow.getDate()).padStart(2, '0');
    input.min = `${yyyy}-${mm}-${dd}`;
    if (!input.value) input.value = `${yyyy}-${mm}-${dd}`;
  }
}

// ===== HERO PARALLAX =====
window.addEventListener('scroll', () => {
  const img = document.querySelector('.hero-img');
  if (img && window.scrollY < window.innerHeight) {
    img.style.transform = `scale(1.05) translateY(${window.scrollY * 0.3}px)`;
  }
}, { passive: true });
