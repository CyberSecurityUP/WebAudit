let lastScan = null;

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "STORE_SCAN") {
    lastScan = msg.data;
    chrome.storage.local.set({ lastScan });
    sendResponse({ ok: true });
  }

  if (msg.type === "GET_LAST_SCAN") {
    chrome.storage.local.get(["lastScan"], (res) => {
      sendResponse(res.lastScan || null);
    });
    return true;
  }
});
