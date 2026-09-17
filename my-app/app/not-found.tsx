import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex max-w-column flex-col gap-4 px-8 pb-16 pt-24">
      <h1 className="font-mono text-[0.875rem] font-medium text-faint">
        <span className="text-fainter">## </span>404
      </h1>
      <p className="text-[1rem] leading-[1.7] text-body">
        There is nothing at this address. Everything on this site lives on one page.
      </p>
      <p className="font-mono text-[0.875rem]">
        <Link href="/">back to titouanguerin.com</Link>
      </p>
    </main>
  );
}
