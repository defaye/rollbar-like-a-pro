/**
 * Extracts parameter values from the page content
 * Searches for patterns like "jid 12345" or "jid: 12345"
 */
export function extractParamValue(paramName: string): string | null {
  // Look for the parameter in the page text
  // Pattern: paramName followed by optional colon/whitespace, then alphanumeric value
  const paramRegex = new RegExp(`${paramName}[:\\s]+([a-zA-Z0-9\\-_.]+)`, 'i');
  const pageContent = document.body.innerText;
  const match = pageContent.match(paramRegex);
  return match ? match[1] : null;
}

/**
 * Replaces placeholders in a preset text with actual values from the page
 * Placeholder format: #{parameter.path.name}
 * Example: "JID #{request.params.jid}" -> "JID 12345"
 *
 * Returns null if any placeholder cannot be resolved
 */
export function replacePlaceholders(text: string): string | null {
  const placeholderRegex = /#{([\w.]+)}/g;
  let hasUnresolvedPlaceholder = false;

  const result = text.replace(placeholderRegex, (match, paramPath) => {
    // Extract the last segment of the path as the parameter name
    // e.g., "request.params.jid" -> "jid"
    const paramName = paramPath.split('.').pop() || paramPath;

    const value = extractParamValue(paramName);
    if (!value) {
      hasUnresolvedPlaceholder = true;
      return match; // Keep the placeholder if value not found
    }
    return value;
  });

  // Return null if any placeholder couldn't be resolved
  // This allows us to hide presets that aren't applicable to the current page
  return hasUnresolvedPlaceholder ? null : result;
}

/**
 * Checks if a preset text contains any placeholders
 */
export function hasPlaceholders(text: string): boolean {
  return /#{[\w.]+}/.test(text);
}
