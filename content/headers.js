export async function scanHeaders() {
  const res = await fetch(location.href, { method: "GET" });

  const wanted = [
    "content-security-policy",
    "x-frame-options",
    "x-content-type-options",
    "strict-transport-security",
    "referrer-policy",
    "permissions-policy"
  ];

  const results = {};

  for (const h of wanted) {
    const v = res.headers.get(h);
    results[h] = v || "MISSING";
  }

  return results;
}
