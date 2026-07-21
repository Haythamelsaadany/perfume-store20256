// ======================== المنتجات (ثابتة في الملف) ========================
const defaultProducts = [
    {
        id: 1,
        name: "Yara Candy",
        category: "حريمي",
        sizes: [{ size: "100ml", price: 120.00 }],
        img: "images/women/yara.jpg",
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
    },
    // ===== أضف منتجات جديدة هنا =====
    // {
    //     id: 2,
    //     name: "اسم المنتج",
    //     category: "رجالي",
    //     sizes: [{ size: "100ml", price: 99.99 }],
    //     img: "images/اسم_الصورة.jpg",
    //     desc: "وصف قصير",
    //     fullDesc: "وصف طويل...",
    //     salesCount: 0,
    //     gender: "رجالي",
    //     discountPercent: 0,
    //     details: { topNotes: [], heartNotes: [], baseNotes: [] }
    // }
];

let products = [];
let categories = [];

function loadProducts() {
    try {
        const stored = localStorage.getItem('storeProducts');
        if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed && parsed.length > 0) {
                // التحقق من وجود المنتجات الجديدة في localStorage
                let updated = false;
                const newIds = defaultProducts.map(p => p.id);
                const existingIds = parsed.map(p => p.id);
                const missing = newIds.filter(id => !existingIds.includes(id));
                if (missing.length > 0) {
                    // إضافة المنتجات المفقودة
                    const newProducts = defaultProducts.filter(p => missing.includes(p.id));
                    parsed.push(...newProducts);
                    updated = true;
                }
                if (updated) {
                    localStorage.setItem('storeProducts', JSON.stringify(parsed));
                }
                products = parsed;
                return;
            }
        }
    } catch (e) {}
    
    // لو مفيش بيانات، نحمل الافتراضية
    products = JSON.parse(JSON.stringify(defaultProducts));
    localStorage.setItem('storeProducts', JSON.stringify(products));
}
loadProducts();

categories = [...new Set(products.map(p => p.category))];
localStorage.setItem('storeCategories', JSON.stringify(categories));

// ===== باقي الكود (عداد، عطر اليوم، سلة، عرض المنتجات) =====

let cart = JSON.parse(localStorage.getItem('luxuryCart') || '[]');

// عداد الزوار
let visitCount = parseInt(localStorage.getItem('totalVisits')) || 4050;
visitCount++;
localStorage.setItem('totalVisits', visitCount);
const counterSpan = document.getElementById('visitCounter');
if (counterSpan) counterSpan.innerText = visitCount.toLocaleString('ar-EG');

// عطر اليوم
function showDailyPerfume() {
    const container = document.getElementById('daily-perfume-content');
    if (!container || products.length === 0) return;
    const today = new Date().toDateString();
    let dailyId = localStorage.getItem('dailyPerfumeId');
    let lastDate = localStorage.getItem('dailyPerfumeDate');
    if (!dailyId || lastDate !== today) {
        dailyId = products[Math.floor(Math.random() * products.length)].id;
        localStorage.setItem('dailyPerfumeId', dailyId);
        localStorage.setItem('dailyPerfumeDate', today);
    }
    const perfume = products.find(p => p.id === dailyId);
    if (perfume) {
        const imgSrc = perfume.img || "https://img.icons8.com/ios-filled/100/ffffff/perfume-bottle.png";
        container.innerHTML = `
            <div style="display:flex; align-items:center; gap:15px; justify-content:center;">
                <img src="${imgSrc}" onerror="this.src='https://img.icons8.com/ios-filled/100/ffffff/perfume-bottle.png';">
                <div><strong>${perfume.name}</strong><br>${perfume.desc}</div>
                <a href="product.html?id=${perfume.id}" class="btn-shop" style="padding:5px 15px; font-size:0.8rem;">اطلبه الآن</a>
            </div>
        `;
    }
}

