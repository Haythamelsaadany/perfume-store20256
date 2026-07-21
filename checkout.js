console.log('🚀 checkout.js تم تحميله');

const MERCHANT_PHONE = "01066774623";
const VODAFONE_CASH = "01014946580";
const INSTAPAY_NUMBER = "01066774623";

// ===== جميع المحافظات والمناطق =====
const areasByGovernorate = {
  "القاهرة": ["مدينة نصر", "مصر الجديدة", "العباسية", "الزمالك", "وسط البلد", "المعادي", "مصر القديمة", "شبرا", "الوايلي", "الزيتون", "حدائق القبة", "السلام"],
  "الجيزة": ["المهندسين", "الدقي", "العجوزة", "الهرم", "فيصل", "الشيخ زايد", "السادس من أكتوبر", "حدائق الأهرام", "بين السريات", "أم المصريين", "الوراق", "إمبابة"],
  "الإسكندرية": ["المنتزه", "سموحة", "محطة الرمل", "العصافرة", "كريم", "لوران", "الإبراهيمية", "باكوس", "سيدي بشر", "المنشية"],
  "الشرقية": ["الزقازيق", "العاشر من رمضان", "منيا القمح", "بلبيس", "أبو حماد", "ههيا", "فاقوس", "الحسينية"],
  "الدقهلية": ["المنصورة", "طلخا", "المطرية", "دكرنس", "أجا", "ميت غمر", "نبروه", "تمي الأمديد"],
  "البحيرة": ["دمنهور", "كفر الدوار", "رشيد", "إيتاي البارود", "المحمودية", "أبو المطامير", "حوش عيسى"],
  "المنوفية": ["شبين الكوم", "منوف", "الباجور", "قويسنا", "سرس الليان", "تلا", "بركة السبع"],
  "القليوبية": ["بنها", "شبرا الخيمة", "قليوب", "الخانكة", "كفر شكر", "طوخ", "القناطر الخيرية"],
  "الغربية": ["طنطا", "المحلة الكبرى", "سمنود", "كفر الزيات", "قطور", "بسيون", "السنطة"],
  "كفر الشيخ": ["كفر الشيخ", "دسوق", "مطوبس", "بلطيم", "سيدي سالم", "قلين", "الرياض"],
  "الإسماعيلية": ["الإسماعيلية", "التل الكبير", "القنطرة", "فايد", "أبو صوير"],
  "بورسعيد": ["بورسعيد", "الضواحي", "العرب", "الزهور", "المناخ"],
  "السويس": ["السويس", "الأربعين", "عتاقة", "فيصل", "الجناين"],
  "دمياط": ["دمياط", "عزبة البرج", "فارسكور", "كفر سعد", "الزرقا"],
  "الأقصر": ["الأقصر", "القرنة", "إسنا", "البياضية", "الطود"],
  "أسوان": ["أسوان", "إدفو", "كوم أمبو", "نصر النوبة", "كلابشة"],
  "قنا": ["قنا", "نجع حمادي", "قفط", "الوقف", "أبوتشت", "فرشوط"],
  "سوهاج": ["سوهاج", "أخميم", "طهطا", "جرجا", "المنشأة", "البلينا"],
  "أسيوط": ["أسيوط", "منفلوط", "أبو تيج", "القوصية", "ديروط", "البداري"],
  "المنيا": ["المنيا", "ملوي", "بني مزار", "مطاي", "سمالوط", "أبو قرقاص"],
  "بني سويف": ["بني سويف", "الواسطى", "أهناسيا", "ناصر", "ببا", "الفشن"],
  "الفيوم": ["الفيوم", "سنورس", "طامية", "إبشواي", "يوسف الصديق"],
  "شمال سيناء": ["العريش", "الشيخ زويد", "رفح", "بئر العبد"],
  "جنوب سيناء": ["الطور", "شرم الشيخ", "دهب", "نويبع", "سانت كاترين", "رأس سدر"],
  "مطروح": ["مرسى مطروح", "الضبعة", "السلوم", "الحمام", "سيوة"],
  "البحر الأحمر": ["الغردقة", "سفاجا", "القصير", "مرسى علم", "رأس غارب"],
  "الوادي الجديد": ["الخارجة", "الداخلة", "الفرافرة", "بلاط", "باريس"]
};

// ===== تسعيرة الشحن =====
const shippingCosts = {
  "القاهرة": 100,
  "الجيزة": 80,
  "الإسكندرية": 300,
  "الشرقية": 300,
  "الدقهلية": 300,
  "البحيرة": 300,
  "المنوفية": 300,
  "القليوبية": 300,
  "الغربية": 300,
  "كفر الشيخ": 300,
  "الإسماعيلية": 300,
  "بورسعيد": 300,
  "السويس": 300,
  "دمياط": 300,
  "الأقصر": 400,
  "أسوان": 400,
  "قنا": 400,
  "سوهاج": 400,
  "أسيوط": 400,
  "المنيا": 400,
  "بني سويف": 400,
  "الفيوم": 400,
  "شمال سيناء": 400,
  "جنوب سيناء": 400,
  "مطروح": 400,
  "البحر الأحمر": 400,
  "الوادي الجديد": 400
};

// ===== التحكم في المناطق =====
const govSelect = document.getElementById('governorate');
const areaSelect = document.getElementById('area');
if (govSelect && areaSelect) {
  areaSelect.disabled = true;
  areaSelect.innerHTML = '<option value="">-- اختر المحافظة أولاً --</option>';
  govSelect.addEventListener('change', function() {
    const gov = this.value;
    if (gov && areasByGovernorate[gov]) {
      areaSelect.disabled = false;
      areaSelect.innerHTML = '<option value="">-- اختر المنطقة --</option>';
      areasByGovernorate[gov].forEach(a => {
        const opt = document.createElement('option');
        opt.value = a;
        opt.textContent = a;
        areaSelect.appendChild(opt);
      });
    } else {
      areaSelect.disabled = true;
      areaSelect.innerHTML = '<option value="">-- اختر المحافظة أولاً --</option>';
    }
    updateOrderSummary();
  });
}

