// story: e03s01
const hosts = [
  { name: "Node", url: "https://node.danielvm.net", status: "live" },
  { name: "Node staging", url: "https://node-staging.danielvm.net", status: "live" },
  { name: "Python", url: "https://python.danielvm.net", status: "live" },
  { name: "PHP", url: "https://php.danielvm.net", status: "live" },
  { name: "Go", url: "https://go.danielvm.net", status: "live" },
];

export function SitesPage() {
  return (
    <section>
      <h1>Sites</h1>
      <p className="text-muted">Deployable canaries on Appwrite Sites (CNAME → sites.danielvm.net).</p>
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