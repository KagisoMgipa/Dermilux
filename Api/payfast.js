import crypto from "crypto";

const PF_HOST = "https://www.payfast.co.za";

function encode(value) {
  return encodeURIComponent(value).replace(/%20/g, "+");
}

function generateSignature(data, passphrase) {
  let str = "";

  Object.keys(data)
    .sort()
    .forEach((key) => {
      if (data[key] !== undefined && data[key] !== "") {
        str += `${key}=${encode(data[key])}&`;
      }
    });

  str += `passphrase=${encode(passphrase)}`;

  return crypto.createHash("md5").update(str).digest("hex");
}

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { amount, customer } = req.body;

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    if (!customer?.email || !customer?.name) {
      return res.status(400).json({ error: "Invalid customer data" });
    }

    const data = {
      merchant_id: process.env.PF_MERCHANT_ID,
      merchant_key: process.env.PF_MERCHANT_KEY,
      return_url: "https://www.dermilux.co.za/success.html",
      cancel_url: "https://www.dermilux.co.za/cancel.html",
      notify_url: "https://www.dermilux.co.za/api/payfast-itn",
      amount: Number(amount).toFixed(2),
      item_name: "Dermilux Order",
      name_first: customer.name.split(" ")[0],
      email_address: customer.email
    };

    data.signature = generateSignature(data, process.env.PF_PASSPHRASE);

    const query = Object.entries(data)
      .map(([k, v]) => `${k}=${encode(v)}`)
      .join("&");

    return res.status(200).json({
      redirectUrl: `${PF_HOST}/eng/process?${query}`
    });

  } catch (err) {
    console.error("PayFast error:", err);
    return res.status(500).json({ error: "Payment init failed" });
  }
}
