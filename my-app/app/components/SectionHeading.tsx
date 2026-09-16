export default function SectionHeading({ id, children }: { id: string; children: string }) {
  return (
    <h2 id={id} translate="no" className="font-mono text-[18px] font-bold text-ink">
      <span className="text-fainter">## </span>
      {children}
    </h2>
  );
}
