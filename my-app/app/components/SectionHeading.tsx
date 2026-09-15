export default function SectionHeading({ id, children }: { id: string; children: string }) {
  return (
    <h2 id={id} className="font-mono text-[14px] font-medium text-faint">
      <span className="text-fainter">## </span>
      {children}
    </h2>
  );
}