// الأكثر مبيعاً
function renderBestSellers() {
    const container = document.getElementById('best-sellers-grid');
    if (!container || products.length === 0) return;
    const sorted = [...products].sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0)).slice(0, 3);
    container.innerHTML = sorted.map(p => {
        const imgSrc = p.img || "https://img.icons8.com/ios-filled/100/ffffff/perfume-bottle.png";
        return `
            <div class="best-seller-item">
                <img src="${imgSrc}" onerror="this.src='https://img.icons8.com/ios-filled/100/ffffff/perfume-bottle.png';">
                <div class="item-info">
                    <h4>${p.name}</h4>
                    <span class="price">${p.sizes[0].price} ج.م</span>
                </div>
                <a href="product.html?id=${p.id}" style="color:#f7c56e; text-decoration:none; font-size:0.8rem;">تسوق</a>
            </div>
        `;
    }).join('');
}

// عرض المنتجات مع الفلاتر
let currentFilter = { gender: 'all', category: 'all', sort: 'default' };

function renderProducts() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;

    let filtered = [...products];

    if (currentFilter.gender !== 'all') {
        filtered = filtered.filter(p => p.gender === currentFilter.gender);
    }
    if (currentFilter.category !== 'all') {
        filtered = filtered.filter(p => p.category === currentFilter.category);
    }

    const searchVal = document.getElementById('searchInput')?.value.trim().toLowerCase() || '';
    if (searchVal) {
        filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(searchVal) || 
            p.desc.toLowerCase().includes(searchVal) ||
            (p.details?.topNotes?.some(n => n.includes(searchVal))) ||
            (p.details?.heartNotes?.some(n => n.includes(searchVal))) ||
            (p.details?.baseNotes?.some(n => n.includes(searchVal)))
        );
    }

    if (currentFilter.sort === 'price-asc') {
        filtered.sort((a, b) => a.sizes[0].price - b.sizes[0].price);
    } else if (currentFilter.sort === 'price-desc') {
        filtered.sort((a, b) => b.sizes[0].price - a.sizes[0].price);
    } else if (currentFilter.sort === 'sales-desc') {
        filtered.sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0));
    }

    if (filtered.length === 0) {
        grid.innerHTML = `<div style="text-align:center; padding:40px; color:#aaa;">لا توجد منتجات مطابقة</div>`;
        return;
    }

    grid.innerHTML = filtered.map(p => {
        const imgSrc = p.img || "https://img.icons8.com/ios-filled/100/ffffff/perfume-bottle.png";
        const genderTag = p.gender === 'رجالي' ? '👔 رجالي' : p.gender === 'حريمي' ? '👗 حريمي' : '⚪ مختلط';
        return `
            <div class="product-card" onclick="goToProduct(${p.id})">
                <img src="${imgSrc}" onerror="this.src='https://img.icons8.com/ios-filled/100/ffffff/perfume-bottle.png';">
                <span class="gender-tag">${genderTag}</span>
                <h3>${p.name}</h3>
                <p style="color:#aaa; font-size:0.85rem;">${p.desc}</p>
                <span class="price">${p.sizes[0].price} ج.م</span>
                ${p.discountPercent > 0 ? `<span style="color:#e53935; font-size:0.7rem;">خصم ${p.discountPercent}%</span>` : ''}
                <button class="add-to-cart" onclick="event.stopPropagation(); addToCart(${p.id})">🛒 أضف للسلة</button>
            </div>
        `;
    }).join('');
}

function goToProduct(id) {
    window.location.href = `product.html?id=${id}`;
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    const key = `${product.id}_${product.sizes[0].size}`;
    const existing = cart.find(i => i.key === key);
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({
            key: key,
            id: product.id,
            name: product.name,
            price: product.sizes[0].price,
            quantity: 1,
            size: product.sizes[0].size,
            img: product.img
        });
    }
    localStorage.setItem('luxuryCart', JSON.stringify(cart));
    updateCartBadge();
    alert(`✅ تم إضافة ${product.name} إلى السلة`);
}

