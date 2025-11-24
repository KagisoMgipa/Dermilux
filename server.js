const body = {
  entityId: PEACH_ENTITY_ID,
  amount: amount.toFixed(2).toString(),
  currency: "ZAR",
  paymentType: "DB",
  customer: {
    givenName: givenName,
    surname: surname,
    email: customer.email || "",
  },
  merchantTransactionId: `txn_${Date.now()}`,
};

const query = new URLSearchParams(body).toString();
const auth = Buffer.from(`${PEACH_ENTITY_ID}:${PEACH_SECRET}`).toString("base64");

try {
  const peachResponse = await fetch(`${PEACH_API_BASE}/v1/checkouts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": `Basic ${auth}`
    },
    body: query
  });

  const data = await peachResponse.json();
  console.log("Peach response:", data);  // <-- debug

  if (data && data.id) {
    res.json({ checkoutId: data.id });
  } else {
    console.error("Peach checkout error:", data);
    res.status(500).json({ error: "Could not create Peach checkout" });
  }
} catch (err) {
  console.error(err);
  res.status(500).json({ error: "Server error" });
}
