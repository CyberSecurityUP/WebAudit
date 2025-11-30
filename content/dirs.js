export async function scanDirs() {
  const dirs = [
    "/admin","/login","/wp-admin","/wp-login.php","/.git","/.env",
    "/.git/config","/phpinfo.php","/server-status","/config.json",
    "/swagger","/_next","/.DS_Store","/.idea","/.vscode"
  ];

  const results = [];
  const origin = location.origin;

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
