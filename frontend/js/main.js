// ===== GLOBAL STATE =====
let currentUser = JSON.parse(localStorage.getItem('mj_user')) || null;
let isAdmin = currentUser && currentUser.role === 'admin';
let cart = JSON.parse(localStorage.getItem('mj_cart')) || [];
let workers = [];
let products = [];
let slides = [];
let notifications = [];
let socket;

// ===== COMPONENT LOADER =====
async function loadComponent(elementId, componentPath) {
    const el = document.getElementById(elementId);
    if (!el) return;
    try {
        const response = await fetch(componentPath);
        if (response.ok) el.innerHTML = await response.text();
    } catch (e) { console.error(`Failed to load ${componentPath}`, e); }
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', async () => {
    // 1. Load shared components
    await Promise.all([
        loadComponent('navbar-container', 'components/navbar.html?v=10'),
        loadComponent('modals-container', 'components/modals.html?v=10'),
        loadComponent('footer-container', 'components/footer.html?v=10')
    ]);

    document.body.style.display = 'block';

    // 2. Fetch data from backend
    try {
        workers = await api.getWorkers();
        products = await api.getProducts();
        if (typeof api.getSlides === 'function') {
            slides = await api.getSlides();
        }
    } catch (e) {
        console.error("Backend not reachable. Is server running on port 3000?", e);
    }

    // 3. Socket.io
    try {
        socket = io(window.location.origin);
        socket.on('workerStatusUpdate', (updatedWorkers) => {
            workers = updatedWorkers;
            if (typeof renderServicesPage === 'function') renderServicesPage();
            if (typeof renderAdmin === 'function') renderAdmin();
        });
    } catch (e) { console.error('Socket.io connection failed', e); }

    // 4. Init UI
    updateAuthUI();
    updateCartUI();
    highlightActiveNav();
    highlightActiveMobileNav();

    // 5. Page-specific init
    const page = document.querySelector('main')?.dataset.page;
    if (page === 'index') { initHomeSlider(); animateCounters(); }
    if (page === 'services') { applyServiceFilter(); renderServicesPage(); }
    if (page === 'mart') { applyMartFilter(); renderMartPage('all'); initCategoryChips(); }
    if (page === 'admin') initAdminPage();
    if (page === 'checkout') renderCheckoutPage();
    if (page === 'orders') renderOrdersPage();
    if (page === 'bookings') renderBookingsPage();
    if (page === 'account') renderAccountPage();

    // 6. Global event listeners
    attachGlobalListeners();
    if (typeof initGlobalSearch === 'function') initGlobalSearch();
    if (typeof initScrollReveal === 'function') initScrollReveal();
});

// ===== NAV HIGHLIGHTING =====
function highlightActiveNav() {
    const page = document.querySelector('main')?.dataset.page || 'index';
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('text-orange', 'font-semibold');
        if (link.dataset.page === page) link.classList.add('text-orange', 'font-semibold');
    });
}

function highlightActiveMobileNav() {
    const page = document.querySelector('main')?.dataset.page || 'index';
    document.querySelectorAll('.mob-nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.page === page) item.classList.add('active');
    });
}

// ===== HOME SLIDER =====
let _sliderIdx = 0;
let _sliderTimer = null;

function initHomeSlider() {
    const track = document.getElementById('sliderTrack');
    const dotsContainer = document.getElementById('sliderDots');
    if (!track || !slides || slides.length === 0) return;

    track.innerHTML = slides.map((s, i) => {
        const hasGallery = s.galleryImages && s.galleryImages.length > 0;
        const btnAction = hasGallery
            ? `onclick="openLightbox(${JSON.stringify(s.galleryImages).replace(/"/g, '&quot;')}, 0)"`
            : `href="${s.buttonLink}"`;

        return `
        <div class="slider-slide min-w-full relative">
            <img src="${s.img}" alt="Slide ${i + 1}" class="w-full h-[400px] md:h-[500px] lg:h-[600px] object-cover">
            <div class="absolute inset-0 bg-gradient-to-r from-[rgba(0,0,0,0.2)] via-[rgba(0,0,0,0.1)] to-transparent"></div>
            <div class="absolute bottom-10 left-10 md:bottom-20 md:left-20 text-[#FFFFFF] max-w-2xl z-10">
                <h3 class="text-4xl md:text-6xl font-bold leading-[1.1]" style="font-family:'Outfit',sans-serif">${s.title}</h3>
                <p class="text-lg md:text-xl text-[#E5E5E5] mt-5 leading-relaxed">${s.subtitle}</p>
                ${hasGallery
                ? `<button ${btnAction} class="inline-block mt-8 btn-primary px-8 py-3.5 text-sm font-semibold">${s.buttonText}</button>`
                : `<a ${btnAction} class="inline-block mt-8 btn-primary px-8 py-3.5 text-sm font-semibold no-underline">${s.buttonText}</a>`
            }
            </div>
        </div>
        `;
    }).join('');

    if (dotsContainer) {
        dotsContainer.innerHTML = slides.map((_, i) => `
            <button onclick="goSlider(${i})" class="w-12 h-1 rounded-full ${i === 0 ? 'bg-[#FFFFFF]' : 'bg-[rgba(255,255,255,0.4)] hover:bg-[#FFFFFF]'} transition-colors duration-300 slider-dot ${i === 0 ? 'active' : ''}"></button>
        `).join('');
    }

    _sliderIdx = 0;
    resetSliderTimer();
}

