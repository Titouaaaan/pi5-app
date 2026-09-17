/** How a request reaches the site. Inline SVG so it follows the theme tokens. */
export default function TunnelDiagram() {
  const box = "fill-white stroke-rule";
  const line = "stroke-faint fill-none";
  const label = "font-mono text-[0.7188rem] [&]:fill-faint";
  return (
    <svg
      viewBox="0 0 760 280"
      role="img"
      aria-label="A request goes from the browser to Cloudflare, then through an outbound tunnel to the Raspberry Pi, where cloudflared hands it to Next.js and FastAPI"
      className="h-auto w-full text-[0.8125rem] [&_text]:fill-body"
    >
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0L10 5L0 10z" className="fill-faint" />
        </marker>
      </defs>

      <rect className={box} x="20" y="112" width="130" height="56" rx="6" strokeWidth="1.2" />
      <text x="85" y="145" textAnchor="middle" className="font-semibold [&]:fill-ink">your browser</text>

      <rect className={box} x="230" y="104" width="140" height="72" rx="6" strokeWidth="1.2" />
      <text x="300" y="134" textAnchor="middle" className="font-semibold [&]:fill-ink">Cloudflare</text>
      <text x="300" y="156" textAnchor="middle" className={label}>dns · tls</text>

      <rect x="450" y="36" width="290" height="216" rx="8" className="fill-none stroke-fainter" strokeWidth="1.2" strokeDasharray="4 4" />
      <text x="466" y="62" className="font-semibold [&]:fill-ink">Raspberry Pi 5</text>
      <text x="466" y="80" className={label}>no open ports</text>
      <rect className={box} x="466" y="96" width="258" height="38" rx="6" strokeWidth="1.2" />
      <text x="595" y="120" textAnchor="middle">cloudflared</text>
      <rect className={box} x="466" y="148" width="258" height="38" rx="6" strokeWidth="1.2" />
      <text x="595" y="172" textAnchor="middle">Next.js</text>
      <rect className={box} x="466" y="200" width="120" height="38" rx="6" strokeWidth="1.2" />
      <text x="526" y="224" textAnchor="middle">FastAPI</text>
      <rect className={box} x="604" y="200" width="120" height="38" rx="6" strokeWidth="1.2" />
      <text x="664" y="224" textAnchor="middle">SQLite</text>

      <path className={line} d="M150 140 H230" strokeWidth="1.4" markerEnd="url(#arrow)" />
      <text x="190" y="132" textAnchor="middle" className={label}>https</text>
      <path className={line} d="M370 140 C 400 140, 415 115, 466 115" strokeWidth="1.4" strokeDasharray="5 4" markerEnd="url(#arrow)" />
      <text x="410" y="104" textAnchor="middle" className={label}>tunnel</text>
      <path className={line} d="M595 134 V148" strokeWidth="1.4" markerEnd="url(#arrow)" />
      <path className={line} d="M540 186 V200" strokeWidth="1.4" markerEnd="url(#arrow)" />
      <path className={line} d="M586 219 H604" strokeWidth="1.4" markerEnd="url(#arrow)" />
    </svg>
  );
}
