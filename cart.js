console.log('🛒 cart.js تم تحميله');

function renderCart() {
  const container = document.getElementById('cartItemsList');
  const totalDiv = document.getElementById('cartTotal');
  const checkoutBtn = document.getElementById('checkoutBtn');

  let cart = JSON.parse(localStorage.getItem('luxuryCart') || '[]');

  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="empty-cart">
        <i class="fas fa-shopping-cart" style="font-size:3rem; color:#aaa;"></i>
        <p>سلة التسوق فارغة حالياً</p>
        <a href="index.html">تسوق الآن</a>
      </div>
    `;
    totalDiv.innerHTML = '';
    if (checkoutBtn) checkoutBtn.style.display = 'none';
    return;
  }

  let html = '';
  let total = 0;

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    html += `
      <div class="cart-item">
        <div class="item-info">
          <h3>${item.name}</h3>
          <span class="price">${item.price} ج.م</span>
        </div>
        <div class="qty-controls">
          <button onclick="updateQuantity(${index}, -1)">-</button>
          <span style="min-width:30px; text-align:center;">${item.quantity}</span>
          <button onclick="updateQuantity(${index}, 1)">+</button>
          <button class="remove-btn" onclick="removeItem(${index})"><i class="fas fa-trash"></i></button>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
  totalDiv.innerHTML = `<span>الإجمالي: <span class="total-price">${total.toFixed(2)} ج.م</span></span>`;
  if (checkoutBtn) checkoutBtn.style.display = 'inline-block';
}

function updateQuantity(index, delta) {
  let cart = JSON.parse(localStorage.getItem('luxuryCart') || '[]');
  if (!cart[index]) return;
  cart[index].quantity += delta;
  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }
  localStorage.setItem('luxuryCart', JSON.stringify(cart));
  renderCart();
}

function removeItem(index) {
  let cart = JSON.parse(localStorage.getItem('luxuryCart') || '[]');
  cart.splice(index, 1);
  localStorage.setItem('luxuryCart', JSON.stringify(cart));
  renderCart();
}

document.addEventListener('DOMContentLoaded', function() {
  renderCart();
});