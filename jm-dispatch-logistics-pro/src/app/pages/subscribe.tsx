export default function Subscribe() {
  const handleSubscribe = async () => {
    const res = await fetch('/api/checkout', { method: 'POST' });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-8 rounded shadow space-y-4 text-center">
        <h1 className="text-2xl font-bold">Abonnement Premium</h1>
        <p>$50 / mois — Accès complet à JM Dispatch Logistics Pro</p>
        <button onClick={handleSubscribe} className="bg-blue-600 text-white px-4 py-2 rounded">
          S'abonner maintenant
        </button>
      </div>
    </div>
  );
}
