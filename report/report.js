chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "LOAD_REPORT") {
    renderFullReport(msg.scan);
  }
});

function renderFullReport(scan) {
  const root = document.getElementById("container");

  root.innerHTML = `
    <h1>Web Audit Report</h1>
    <div class="meta">URL: ${scan.url}</div>
    <div class="meta">Date: ${scan.timestamp}</div>

    ${section("Secrets", renderSecrets(scan.secrets))}
    ${section("Sensitive Directories", renderDirs(scan.dirs))}
    ${section("Security Headers", renderHeaders(scan.headers))}
    ${section("Cookies", renderCookies(scan.cookies))}
  `;
}

function section(title, content) {
  return `
    <div class="section">
      <h2>${title}</h2>
      <div class="box">${content}</div>
    </div>
  `;
}

/* ---------- Secrets ---------- */
function renderSecrets(list) {
  if (!list || list.length === 0) {
    return "<p>No secrets found.</p>";
  }

  return `
    <table class="table">
      <tr><th>Source</th><th>Key</th><th>Risk</th></tr>
      ${list.map(x => `
        <tr>
          <td>${x.source}</td>
          <td>${x.key}</td>
          <td class="risk-${x.risk.toLowerCase()}">${x.risk}</td>
        </tr>
      `).join("")}
    </table>
  `;
}

/* ---------- Directories ---------- */
function renderDirs(list) {
  return `
    <table class="table">
      <tr><th>Path</th><th>Status</th><th>Size</th></tr>
      ${list.map(x => `
        <tr>
          <td>${x.path}</td>
          <td>${x.status}</td>
          <td>${x.size}</td>
        </tr>
      `).join("")}
    </table>
  `;
}

/* ---------- Headers ---------- */
function renderHeaders(headers) {
  return `
    <table class="table">
      <tr><th>Header</th><th>Value</th></tr>
      ${Object.entries(headers).map(([k,v]) => `
        <tr>
          <td>${k}</td>
          <td>${v}</td>
        </tr>
      `).join("")}
    </table>
  `;
}

/* ---------- Cookies ---------- */
function renderCookies(list) {
  return `
    <table class="table">
      <tr><th>Name</th><th>Secure</th><th>HttpOnly</th><th>SameSite</th></tr>
      ${list.map(c => `
        <tr>
          <td>${c.name}</td>
          <td>${c.secure}</td>
          <td>${c.httpOnly}</td>
          <td>${c.sameSite}</td>
        </tr>
      `).join("")}
    </table>
  `;
}
