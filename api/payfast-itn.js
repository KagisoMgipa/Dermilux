import crypto from "crypto";
import querystring from "querystring";

export const config = {
  api: {
    bodyParser: false
  }
};

function readBody(req) {
  return new Promise((resolve) => {
    let data = "";
    req.on("data", chunk => (data += chunk));
    req.on("end", () => resolve(data));
  });
}

function generateSignature(data, passphrase) {
  const sortedKeys = Object.keys(data).sort();
  let str = "";

  sortedKeys.forEach(key => {
    if (key !== "signature") {
      str += `${key}=${encodeURIComponent(data[key]).replace(/%20/g, "+")}&`;
    }
  });

  str += `passphrase=${encodeURIComponent(passphrase).replace(/%20/g, "+")}`;

  return crypto.createHash("md5").update(str).digest("hex");
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end("Method Not Allowed");
  }

  const rawBody = await readBody(req);
  const data = querystring.parse(rawBody);

  const expectedSignature = generateSignature(
    data,
    process.env.PF_PASSPHRASE
  );

  if (expectedSignature !== data.signature) {
    console.error("❌ Invalid PayFast signature");
    return res.status(400).end("Invalid signature");
  }

  // ✅ PAYMENT VERIFIED
  if (data.payment_status === "COMPLETE") {
    console.log("✅ Payment successful:", {
      orderId: data.m_payment_id,
      amount: data.amount_gross,
      email: data.email_address
    });

    // TODO:
    // - Save order to database
    // - Send confirmation email
    // - Mark order as PAID
  }

  res.status(200).end("OK");
}
