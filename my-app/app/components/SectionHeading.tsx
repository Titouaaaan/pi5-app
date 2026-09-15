export default function SectionHeading({ children }: { children: string }) {
  return (
    <h2 className="font-mono text-[14px] font-medium text-faint">
      <span className="text-fainter">## </span>
      {children}
    </h2>
  );
}
