let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartItemsContainer = document.querySelector(".cart-items");
const subtotalEl = document.getElementById("subtotal");
const shippingEl = document.getElementById("shipping");
const totalEl = document.getElementById("total");
const checkoutBtn = document.querySelector(".checkout-btn");

const SHIPPING_COST = 60;

function renderCart() {
  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
    updateTotals();
    return;
  }

  cart.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "cart-item";

    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div>
        <h4>${item.name}</h4>
        <p>R${Number(item.price).toFixed(2)}</p>
        <button class="dec">-</button>
        <span>${item.qty}</span>
        <button class="inc">+</button>
        <button class="remove">Remove</button>
      </div>
    `;

    div.querySelector(".dec").onclick = () => {
      if (item.qty > 1) item.qty--;
      save();
    };

    div.querySelector(".inc").onclick = () => {
      item.qty++;
      save();
    };

    div.querySelector(".remove").onclick = () => {
      cart.splice(index, 1);
      save();
    };

    cartItemsContainer.appendChild(div);
  });

  updateTotals();
}

function updateTotals() {
  const subtotal = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.qty,
    0
  );

  const shipping = cart.length ? SHIPPING_COST : 0;
  const total = subtotal + shipping;

  subtotalEl.textContent = `R${subtotal.toFixed(2)}`;
  shippingEl.textContent = `R${shipping.toFixed(2)}`;
  totalEl.textContent = `R${total.toFixed(2)}`;

  sessionStorage.setItem("checkoutCart", JSON.stringify(cart));
  sessionStorage.setItem("checkoutTotal", total.toFixed(2));
}

function save() {
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

if (checkoutBtn) {
  checkoutBtn.onclick = () => {
    if (!cart.length) {
      alert("Your cart is empty");
      return;
    }

    // 🔐 Ensure checkout ALWAYS has data
    sessionStorage.setItem("checkoutCart", JSON.stringify(cart));

    const subtotal = cart.reduce(
      (sum, item) => sum + Number(item.price) * item.qty,
      0
    );

    const shipping = cart.length ? SHIPPING_COST : 0;
    const total = subtotal + shipping;

    sessionStorage.setItem("checkoutTotal", total.toFixed(2));

    window.location.href = "checkout.html";
  };
}


renderCart();
