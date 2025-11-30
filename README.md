# **Web Audit Pro – Browser Extension**

A lightweight security auditing extension for Chrome (Manifest V3).
Designed for **Bug Bounty Hunters**, **Red Teams**, and **TPRM analysts**.

---

## **Features**

### 🔍 **1. Secret Key Scanner**

Detects exposed API keys and tokens in:

* Inline HTML
* External JavaScript files
* Minified or obfuscated JS bundles
  Uses pattern matching + entropy detection.

### 📁 **2. Sensitive Directory Finder**

Checks for common exposed endpoints such as:

* `/admin`
* `/login`
* `/wp-admin`
* `/.git`
* `/config.json`
* and more.

### 🛡️ **3. Security Header Analyzer**

Evaluates missing or weak headers:

* CSP
* X-Frame-Options
* X-Content-Type-Options
* HSTS
* Referrer-Policy
* Permissions-Policy

### 🍪 **4. Cookie Security Review**

Extracts and analyzes cookies for:

* Secure flag
* HttpOnly flag
* SameSite attribute

### 🧮 **5. Full HTML Report Export**

Generates a structured, professional audit report including:

* Secrets
* Directories
* Headers
* Cookies
  With a modern dark interface.

---

## **Installation (Developer Mode)**

1. Download or clone this repository.
2. Open Chrome and go to:
   `chrome://extensions`
3. Enable **Developer Mode** (top right).
4. Click **Load unpacked**.
5. Select the project directory.

---

## **How to Use**

1. Open any target website.
2. Click the **Web Audit Pro** icon.
3. Press **Run Full Audit**.
4. After the scan completes, click **Export HTML Report**.
5. A new tab will open with the structured report.

---

## **File Structure**

```
web-audit-extension/
├── manifest.json
├── service_worker.js
├── popup/
│   ├── popup.html
│   ├── popup.js
│   └── popup.css
├── content/
│   └── main.js
└── report/
    ├── report.html
    ├── report.js
    └── report.css
```

---

## **Requirements**

* Chrome 114+
* Manifest Version 3 support
