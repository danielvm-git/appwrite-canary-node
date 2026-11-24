export function StubPage({ title, hint }: { title: string; hint: string }) {
  return (
    <section>
      <h1>{title}</h1>
      <p className="text-muted">{hint}</p>
    </section>
  );
}