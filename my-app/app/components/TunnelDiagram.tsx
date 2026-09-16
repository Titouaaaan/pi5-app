/** How a request reaches the site. Inline SVG so it follows the theme tokens. */
export default function TunnelDiagram() {
  const box = "fill-white stroke-rule";
  const line = "stroke-faint fill-none";
  return (
    <svg
      viewBox="0 0 760 330"
      role="img"
      aria-label="A request goes from the browser to Cloudflare, then through an outbound tunnel to the Raspberry Pi, where cloudflared hands it to Next.js and FastAPI"
      className="h-auto w-full text-[13px] [&_text]:fill-body"
    >
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0L10 5L0 10z" className="fill-faint" />
        </marker>
      </defs>
      <rect className={box} x="16" y="120" width="120" height="64" rx="6" strokeWidth="1.2" />
      <text x="76" y="147" textAnchor="middle" className="font-semibold [&]:fill-ink">your browser</text>
      <text x="76" y="166" textAnchor="middle" className="font-mono text-[11.5px] [&]:fill-faint">anywhere</text>

      <rect className={box} x="216" y="104" width="150" height="96" rx="6" strokeWidth="1.2" />
      <text x="291" y="132" textAnchor="middle" className="font-semibold [&]:fill-ink">Cloudflare</text>
      <text x="291" y="152" textAnchor="middle" className="font-mono text-[11.5px] [&]:fill-faint">dns · tls · https</text>
      <text x="291" y="168" textAnchor="middle" className="font-mono text-[11.5px] [&]:fill-faint">the only public address</text>

      <rect x="446" y="40" width="298" height="264" rx="8" className="fill-none stroke-fainter" strokeWidth="1.2" strokeDasharray="4 4" />
      <text x="462" y="64" className="font-semibold [&]:fill-ink">Raspberry Pi 5 · a shelf in my flat</text>
      <text x="462" y="82" className="font-mono text-[11.5px] [&]:fill-faint">no ports open to the internet</text>
      <rect className={box} x="462" y="100" width="266" height="42" rx="6" strokeWidth="1.2" />
      <text x="595" y="126" textAnchor="middle">cloudflared <tspan className="font-mono text-[11.5px] [&]:fill-faint">keeps the tunnel up</tspan></text>
      <rect className={box} x="462" y="156" width="266" height="42" rx="6" strokeWidth="1.2" />
      <text x="595" y="182" textAnchor="middle">Next.js <tspan className="font-mono text-[11.5px] [&]:fill-faint">renders the pages</tspan></text>
      <rect className={box} x="462" y="212" width="126" height="42" rx="6" strokeWidth="1.2" />
      <text x="525" y="238" textAnchor="middle">FastAPI</text>
      <rect className={box} x="602" y="212" width="126" height="42" rx="6" strokeWidth="1.2" />
      <text x="665" y="238" textAnchor="middle">SQLite</text>
      <text x="462" y="284" className="font-mono text-[11.5px] [&]:fill-faint">python backend: live stats, the visitor counter,</text>
      <text x="462" y="298" className="font-mono text-[11.5px] [&]:fill-faint">and a small cache of GitHub, OpenAlex and Cloudflare data</text>

      <path className={line} d="M136 152 H216" strokeWidth="1.4" markerEnd="url(#arrow)" />
      <text x="176" y="144" textAnchor="middle" className="font-mono text-[11.5px] [&]:fill-faint">https</text>
      <path className={line} d="M366 152 C 400 152, 410 121, 462 121" strokeWidth="1.4" strokeDasharray="5 4" markerEnd="url(#arrow)" />
      <text x="402" y="112" textAnchor="middle" className="font-mono text-[11.5px] [&]:fill-faint">tunnel</text>
      <text x="402" y="126" textAnchor="middle" className="font-mono text-[11.5px] [&]:fill-faint">outbound only</text>
      <path className={line} d="M595 142 V156" strokeWidth="1.4" markerEnd="url(#arrow)" />
      <path className={line} d="M540 198 V212" strokeWidth="1.4" markerEnd="url(#arrow)" />
      <path className={line} d="M588 233 H602" strokeWidth="1.4" markerEnd="url(#arrow)" />
    </svg>
  );
}
