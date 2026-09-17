/** Label / items rows in mono, one rule between categories (about, tools). */
export default function LabelledList({
  groups,
}: {
  groups: readonly { label: string; items: readonly string[] }[];
}) {
  return (
    <dl translate="no" className="divide-y divide-rule font-mono text-[14px] leading-[1.8]">
      {groups.map((group) => (
        <div
          key={group.label}
          className="grid grid-cols-[88px_minmax(0,1fr)] gap-x-[18px] py-2 sm:grid-cols-[132px_minmax(0,1fr)]"
        >
          <dt className="text-faint">{group.label}</dt>
          <dd className="text-muted">{group.items.join(" · ")}</dd>
        </div>
      ))}
    </dl>
  );
}
