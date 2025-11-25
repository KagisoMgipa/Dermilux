// -------------------------------
// Cart.js (Updated for PayFast integration)
// -------------------------------

// Load cart from localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartItemsContainer = document.querySelector(".cart-items");
const subtotalEl = document.getElementById("subtotal");
const shippingEl = document.getElementById("shipping");
const totalEl = document.getElementById("total");
const checkoutBtn = document.querySelector(".checkout-btn");

const SHIPPING_COST = 60;

// -------------------------------
// Render the cart items
// -------------------------------
function renderCart() {
  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
    updateTotals();
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
        <p class="price">R${Number(item.price).toFixed(2)}</p>
        <div class="qty-controls">
          <button class="qty-btn decrease">-</button>
          <span class="qty">${item.qty}</span>
          <button class="qty-btn increase">+</button>
        </div>
        <button class="remove-item">Remove</button>
      </div>
    `;
    cartItemsContainer.appendChild(cartItem);

    // Quantity buttons
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

// -------------------------------
// Update cart in localStorage
// -------------------------------
function updateCartStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// -------------------------------
// Update totals
// -------------------------------
function updateTotals() {
  const subtotal = cart.reduce((sum, item) => sum + Number(item.price) * Number(item.qty), 0);
  const shipping = cart.length > 0 ? SHIPPING_COST : 0;
  const total = subtotal + shipping;

  subtotalEl.textContent = `R${subtotal.toFixed(2)}`;
  shippingEl.textContent = `R${shipping.toFixed(2)}`;
  totalEl.textContent = `R${total.toFixed(2)}`;

  // Save totals to sessionStorage for checkout
  sessionStorage.setItem("checkoutCart", JSON.stringify(cart));
  sessionStorage.setItem("checkoutSubtotal", subtotal.toFixed(2));
  sessionStorage.setItem("checkoutShipping", shipping.toFixed(2));
  sessionStorage.setItem("checkoutTotal", total.toFixed(2));
}

// -------------------------------
// Update cart counter in header
// -------------------------------
function updateCartCount() {
  const counter = document.getElementById("cartCount");
  if (counter) {
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    counter.textContent = totalQty;
  }
}

// -------------------------------
// Checkout button functionality
// -------------------------------
if (checkoutBtn) {
  checkoutBtn.addEventListener("click", () => {
    if (cart.length === 0) {
      alert("Your cart is empty. Add products before proceeding to checkout.");
      return;
    }

    // Redirect to checkout page
    window.location.href = "checkout.html";
  });
}

// Initial render
renderCart();
