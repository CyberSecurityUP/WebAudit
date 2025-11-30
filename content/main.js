console.log("[WebAudit] main.js injected into:", window.location.href);

// ---------------------- UTIL ----------------------
function entropy(str) {
  const map = new Map();
  for (const c of str) map.set(c, (map.get(c) || 0) + 1);
  return [...map].reduce((s, [, c]) => {
    const p = c / str.length;
    return s - p * Math.log2(p);
  }, 0);
}

// ---------------------- SECRET SCANNER ----------------------
async function scanSecrets() {
  const results = [];

  const critical = [
    /AKIA[0-9A-Z]{16}/,
    /sk_live_[0-9a-zA-Z]{24}/,
    /gh[pus]_[0-9A-Za-z]{36}/,
    /xox[baprs]-[0-9]{8,}-[0-9A-Za-z-]{10,}/,
    /ey[A-Za-z0-9_]+\.[A-Za-z0-9_]+\.[A-Za-z0-9_-]+/
  ];

  const high = [
    /[A-Za-z0-9]{32,100}/,
    /[A-Za-z0-9_-]{40,}/
  ];

  function scanText(text, source) {
    [...text.matchAll(/[A-Za-z0-9_\-+\/]{25,100}/g)].forEach(m => {
      const key = m[0];
      let risk = "MEDIUM";

      if (critical.some(r => r.test(key))) risk = "CRITICAL";
      else if (high.some(r => r.test(key))) risk = "HIGH";
      else if (entropy(key) > 3.5) risk = "HIGH";

      results.push({ source, key, risk });
    });
  }

  scanText(document.documentElement.innerHTML, "inline-html");

  for (const s of document.querySelectorAll("script[src]")) {
    try {
      const txt = await fetch(s.src).then(r => r.text());
      scanText(txt, s.src);
    } catch {}
  }

  return results;
}

// ---------------------- DIRS SCANNER ----------------------
async function scanDirs() {
  const dirs = [
    "/admin", "/login", "/wp-admin", "/wp-login.php", "/.git", "/.env",
    "/.git/config", "/phpinfo.php", "/server-status", "/config.json",
    "/swagger", "/_next", "/.DS_Store", "/.idea", "/.vscode"
  ];
  const origin = location.origin;
  const results = [];

  for (const d of dirs) {
    try {
      const r = await fetch(origin + d);
      results.push({
        path: d,
        status: r.status,
        size: r.headers.get("content-length") || "?"
      });
    } catch {}
  }

  return results;
}

// ---------------------- HEADERS SCANNER ----------------------
async function scanHeaders() {
  const res = await fetch(location.href);

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

// ---------------------- COOKIES SCANNER ----------------------
function scanCookies() {
  return document.cookie.split(";").map(c => {
    const [name] = c.trim().split("=");

    return {
      name,
      secure: c.includes("Secure"),
      httpOnly: c.includes("HttpOnly"),
      sameSite: /SameSite/i.test(c)
    };
  });
}

// ---------------------- FULL AUDIT ----------------------
async function runFullAudit() {
  console.log("[WebAudit] Running full audit...");

  return {
    url: location.href,
    timestamp: new Date().toISOString(),
    secrets: await scanSecrets(),
    dirs: await scanDirs(),
    headers: await scanHeaders(),
    cookies: scanCookies()
  };
}

// ---------------------- MESSAGE LISTENER ----------------------
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "RUN_AUDIT") {
    runFullAudit().then(result => {
      chrome.runtime.sendMessage({ type: "STORE_SCAN", data: result });
      sendResponse({ ok: true });
    });
    return true;
  }
});
