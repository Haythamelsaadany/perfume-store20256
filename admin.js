// ============================================================
// admin.js - لوحة التحكم (مع صور النوتات)
// ============================================================

const ADMIN_PASSWORD = "Lolo@0202";
let editingId = null;

// ===== تحميل المنتجات =====
function loadProducts() {
    try {
        const stored = localStorage.getItem('storeProducts');
        if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed && parsed.length > 0) return parsed;
        }
    } catch (e) {}
    return [];
}

// ===== حفظ المنتجات =====
function saveProducts(products) {
    localStorage.setItem('storeProducts', JSON.stringify(products));
    const categories = [...new Set(products.map(p => p.category))];
    localStorage.setItem('storeCategories', JSON.stringify(categories));
    window.dispatchEvent(new Event('productsUpdated'));
}

// ===== رفع الصور (عام) =====
function setupImageUpload(inputId, previewId, hiddenId) {
    const fileInput = document.getElementById(inputId);
    const previewImg = document.getElementById(previewId);
    const hiddenInput = document.getElementById(hiddenId);

    if (fileInput) {
        const newFileInput = fileInput.cloneNode(true);
        fileInput.parentNode.replaceChild(newFileInput, fileInput);
        
        newFileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(ev) {
                    hiddenInput.value = ev.target.result;
                    previewImg.src = ev.target.result;
                    previewImg.style.display = 'block';
                };
                reader.readAsDataURL(file);
            }
        });
    }
}

// ===== عرض رسالة الحالة =====
function showStatus(msg, type) {
    const el = document.getElementById('formStatus');
    el.textContent = msg;
    el.className = 'status-msg ' + type;
    el.style.display = 'block';
    setTimeout(() => {
        el.style.display = 'none';
    }, 4000);
}