// ===== تحديث الملخص =====
function updateOrderSummary() {
  const cart = JSON.parse(localStorage.getItem('luxuryCart') || '[]');
  const summaryDiv = document.getElementById('orderSummary');
  if (!summaryDiv) return;
  if (cart.length === 0) {
    summaryDiv.innerHTML = '<p>السلة فارغة</p>';
    return;
  }

  let subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const gov = document.getElementById('governorate')?.value || '';
  const shipping = gov ? (shippingCosts[gov] || 0) : 0;
  const total = subtotal + shipping;

  summaryDiv.innerHTML = `
    <ul>
      ${cart.map(i => `<li>${i.name} × ${i.quantity} = ${(i.price * i.quantity).toFixed(2)} ج.م</li>`).join('')}
    </ul>
    <p><strong>المجموع: ${subtotal.toFixed(2)} ج.م</strong></p>
    <p><strong>الشحن: ${shipping === 0 ? 'غير محدد' : shipping + ' ج.م'}</strong></p>
    <p><strong>الإجمالي النهائي: ${total.toFixed(2)} ج.م</strong></p>
  `;
  return { subtotal, shipping, total };
}

// ===== عرض رسالة الشكر =====
function showThankYou(customerName, paymentMethod, transactionNumber) {
  const modal = document.getElementById('thankYouModal');
  if (modal) {
    document.getElementById('thankYouName').innerText = `شكراً لك ${customerName}!`;
    const paymentInfo = document.getElementById('paymentInfo');
    let msg = '';
    if (paymentMethod === 'vodafone') {
      msg = `💳 الدفع عبر فودافون كاش على الرقم: ${VODAFONE_CASH}`;
    } else {
      msg = `💳 الدفع عبر إنستا باي على الرقم: ${INSTAPAY_NUMBER}`;
    }
    if (transactionNumber) {
      msg += `<br>📌 رقم المعاملة: ${transactionNumber}`;
    }
    paymentInfo.innerHTML = msg;
    modal.classList.add('open');
    modal.style.display = 'flex';
  } else {
    alert(`🎉 شكراً لك ${customerName}! تم استلام طلبك.`);
  }
}

// ===== إرسال الطلب =====
const form = document.getElementById('checkout-form');
if (form) {
  form.addEventListener('submit', function(e) {
    e.preventDefault();

    const cart = JSON.parse(localStorage.getItem('luxuryCart') || '[]');
    if (cart.length === 0) {
      alert('⚠️ السلة فارغة! أضف منتجات أولاً.');
      return;
    }

    const fullName = document.getElementById('fullName').value.trim();
    const mobile = document.getElementById('mobile').value.trim();
    const email = document.getElementById('email').value.trim();
    const governorate = document.getElementById('governorate').value;
    const area = document.getElementById('area').value;
    const addressDetails = document.getElementById('addressDetails').value.trim();
    const paymentMethod = document.querySelector('input[name="payment"]:checked')?.value || 'vodafone';
    const receiptFile = document.getElementById('receiptImage')?.files[0];
    const transactionNumber = document.getElementById('transactionNumber').value.trim();

    if (!fullName || !mobile || !governorate || !area) {
      alert('⚠️ يرجى ملء جميع الحقول (الاسم، الجوال، المحافظة، المنطقة)');
      return;
    }

    const fullAddress = `${addressDetails ? addressDetails + '، ' : ''}${area}، ${governorate}`;
    const summary = updateOrderSummary();
    const total = summary ? summary.total : 0;

    let orderText = `🛍️ طلب جديد من جواهر العطور:\n`;
    cart.forEach(item => {
      orderText += `- ${item.name} × ${item.quantity} = ${(item.price * item.quantity).toFixed(2)} ج.م\n`;
    });
    orderText += `\nالمجموع: ${summary.subtotal.toFixed(2)} ج.م`;
    orderText += `\nالشحن: ${summary.shipping} ج.م`;
    orderText += `\nالإجمالي: ${total.toFixed(2)} ج.م`;
    orderText += `\nطريقة الدفع: ${paymentMethod === 'vodafone' ? 'فودافون كاش' : 'إنستا باي'}`;
    if (transactionNumber) {
      orderText += `\n📌 رقم المعاملة: ${transactionNumber}`;
    }
    if (receiptFile) {
      orderText += `\n🖼️ تم رفع إيصال الدفع`;
    }
    orderText += `\n\n👤 العميل: ${fullName}\n📱 جوال: ${mobile}\n📧 بريد: ${email || 'غير مذكور'}\n🏠 العنوان: ${fullAddress}`;

    window.open(`https://wa.me/${MERCHANT_PHONE}?text=${encodeURIComponent(orderText)}`, '_blank');

    let orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push({
      id: `ORD-${Date.now()}`,
      customer: fullName,
      mobile: mobile,
      address: fullAddress,
      total: total,
      items: cart.map(i => ({ name: i.name, quantity: i.quantity, price: i.price })),
      payment: paymentMethod,
      transactionNumber: transactionNumber || 'غير مدخل',
      date: new Date().toISOString()
    });
    localStorage.setItem('orders', JSON.stringify(orders));

    showThankYou(fullName, paymentMethod, transactionNumber);
    localStorage.removeItem('luxuryCart');

    setTimeout(() => {
      window.location.href = 'index.html';
    }, 4000);
  });
}

document.addEventListener('DOMContentLoaded', function() {
  updateOrderSummary();
});