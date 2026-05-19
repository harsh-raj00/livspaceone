// ===== PRICE RANGE HELPER =====
function formatPrice(p) {
    if (p.priceMax && p.priceMax > p.price) return `₹${p.price} - ₹${p.priceMax}`;
    return `₹${p.price}`;
}

// ===== RENDER: SERVICES PAGE =====
function renderServicesPage() { const grid = document.getElementById('servicesWorkerGrid'); if (!grid) return; let f = getFilteredWorkers(); if (!f.length) { grid.innerHTML = '<div class="col-span-full text-center py-20 text-[#666]"><i class="fas fa-search text-4xl mb-4"></i><p>No professionals found</p></div>'; return } grid.innerHTML = f.map(w => `<div class="glass-card p-6 border border-[rgba(0,0,0,0.12)] hover:border-[rgba(255,255,255,0.25)] hover:shadow-[0_0_40px_rgba(255,255,255,0.03)] cursor-pointer group bg-[rgba(0,0,0,0.02)]" onclick="showWorkerProfile('${w._id || w.id}')">${w.verified ? '<div class="absolute top-4 left-4"><span class="bg-[rgba(0,0,0,0.05)] border border-[rgba(255,255,255,0.15)] text-black text-xs px-2.5 py-1 rounded-full font-semibold tracking-wide"><i class="fas fa-shield-check mr-1"></i>Verified</span></div>' : ''}<img src="${w.img}" class="w-24 h-24 rounded-full mx-auto object-cover border-[3px] border-[rgba(0,0,0,0.05)] group-hover:border-white transition-colors duration-500 mt-2"><h3 class="font-bold text-lg text-center mt-4 text-black font-display tracking-wide">${w.name}</h3><p class="text-center text-sm text-[#525252] mt-1">${w.role} • ${w.exp}</p><div class="flex justify-center gap-0.5 mt-2 text-xs text-black tracking-widest">★★★★★ <span class="text-[#666] ml-1 tracking-normal">(${w.rating})</span></div><p class="text-center text-black font-bold mt-3">${w.price}</p><p class="text-center text-xs text-[#525252] mt-3"><i class="fas fa-map-marker-alt text-black mr-1"></i>${w.city}</p></div>`).join('') }
function getFilteredWorkers() { let f = [...workers]; const s = document.getElementById('workerSearch')?.value.toLowerCase() || ''; const c = document.getElementById('cityFilter')?.value || ''; const t = document.getElementById('serviceTypeFilter')?.value || ''; const a = document.getElementById('availFilter')?.value || ''; if (s) f = f.filter(w => w.name.toLowerCase().includes(s) || w.role.toLowerCase().includes(s)); if (c) f = f.filter(w => w.city === c); if (t) f = f.filter(w => w.role === t); if (a) f = f.filter(w => w.status === a); return f }
function filterWorkers() { renderServicesPage() }

// ===== WORKER PROFILE & BOOKING =====
function showWorkerProfile(id) { const w = workers.find(x => (x._id || x.id) == id); if (!w) return; const el = document.getElementById('workerProfileModalContent'); if (!el) return; el.innerHTML = `<i class="fas fa-times absolute top-5 right-6 text-[#525252] cursor-pointer hover:text-[#000000] text-lg transition-colors" onclick="closeModal('workerProfileModal')"></i><div class="text-center pt-2"><div class="w-28 h-28 mx-auto rounded-full p-1 border border-[#FFFFFF] mb-4 shadow-[0_0_20px_rgba(0,0,0,0.1)]"><img src="${w.img}" class="w-full h-full rounded-full object-cover"></div><h3 class="font-bold text-2xl text-[#000000]" style="font-family:'Outfit',sans-serif">${w.name}</h3><p class="text-[#525252] mt-1">${w.role} • ${w.city}</p><div class="flex justify-center items-center gap-2 mt-3"><span class="status-dot status-${w.status === 'Available' ? 'available' : w.status === 'Busy' ? 'busy' : 'offline'}"></span><span class="text-sm font-medium text-[#000000]">${w.status}</span></div>${w.verified ? '<span class="inline-block mt-3 bg-[rgba(255,255,255,0.1)] border border-[rgba(0,0,0,0.1)] text-[#000000] text-xs px-3 py-1 rounded-full font-medium"><i class="fas fa-shield-check mr-1"></i> Certified Professional</span>' : ''}</div><div class="grid grid-cols-3 gap-4 mt-8"><div class="bg-[rgba(0,0,0,0.03)] border border-[rgba(0,0,0,0.1)] rounded-xl p-4 text-center"><p class="font-bold text-xl text-[#000000]">${w.rating}</p><p class="text-xs text-[#525252] mt-1 uppercase tracking-wider">Rating</p></div><div class="bg-[rgba(0,0,0,0.03)] border border-[rgba(0,0,0,0.1)] rounded-xl p-4 text-center"><p class="font-bold text-xl text-[#000000]">${w.exp}</p><p class="text-xs text-[#525252] mt-1 uppercase tracking-wider">Experience</p></div><div class="bg-[rgba(0,0,0,0.03)] border border-[rgba(0,0,0,0.1)] rounded-xl p-4 text-center"><p class="font-bold text-xl text-[#000000]">${w.price}</p><p class="text-xs text-[#525252] mt-1 uppercase tracking-wider">Rate</p></div></div><button class="btn-primary w-full py-4 text-base mt-8" onclick="closeModal('workerProfileModal');bookWorker('${w._id || w.id}')">${w.status === 'Available' ? 'Schedule Consultation' : 'Currently Unavailable'}</button>`; openModal('workerProfileModal') }
function bookWorker(id) { if (!requireLogin('book a worker')) return; const w = workers.find(x => (x._id || x.id) == id); if (!w || w.status !== 'Available') { showToast('Worker not available', 'warning'); return } document.getElementById('modalWorkerName').innerHTML = `<div class="flex items-center gap-3"><img src="${w.img}" class="w-10 h-10 rounded-full"><div><p class="font-bold">${w.name}</p><p class="text-sm text-[#A0A0A0]">${w.role} • ${w.price}</p></div></div>`; openModal('bookingModal'); document.getElementById('confirmBookingBtn').onclick = async () => { const date = document.getElementById('bookingDate').value; if (!date) { showToast('Select a date', 'warning'); return } try { await api.createBooking({ worker: w._id || w.id, workerName: w.name, workerRole: w.role, date, timeSlot: document.getElementById('bookingSlot').value, description: document.getElementById('bookingDesc')?.value || '' }); closeModal('bookingModal'); showToast('Booking confirmed with ' + w.name + '! ✅') } catch (e) { showToast('Booking failed', 'error') } } }

