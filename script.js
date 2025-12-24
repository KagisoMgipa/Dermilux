// -------------------------------
// SIMPLE CART SYSTEM (LocalStorage)
// -------------------------------

// Load cart items or create empty array
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// -------------------------------
// UPDATE CART COUNTER
// -------------------------------
function updateCartCount() {
  const counter = document.getElementById("cartCount");
  if (counter) {
    // Sum quantities of all items in cart
    const totalQty = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
    counter.textContent = totalQty;
  }
}

// Call on page load
updateCartCount();

// -------------------------------
// ADD TO CART FUNCTIONALITY
// -------------------------------
document.addEventListener("DOMContentLoaded", () => {
  const cartBtnEl = document.querySelector(".floating-cart-btn");

  document.querySelectorAll(".product-card").forEach((card) => {
    const btn = card.querySelector(".btn");

    if (btn) {
      // Fix cursor hand issue
      btn.style.cursor = "pointer";

      btn.addEventListener("click", () => {
        const name = card.querySelector("h3").textContent;
        const price = card.querySelector(".price").textContent.replace("R", "");
        const image = card.querySelector("img").src;

        // Check if item already exists
        const existingItem = cart.find((item) => item.name === name);
        if (existingItem) {
          existingItem.qty += 1;
        } else {
          cart.push({ name, price, image, qty: 1 });
        }

        // Save cart
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartCount();

        // Show popup
        showAddedPopup(name);

        // Bounce cart button
        if (cartBtnEl) bounceCart(cartBtnEl);
      });
    }
  });
});

// -------------------------------
// SHOW "ADDED TO CART" POPUP (NO STACKING)
// -------------------------------
let popupTimeout;
let popupEl;

function showAddedPopup(productName) {
  if (!popupEl) {
    popupEl = document.createElement("div");
    popupEl.className = "added-popup";
    document.body.appendChild(popupEl);
  }

  popupEl.innerHTML = `
    <span class="checkmark">✔️</span>
    ${productName} added to cart
    <a href="cart.html">View Cart</a>
  `;

  popupEl.style.opacity = "1";
  popupEl.style.transform = "translateY(0) scale(1)";

  if (popupTimeout) clearTimeout(popupTimeout);

  popupTimeout = setTimeout(() => {
    popupEl.style.opacity = "0";
    popupEl.style.transform = "translateY(-20px) scale(0.95)";
    setTimeout(() => {
      if (popupEl) popupEl.remove();
      popupEl = null;
    }, 400);
  }, 3000);
}

// -------------------------------
// FLOATING CART BOUNCE ANIMATION
// -------------------------------
function bounceCart(cartBtnEl) {
  cartBtnEl.style.transition = "transform 0.2s";
  cartBtnEl.style.transform = "scale(1.2)";
  setTimeout(() => {
    cartBtnEl.style.transform = "scale(1)";
  }, 200);
}

