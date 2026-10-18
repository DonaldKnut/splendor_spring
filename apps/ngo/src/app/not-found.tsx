import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-6 text-center">
      <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[#d97845]">404</p>
      <h1 className="mt-3 font-display text-4xl text-[#1b2430]">Page not found</h1>
      <p className="mt-3 text-sm text-[#1b2430]/70">
        That link may be outdated, or the page has not been published yet.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full px-5 py-2.5 text-sm font-semibold text-white"
        style={{ background: "linear-gradient(135deg, #1f5c70, #2f8f8a)" }}
      >
        Back home
      </Link>
    </main>
  );
}
