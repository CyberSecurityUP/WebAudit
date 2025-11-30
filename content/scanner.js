export async function scanSecrets() {
  const results = [];

  const critical = [
    /AKIA[0-9A-Z]{16}/,
    /sk_live_[0-9a-zA-Z]{24}/,
    /gh[pus]_[0-9A-Za-z]{36}/,
    /xox[baprs]-[0-9]{8,}-[0-9A-Za-z-]{10,}/,
    /ey[A-Za-z0-9_]+\.[A-Za-z0-9_]+\.[A-Za-z0-9_-]+/ // JWT
  ];

  const high = [
    /[A-Za-z0-9]{32,100}/,
    /[A-Za-z0-9_-]{40,}/
  ];

  const scanText = (text, source) => {
    [...text.matchAll(/[A-Za-z0-9_\-+\/]{25,100}/g)].forEach(m => {
      const key = m[0];

      let risk = "MEDIUM";
      if (critical.some(r => r.test(key))) risk = "CRITICAL";
      else if (high.some(r => r.test(key))) risk = "HIGH";
      else if (key.length >= 25 && key.length <= 100 && entropy(key) > 3.5) risk = "HIGH";

      results.push({ source, key, risk });
    });
  };

  // Inline HTML
  scanText(document.documentElement.innerHTML, "inline-html");

  // External JS files
  for (const s of document.querySelectorAll("script[src]")) {
    try {
      const txt = await fetch(s.src).then(r => r.text());
      scanText(txt, s.src);
    } catch {}
  }

  return results;
}
