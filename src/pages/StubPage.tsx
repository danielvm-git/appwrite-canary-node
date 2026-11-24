export function StubPage({ title, hint }: { title: string; hint: string }) {
  return (
    <section>
      <h1 className="page-title ds-h1">{title}</h1>
      <p className="page-desc">{hint}</p>
    </section>
  );
}