// ===== عرض لوحة التحكم =====
function renderAdmin() {
    const root = document.getElementById('adminRoot');
    const products = loadProducts();

    let html = `
        <div class="admin-container">
            <h1><i class="fas fa-crown"></i> لوحة التحكم - جواهر العطور</h1>

            <!-- نموذج إضافة/تعديل -->
            <div class="admin-section" id="formSection">
                <h2>${editingId ? '✏️ تعديل المنتج' : '➕ إضافة منتج جديد'}</h2>
                <form id="productForm" class="form-grid">
                    <input type="hidden" id="editId" value="${editingId || ''}">
                    <input type="hidden" id="prodImg" value="">

                    <!-- بيانات المنتج الأساسية -->
                    <div>
                        <label class="label-text">اسم المنتج</label>
                        <input type="text" id="prodName" placeholder="مثال: Yara Candy" required>
                    </div>
                    
                    <div>
                        <label class="label-text">نوع العطر</label>
                        <select id="prodCategory" required>
                            <option value="رجالي">رجالي</option>
                            <option value="حريمي">حريمي</option>
                            <option value="مختلط">مختلط</option>
                            <option value="خشبي">خشبي</option>
                            <option value="زهري">زهري</option>
                            <option value="شرقي">شرقي</option>
                        </select>
                    </div>

                    <div>
                        <label class="label-text">حجم العبوة</label>
                        <input type="text" id="prodSize" placeholder="مثال: 100ml" required>
                    </div>

                    <div>
                        <label class="label-text">السعر (ج.م)</label>
                        <input type="number" id="prodPrice" placeholder="مثال: 120" step="0.01" required>
                    </div>

                    <div>
                        <label class="label-text">نسبة الخصم</label>
                        <input type="number" id="prodDiscount" placeholder="مثال: 10" min="0" max="100">
                    </div>

                    <div>
                        <label class="label-text">وصف قصير</label>
                        <input type="text" id="prodDesc" placeholder="وصف مختصر">
                    </div>

                    <div>
                        <label class="label-text">وصف طويل</label>
                        <textarea id="prodFullDesc" placeholder="وصف تفصيلي للمنتج"></textarea>
                    </div>

                    <!-- النوتات العطرية مع صور -->
                    <div class="notes-group">
                        <div class="note-item">
                            <label class="label-text">الافتتاحية (Top Notes)</label>
                            <input type="text" id="prodTopNotes" placeholder="زعفران، برغموت">
                            <input type="file" id="prodTopImg" accept="image/*">
                            <img id="previewTopImg" class="note-preview">
                            <input type="hidden" id="prodTopImgData" value="">
                        </div>
                        <div class="note-item">
                            <label class="label-text">قلب العطر (Heart Notes)</label>
                            <input type="text" id="prodHeartNotes" placeholder="عود، ورد">
                            <input type="file" id="prodHeartImg" accept="image/*">
                            <img id="previewHeartImg" class="note-preview">
                            <input type="hidden" id="prodHeartImgData" value="">
                        </div>
                        <div class="note-item">
                            <label class="label-text">قاعدة العطر (Base Notes)</label>
                            <input type="text" id="prodBaseNotes" placeholder="عنبر، مسك">
                            <input type="file" id="prodBaseImg" accept="image/*">
                            <img id="previewBaseImg" class="note-preview">
                            <input type="hidden" id="prodBaseImgData" value="">
                        </div>
                    </div>

                    <!-- صورة المنتج الرئيسية -->
                    <div class="file-upload-area">
                        <label class="label-text">📸 صورة المنتج الرئيسية</label>
                        <input type="file" id="prodImgFile" accept="image/*">
                        <div>
                            <img id="previewImg" class="preview-img">
                        </div>
                        <small style="color:#aaa;">اختر صورة من جهازك، ستظهر معاينة فورية</small>
                    </div>

                    <div class="form-actions">
                        <button type="submit" class="btn-primary">${editingId ? '💾 حفظ التعديلات' : '➕ إضافة المنتج'}</button>
                        ${editingId ? `<button type="button" id="cancelEditBtn" class="btn-primary" style="background:#f57c00;">❌ إلغاء التعديل</button>` : ''}
                    </div>
                </form>
                <div id="formStatus" class="status-msg"></div>
            </div>

            <!-- قائمة المنتجات -->
            <div class="admin-section">
                <h2>📦 قائمة المنتجات (${products.length})</h2>
                <div class="action-bar">
                    <button id="refreshBtn" class="btn-primary"><i class="fas fa-sync-alt"></i> تحديث الجدول</button>
                    <button id="syncBtn" class="btn-primary" style="background:#2e7d32;"><i class="fas fa-upload"></i> تطبيق على الموقع</button>
                    <button id="logoutBtn" class="btn-primary" style="background:#c62828; color:white;"><i class="fas fa-sign-out-alt"></i> خروج</button>
                </div>
                <div class="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>الصورة</th>
                                <th>الاسم</th>
                                <th>النوع</th>
                                <th>الحجم</th>
                                <th>السعر</th>
                                <th>الخصم</th>
                                <th>النوتات</th>
                                <th>إجراءات</th>
                            </tr>
                        </thead>
                        <tbody id="productsTableBody">
                            ${products.map(p => `
                                <tr>
                                    <td><img src="${p.img || 'https://img.icons8.com/ios-filled/100/ffffff/perfume-bottle.png'}" onerror="this.src='https://img.icons8.com/ios-filled/100/ffffff/perfume-bottle.png';"></td>
                                    <td>${p.name}</td>
                                    <td>${p.category}</td>
                                    <td>${p.sizes && p.sizes.length > 0 ? p.sizes[0].size : '-'}</td>
                                    <td>${p.sizes && p.sizes.length > 0 ? p.sizes[0].price : '-'} ج.م</td>
                                    <td>${p.discountPercent || 0}%</td>
                                    <td class="notes-cell">
                                        ${p.details?.topNotes?.join('، ') || ''}
                                        ${p.details?.heartNotes?.join('، ') || ''}
                                        ${p.details?.baseNotes?.join('، ') || ''}
                                    </td>
                                    <td>
                                        <button class="btn-edit" data-id="${p.id}"><i class="fas fa-edit"></i> تعديل</button>
                                        <button class="btn-danger" data-id="${p.id}"><i class="fas fa-trash"></i> حذف</button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;

    root.innerHTML = html;

    // ===== ربط الأحداث =====

    // تحميل بيانات المنتج للتعديل
    if (editingId) {
        const p = loadProducts().find(prod => prod.id === editingId);
        if (p) {
            document.getElementById('prodName').value = p.name;
            document.getElementById('prodCategory').value = p.category;
            document.getElementById('prodSize').value = p.sizes && p.sizes.length > 0 ? p.sizes[0].size : '';
            document.getElementById('prodPrice').value = p.sizes && p.sizes.length > 0 ? p.sizes[0].price : '';
            document.getElementById('prodDiscount').value = p.discountPercent || 0;
            document.getElementById('prodDesc').value = p.desc || '';
            document.getElementById('prodFullDesc').value = p.fullDesc || '';
            
            // النوتات
            document.getElementById('prodTopNotes').value = p.details?.topNotes?.join('، ') || '';
            document.getElementById('prodHeartNotes').value = p.details?.heartNotes?.join('، ') || '';
            document.getElementById('prodBaseNotes').value = p.details?.baseNotes?.join('، ') || '';
            
            // صور النوتات
            if (p.details?.topImg) {
                document.getElementById('previewTopImg').src = p.details.topImg;
                document.getElementById('previewTopImg').style.display = 'block';
                document.getElementById('prodTopImgData').value = p.details.topImg;
            }
            if (p.details?.heartImg) {
                document.getElementById('previewHeartImg').src = p.details.heartImg;
                document.getElementById('previewHeartImg').style.display = 'block';
                document.getElementById('prodHeartImgData').value = p.details.heartImg;
            }
            if (p.details?.baseImg) {
                document.getElementById('previewBaseImg').src = p.details.baseImg;
                document.getElementById('previewBaseImg').style.display = 'block';
                document.getElementById('prodBaseImgData').value = p.details.baseImg;
            }
            
            document.getElementById('prodImg').value = p.img || '';
            const preview = document.getElementById('previewImg');
            if (p.img) {
                preview.src = p.img;
                preview.style.display = 'block';
            }
        }
    }

    // إضافة/تعديل منتج
    document.getElementById('productForm').addEventListener('submit', function(e) {
        e.preventDefault();
        let products = loadProducts();
        const id = parseInt(document.getElementById('editId').value) || Date.now();
        const name = document.getElementById('prodName').value.trim();
        const category = document.getElementById('prodCategory').value;
        const size = document.getElementById('prodSize').value.trim();
        const price = parseFloat(document.getElementById('prodPrice').value);
        const discount = parseInt(document.getElementById('prodDiscount').value) || 0;
        const desc = document.getElementById('prodDesc').value.trim();
        const fullDesc = document.getElementById('prodFullDesc').value.trim();
        const img = document.getElementById('prodImg').value.trim();

        // قراءة النوتات
        const topNotes = document.getElementById('prodTopNotes').value.split('،').map(s => s.trim()).filter(s => s);
        const heartNotes = document.getElementById('prodHeartNotes').value.split('،').map(s => s.trim()).filter(s => s);
        const baseNotes = document.getElementById('prodBaseNotes').value.split('،').map(s => s.trim()).filter(s => s);
        
        // قراءة صور النوتات
        const topImg = document.getElementById('prodTopImgData').value;
        const heartImg = document.getElementById('prodHeartImgData').value;
        const baseImg = document.getElementById('prodBaseImgData').value;

        if (!name || !size || isNaN(price)) {
            showStatus('⚠️ يرجى ملء الاسم، الحجم، والسعر', 'error');
            return;
        }

        const productData = {
            id: id,
            name: name,
            category: category,
            sizes: [{ size: size, price: price }],
            img: img || "",
            desc: desc || name,
            fullDesc: fullDesc || desc || name,
            salesCount: 0,
            discountPercent: discount,
            details: { 
                topNotes, heartNotes, baseNotes,
                topImg, heartImg, baseImg
            }
        };

        if (editingId) {
            const index = products.findIndex(p => p.id === editingId);
            if (index !== -1) {
                productData.salesCount = products[index].salesCount || 0;
                products[index] = productData;
            }
            editingId = null;
        } else {
            products.push(productData);
        }

        saveProducts(products);
        showStatus('✅ تم حفظ المنتج بنجاح!', 'success');
        renderAdmin();
        setupAllUploads();
    });

    // إلغاء التعديل
    document.getElementById('cancelEditBtn')?.addEventListener('click', function() {
        editingId = null;
        renderAdmin();
        setupAllUploads();
    });

    // تعديل منتج
    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', function() {
            editingId = parseInt(this.dataset.id);
            renderAdmin();
            setupAllUploads();
        });
    });

    // حذف منتج
    document.querySelectorAll('.btn-danger').forEach(btn => {
        btn.addEventListener('click', function() {
            if (!confirm('⚠️ هل أنت متأكد من حذف هذا المنتج؟')) return;
            let products = loadProducts();
            products = products.filter(p => p.id !== parseInt(this.dataset.id));
            saveProducts(products);
            renderAdmin();
            setupAllUploads();
        });
    });

    // تحديث الجدول
    document.getElementById('refreshBtn')?.addEventListener('click', function() {
        renderAdmin();
        setupAllUploads();
    });

    // تطبيق على الموقع
    document.getElementById('syncBtn')?.addEventListener('click', function() {
        window.dispatchEvent(new Event('productsUpdated'));
        showStatus('✅ تم تطبيق التغييرات على الموقع!', 'success');
    });

    // خروج
    document.getElementById('logoutBtn')?.addEventListener('click', function() {
        localStorage.removeItem('adminLoggedIn');
        showLogin();
    });

    setupAllUploads();
}

