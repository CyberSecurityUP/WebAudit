console.log("[WebAudit Popup] Loaded");

// ---------------------- UI ELEMENTS ----------------------

const btnRun = document.getElementById("runScan");
const btnExport = document.getElementById("exportHTML");
const lastScanDiv = document.getElementById("lastScan");

// ---------------------- LOAD LAST SCAN ON POPUP OPEN ----------------------

chrome.runtime.sendMessage({ type: "GET_LAST_SCAN" }, (scan) => {
  if (chrome.runtime.lastError) {
    lastScanDiv.innerText = "Error reading last scan.";
    return;
  }

  if (!scan) {
    lastScanDiv.innerText = "No previous scans.";
  } else {
    lastScanDiv.innerText = JSON.stringify(scan, null, 2);
  }
});

// ---------------------- RUN AUDIT ON CURRENT TAB ----------------------
btnRun.addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      files: ["content/main.js"]
    },
    () => {
      if (chrome.runtime.lastError) {
        console.error("Injection error:", chrome.runtime.lastError.message);
        alert("Content script injection failed.");
        return;
      }

      chrome.tabs.sendMessage(tab.id, { type: "RUN_AUDIT" }, (res) => {
        if (chrome.runtime.lastError) {
          console.error("[WebAudit Popup] Error:", chrome.runtime.lastError.message);
          alert("Could not start audit: " + chrome.runtime.lastError.message);
          return;
        }

        console.log("Audit started OK:", res);
      });
    }
  );
});


// ---------------------- EXPORT HTML REPORT ----------------------

btnExport.addEventListener("click", () => {
  chrome.runtime.sendMessage({ type: "GET_LAST_SCAN" }, async (scan) => {
    if (!scan) {
      alert("No scan available to export.");
      return;
    }

    const reportUrl = chrome.runtime.getURL("report/report.html");

    // abrir a aba
    chrome.tabs.create({ url: reportUrl }, (newTab) => {

      // Monitorar carregamento do report.html
      chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
        if (tabId === newTab.id && changeInfo.status === "complete") {

          chrome.tabs.onUpdated.removeListener(listener);

          // finalmente enviar os dados!
          chrome.tabs.sendMessage(newTab.id, {
            type: "LOAD_REPORT",
            scan
          }, (res) => {
            if (chrome.runtime.lastError) {
              console.error("EXPORT ERROR:", chrome.runtime.lastError.message);
            }
          });

        }
      });

    });
  });
});
