/**
 * Safely copy text to clipboard with modern Async Clipboard API and legacy fallback.
 * Works seamlessly in both Secure Contexts (HTTPS / localhost) and non-secure environments (HTTP / IP / WebViews).
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  // 1. Try modern Async Clipboard API if available in secure context
  if (typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fallback below if permission denied or rejected
    }
  }

  // 2. Legacy fallback using invisible textarea + document.execCommand('copy')
  if (typeof document !== 'undefined') {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      // Ensure element is off-screen and invisible to avoid layout disruption or scrolling
      textArea.style.position = 'fixed';
      textArea.style.top = '0';
      textArea.style.left = '0';
      textArea.style.width = '2em';
      textArea.style.height = '2em';
      textArea.style.padding = '0';
      textArea.style.border = 'none';
      textArea.style.outline = 'none';
      textArea.style.boxShadow = 'none';
      textArea.style.background = 'transparent';
      textArea.setAttribute('readonly', '');
      document.body.appendChild(textArea);

      textArea.focus();
      textArea.select();
      textArea.setSelectionRange(0, 99999); // For iOS Safari

      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    } catch (err) {
      console.warn('Fallback copy to clipboard failed:', err);
      return false;
    }
  }

  return false;
}
