require("dotenv").config();

console.log("SokoYetu Mtaani LiveKit Configuration");
console.log("-----------------------------");

const required = ["LIVEKIT_URL", "LIVEKIT_API_KEY", "LIVEKIT_API_SECRET"];
let ok = true;

for (const key of required) {
  const value = process.env[key];
  if (!value) {
    console.log("MISSING:", key);
    ok = false;
  } else if (key.includes("SECRET") || key.includes("KEY")) {
    console.log("OK:", key, "=", value.slice(0, 4) + "...hidden");
  } else {
    console.log("OK:", key, "=", value);
  }
}

console.log("");
console.log(ok ? "LiveKit configuration looks ready." : "Add the missing LiveKit values to .env before testing livestream rooms.");
process.exit(ok ? 0 : 1);

