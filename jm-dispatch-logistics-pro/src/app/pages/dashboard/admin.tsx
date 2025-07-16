export default function AdminDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <ul className="space-y-2">
        <li>✓ Gérer les brokers</li>
        <li>✓ Gérer les dispatchers</li>
        <li>✓ Gérer les chauffeurs</li>
        <li>✓ Visualiser les paiements</li>
      </ul>
    </div>
  );
}
