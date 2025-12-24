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
// PAY BUTTON HANDLER
// -------------------------------
const payBtn = document.getElementById("pay-button");

payBtn.addEventListener("click", async () => {
  const customer = {
    name: document.getElementById("name").value.trim(),
    email: document.getElementById("email").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    address: document.getElementById("address").value.trim()
  };

  if (!customer.name || !customer.email || !customer.address) {
    alert("Please fill in all delivery details.");
    return;
  }

  // Save delivery info (optional future use)
  localStorage.setItem("deliveryInfo", JSON.stringify(customer));

  try {
    payBtn.disabled = true;
    payBtn.textContent = "Redirecting to PayFast...";

    const res = await fetch("/api/payfast", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: Number(total).toFixed(2),
        customer
      })
    });

    const data = await res.json();

    if (!res.ok || !data.redirectUrl) {
      throw new Error("PayFast initialization failed");
    }

    // ✅ Redirect to PayFast
    window.location.href = data.redirectUrl;

  } catch (err) {
    console.error("PayFast error:", err);
    alert("Failed to start payment. Please try again.");
    payBtn.disabled = false;
    payBtn.textContent = "Pay Now";
  }
});
