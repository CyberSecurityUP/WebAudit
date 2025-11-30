(async () => {
  const scripts = [
    "scanner.js",
    "dirs.js",
    "headers.js",
    "cookies.js",
    "utils.js"
  ];

  for (const s of scripts) {
    await chrome.scripting.executeScript({
      target: { tabId: chrome.devtools?.inspectedWindow?.tabId || 0 },
      files: []
    });
  }
})();

chrome.runtime.onMessage.addListener(async (msg) => {
  if (msg.type === "RUN_AUDIT") {
    const scan = await runFullAudit();
    chrome.runtime.sendMessage({ type: "STORE_SCAN", data: scan });
    alert("Audit complete! Export via popup.");
  }
});

async function runFullAudit() {
  const secrets = await scanSecrets();
  const dirs = await scanDirs();
  const headers = await scanHeaders();
  const cookies = scanCookies();

  return {
    url: location.href,
    timestamp: new Date().toISOString(),
    secrets,
    dirs,
    headers,
    cookies
  };
}