function moveSlider(dir) {
    const track = document.getElementById('sliderTrack');
    if (!track) return;
    const total = track.children.length;
    _sliderIdx = ((_sliderIdx || 0) + dir + total) % total;
    track.style.transform = `translateX(-${_sliderIdx * 100}%)`;
    updateSliderDots();
    resetSliderTimer();
}

function goSlider(idx) {
    _sliderIdx = idx;
    const track = document.getElementById('sliderTrack');
    if (track) track.style.transform = `translateX(-${idx * 100}%)`;
    updateSliderDots();
    resetSliderTimer();
}

function updateSliderDots() {
    document.querySelectorAll('.slider-dot').forEach((d, i) => {
        d.classList.toggle('active', i === _sliderIdx);
        d.classList.toggle('bg-[#FFFFFF]', i === _sliderIdx);
        d.classList.toggle('bg-[rgba(255,255,255,0.4)]', i !== _sliderIdx);
    });
}

function resetSliderTimer() {
    if (_sliderTimer) clearTimeout(_sliderTimer);
    let duration = 5000;
    // slides 1 & 2 (idx 0 & 1) show for more time, slides 3 & 4 (idx 2 & 3) show for half that time
    if (_sliderIdx === 0 || _sliderIdx === 1) duration = 6000;
    else duration = 3000;
    _sliderTimer = setTimeout(() => moveSlider(1), duration);
}

// ===== URL PARAM FILTERS =====
function applyServiceFilter() {
    const params = new URLSearchParams(window.location.search);
    const role = params.get('role');
    if (role) {
        const sel = document.getElementById('serviceTypeFilter');
        if (sel) sel.value = role;
    }
}

function applyMartFilter() {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get('cat');
    if (cat) {
        // Activate the correct category chip
        setTimeout(() => {
            document.querySelectorAll('.category-chip').forEach(chip => {
                chip.classList.remove('active');
                if (chip.dataset.cat === cat) {
                    chip.classList.add('active');
                    renderMartPage(cat);
                }
            });
        }, 100);
    }
}

// ===== GLOBAL LISTENERS =====
function attachGlobalListeners() {
    // Profile dropdown
    document.getElementById('userAvatar')?.addEventListener('click', (e) => {
        e.stopPropagation();
        document.getElementById('profileDropdown')?.classList.toggle('show');
        document.getElementById('notifDropdown')?.classList.remove('show');
    });

    // Notifications
    document.getElementById('notifBell')?.addEventListener('click', (e) => {
        e.stopPropagation();
        document.getElementById('notifDropdown')?.classList.toggle('show');
        document.getElementById('profileDropdown')?.classList.remove('show');
    });

    // Cart icon
    document.getElementById('cartIcon')?.addEventListener('click', (e) => {
        e.stopPropagation();
        openCartSidebar();
    });

    // Close cart sidebar
    document.getElementById('closeCartSidebar')?.addEventListener('click', closeCartSidebar);

    // Chatbot
    document.getElementById('chatbotBtn')?.addEventListener('click', () => openModal('chatbotModal'));
    document.getElementById('closeChat')?.addEventListener('click', () => closeModal('chatbotModal'));
    document.getElementById('chatInput')?.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendChat(); });

    // Mobile menu
    document.getElementById('mobileMenuBtn')?.addEventListener('click', () => {
        document.getElementById('mobileMenu')?.classList.toggle('hidden');
    });

    // Close dropdowns on outside click
    document.addEventListener('click', closeDropdowns);
}

function closeDropdowns() {
    document.getElementById('profileDropdown')?.classList.remove('show');
    document.getElementById('notifDropdown')?.classList.remove('show');
}
