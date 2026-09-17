/**
 * Anchor attributes for any href that leaves the site's pages: other sites,
 * and the PDFs, which would otherwise replace the page. Spread onto <a>.
 * In-page (#), same-site routes and mailto get nothing.
 */
export function newTab(href: string) {
  return href.startsWith("http") || href.endsWith(".pdf")
    ? ({ target: "_blank", rel: "noopener noreferrer" } as const)
    : {};
}
