export function scanCookies() {
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
