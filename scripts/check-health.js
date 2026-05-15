const http = require("http");

const url = process.env.HEALTH_URL || "http://localhost:5173/api/health";

http.get(url, (res) => {
  let body = "";

  res.on("data", (chunk) => {
    body += chunk;
  });

  res.on("end", () => {
    console.log("Status:", res.statusCode);
    console.log(body);
    process.exit(res.statusCode === 200 ? 0 : 1);
  });
}).on("error", (error) => {
  console.error("Health check failed:", error.message);
  process.exit(1);
});
