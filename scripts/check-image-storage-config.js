require("dotenv").config();

console.log("SokoYetu Mtaani Image Storage Configuration");
console.log("-----------------------------------");
console.log("UPLOAD_MODE =", process.env.UPLOAD_MODE || "local");

if (process.env.UPLOAD_MODE === "cloudinary") {
  const required = [
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
  ];

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
  console.log(ok ? "Cloudinary image storage looks ready." : "Fix missing Cloudinary values before using cloudinary mode.");
  process.exit(ok ? 0 : 1);
}

console.log("Local image storage is active. Uploaded files will remain in uploads/products on this computer.");
console.log("For production, set UPLOAD_MODE=cloudinary and add Cloudinary credentials.");

