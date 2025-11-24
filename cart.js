// Load cart from localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];
const cartItemsContainer = document.querySelector(".cart-items");
const subtotalEl = document.getElementById("subtotal");
const shippingEl = document.getElementById("shipping");
const totalEl = document.getElementById("total");

const SHIPPING_COST = 60;

// Render the cart items
function renderCart() {
  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
    subtotalEl.textContent = "R0";
    totalEl.textContent = "R0";
    shippingEl.textContent = "R0";
    updateCartCount();
    return;
  }

  cart.forEach((item, index) => {
    const cartItem = document.createElement("div");
    cartItem.className = "cart-item";
    cartItem.innerHTML = `
      <img src="${item.image}" class="cart-item-img" alt="${item.name}">
      <div class="cart-item-details">
        <h3>${item.name}</h3>
        <p class="price">R${item.price}</p>
        <div class="qty-controls">
          <button class="qty-btn decrease">-</button>
          <span class="qty">${item.qty}</span>
          <button class="qty-btn increase">+</button>
        </div>
        <button class="remove-item">Remove</button>
      </div>
    `;
    cartItemsContainer.appendChild(cartItem);

    // Add event listeners for increase, decrease, remove
    const decreaseBtn = cartItem.querySelector(".decrease");
    const increaseBtn = cartItem.querySelector(".increase");
    const qtyEl = cartItem.querySelector(".qty");
    const removeBtn = cartItem.querySelector(".remove-item");

    decreaseBtn.addEventListener("click", () => {
      if (item.qty > 1) item.qty--;
      qtyEl.textContent = item.qty;
      updateCartStorage();
      updateTotals();
      updateCartCount();
    });

    increaseBtn.addEventListener("click", () => {
      item.qty++;
      qtyEl.textContent = item.qty;
      updateCartStorage();
      updateTotals();
      updateCartCount();
    });

    removeBtn.addEventListener("click", () => {
      cart.splice(index, 1);
      updateCartStorage();
      renderCart();
    });
  });

  updateTotals();
  updateCartCount();
}

// Update cart in localStorage
function updateCartStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Update totals
function updateTotals() {
  let subtotal = cart.reduce((sum, item) => sum + Number(item.price) * item.qty, 0);
  subtotalEl.textContent = `R${subtotal}`;
  const shipping = cart.length > 0 ? SHIPPING_COST : 0;
  shippingEl.textContent = `R${shipping}`;
  totalEl.textContent = `R${subtotal + shipping}`;
}

// Update cart counter in header
function updateCartCount() {
  const counter = document.getElementById("cartCount");
  if (counter) {
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    counter.textContent = totalQty;
  }
}

// Initial render
renderCart();
