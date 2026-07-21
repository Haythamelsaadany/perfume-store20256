// ======================== إجبار مسح البيانات القديمة ========================
(function forceReset() {
    console.log('🔄 جاري إعادة ضبط المنتجات...');
    localStorage.removeItem('storeProducts');
    localStorage.removeItem('storeCategories');
    console.log('✅ تم مسح البيانات القديمة');
})();

// ======================== المنتجات ========================
let products = [];
let categories = [];

const defaultProducts = [
    // ===== المنتج الوحيد: Yara Candy =====
    {
        id: 1,
        name: "Yara Candy",
        category: "حريمي",
        sizes: [{ size: "100ml", price: 120.00 }],
        img: "images/women/yara.jpeg",
        desc: "عطر فواكه وحلوى فاخر من Lattafa",
        fullDesc: "EAU DE PERFUME NATURAL SPRAY 100ML - Yara Candy for Women by Lattafa هي إضافة سكرية وحلوة لعائلة Yara. مزيج متناغم من الفواكه المسكرة وشراب الفانيليا الفاخر. تفتتح برائحة الماندرين الأخضر والكشمش الأسود، مع قلب من الجاردينيا وفراولة الحلوى. عطر مثالي لمن يقدّرون الأناقة المتوازنة والرائحة الحلوة الجذابة.",
        salesCount: 0,
        gender: "حريمي",
        discountPercent: 0,
        details: {
            topNotes: ["ماندرين أخضر", "كشمش أسود"],
            heartNotes: ["جاردينيا", "فراولة حلوى"],
            baseNotes: ["فانيليا", "مسك"]
        }
    }
];

function loadProducts() {
    try {
        const stored = localStorage.getItem('storeProducts');
        if (stored) {
            const parsed = JSON.parse(stored);
            // التحقق: هل البيانات تحتوي على Yara Candy فقط؟
            if (parsed.length === 1 && parsed[0].name === "Yara Candy") {
                products = parsed;
            } else {
                products = defaultProducts;
                localStorage.setItem('storeProducts', JSON.stringify(products));
                console.log('✅ تم استبدال البيانات بالمنتج الجديد (Yara Candy)');
            }
        } else {
            products = defaultProducts;
            localStorage.setItem('storeProducts', JSON.stringify(products));
        }
    } catch (e) {
        products = defaultProducts;
        localStorage.setItem('storeProducts', JSON.stringify(products));
    }
    categories = [...new Set(products.map(p => p.category))];
    localStorage.setItem('storeCategories', JSON.stringify(categories));
}

loadProducts();
console.log('📦 المنتجات المحملة:', products.map(p => p.name));

// ======================== باقي الكود (نفس الكود السابق لكن نظيف) ========================
let visitCount = parseInt(localStorage.getItem('totalVisits')) || 4050;
visitCount++;
localStorage.setItem('totalVisits', visitCount);
const counterSpan = document.getElementById('visitCounter');
if (counterSpan) counterSpan.innerText = visitCount.toLocaleString('ar-EG');

function showDailyPerfume() {
    const container = document.getElementById('daily-perfume-content');
    if (!container || products.length === 0) return;
    const today = new Date().toDateString();
    let dailyId = localStorage.getItem('dailyPerfumeId');
    let lastDate = localStorage.getItem('dailyPerfumeDate');
    if (!dailyId || lastDate !== today) {
        dailyId = products[0].id;
        localStorage.setItem('dailyPerfumeId', dailyId);
        localStorage.setItem('dailyPerfumeDate', today);
    }
    const perfume = products.find(p => p.id == dailyId);
    if (perfume) {
        let imgSrc = perfume.img && perfume.img.trim() ? perfume.img : "https://img.icons8.com/ios-filled/100/ffffff/perfume-bottle.png";
        container.innerHTML = `
            <div style="display:flex; align-items:center; justify-content:center; gap:20px; flex-wrap:wrap;">
                <img src="${imgSrc}" style="width:60px; border-radius:20px;" onerror="this.src='https://img.icons8.com/ios-filled/100/ffffff/perfume-bottle.png';">
                <span><strong>${perfume.name}</strong> - ${perfume.desc}</span>
                <a href="product.html?id=${perfume.id}" class="btn-cta" style="padding:5px 15px;">اطلبه الآن</a>
            </div>
        `;
    }
}

function renderBestSellers() {
    const container = document.getElementById('bestSellersGrid');
    if (!container || products.length === 0) return;
    container.innerHTML = products.map(p => {
        let imgSrc = p.img && p.img.trim() ? p.img : "https://img.icons8.com/ios-filled/100/ffffff/perfume-bottle.png";
        return `
            <div class="best-seller-item">
                <img src="${imgSrc}" onerror="this.src='https://img.icons8.com/ios-filled/100/ffffff/perfume-bottle.png';">
                <h4>${p.name}</h4>
                <span class="price">${p.sizes[0].price} ج.م</span>
                <a href="product.html?id=${p.id}" class="details-link">تسوق الآن</a>
            </div>
        `;
    }).join('');
}