function updateCartBadge() {
    const total = cart.reduce((s, i) => s + (i.quantity || 1), 0);
    const badge = document.getElementById('cart-count');
    if (badge) badge.innerText = total;
}

// الأحداث
document.addEventListener('DOMContentLoaded', function() {
    renderProducts();
    showDailyPerfume();
    renderBestSellers();
    updateCartBadge();

    // البحث
    document.getElementById('searchBtn').addEventListener('click', renderProducts);
    document.getElementById('searchInput').addEventListener('keyup', function(e) {
        if (e.key === 'Enter') renderProducts();
    });
    document.getElementById('searchInput').addEventListener('input', renderProducts);

    // فلاتر النوع
    document.querySelectorAll('.gender-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.gender-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentFilter.gender = this.dataset.filter;
            renderProducts();
        });
    });

    // فلاتر الفئة
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentFilter.category = this.dataset.category;
            renderProducts();
        });
    });

    // فلاتر الترتيب
    document.querySelectorAll('.sort-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentFilter.sort = this.dataset.sort;
            renderProducts();
        });
    });

    // تبديل الثيم
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            document.body.className = `theme-${this.dataset.theme}`;
            localStorage.setItem('siteTheme', this.dataset.theme);
        });
    });

    // استرجاع الثيم المحفوظ
    const savedTheme = localStorage.getItem('siteTheme');
    if (savedTheme) {
        document.body.className = `theme-${savedTheme}`;
        document.querySelectorAll('.theme-btn').forEach(b => {
            b.classList.toggle('active', b.dataset.theme === savedTheme);
        });
    }
const defaultProducts = [
    // ===== المنتج الأول: Yara Candy (موجود) =====
    {
        id: 1,
        name: "Yara Candy",
        category: "حريمي",
        sizes: [{ size: "100ml", price: 120.00 }],
        img: "images/women/yara.jpg",
        desc: "عطر فواكه وحلوى فاخر من Lattafa",
        fullDesc: "EAU DE PERFUME NATURAL SPRAY 100ML - Yara Candy for Women by Lattafa...",
        salesCount: 0,
        gender: "حريمي",
        discountPercent: 0,
        details: {
            topNotes: ["ماندرين أخضر", "كشمش أسود"],
            heartNotes: ["جاردينيا", "فراولة حلوى"],
            baseNotes: ["فانيليا", "مسك"]
        }
    },
    
    // ===== المنتج الجديد 1: أمير الليل =====
    {
        id: 2,
        name: "أمير الليل",
        category: "خشبي",
        sizes: [{ size: "100ml", price: 129.99 }],
        img: "images/amir_layl.jpg",
        desc: "عود وعنبر فاخر",
        fullDesc: "تركيبة فاخرة من العود والعنبر مع خشب الأرز والمسك. يدوم أكثر من 12 ساعة.",
        salesCount: 0,
        gender: "رجالي",
        discountPercent: 10,
        details: {
            topNotes: ["زعفران", "برغموت"],
            heartNotes: ["عود", "ورد بلغاري"],
            baseNotes: ["عنبر", "مسك أبيض"]
        }
    },

    // ===== المنتج الجديد 2: مسك الغروب =====
    {
        id: 3,
        name: "مسك الغروب",
        category: "زهري",
        sizes: [{ size: "100ml", price: 109.99 }],
        img: "images/misk_ghoroub.jpg",
        desc: "مسك وورود ناعمة",
        fullDesc: "مزيج ناعم من المسك الأبيض وزهر البرتقال وخشب الصندل.",
        salesCount: 0,
        gender: "حريمي",
        discountPercent: 5,
        details: {
            topNotes: ["برتقال", "لافندر"],
            heartNotes: ["ورد", "مسك أبيض"],
            baseNotes: ["خشب الصندل", "عنبر خفيف"]
        }
    }
];
    // الاستماع لتغييرات المنتجات من الأدمن
    window.addEventListener('productsUpdated', function() {
        loadProducts();
        renderProducts();
        showDailyPerfume();
        renderBestSellers();
        updateCartBadge();
    });
});