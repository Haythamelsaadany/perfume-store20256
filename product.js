let products = [];

function loadProducts() {
    try {
        const stored = localStorage.getItem('storeProducts');
        if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed && parsed.length > 0) {
                products = parsed;
                return;
            }
        }
    } catch (e) {}
    products = [];
}
loadProducts();

function getProductId() {
    const params = new URLSearchParams(window.location.search);
    return parseInt(params.get('id'));
}

function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem('luxuryCart') || '[]');
    const total = cart.reduce((s, i) => s + (i.quantity || 1), 0);
    const badge = document.getElementById('cart-count-header');
    if (badge) badge.innerText = `(${total})`;
}

function addToCart(product, sizeObj) {
    let cart = JSON.parse(localStorage.getItem('luxuryCart') || '[]');
    const key = `${product.id}_${sizeObj.size}`;
    const existing = cart.find(i => i.key === key);
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({
            key: key,
            id: product.id,
            name: `${product.name} (${sizeObj.size})`,
            price: sizeObj.price,
            quantity: 1,
            size: sizeObj.size,
            img: product.img
        });
    }
    localStorage.setItem('luxuryCart', JSON.stringify(cart));
    updateCartBadge();
    alert(`✅ تم إضافة ${product.name} (${sizeObj.size}) إلى السلة`);
}

// ===== تكبير الصورة =====
function initZoomModal() {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImg');
    const closeBtn = document.getElementById('closeModal');
    const zoomInBtn = document.getElementById('zoomInBtn');
    const zoomOutBtn = document.getElementById('zoomOutBtn');
    const resetBtn = document.getElementById('resetZoomBtn');

    if (!modal) return;

    let currentZoom = 1;
    const MIN_ZOOM = 0.5;
    const MAX_ZOOM = 3;
    let isDragging = false;
    let startX, startY, translateX = 0, translateY = 0;

    document.querySelector('.product-gallery img')?.addEventListener('click', function() {
        modalImg.src = this.src;
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
        resetZoom();
    });

    function closeModal() {
        modal.classList.remove('open');
        document.body.style.overflow = '';
        resetZoom();
    }
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeModal();
    });

    zoomInBtn.addEventListener('click', function() {
        currentZoom = Math.min(currentZoom + 0.2, MAX_ZOOM);
        applyZoom();
    });
    zoomOutBtn.addEventListener('click', function() {
        currentZoom = Math.max(currentZoom - 0.2, MIN_ZOOM);
        applyZoom();
    });
    resetBtn.addEventListener('click', resetZoom);

    modalImg.addEventListener('wheel', function(e) {
        e.preventDefault();
        if (e.deltaY < 0) currentZoom = Math.min(currentZoom + 0.1, MAX_ZOOM);
        else currentZoom = Math.max(currentZoom - 0.1, MIN_ZOOM);
        applyZoom();
    }, { passive: false });

    modalImg.addEventListener('mousedown', function(e) {
        isDragging = true;
        startX = e.clientX - translateX;
        startY = e.clientY - translateY;
        modalImg.style.cursor = 'grabbing';
        e.preventDefault();
    });
    document.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        translateX = e.clientX - startX;
        translateY = e.clientY - startY;
        applyZoom();
    });
    document.addEventListener('mouseup', function() {
        isDragging = false;
        modalImg.style.cursor = 'grab';
    });

    let touchStartX, touchStartY, touchTranslateX, touchTranslateY;
    modalImg.addEventListener('touchstart', function(e) {
        const touch = e.touches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
        touchTranslateX = translateX;
        touchTranslateY = translateY;
        isDragging = true;
    });
    modalImg.addEventListener('touchmove', function(e) {
        if (!isDragging) return;
        const touch = e.touches[0];
        translateX = touchTranslateX + (touch.clientX - touchStartX);
        translateY = touchTranslateY + (touch.clientY - touchStartY);
        applyZoom();
        e.preventDefault();
    }, { passive: false });
    modalImg.addEventListener('touchend', function() {
        isDragging = false;
    });

    modalImg.addEventListener('dblclick', resetZoom);

    function applyZoom() {
        modalImg.style.transform = `scale(${currentZoom}) translate(${translateX / currentZoom}px, ${translateY / currentZoom}px)`;
        let levelEl = document.querySelector('.zoom-level');
        if (!levelEl) {
            const controls = document.querySelector('.zoom-controls');
            if (controls) {
                levelEl = document.createElement('span');
                levelEl.className = 'zoom-level';
                controls.appendChild(levelEl);
            }
        }
        if (levelEl) levelEl.textContent = Math.round(currentZoom * 100) + '%';
    }

    function resetZoom() {
        currentZoom = 1;
        translateX = 0;
        translateY = 0;
        applyZoom();
    }
}

