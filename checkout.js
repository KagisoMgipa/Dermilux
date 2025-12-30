// checkout.js

// -------------------------------
// LOAD CART & TOTAL
// -------------------------------
const cart = JSON.parse(sessionStorage.getItem("checkoutCart")) || [];
const total = sessionStorage.getItem("checkoutTotal");

// If checkout opened without cart
if (!cart.length || !total || Number(total) <= 0) {
  alert("Your cart is empty or expired. Please add items again.");
  window.location.href = "cart.html";
}

// -------------------------------
// RENDER ORDER SUMMARY
// -------------------------------
const cartItemsEl = document.getElementById("cart-items");
const cartTotalEl = document.getElementById("cart-total");

cart.forEach(item => {
  const li = document.createElement("li");
  li.innerHTML = `
    ${item.name} x ${item.qty}
    <span>R${(item.price * item.qty).toFixed(2)}</span>
  `;
  cartItemsEl.appendChild(li);
});

cartTotalEl.textContent = `${Number(total).toFixed(2)} ZAR`;

// -------------------------------
// PAYFAST FORM HANDLER
// -------------------------------
const payfastForm = document.getElementById("payfastForm");

payfastForm.addEventListener("submit", (e) => {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const address = document.getElementById("address").value.trim();

  if (!name || !email || !address) {
    e.preventDefault();
    alert("Please fill in all delivery details.");
    return;
  }

  // Inject PayFast required values
  document.getElementById("pf_amount").value = Number(total).toFixed(2);
  document.getElementById("pf_name").value = name;
  document.getElementById("pf_email").value = email;

  // Save delivery info (optional)
  localStorage.setItem(
    "deliveryInfo",
    JSON.stringify({ name, email, address })
  );
});
