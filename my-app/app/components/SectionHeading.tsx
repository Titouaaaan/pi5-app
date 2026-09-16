// Numbered like a paper's section heads: small caps, centred, roman numeral.
// The counter is reset on <main> in globals.css, so each page counts from I.
export default function SectionHeading({ id, children }: { id: string; children: string }) {
  return (
    <h2
      id={id}
      translate="no"
      className="text-center text-[15px] font-medium capitalize tracking-[0.06em] text-ink [counter-increment:sec] [font-variant-caps:small-caps] before:mr-[0.6em] before:content-[counter(sec,upper-roman)'.']"
    >
      {children}
    </h2>
  );
}
