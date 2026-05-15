require("dotenv").config();

async function main() {
  const env = process.env.MPESA_ENV || "sandbox";
  const baseUrl = env === "production" ? "https://api.safaricom.co.ke" : "https://sandbox.safaricom.co.ke";

  const key = process.env.MPESA_CONSUMER_KEY;
  const secret = process.env.MPESA_CONSUMER_SECRET;

  if (!key || !secret) {
    console.error("Missing MPESA_CONSUMER_KEY or MPESA_CONSUMER_SECRET in .env");
    process.exit(1);
  }

  const credentials = Buffer.from(key + ":" + secret).toString("base64");

  const response = await fetch(baseUrl + "/oauth/v1/generate?grant_type=client_credentials", {
    method: "GET",
    headers: { Authorization: "Basic " + credentials },
  });

  const data = await response.json();
  console.log("Status:", response.status);
  console.log(data);

  if (!response.ok || !data.access_token) {
    console.error("M-PESA token test failed.");
    process.exit(1);
  }

  console.log("");
  console.log("M-PESA token test successful.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
