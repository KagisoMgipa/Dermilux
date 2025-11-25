const express = require("express");
const app = express();
app.use(express.json());

// Shipping cost
const SHIPPING_COST = 60;

app.post("/create-payfast-payment", (req, res) => {
  const { customer, items } = req.body;

  if (!customer || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Invalid order data" });
  }

  // Recalculate subtotal and total on server
  const subtotal = items.reduce((sum, item) => sum + Number(item.price) * Number(item.qty), 0);
  const total = subtotal + SHIPPING_COST;

  // Prepare PayFast data
  const names = customer.name.trim().split(" ");
  const payfastData = {
    merchant_id: "26831331",
    merchant_key: "tg6ksmmtyqtxa",
    amount: total.toFixed(2), // 2 decimals
    item_name: items.map(i => i.name).join(", "), // all items in one string
    return_url: "https://yourdomain.com/success",
    cancel_url: "https://yourdomain.com/cancel",
    email_address: customer.email,
    name_first: names.shift(),
    name_last: names.join(" "),
  };

  const queryString = new URLSearchParams(payfastData).toString();
  const redirectUrl = `https://www.payfast.co.za/eng/process?${queryString}`;

  res.json({ redirectUrl });
});

app.listen(3000, () => console.log("Server running on port 3000"));
