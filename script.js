// -------------------------------
// SIMPLE CART SYSTEM (LocalStorage)
// -------------------------------

// Load cart items or create empty array
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Update cart counter on page load
function updateCartCount() {
  const counter = document.getElementById("cartCount");
  if (counter) counter.textContent = cart.length;
}
updateCartCount();

// Add to cart functionality
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".product-card").forEach((card) => {
    const btn = card.querySelector(".btn");

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

      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartCount();
      showAddedPopup(name);
    });
  });
});

// -------------------------------
// Popup message
// -------------------------------
function showAddedPopup(productName) {
  const popup = document.createElement("div");
  popup.className = "added-popup";
  popup.innerHTML = `${productName} added to cart ✔️ <a href="cart.html">Go to Cart</a>`;

  document.body.appendChild(popup);

  setTimeout(() => popup.remove(), 3000);
}

// -------------------------------
// UPDATE CART COUNTER IN HEADER
// -------------------------------

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const counter = document.getElementById("cartCount");
  if (counter) {
    // Sum quantities of all items in cart
    const totalQty = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
    counter.textContent = totalQty;
  }
}

// Call on page load
updateCartCount();