let cart = JSON.parse(localStorage.getItem('luxuryCart') || '[]');
function updateCartBadge() {
    const total = cart.reduce((s, i) => s + (i.quantity || 1), 0);
    const badge = document.getElementById('cart-count-header');
    if (badge) badge.innerText = `(${total})`;
    localStorage.setItem('luxuryCart', JSON.stringify(cart));
}
function addToCart(product, sizeObj) {
    const key = `${product.id}_${sizeObj.size}`;
    const existing = cart.find(i => i.key === key);
    if (existing) existing.quantity++;
    else cart.push({ key, id: product.id, name: `${product.name} (${sizeObj.size})`, price: sizeObj.price, quantity: 1, size: sizeObj.size, img: product.img });
    updateCartBadge();
    showToast(`✅ تم إضافة ${product.name} (${sizeObj.size})`);
}
function showToast(msg) {
    let t = document.querySelector('.toast');
    if (t) t.remove();
    const div = document.createElement('div');
    div.className = 'toast';
    div.innerText = msg;
    div.style.cssText = 'position:fixed; bottom:30px; left:50%; transform:translateX(-50%); background:#2e7d32; padding:10px 20px; border-radius:40px; color:white; z-index:9999;';
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 2000);
}

const closeCardBtn = document.getElementById('closePromoCard');
const floatingCard = document.getElementById('floating-promo-card');
if (closeCardBtn && floatingCard) {
    if (localStorage.getItem('promoCardClosed') === 'true') floatingCard.style.display = 'none';
    closeCardBtn.onclick = () => { floatingCard.style.display = 'none'; localStorage.setItem('promoCardClosed', 'true'); };
}

let currentFilter = 'all';

function renderProducts(filter = 'all', search = '') {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    if (products.length === 0) {
        grid.innerHTML = '<div style="text-align:center; padding:40px;">⚠️ لا توجد منتجات</div>';
        return;
    }
    let filtered = products.filter(p => {
        if (filter !== 'all' && p.category !== filter) return false;
        return true;
    });
    if (search && search.trim() !== '') {
        const s = search.toLowerCase();
        filtered = filtered.filter(p => p.name.toLowerCase().includes(s) || p.desc.toLowerCase().includes(s));
    }
    if (filtered.length === 0) {
        grid.innerHTML = '<div style="text-align:center; padding:40px;">😔 لا توجد منتجات مطابقة</div>';
        return;
    }
    grid.innerHTML = filtered.map(p => {
        let imgSrc = p.img && p.img.trim() ? p.img : "https://img.icons8.com/ios-filled/100/ffffff/perfume-bottle.png";
        let defaultSize = p.sizes[0];
        return `
            <div class="product-card" onclick="goToProduct(${p.id})">
                <img src="${imgSrc}" alt="${p.name}" onerror="this.src='https://img.icons8.com/ios-filled/100/ffffff/perfume-bottle.png';">
                <h3>${p.name}</h3>
                <p>${p.desc}</p>
                <span class="price">${defaultSize.price} ج.م</span>
                <button class="add-to-cart" onclick="event.stopPropagation(); addToCartById(${p.id})">🛒 أضف للسلة</button>
            </div>
        `;
    }).join('');
}

function goToProduct(id) {
    window.location.href = `product.html?id=${id}`;
}
function addToCartById(id) {
    const prod = products.find(p => p.id === id);
    if (prod) addToCart(prod, prod.sizes[0]);
}

function renderFilterButtons() {
    const container = document.getElementById('filtersContainer');
    if (!container) return;
    container.innerHTML = `<button class="filter-btn active" data-filter="all">الكل</button>`;
    categories.forEach(cat => {
        container.innerHTML += `<button class="filter-btn" data-filter="${cat}">${cat}</button>`;
    });
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.onclick = () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderProducts(currentFilter, document.getElementById('searchInput')?.value || '');
        };
    });
}

function setMode(mode) {
    document.body.classList.remove('mode-dark', 'mode-light');
    document.body.classList.add(mode);
    localStorage.setItem('siteMode', mode);
    document.querySelectorAll('.style-btn').forEach(b => b.classList.remove('active'));
    if (mode === 'mode-dark') {
        document.getElementById('modeDark').classList.add('active');
        document.querySelector('.mode-toggle-btn').innerHTML = '<i class="fas fa-moon"></i> مود ليلي';
    } else {
        document.getElementById('modeLight').classList.add('active');
        document.querySelector('.mode-toggle-btn').innerHTML = '<i class="fas fa-sun"></i> مود نهاري';
    }
}
const savedMode = localStorage.getItem('siteMode');
setMode(savedMode === 'mode-light' ? 'mode-light' : 'mode-dark');
document.getElementById('modeDark')?.addEventListener('click', () => setMode('mode-dark'));
document.getElementById('modeLight')?.addEventListener('click', () => setMode('mode-light'));
document.getElementById('modeToggle')?.addEventListener('click', () => {
    setMode(document.body.classList.contains('mode-dark') ? 'mode-light' : 'mode-dark');
});

document.addEventListener('DOMContentLoaded', function() {
    renderFilterButtons();
    renderProducts();
    showDailyPerfume();
    renderBestSellers();
    updateCartBadge();
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.oninput = (e) => renderProducts(currentFilter, e.target.value);
});