function renderProductDetail() {
    const id = getProductId();
    const product = products.find(p => p.id === id);
    const container = document.getElementById('productDetailContainer');

    if (!product) {
        container.innerHTML = `<div style="text-align:center; padding:50px;"><p>⚠️ المنتج غير موجود</p><a href="index.html" style="color:#d4af37;">⬅️ العودة</a></div>`;
        return;
    }

    let selectedSize = product.sizes[0];
    let currentPrice = selectedSize.price;
    let imgSrc = (product.img && product.img.trim() !== "") ? product.img : "https://img.icons8.com/ios-filled/100/ffffff/perfume-bottle.png";

    let notesHtml = '';
    const details = product.details || {};
    if (details.topNotes?.length || details.heartNotes?.length || details.baseNotes?.length) {
        notesHtml = `
            <div class="notes-section">
                <h3><i class="fas fa-chart-line"></i> النوتات العطرية</h3>
                <div><strong>الافتتاحية:</strong> ${details.topNotes ? details.topNotes.join(' - ') : '—'}</div>
                <div><strong>قلب العطر:</strong> ${details.heartNotes ? details.heartNotes.join(' - ') : '—'}</div>
                <div><strong>قاعدة العطر:</strong> ${details.baseNotes ? details.baseNotes.join(' - ') : '—'}</div>
            </div>
        `;
    } else {
        notesHtml = `<div class="notes-section"><p>📝 لا توجد نوتات عطرية مسجلة.</p></div>`;
    }

    let discount = product.discountPercent || 0;
    let originalPrice = currentPrice;
    let finalPrice = originalPrice * (1 - discount / 100);
    let priceHtml = '';
    if (discount > 0) {
        priceHtml = `
            <div class="price-wrapper">
                <span class="old-price">${originalPrice.toFixed(2)} ج.م</span>
                <span class="new-price">${finalPrice.toFixed(2)} ج.م</span>
                <span class="discount-badge">-${discount}%</span>
            </div>
        `;
    } else {
        priceHtml = `<span class="new-price">${originalPrice.toFixed(2)} ج.م</span>`;
    }

    const sizesHtml = product.sizes.map(s =>
        `<button class="size-btn" data-price="${s.price}" data-size="${s.size}">${s.size} - ${s.price} ج.م</button>`
    ).join('');

    container.innerHTML = `
        <div class="product-detail-container">
            <div class="product-gallery">
                <img src="${imgSrc}" alt="${product.name}" onerror="this.src='https://img.icons8.com/ios-filled/100/ffffff/perfume-bottle.png';">
            </div>
            <div class="product-info">
                <h1>${product.name}</h1>
                <p class="product-description">${product.fullDesc || product.desc}</p>
                ${priceHtml}
                ${notesHtml}
                <div class="option-group">
                    <label>📦 اختر الحجم:</label>
                    <div class="size-buttons" id="sizeButtons">${sizesHtml}</div>
                </div>
                <button id="addToCartBtn" class="btn-primary">🛒 أضف إلى السلة</button>
                <a href="index.html" class="details-link">⬅️ العودة للتسوق</a>
            </div>
        </div>
    `;

    document.querySelectorAll('.size-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            currentPrice = parseFloat(btn.dataset.price);
            selectedSize = { size: btn.dataset.size, price: currentPrice };
            let newFinal = currentPrice * (1 - discount / 100);
            const priceDisplay = document.querySelector('.new-price');
            if (priceDisplay) priceDisplay.innerText = `${newFinal.toFixed(2)} ج.م`;
        });
        if (btn.dataset.size === product.sizes[0].size) btn.classList.add('selected');
    });

    document.getElementById('addToCartBtn').addEventListener('click', () => addToCart(product, selectedSize));

    setTimeout(initZoomModal, 300);
}

document.addEventListener('DOMContentLoaded', function() {
    renderProductDetail();
    updateCartBadge();
});