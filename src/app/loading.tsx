export default function Loading() {
  return (
    <div
      role="status"
      aria-label="Loading"
      className="mx-auto w-full max-w-5xl animate-pulse px-4 py-10"
    >
      <div className="h-7 w-48 rounded-md bg-muted" />
      <div className="mt-3 h-4 w-80 max-w-full rounded-md bg-muted/70" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="h-28 rounded-xl bg-muted/60" />
        ))}
      </div>
    </div>
  );
}
