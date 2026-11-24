// story: e01s02
const hosts = [
  { name: "Node", url: "https://node.danielvm.net", status: "pilot" },
  { name: "Python", url: "https://python.danielvm.net", status: "planned" },
  { name: "PHP", url: "https://php.danielvm.net", status: "planned" },
  { name: "Go", url: "https://go.danielvm.net", status: "planned" },
];

export function SitesPage() {
  return (
    <section>
      <h1>Sites</h1>
      <table className="mono">
        <thead>
          <tr>
            <th>Host</th>
            <th>URL</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {hosts.map((h) => (
            <tr key={h.url}>
              <td>{h.name}</td>
              <td>
                <a href={h.url} target="_blank" rel="noreferrer">
                  {h.url}
                </a>
              </td>
              <td>{h.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}