// ===== رفع جميع الصور =====
function setupAllUploads() {
    // صورة المنتج الرئيسية
    setupImageUpload('prodImgFile', 'previewImg', 'prodImg');
    
    // صور النوتات
    setupImageUpload('prodTopImg', 'previewTopImg', 'prodTopImgData');
    setupImageUpload('prodHeartImg', 'previewHeartImg', 'prodHeartImgData');
    setupImageUpload('prodBaseImg', 'previewBaseImg', 'prodBaseImgData');
}

// ===== شاشة تسجيل الدخول =====
function showLogin() {
    document.getElementById('adminRoot').innerHTML = `
        <div class="login-container">
            <h2>🔐 دخول المدير</h2>
            <input type="password" id="adminPass" placeholder="كلمة المرور">
            <button id="loginBtn">دخول</button>
            <div class="error-msg" id="loginError">❌ كلمة مرور خاطئة</div>
            <div style="color:#aaa; font-size:0.8rem; margin-top:15px;">كلمة المرور: Lolo@0202</div>
        </div>
    `;

    document.getElementById('loginBtn').addEventListener('click', function() {
        const pass = document.getElementById('adminPass').value;
        if (pass === ADMIN_PASSWORD) {
            localStorage.setItem('adminLoggedIn', 'true');
            renderAdmin();
        } else {
            document.getElementById('loginError').style.display = 'block';
        }
    });

    document.getElementById('adminPass').addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            document.getElementById('loginBtn').click();
        }
    });
}

// ===== بدء التشغيل =====
if (localStorage.getItem('adminLoggedIn') === 'true') {
    renderAdmin();
} else {
    showLogin();
}