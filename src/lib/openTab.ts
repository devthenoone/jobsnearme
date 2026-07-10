// Open a URL in a real new browser TAB (not a popup window).
// Passing a features string to window.open makes browsers spawn a popup window;
// clicking a synthetic <a target="_blank"> opens a normal tab and respects the
// user gesture, so it isn't blocked.
export function openInNewTab(url: string): void {
  if (typeof document === "undefined") {
    window.open(url, "_blank");
    return;
  }
  const a = document.createElement("a");
  a.href = url;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  document.body.appendChild(a);
  a.click();
  a.remove();
}
