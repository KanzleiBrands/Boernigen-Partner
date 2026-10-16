/** Meta-Cookies für die Conversions API (Zuordnung Browser ↔ Server-Event). */
export function getMetaCookies() {
  const read = (name: string) =>
    document.cookie
      .split("; ")
      .find((c) => c.startsWith(`${name}=`))
      ?.slice(name.length + 1);
  return { fbp: read("_fbp"), fbc: read("_fbc") };
}