// ===== RENDER: MART PAGE =====
function renderMartPage(category = 'all') { const grid = document.getElementById('productsGrid'); if (!grid) return; let filtered = category === 'all' ? [...products] : products.filter(p => p.category === category); const search = document.getElementById('productSearch')?.value.toLowerCase() || ''; if (search) filtered = filtered.filter(p => p.name.toLowerCase().includes(search)); const sort = document.getElementById('sortProducts')?.value || ''; if (sort === 'priceLow') filtered.sort((a, b) => a.price - b.price); if (sort === 'priceHigh') filtered.sort((a, b) => b.price - a.price); if (sort === 'rating') filtered.sort((a, b) => b.rating - a.rating); grid.innerHTML = filtered.map(p => { const sl = p.stock > 20 ? 'In Stock' : p.stock > 0 ? 'Limited' : 'Out of Stock'; const sc = p.stock > 20 ? 'text-black' : p.stock > 0 ? 'text-gray-700' : 'text-red-400'; const priceLabel = formatPrice(p); return `<div class="glass-card overflow-hidden border border-[rgba(0,0,0,0.12)] hover:border-[rgba(255,255,255,0.25)] hover:shadow-[0_0_40px_rgba(255,255,255,0.03)] bg-[rgba(0,0,0,0.02)] group cursor-pointer" onclick="showProductDetail('${p._id || p.id}')"><div class="relative overflow-hidden"><img src="${p.img}" class="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-700">${p.discount ? `<span class="absolute top-3 left-3 bg-white text-black text-xs px-3 py-1 rounded-full font-bold shadow-lg">${p.discount}</span>` : ''}<span class="absolute bottom-3 right-3 ${sc} bg-[rgba(0,0,0,0.8)] backdrop-blur-md border border-[rgba(255,255,255,0.15)] text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full font-bold">${sl}</span></div><div class="p-5"><h3 class="font-bold text-black font-display text-lg line-clamp-1">${p.name}</h3><p class="text-xs text-[#525252] uppercase tracking-widest mt-1"><i class="fas fa-tag text-black mr-1"></i> ${p.category}</p><div class="flex items-center gap-1 mt-2 text-black">${'<i class="fas fa-star text-xs"></i>'.repeat(Math.floor(p.rating))}<span class="text-xs text-[#555] ml-1">(${p.rating})</span></div><div class="flex items-baseline gap-2 mt-3"><span class="text-black font-bold text-xl">${priceLabel}</span>${!p.priceMax || p.priceMax <= p.price ? `<span class="text-[#555] line-through text-xs">₹${p.oldPrice}</span>` : ''}</div><p class="text-xs text-[#525252] mt-2"><i class="fas fa-truck text-black mr-1 opacity-70"></i> Priority Shipping</p><div class="flex gap-2 mt-5"><button class="flex-1 bg-[rgba(0,0,0,0.05)] border border-[rgba(255,255,255,0.15)] text-black py-2.5 rounded-lg text-sm font-semibold hover:bg-white hover:text-black transition-all" onclick="event.stopPropagation();addToCart({id:'${p._id || p.id}',name:'${(p.name || '').replace(/'/g, "\\'")}',price:${p.price},img:'${p.img}'})">Add to Bag</button><button class="px-5 bg-white text-black py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-all" onclick="event.stopPropagation();buyNow('${p._id || p.id}')">Buy</button></div></div></div>` }).join('') }
function filterProducts() { const chip = document.querySelector('.category-chip.active'); renderMartPage(chip?.dataset.cat || 'all') }
function initCategoryChips() { document.querySelectorAll('.category-chip').forEach(chip => chip.addEventListener('click', function () { document.querySelectorAll('.category-chip').forEach(c => c.classList.remove('active')); this.classList.add('active'); renderMartPage(this.dataset.cat) })) }
function showProductDetail(id) { const p = products.find(x => (x._id || x.id) == id); if (!p) return; const el = document.getElementById('productModalContent'); if (!el) return; const imgs = [p.img, ...(p.images || [])].filter(Boolean); const uniqueImgs = [...new Set(imgs)]; const hasMulti = uniqueImgs.length > 1; const priceLabel = formatPrice(p); const galleryHtml = hasMulti ? `<div class="product-gallery w-full md:w-1/2 rounded-2xl overflow-hidden border border-[rgba(0,0,0,0.1)]"><div class="product-gallery-track" id="pgTrack">${uniqueImgs.map((img, i) => `<img src="${img}" onclick="openLightbox(${JSON.stringify(uniqueImgs).replace(/"/g, '&quot;')},${i})">`).join('')}</div><div class="gallery-arrow gallery-arrow-left" onclick="event.stopPropagation();slideGallery(-1)"><i class="fas fa-chevron-left"></i></div><div class="gallery-arrow gallery-arrow-right" onclick="event.stopPropagation();slideGallery(1)"><i class="fas fa-chevron-right"></i></div><div class="gallery-dots">${uniqueImgs.map((_, i) => `<div class="gallery-dot${i === 0 ? ' active' : ''}" onclick="event.stopPropagation();goToSlide(${i})"></div>`).join('')}</div></div>` : `<div class="w-full md:w-1/2 rounded-2xl overflow-hidden border border-[rgba(0,0,0,0.1)]"><img src="${p.img}" class="w-full h-80 object-cover cursor-pointer hover:scale-105 transition-transform duration-500" onclick="openLightbox(['${p.img}'],0)"></div>`; el.innerHTML = `<i class="fas fa-times absolute top-5 right-6 text-[#525252] cursor-pointer hover:text-[#000000] text-lg transition-colors" onclick="closeModal('productModal')"></i><div class="flex flex-col md:flex-row gap-8 pt-2">${galleryHtml}<div class="flex-1"><span class="inline-block px-3 py-1 bg-[rgba(255,255,255,0.1)] border border-[rgba(0,0,0,0.1)] rounded-full text-xs text-[#000000] font-semibold tracking-wider uppercase mb-3">${p.category}</span><h2 class="text-3xl font-bold text-[#000000]" style="font-family:'Outfit',sans-serif">${p.name}</h2><div class="flex items-center gap-1 mt-2">${'<i class="fas fa-star text-[#000000] text-sm"></i>'.repeat(Math.floor(p.rating))}<span class="text-sm text-[#525252] ml-2">(${p.rating} reviews)</span></div><div class="flex items-center gap-4 mt-5"><span class="text-3xl font-bold text-[#000000]">${priceLabel}</span>${!p.priceMax || p.priceMax <= p.price ? `<span class="text-[#555] line-through text-lg">₹${p.oldPrice}</span>` : ''} ${p.discount ? `<span class="bg-gradient-to-r from-[#FFFFFF] to-[#E5E5E5] text-[#000000] px-3 py-1 rounded-full text-xs font-bold shadow-lg">${p.discount}</span>` : ''}</div>${p.description ? `<p class="text-sm text-[#525252] mt-5 leading-relaxed">${p.description}</p>` : ''}<div class="mt-6 pt-6 border-t border-[rgba(0,0,0,0.1)]"><p class="text-sm font-medium ${p.stock > 20 ? 'text-[#0FAF8F]' : p.stock > 0 ? 'text-[#000000]' : 'text-red-400'} flex items-center gap-2"><i class="fas ${p.stock > 0 ? 'fa-check-circle' : 'fa-times-circle'}"></i> ${p.stock > 20 ? 'Available for immediate dispatch' : p.stock > 0 ? 'Limited availability' : 'Currently out of stock'}</p></div><div class="flex gap-4 mt-8"><button class="btn-outline flex-1 py-4 text-base" onclick="addToCart({id:'${p._id || p.id}',name:'${(p.name || '').replace(/'/g, "\\'")}',price:${p.price},img:'${p.img}'});closeModal('productModal')"><i class="fas fa-shopping-bag mr-2"></i> Add to Bag</button><button class="btn-primary flex-1 py-4 text-base" onclick="closeModal('productModal');buyNow('${p._id || p.id}')">Purchase Now <i class="fas fa-arrow-right ml-2 text-sm"></i></button></div></div></div>`; window._gallerySlide = 0; openModal('productModal') }
function slideGallery(dir) { const track = document.getElementById('pgTrack'); if (!track) return; const total = track.children.length; window._gallerySlide = ((window._gallerySlide || 0) + dir + total) % total; track.style.transform = `translateX(-${window._gallerySlide * 100}%)`; document.querySelectorAll('.gallery-dot').forEach((d, i) => d.classList.toggle('active', i === window._gallerySlide)) }
function goToSlide(i) { window._gallerySlide = i; const track = document.getElementById('pgTrack'); if (track) track.style.transform = `translateX(-${i * 100}%)`; document.querySelectorAll('.gallery-dot').forEach((d, idx) => d.classList.toggle('active', idx === i)) }
function buyNow(id) { const p = products.find(x => (x._id || x.id) == id); if (!requireLogin('purchase')) return; addToCart({ id: p._id || p.id, name: p.name, price: p.price, img: p.img }); openCartSidebar() }

// ===== CHECKOUT =====
function renderCheckoutPage() { if (!requireLogin('checkout')) { window.location.href = 'login.html'; return } if (!cart.length) { showToast('Cart is empty', 'warning'); window.location.href = 'mart.html'; return } let total = 0; const el = document.getElementById('checkoutItems'); if (el) el.innerHTML = cart.map(p => { total += p.price * (p.qty || 1); return `<div class="flex items-center gap-3"><img src="${p.img}" class="w-12 h-12 rounded-lg object-cover"><div class="flex-1"><p class="font-semibold text-sm">${p.name}</p><p class="text-xs text-[#A0A0A0]">Qty: ${p.qty || 1}</p></div><p class="font-bold text-sm">₹${p.price * (p.qty || 1)}</p></div>` }).join(''); document.getElementById('checkoutSubtotal') && (document.getElementById('checkoutSubtotal').textContent = '₹' + total); document.getElementById('checkoutTotal') && (document.getElementById('checkoutTotal').textContent = '₹' + total) }
async function placeOrder() { const name = document.getElementById('checkoutName')?.value; const phone = document.getElementById('checkoutPhone')?.value; const addr = document.getElementById('checkoutAddress')?.value; if (!name || !phone || !addr) { showToast('Fill delivery details', 'warning'); return } const pay = document.querySelector('input[name="payment"]:checked')?.value || 'cod'; let total = 0; cart.forEach(p => total += p.price * (p.qty || 1)); try { await api.createOrder({ items: cart.map(p => ({ name: p.name, price: p.price, qty: p.qty || 1, img: p.img })), totalAmount: total, shippingAddress: { name, phone, address: addr, city: document.getElementById('checkoutCity')?.value || '', pinCode: document.getElementById('checkoutPin')?.value || '' }, paymentMethod: pay }); cart = []; localStorage.setItem('mj_cart', '[]'); showToast('Order placed successfully! ðŸŽ‰'); setTimeout(() => window.location.href = 'orders.html', 1500) } catch (e) { showToast('Order failed', 'error') } }

// ===== ORDERS & BOOKINGS PAGES =====
async function renderOrdersPage() { if (!currentUser) { window.location.href = 'login.html'; return } try { const orders = await api.getOrders(); const el = document.getElementById('ordersContainer'); if (!el) return; if (!orders.length) { el.innerHTML = '<div class="text-center py-20"><i class="fas fa-box-open text-5xl text-[#555] mb-4"></i><p class="text-[#525252]">Your collection history is empty</p><a href="mart.html" class="btn-primary inline-block px-8 py-3.5 mt-6">Explore Collections</a></div>'; return } el.innerHTML = orders.map(o => `<div class="glass-card gold-border p-6 hover:shadow-[0_0_30px_rgba(0,0,0,0.05)] transition-all"><div class="flex justify-between items-start mb-5 pb-5 border-b border-[rgba(0,0,0,0.1)]"><div><p class="font-bold text-[#000000] text-lg">Order #${(o._id || '').slice(-6).toUpperCase()}</p><p class="text-xs text-[#525252] mt-1">${new Date(o.createdAt).toLocaleDateString(undefined, {year: 'numeric', month: 'long', day: 'numeric'})}</p></div><span class="px-4 py-1.5 rounded-full text-xs font-bold border ${o.status === 'Delivered' ? 'bg-[rgba(15,175,143,0.1)] text-[#0FAF8F] border-[rgba(15,175,143,0.2)]' : o.status === 'Shipped' ? 'bg-[rgba(74,124,255,0.1)] text-[#4A7CFF] border-[rgba(74,124,255,0.2)]' : 'bg-[rgba(255,255,255,0.1)] text-[#000000] border-[rgba(0,0,0,0.1)]'}">${o.status}</span></div><div class="space-y-4">${(o.items || []).map(i => `<div class="flex items-center gap-4"><div class="w-14 h-14 bg-[rgba(0,0,0,0.03)] border border-[rgba(0,0,0,0.1)] rounded-xl flex items-center justify-center overflow-hidden"><img src="${i.img || 'https://via.placeholder.com/60'}" class="w-full h-full object-cover"></div><div class="flex-1"><p class="text-sm font-bold text-[#000000]">${i.name}</p><p class="text-xs text-[#525252] mt-0.5">Qty: ${i.qty}</p></div><p class="text-sm font-bold text-[#000000]">₹${i.price}</p></div>`).join('')}</div><div class="mt-5 pt-5 border-t border-[rgba(0,0,0,0.1)] flex justify-between items-center"><span class="text-sm text-[#525252] uppercase tracking-wider font-semibold">Total Amount</span><span class="font-bold text-xl text-[#000000]">₹${o.totalAmount}</span></div></div>`).join('') } catch (e) { console.error(e) } }
async function renderBookingsPage() { if (!currentUser) { window.location.href = 'login.html'; return } try { const bookings = await api.getBookings(); const el = document.getElementById('bookingsContainer'); if (!el) return; if (!bookings.length) { el.innerHTML = '<div class="text-center py-20"><i class="fas fa-calendar-times text-5xl text-[#555] mb-4"></i><p class="text-[#525252]">No appointments scheduled yet</p><a href="services.html" class="btn-primary inline-block px-8 py-3.5 mt-6">Consult an Expert</a></div>'; return } el.innerHTML = bookings.map(b => `<div class="glass-card gold-border p-6 hover:shadow-[0_0_30px_rgba(0,0,0,0.05)] transition-all"><div class="flex justify-between items-start mb-5 pb-5 border-b border-[rgba(0,0,0,0.1)]"><div><p class="font-bold text-lg text-[#000000]">${b.workerName || 'Expert'}</p><p class="text-xs text-[#000000] font-semibold tracking-wide uppercase mt-1">${b.workerRole || ''}</p></div><span class="px-4 py-1.5 rounded-full text-xs font-bold border ${b.status === 'Confirmed' ? 'bg-[rgba(15,175,143,0.1)] text-[#0FAF8F] border-[rgba(15,175,143,0.2)]' : b.status === 'Completed' ? 'bg-[rgba(74,124,255,0.1)] text-[#4A7CFF] border-[rgba(74,124,255,0.2)]' : 'bg-[rgba(255,255,255,0.1)] text-[#000000] border-[rgba(0,0,0,0.1)]'}">${b.status}</span></div><div class="flex flex-wrap gap-6 text-sm text-[#000000]"><div class="flex items-center gap-2 bg-[rgba(0,0,0,0.03)] px-4 py-2 rounded-lg border border-[rgba(0,0,0,0.1)]"><i class="fas fa-calendar text-[#000000]"></i> <span class="font-medium">${b.date}</span></div><div class="flex items-center gap-2 bg-[rgba(0,0,0,0.03)] px-4 py-2 rounded-lg border border-[rgba(0,0,0,0.1)]"><i class="fas fa-clock text-[#000000]"></i> <span class="font-medium">${b.timeSlot}</span></div></div>${b.description ? `<div class="mt-5 p-4 bg-[rgba(0,0,0,0.02)] border border-[rgba(0,0,0,0.08)] rounded-xl"><p class="text-sm text-[#525252] leading-relaxed"><i class="fas fa-quote-left text-[#555] mr-2 text-xs"></i>${b.description}</p></div>` : ''}</div>`).join('') } catch (e) { console.error(e) } }
function renderAccountPage() { if (currentUser) { document.getElementById('accName') && (document.getElementById('accName').textContent = currentUser.name); document.getElementById('accEmail') && (document.getElementById('accEmail').textContent = currentUser.email) } }

// ===== ADMIN =====
async function adminLogin() { const user = document.getElementById('adminUser')?.value; const pass = document.getElementById('adminPass')?.value; if (!user || !pass) { showToast('Enter credentials', 'error'); return } try { const email = user.includes('@') ? user : 'admin@majdoors.com'; const r = await api.login(email, pass); if (r.success && r.user.role === 'admin') { currentUser = r.user; isAdmin = true; localStorage.setItem('mj_user', JSON.stringify(currentUser)); updateAuthUI(); document.getElementById('adminLoginGate')?.classList.add('hidden'); document.getElementById('adminDashboard')?.classList.remove('hidden'); renderAdmin(); fetchAdminStats(); showToast('Admin access granted ✅') } else { showToast('Access denied', 'error') } } catch (e) { showToast('Invalid credentials', 'error') } }
function initAdminPage() { if (isAdmin && currentUser) { document.getElementById('adminLoginGate')?.classList.add('hidden'); document.getElementById('adminDashboard')?.classList.remove('hidden'); renderAdmin(); fetchAdminStats(); } else { document.getElementById('adminLoginGate')?.classList.remove('hidden'); document.getElementById('adminDashboard')?.classList.add('hidden') } }
async function fetchAdminStats() {
    try {
        const stats = await api.getAdminStats();
        if (stats) {
            document.getElementById('adminProductCount') && (document.getElementById('adminProductCount').textContent = stats.products);
            document.getElementById('adminWorkerCount') && (document.getElementById('adminWorkerCount').textContent = stats.workers);
            document.getElementById('adminOrderCount') && (document.getElementById('adminOrderCount').textContent = stats.orders);
            document.getElementById('adminBookingCount') && (document.getElementById('adminBookingCount').textContent = stats.bookings);
        }
    } catch (e) { console.error('Error fetching admin stats', e); }
}
function renderAdmin() { const pt = document.getElementById('adminProductTable'); if (pt) { pt.innerHTML = products.map(p => `<tr><td class="font-medium">${p.name}</td><td class="capitalize">${p.category}</td><td><div class="flex items-center gap-1">₹<input type="number" onchange="updateProductField('${p._id || p.id}','price',this.value)" value="${p.price}" class="w-20 border rounded px-2 py-1 text-sm"></div></td><td><input type="number" onchange="updateProductField('${p._id || p.id}','stock',this.value)" value="${p.stock || 0}" class="w-16 border rounded px-2 py-1 text-sm"></td><td class="text-green-600">${p.discount || ''}</td><td class="flex gap-2"><button onclick="openEditProduct('${p._id || p.id}')" class="text-blue-400 hover:text-blue-400 text-sm" title="Edit"><i class="fas fa-edit"></i></button><button onclick="deleteProduct('${p._id || p.id}')" class="text-red-400 hover:text-red-600 text-sm" title="Delete"><i class="fas fa-trash"></i></button></td></tr>`).join(''); } const wt = document.getElementById('adminWorkerTable'); if (wt) { wt.innerHTML = workers.map(w => `<tr><td class="font-medium"><div class="flex items-center gap-2"><img src="${w.img}" class="w-8 h-8 rounded-full">${w.name}</div></td><td>${w.role}</td><td>${w.price}</td><td><label class="flex items-center gap-1 cursor-pointer text-sm"><input type="checkbox" onchange="updateWorkerField('${w._id || w.id}','verified',this.checked)" ${w.verified ? 'checked' : ''}> Verified</label></td><td><select onchange="updateWorkerField('${w._id || w.id}','status',this.value)" class="border rounded-lg px-2 py-1 text-sm"><option value="Available" ${w.status === 'Available' ? 'selected' : ''}>Available</option><option value="Busy" ${w.status === 'Busy' ? 'selected' : ''}>Busy</option><option value="Offline" ${w.status === 'Offline' ? 'selected' : ''}>Offline</option></select></td><td><button onclick="deleteWorker('${w._id || w.id}')" class="text-red-400 hover:text-red-600 text-sm" title="Delete worker"><i class="fas fa-trash"></i></button></td></tr>`).join(''); } const st = document.getElementById('adminSlideTable'); if (st) { st.innerHTML = slides.map(s => `<tr><td class="font-medium"><div class="flex items-center gap-2"><img src="${s.img}" class="w-12 h-8 rounded object-cover">${s.title.replace(/<[^>]*>?/gm, ' ')}</div></td><td><input type="number" onchange="updateSlideField('${s._id || s.id}','sortOrder',this.value)" value="${s.sortOrder}" class="w-16 border rounded px-2 py-1 text-sm"></td><td>${(s.galleryImages && s.galleryImages.length > 0) ? '<span class="text-blue-500 font-medium text-xs bg-[rgba(59,130,246,0.1)] px-2 py-1 rounded-full">Gallery</span>' : '<span class="text-[#A0A0A0] text-xs truncate max-w-[100px] inline-block">' + s.buttonLink + '</span>'}</td><td><label class="flex items-center gap-1 cursor-pointer text-sm"><input type="checkbox" onchange="updateSlideField('${s._id || s.id}','isActive',this.checked)" ${s.isActive ? 'checked' : ''}> Active</label></td><td class="flex gap-2"><button onclick="openEditSlide('${s._id || s.id}')" class="text-blue-400 hover:text-blue-400 text-sm" title="Edit Slide"><i class="fas fa-edit"></i></button><button onclick="deleteSlide('${s._id || s.id}')" class="text-red-400 hover:text-red-600 text-sm" title="Delete Slide"><i class="fas fa-trash"></i></button></td></tr>`).join(''); } }

// ===== STYLED CONFIRM DIALOG =====
function showConfirmDialog(message, onConfirm) {
    const overlay = document.createElement('div');
    overlay.className = 'confirm-overlay';
    overlay.innerHTML = `<div class="bg-[#1E1E1E] rounded-2xl p-6 max-w-sm mx-4 shadow-2xl text-center animate-bounce-in">
        <div class="w-14 h-14 bg-[rgba(239,68,68,0.1)] rounded-full flex items-center justify-center mx-auto mb-4"><i class="fas fa-exclamation-triangle text-red-500 text-2xl"></i></div>
        <h3 class="font-bold text-lg mb-2">Confirm Delete</h3>
        <p class="text-[#A0A0A0] text-sm mb-6">${message}</p>
        <div class="flex gap-3"><button id="confirmYes" class="flex-1 bg-[rgba(239,68,68,0.1)]0 text-black py-2.5 rounded-full font-semibold hover:bg-red-600 transition">Yes, Delete</button><button id="confirmNo" class="flex-1 border-2 py-2.5 rounded-full font-semibold hover:bg-[#171717] transition">Cancel</button></div>
    </div>`;
    document.body.appendChild(overlay);
    overlay.querySelector('#confirmYes').onclick = () => { overlay.remove(); onConfirm(); };
    overlay.querySelector('#confirmNo').onclick = () => overlay.remove();
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
}

// ===== ONE-BY-ONE IMAGE UPLOAD =====
let selectedImageFiles = [];

function addSingleImage(input, mode) {
    const file = input.files[0];
    if (!file) return;
    if (selectedImageFiles.length >= 5) { showToast('Maximum 5 images allowed', 'warning'); input.value = ''; return; }
    selectedImageFiles.push(file);
    input.value = ''; // reset for next pick
    renderImagePreviews(mode);
}

function renderImagePreviews(mode) {
    const gridId = mode === 'edit' ? 'editProdNewImgGrid' : 'newProdImgGrid';
    const grid = document.getElementById(gridId);
    if (!grid) return;
    grid.innerHTML = '';
    selectedImageFiles.forEach((file, i) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const div = document.createElement('div');
            div.className = 'relative group';
            div.innerHTML = `<img src="${e.target.result}" class="w-full h-20 object-cover rounded-lg border border-[rgba(0,0,0,0.12)]"><button type="button" onclick="removePreviewImage(${i},'${mode}')" class="absolute -top-1 -right-1 w-5 h-5 bg-[rgba(239,68,68,0.1)]0 text-black rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition"><i class="fas fa-times" style="font-size:8px"></i></button>`;
            grid.appendChild(div);
        };
        reader.readAsDataURL(file);
    });
    // Update button text
    const btnText = document.getElementById('addImgBtnText');
    if (btnText) btnText.textContent = selectedImageFiles.length ? 'Add More Image' : 'Upload First Image';
}

