import crypto from "crypto";

const PF_HOST =
  process.env.PF_MODE === "live"
    ? "https://www.payfast.co.za"
    : "https://sandbox.payfast.co.za";

function encode(value) {
  return encodeURIComponent(value).replace(/%20/g, "+");
}

function generateSignature(data, passphrase) {
  const sortedKeys = Object.keys(data).sort();
  let paramString = "";

  sortedKeys.forEach(key => {
    paramString += `${key}=${encode(data[key])}&`;
  });

  if (passphrase) {
    paramString += `passphrase=${encode(passphrase)}`;
  } else {
    paramString = paramString.slice(0, -1); // remove trailing &
  }

  return crypto.createHash("md5").update(paramString).digest("hex");
}

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { amount, customer } = req.body;

  if (!amount || !customer?.email || !customer?.name) {
    return res.status(400).json({ error: "Invalid request data" });
  }

  const data = {
    merchant_id: process.env.PF_MERCHANT_ID,
    merchant_key: process.env.PF_MERCHANT_KEY,
    return_url: "https://www.dermilux.co.za/success.html",
    cancel_url: "https://www.dermilux.co.za/cancel.html",
    amount: Number(amount).toFixed(2),
    item_name: "Dermilux Order",
    name_first: customer.name.split(" ")[0],
    email_address: customer.email
  };

  data.signature = generateSignature(
    data,
    process.env.PF_PASSPHRASE || ""
  );

  const query = Object.entries(data)
    .map(([k, v]) => `${k}=${encode(v)}`)
    .join("&");

  return res.status(200).json({
    redirectUrl: `${PF_HOST}/eng/process?${query}`
  });
}
