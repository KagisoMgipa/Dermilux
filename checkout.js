// -------------------------------
// Checkout.js (PayFast Integration)
// -------------------------------

// Load delivery info if saved
const deliveryForm = document.getElementById("deliveryForm");
const saveDeliveryBtn = document.getElementById("save-delivery");

// Save delivery info
saveDeliveryBtn.addEventListener("click", () => {
  const info = {
    name: deliveryForm.name.value.trim(),
    email: deliveryForm.email.value.trim(),
    phone: deliveryForm.phone.value.trim(),
    address: deliveryForm.address.value.trim(),
  };

  if (!info.name || !info.email || !info.phone || !info.address) {
    alert("Please fill in all delivery fields.");
    return;
  }

  localStorage.setItem("deliveryInfo", JSON.stringify(info));
  alert("Delivery info saved!");
});

// -------------------------------
// Load cart from sessionStorage
// -------------------------------
let cart = JSON.parse(sessionStorage.getItem("checkoutCart") || "[]");

const cartItemsContainer = document.getElementById("cart-items");
const cartTotalEl = document.getElementById("cart-total");

// Render cart
function renderCart() {
  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
    cartTotalEl.textContent = "0.00 ZAR";
    return;
  }

  let total = 0;
  cart.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.name} x ${item.qty} - R${(item.price * item.qty).toFixed(2)}`;
    cartItemsContainer.appendChild(li);

    total += Number(item.price) * Number(item.qty);
  });

  // Add shipping
  const SHIPPING_COST = 60;
  total += SHIPPING_COST;

  cartTotalEl.textContent = total.toFixed(2) + " ZAR";
}

renderCart();

// -------------------------------
// PayFast Payment Button
// -------------------------------
const payButton = document.getElementById("pay-button");

payButton.addEventListener("click", async () => {
  const saved = JSON.parse(localStorage.getItem("deliveryInfo") || "{}");

  if (!saved.name || !saved.email || !saved.phone || !saved.address) {
    alert("Please save delivery information first.");
    return;
  }

  if (cart.length === 0) {
    alert("Cart is empty.");
    return;
  }

  try {
    // Send order + customer info to backend
    const response = await fetch("/create-payfast-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: cart,
        customer: saved
      }),
    });

    const data = await response.json();

    if (!data.redirectUrl) {
      alert("Error starting payment. Please try again.");
      return;
    }

    // Redirect customer to PayFast for card payment
    window.location.href = data.redirectUrl;

  } catch (err) {
    console.error("PayFast Checkout error:", err);
    alert("Failed to start payment. Check console for details.");
  }
});