function removePreviewImage(index, mode) {
    selectedImageFiles.splice(index, 1);
    renderImagePreviews(mode || 'new');
}

async function addProduct(e) {
    // priceMax support
    if (e) e.preventDefault();
    const n = document.getElementById('newProdName')?.value;
    let c = document.getElementById('newProdCat')?.value;
    if (c === 'other') { c = document.getElementById('newProdCatCustom')?.value?.trim(); if (!c) { showToast('Enter custom category name', 'warning'); return; } }
    const desc = document.getElementById('newProdDesc')?.value || '';
    const p = parseInt(document.getElementById('newProdPrice')?.value);
    const pm = parseInt(document.getElementById('newProdPriceMax')?.value) || 0;
    const o = parseInt(document.getElementById('newProdOldPrice')?.value) || Math.round(p * 1.2);
    const s = parseInt(document.getElementById('newProdStock')?.value) || 50;
    if (!n || !p) { showToast('Fill product name and price', 'warning'); return }
    const disc = o > p ? Math.round((1 - p / o) * 100) + '% off' : 'New';
    const btn = document.getElementById('addProductBtn');
    btn.disabled = true; btn.textContent = 'Adding...';

    let imgUrl = document.getElementById('newProdImg')?.value || '';
    let extraImages = [];

    // Upload multiple images if selected
    if (selectedImageFiles.length) {
        try {
            const formData = new FormData();
            selectedImageFiles.forEach(f => formData.append('images', f));
            const user = JSON.parse(localStorage.getItem('mj_user'));
            const uploadRes = await fetch(API_BASE + '/upload-multiple', { method: 'POST', headers: { 'Authorization': `Bearer ${user?.token}` }, body: formData });
            const uploadData = await uploadRes.json();
            if (uploadData.success && uploadData.imageUrls?.length) {
                if (!imgUrl) imgUrl = uploadData.imageUrls[0];
                extraImages = uploadData.imageUrls;
            }
        } catch (err) { console.error('Image upload error', err); }
    }
    if (!imgUrl) imgUrl = `https://picsum.photos/id/${Math.floor(Math.random() * 200)}/400/300`;

    try {
        const r = await api.addProduct({ name: n, description: desc, category: c, price: p, priceMax: pm, oldPrice: o, discount: disc, stock: s, rating: 4.5, img: imgUrl, images: extraImages });
        if (r.product) products.unshift(r.product);
        renderAdmin(); fetchAdminStats(); closeModal('addProductModal');
        showToast('Product added successfully! ✅');
        selectedImageFiles = [];
        // Reset form
        ['newProdName', 'newProdDesc', 'newProdPrice', 'newProdPriceMax', 'newProdOldPrice', 'newProdStock', 'newProdImg', 'newProdCatCustom'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
        const grid = document.getElementById('newProdImgGrid'); if (grid) grid.innerHTML = '';
        const btnTxt = document.getElementById('addImgBtnText'); if (btnTxt) btnTxt.textContent = 'Upload First Image';
    } catch (e) { showToast('Error adding product', 'error') }
    btn.disabled = false; btn.textContent = 'Add Product';
}

async function deleteProduct(id) {
    showConfirmDialog('Are you sure you want to delete this product? This cannot be undone.', async () => {
        try {
            const res = await api.deleteProduct(id);
            if (res.success) { products = products.filter(p => (p._id || p.id) !== id); renderAdmin(); fetchAdminStats(); showToast('Product deleted', 'info') }
            else { showToast(res.message || 'Delete failed', 'error') }
        } catch (e) { showToast('Failed to delete product', 'error'); console.error(e) }
    });
}
async function updateProductField(id, field, value) { try { const updates = {}; updates[field] = field === 'price' || field === 'stock' ? Number(value) : value; await api.updateProduct(id, updates); const p = products.find(x => (x._id || x.id) === id); if (p) p[field] = updates[field]; showToast('Updated') } catch (e) { showToast('Error', 'error') } }
async function addWorkerAdmin() {
    const n = document.getElementById('newWorkerName')?.value;
    const r = document.getElementById('newWorkerRole')?.value;
    const e = document.getElementById('newWorkerExp')?.value || '1 yr';
    const c = document.getElementById('newWorkerCity')?.value || 'Bihar Sharif';
    const p = document.getElementById('newWorkerPrice')?.value;
    const ph = document.getElementById('newWorkerPhone')?.value || '+91 0000000000';
    if (!n || !p) { showToast('Fill required fields', 'warning'); return; }

    const btn = document.querySelector('#addWorkerModal .btn-primary');
    if (btn) { btn.disabled = true; btn.textContent = 'Adding...'; }

    let imgUrl = `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 99)}.jpg`;

    // Upload image if selected
    const fileInput = document.getElementById('newWorkerImgFile');
    if (fileInput && fileInput.files.length) {
        try {
            const formData = new FormData();
            formData.append('images', fileInput.files[0]);
            const user = JSON.parse(localStorage.getItem('mj_user'));
            const uploadRes = await fetch(API_BASE + '/upload-multiple', { method: 'POST', headers: { 'Authorization': `Bearer ${user?.token}` }, body: formData });
            const uploadData = await uploadRes.json();
            if (uploadData.success && uploadData.imageUrls?.length) {
                imgUrl = uploadData.imageUrls[0];
            }
        } catch (err) { console.error('Worker image upload error', err); }
    }

    try {
        const res = await api.addWorker({ name: n, role: r, exp: e, city: c, price: p, phone: ph, rating: 4.0, verified: false, status: 'Available', img: imgUrl });
        if (res.worker) workers.push(res.worker);
        renderAdmin();
        closeModal('addWorkerModal');
        showToast('Worker added!');

        // Reset form
        ['newWorkerName', 'newWorkerRole', 'newWorkerExp', 'newWorkerCity', 'newWorkerPrice', 'newWorkerPhone', 'newWorkerImgFile'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
        const preview = document.getElementById('newWorkerImgPreview');
        if (preview) preview.src = `https://randomuser.me/api/portraits/men/99.jpg`;
    } catch (err) { showToast('Error', 'error'); }

    if (btn) { btn.disabled = false; btn.textContent = 'Add Worker'; }
}
async function deleteWorker(id) {
    showConfirmDialog('Are you sure you want to remove this worker? This cannot be undone.', async () => {
        try {
            const res = await api.deleteWorker(id);
            if (res.success) { workers = workers.filter(w => (w._id || w.id) !== id); renderAdmin(); fetchAdminStats(); showToast('Worker removed', 'info') }
            else { showToast(res.message || 'Delete failed', 'error') }
        } catch (e) { showToast('Failed to remove worker', 'error'); console.error(e) }
    });
}
async function updateWorkerField(id, field, value) { try { const updates = {}; updates[field] = value; await api.updateWorker(id, updates); showToast('Worker updated') } catch (e) { showToast('Error', 'error') } }
async function addCategoryAdmin() { const n = document.getElementById('newCatName')?.value; const i = document.getElementById('newCatIcon')?.value || 'fas fa-box'; const d = document.getElementById('newCatDesc')?.value || ''; if (!n) { showToast('Fill required fields', 'warning'); return } try { await api.addCategory({ name: n, icon: i, description: d }); closeModal('addCategoryModal'); showToast('Category added!'); fetchAdminStats(); } catch (e) { showToast('Error', 'error') } }

// ===== CHATBOT =====
async function sendChat() {
    const input = document.getElementById('chatInput');
    const msg = input?.value.trim();
    if (!msg) return;
    const box = document.getElementById('chatMessages');

    // User message
    box.innerHTML += `<div class="flex gap-2 justify-end"><div class="bg-[#000000] text-[#FFFFFF] rounded-2xl rounded-tr-none p-3 shadow-lg max-w-[80%]"><p class="text-sm font-medium">${msg}</p></div></div>`;
    input.value = '';
    box.scrollTop = box.scrollHeight;

    // Loading indicator
    const loadingId = 'loading-' + Date.now();
    box.innerHTML += `<div id="${loadingId}" class="flex gap-2"><div class="w-8 h-8 bg-[rgba(0,0,0,0.05)] border border-[rgba(255,255,255,0.1)] rounded-full flex items-center justify-center flex-shrink-0"><i class="fas fa-robot text-black text-xs"></i></div><div class="bg-[rgba(0,0,0,0.02)] border border-[rgba(0,0,0,0.1)] text-black rounded-2xl rounded-tl-none p-3 shadow-lg max-w-[80%]"><p class="text-sm flex gap-1"><span class="animate-bounce">.</span><span class="animate-bounce" style="animation-delay:0.1s">.</span><span class="animate-bounce" style="animation-delay:0.2s">.</span></p></div></div>`;
    box.scrollTop = box.scrollHeight;

    try {
        const response = await api.sendChatMessage(msg);
        document.getElementById(loadingId)?.remove();
        const formattedReply = (response.reply || 'Sorry, I am offline.').replace(/\n/g, '<br>');
        box.innerHTML += `<div class="flex gap-2"><div class="w-8 h-8 bg-[rgba(0,0,0,0.05)] border border-[rgba(255,255,255,0.1)] rounded-full flex items-center justify-center flex-shrink-0"><i class="fas fa-robot text-black text-xs"></i></div><div class="bg-[rgba(0,0,0,0.02)] border border-[rgba(0,0,0,0.1)] text-black rounded-2xl rounded-tl-none p-3 shadow-lg max-w-[80%]"><p class="text-sm">${formattedReply}</p></div></div>`;
        box.scrollTop = box.scrollHeight;
    } catch (e) {
        document.getElementById(loadingId)?.remove();
        box.innerHTML += `<div class="flex gap-2"><div class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0"><i class="fas fa-exclamation text-red-500 text-sm"></i></div><div class="bg-[#1E1E1E] rounded-2xl rounded-tl-none p-3 shadow-lg shadow-black/20 border border-red-100"><p class="text-sm text-red-500">Connection error. Please call +91 98765 43210</p></div></div>`;
        box.scrollTop = box.scrollHeight;
    }
}

function sendQuickChat(keyword) {
    const input = document.getElementById('chatInput');
    if (input) {
        input.value = keyword;
        sendChat();
    }
}

// ===== EDIT PRODUCT =====
let editImageFiles = [];
let editKeepImages = [];

function openEditProduct(id) {
    const p = products.find(x => (x._id || x.id) === id);
    if (!p) return;
    document.getElementById('editProdId').value = p._id || p.id;
    document.getElementById('editProdName').value = p.name || '';
    document.getElementById('editProdDesc').value = p.description || '';
    document.getElementById('editProdPrice').value = p.price || '';
    document.getElementById('editProdPriceMax').value = p.priceMax || '';
    document.getElementById('editProdOldPrice').value = p.oldPrice || '';
    document.getElementById('editProdStock').value = p.stock || 0;
    const catSel = document.getElementById('editProdCat');
    const knownCats = ['electrical', 'plumbing', 'paints', 'flooring', 'hardware', 'construction'];
    if (knownCats.includes(p.category)) { catSel.value = p.category; document.getElementById('editCustomCatBox').style.display = 'none'; }
    else { catSel.value = 'other'; document.getElementById('editCustomCatBox').style.display = 'block'; document.getElementById('editProdCatCustom').value = p.category; }
    // Show current images
    editKeepImages = [p.img, ...(p.images || [])].filter(Boolean);
    editImageFiles = [];
    selectedImageFiles = []; // reset shared upload list
    renderEditCurrentImages();
    document.getElementById('editProdNewImgGrid').innerHTML = '';
    document.getElementById('editProdImgUrl').value = '';
    openModal('editProductModal');
}

function renderEditCurrentImages() {
    const grid = document.getElementById('editProdCurrentImgs');
    if (!editKeepImages.length) { grid.innerHTML = '<p class="text-xs text-[#666] col-span-3">No images</p>'; return; }
    grid.innerHTML = editKeepImages.map((img, i) => `<div class="relative group"><img src="${img}" class="w-full h-20 object-cover rounded-lg border"><button type="button" onclick="removeEditCurrentImage(${i})" class="absolute -top-1 -right-1 w-5 h-5 bg-[rgba(239,68,68,0.1)]0 text-black rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition"><i class="fas fa-times" style="font-size:8px"></i></button></div>`).join('');
}

function removeEditCurrentImage(i) { editKeepImages.splice(i, 1); renderEditCurrentImages(); }

function previewEditImages(input) {
    editImageFiles = Array.from(input.files).slice(0, 5);
    const grid = document.getElementById('editProdNewImgGrid');
    const ph = document.getElementById('editProdImgPlaceholder');
    if (!editImageFiles.length) { grid.classList.add('hidden'); ph.classList.remove('hidden'); return; }
    grid.innerHTML = ''; grid.classList.remove('hidden'); ph.classList.add('hidden');
    editImageFiles.forEach((file, i) => {
        const reader = new FileReader();
        reader.onload = (e) => { const d = document.createElement('div'); d.className = 'relative group'; d.innerHTML = `<img src="${e.target.result}" class="w-full h-20 object-cover rounded-lg border">`; grid.appendChild(d); };
        reader.readAsDataURL(file);
    });
}

async function saveEditProduct() {
    const id = document.getElementById('editProdId').value;
    const name = document.getElementById('editProdName').value;
    let cat = document.getElementById('editProdCat').value;
    if (cat === 'other') cat = document.getElementById('editProdCatCustom')?.value?.trim() || '';
    const price = parseInt(document.getElementById('editProdPrice').value);
    const priceMax = parseInt(document.getElementById('editProdPriceMax')?.value) || 0;
    const oldPrice = parseInt(document.getElementById('editProdOldPrice').value) || Math.round(price * 1.2);
    const stock = parseInt(document.getElementById('editProdStock').value) || 0;
    const desc = document.getElementById('editProdDesc').value || '';
    if (!name || !price) { showToast('Name and price required', 'warning'); return; }
    const disc = oldPrice > price ? Math.round((1 - price / oldPrice) * 100) + '% off' : 'New';
    const btn = document.getElementById('editProductBtn');
    btn.disabled = true; btn.textContent = 'Saving...';
    let newUrls = [];
    if (selectedImageFiles.length) {
        try {
            const fd = new FormData(); selectedImageFiles.forEach(f => fd.append('images', f));
            const user = JSON.parse(localStorage.getItem('mj_user'));
            const r = await fetch(API_BASE + '/upload-multiple', { method: 'POST', headers: { 'Authorization': `Bearer ${user?.token}` }, body: fd });
            const d = await r.json();
            if (d.success) newUrls = d.imageUrls;
        } catch (e) { console.error(e); }
    }
    const urlField = document.getElementById('editProdImgUrl').value.trim();
    if (urlField) newUrls.push(urlField);
    const allImgs = [...editKeepImages, ...newUrls];
    const mainImg = allImgs[0] || '';
    try {
        await api.updateProduct(id, { name, description: desc, category: cat, price, priceMax, oldPrice, discount: disc, stock, img: mainImg, images: allImgs });
        const p = products.find(x => (x._id || x.id) === id);
        if (p) { Object.assign(p, { name, description: desc, category: cat, price, priceMax, oldPrice, discount: disc, stock, img: mainImg, images: allImgs }); }
        renderAdmin(); fetchAdminStats(); closeModal('editProductModal');
        showToast('Product updated! ✅');
    } catch (e) { showToast('Update failed', 'error'); }
    btn.disabled = false; btn.textContent = 'Save Changes';
}

// ===== SLIDE MANAGEMENT (Admin) =====
let newSlideGalleryImgs = [];
function previewGalleryImages(input) {
    const preview = document.getElementById('newSlideGalleryPreview');
    preview.innerHTML = ''; newSlideGalleryImgs = [];
    if (!input.files || !input.files.length) return;
    Array.from(input.files).forEach(file => {
        newSlideGalleryImgs.push(file);
        const reader = new FileReader();
        reader.onload = e => { preview.innerHTML += `<img src="${e.target.result}" class="w-20 h-16 object-cover rounded">`; };
        reader.readAsDataURL(file);
    });
}

async function addSlideAdmin() {
    const imgInput = document.getElementById('newSlideImgFile');
    const title = document.getElementById('newSlideTitle').value;
    const subtitle = document.getElementById('newSlideSubtitle').value;
    const buttonText = document.getElementById('newSlideBtnText').value || 'Explore →';
    const buttonLink = document.getElementById('newSlideBtnLink').value || '#';
    const sortOrder = parseInt(document.getElementById('newSlideOrder').value) || 0;

    if (!title || (!imgInput.files || imgInput.files.length === 0)) {
        showToast('Title and Image are required', 'warning'); return;
    }

    try {
        const user = JSON.parse(localStorage.getItem('mj_user'));

        // 1. Upload main image
        const fdMain = new FormData(); fdMain.append('image', imgInput.files[0]);
        const resMain = await fetch(API_BASE + '/upload', { method: 'POST', headers: { 'Authorization': `Bearer ${user?.token}` }, body: fdMain });
        const dataMain = await resMain.json();
        const mainImgUrl = dataMain.success ? dataMain.imageUrl : 'img/slider_interior.png';

        // 2. Upload gallery images if any
        let galleryImageUrls = [];
        if (newSlideGalleryImgs.length > 0) {
            const fdGallery = new FormData();
            newSlideGalleryImgs.forEach(f => fdGallery.append('images', f));
            const resGallery = await fetch(API_BASE + '/upload-multiple', { method: 'POST', headers: { 'Authorization': `Bearer ${user?.token}` }, body: fdGallery });
            const dataGallery = await resGallery.json();
            if (dataGallery.success) galleryImageUrls = dataGallery.imageUrls;
        }

        // 3. Create Slide
        const newSlide = { title, subtitle, img: mainImgUrl, buttonText, buttonLink, sortOrder, galleryImages: galleryImageUrls };
        const res = await api.addSlide(newSlide);
        if (res.success) {
            slides.push(res.slide);
            slides.sort((a, b) => a.sortOrder - b.sortOrder);
            renderAdmin();
            closeModal('addSlideModal');
            showToast('Slide added successfully! ✅');
            // reset form
            ['newSlideTitle', 'newSlideSubtitle', 'newSlideBtnText', 'newSlideBtnLink'].forEach(id => document.getElementById(id).value = '');
            document.getElementById('newSlideImgPreview').src = 'https://via.placeholder.com/400x150';
            document.getElementById('newSlideGalleryPreview').innerHTML = '';
            newSlideGalleryImgs = [];
        }
    } catch (e) { console.error(e); showToast('Error adding slide', 'error'); }
}

async function deleteSlide(id) {
    showConfirmDialog("Are you sure you want to delete this slide?", async () => {
        try {
            await api.deleteSlide(id);
            slides = slides.filter(s => (s._id || s.id) !== id);
            renderAdmin(); showToast('Slide deleted', 'warning');
        } catch (e) { showToast('Error deleting slide', 'error'); }
    });
}

async function updateSlideField(id, field, val) {
    try {
        const payload = {}; payload[field] = val;
        await api.updateSlide(id, payload);
        const s = slides.find(x => (x._id || x.id) === id);
        if (s) s[field] = val;
        if (field === 'sortOrder') { slides.sort((a, b) => a.sortOrder - b.sortOrder); renderAdmin(); }
        showToast('Slide updated');
    } catch (e) { showToast('Error updating slide', 'error'); }
}

let editKeepGalleryImages = [];
function openEditSlide(id) {
    const s = slides.find(x => (x._id || x.id) === id);
    if (!s) return;
    document.getElementById('editSlideId').value = id;
    document.getElementById('editSlideTitle').value = s.title || '';
    document.getElementById('editSlideSubtitle').value = s.subtitle || '';
    document.getElementById('editSlideBtnText').value = s.buttonText || '';
    document.getElementById('editSlideBtnLink').value = s.buttonLink || '';
    document.getElementById('editSlideOrder').value = s.sortOrder || 0;

    document.getElementById('editSlideImgPreview').src = s.img || 'https://via.placeholder.com/400x150';
    document.getElementById('editSlideImgUrl').value = s.img || '';

    editKeepGalleryImages = s.galleryImages || [];
    renderEditSlideGallery();

    document.getElementById('editSlideGalleryPreview').innerHTML = '';
    newSlideGalleryImgs = [];
    document.getElementById('editSlideGalleryFiles').value = '';

    openModal('editSlideModal');
}

function renderEditSlideGallery() {
    const grid = document.getElementById('editSlideKeepGalleryGrid');
    if (!grid) return;
    grid.innerHTML = editKeepGalleryImages.map((url, i) => `
        <div class="relative group">
            <img src="${url}" class="w-full h-20 object-cover rounded-lg border">
            <button type="button" onclick="editKeepGalleryImages.splice(${i}, 1); renderEditSlideGallery()" class="absolute top-1 right-1 bg-[rgba(239,68,68,0.1)]0 text-black w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition"><i class="fas fa-times text-xs"></i></button>
        </div>
    `).join('');
}

function previewEditSlideGalleryImages(input) {
    const preview = document.getElementById('editSlideGalleryPreview');
    preview.innerHTML = ''; newSlideGalleryImgs = [];
    if (!input.files || !input.files.length) return;
    Array.from(input.files).forEach(file => {
        newSlideGalleryImgs.push(file);
        const reader = new FileReader();
        reader.onload = e => { preview.innerHTML += `<img src="${e.target.result}" class="w-20 h-16 object-cover rounded">`; };
        reader.readAsDataURL(file);
    });
}

async function saveEditSlide() {
    const id = document.getElementById('editSlideId').value;
    const title = document.getElementById('editSlideTitle').value;
    const subtitle = document.getElementById('editSlideSubtitle').value;
    const buttonText = document.getElementById('editSlideBtnText').value || 'Explore →';
    const buttonLink = document.getElementById('editSlideBtnLink').value || '#';
    const sortOrder = parseInt(document.getElementById('editSlideOrder').value) || 0;

    if (!title) { showToast('Title is required', 'warning'); return; }

    const btn = document.getElementById('editSlideBtn');
    btn.disabled = true; btn.textContent = 'Saving...';

    try {
        const user = JSON.parse(localStorage.getItem('mj_user'));
        let mainImgUrl = document.getElementById('editSlideImgUrl').value;
        const imgInput = document.getElementById('editSlideImgFile');
        if (imgInput.files && imgInput.files.length > 0) {
            const fdMain = new FormData(); fdMain.append('image', imgInput.files[0]);
            const resMain = await fetch(API_BASE + '/upload', { method: 'POST', headers: { 'Authorization': `Bearer ${user?.token}` }, body: fdMain });
            const dataMain = await resMain.json();
            if (dataMain.success) mainImgUrl = dataMain.imageUrl;
        }

        let newGalleryUrls = [];
        if (newSlideGalleryImgs.length > 0) {
            const fdGallery = new FormData();
            newSlideGalleryImgs.forEach(f => fdGallery.append('images', f));
            const resGallery = await fetch(API_BASE + '/upload-multiple', { method: 'POST', headers: { 'Authorization': `Bearer ${user?.token}` }, body: fdGallery });
            const dataGallery = await resGallery.json();
            if (dataGallery.success) newGalleryUrls = dataGallery.imageUrls;
        }

        const galleryImages = [...editKeepGalleryImages, ...newGalleryUrls];

        const payload = { title, subtitle, img: mainImgUrl, buttonText, buttonLink, sortOrder, galleryImages };
        await api.updateSlide(id, payload);

        const s = slides.find(x => (x._id || x.id) === id);
        if (s) Object.assign(s, payload);
        slides.sort((a, b) => a.sortOrder - b.sortOrder);
        renderAdmin(); closeModal('editSlideModal'); showToast('Slide updated! ✅');
    } catch (e) { console.error(e); showToast('Update failed', 'error'); }

    btn.disabled = false; btn.textContent = 'Save Changes';
}

// ===== LIGHTBOX =====
let lightboxImages = [];
let lightboxIndex = 0;

function openLightbox(images, startIndex) {
    lightboxImages = images.filter(Boolean);
    lightboxIndex = startIndex || 0;
    if (!lightboxImages.length) return;
    document.getElementById('lightboxImg').src = lightboxImages[lightboxIndex];
    document.getElementById('lightboxCounter').textContent = lightboxImages.length > 1 ? `${lightboxIndex + 1} / ${lightboxImages.length}` : '';
    document.getElementById('lightboxModal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    document.getElementById('lightboxModal').style.display = 'none';
    document.body.style.overflow = '';
}

function lightboxNav(dir) {
    lightboxIndex = (lightboxIndex + dir + lightboxImages.length) % lightboxImages.length;
    document.getElementById('lightboxImg').src = lightboxImages[lightboxIndex];
    document.getElementById('lightboxCounter').textContent = `${lightboxIndex + 1} / ${lightboxImages.length}`;
}

// Keyboard nav for lightbox
document.addEventListener('keydown', (e) => {
    if (document.getElementById('lightboxModal')?.style.display === 'flex') {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') lightboxNav(-1);
        if (e.key === 'ArrowRight') lightboxNav(1);
    }
});

// ===== ANIMATIONS =====
function animateCounters() { const counters = document.querySelectorAll('.counter-value'); const observer = new IntersectionObserver((entries) => { entries.forEach(e => { if (e.isIntersecting) { const target = parseInt(e.target.dataset.target); let count = 0; const step = Math.ceil(target / 60); const timer = setInterval(() => { count += step; if (count >= target) { count = target; clearInterval(timer) } e.target.textContent = count.toLocaleString() + '+' }, 30); observer.unobserve(e.target) } }) }, { threshold: 0.5 }); counters.forEach(c => observer.observe(c)) }
function initScrollReveal() { const observer = new IntersectionObserver((entries) => { entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('active') }) }, { threshold: 0.1 }); document.querySelectorAll('.reveal').forEach(el => observer.observe(el)) }

