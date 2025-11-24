// -------------------------------
// Checkout.js
// -------------------------------

// Load delivery info if saved
const deliveryForm = document.getElementById("deliveryForm");
const saveDeliveryBtn = document.getElementById("save-delivery");

// Save delivery info
saveDeliveryBtn.addEventListener("click", () => {
  const info = {
    name: deliveryForm.name.value,
    email: deliveryForm.email.value,
    phone: deliveryForm.phone.value,
    address: deliveryForm.address.value,
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
const subtotal = Number(sessionStorage.getItem("checkoutSubtotal") || 0);
const shipping = Number(sessionStorage.getItem("checkoutShipping") || 0);
const total = Number(sessionStorage.getItem("checkoutTotal") || 0);

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

  cart.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.name} x ${item.qty} - R${(item.price * item.qty).toFixed(2)}`;
    cartItemsContainer.appendChild(li);
  });

  cartTotalEl.textContent = (total).toFixed(2) + " ZAR";
}

renderCart();

// -------------------------------
// Pay Button
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
    // Peach API expects amount as string with 2 decimals
    const amount = total.toFixed(2);

    const resp = await fetch("/create-peach-checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: amount,
        customer: saved,
        cart: cart,
      }),
    });

    const { checkoutId, error } = await resp.json();

    if (error) {
      alert("Error creating checkout: " + error);
      return;
    }

    const peachCheckout = new Peach.Checkout({
      container: "checkout-container",
      checkoutId: checkoutId
    });

    peachCheckout.on("COMPLETE", (data) => {
      console.log("Payment complete:", data);
      alert("Payment successful! Thank you for your order.");

      // Clear cart after successful payment
      localStorage.removeItem("cart");
      sessionStorage.removeItem("checkoutCart");
      sessionStorage.removeItem("checkoutSubtotal");
      sessionStorage.removeItem("checkoutShipping");
      sessionStorage.removeItem("checkoutTotal");

      window.location.href = "/thank-you";
    });

    peachCheckout.on("CANCEL", () => {
      alert("Payment was cancelled.");
    });

    peachCheckout.on("ERROR", (err) => {
      console.error("Payment error:", err);
      alert("Payment error occurred. Check console for details.");
    });

    peachCheckout.open();
  } catch (err) {
    console.error("Checkout error:", err);
    alert("Failed to initiate payment. Check console.");
  }
});
