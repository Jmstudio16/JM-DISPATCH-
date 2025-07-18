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
import ProtectedRoute from "@/components/ProtectedRoute";

export default function DriverDashboard() {
  return (
    <ProtectedRoute>
      <div className="p-6">
        <h1 className="text-2xl font-bold">Driver Dashboard</h1>
        {/* contenu... */}
      </div>
    </ProtectedRoute>
  );
}
import dynamic from "next/dynamic";
const Map = dynamic(() => import("@/components/Map"), { ssr: false });

...

{loads.map((load) => (
  <div key={load.id} className="border p-2 rounded space-y-2">
    <div>
      {load.origin} → {load.destination} - ${load.price}
    </div>

    <Map origin={load.origin} destination={load.destination} />
  </div>
))}
<a href="/chat" className="text-blue-500 underline">Ouvrir le chat</a>
<a href="/historique" className="text-blue-500 underline">Voir l’historique</a>
const fetchMoyenne = async () => {
  const { data } = await supabase
    .from("reviews")
    .select("rating")
    .eq("reviewee", user.email);

  if (data && data.length > 0) {
    const moyenne = data.reduce((sum, r) => sum + r.rating, 0) / data.length;
    setMoyenne(moyenne.toFixed(1));
  }
};
<a href="/support" className="text-blue-500 underline">Contacter le support</a>
<a href="/performance" className="text-blue-500 underline">Voir mes statistiques</a>
<a href="/planning" className="text-blue-600 underline">📅 Voir le planning</a>
import { signIn, signOut, useSession } from "next-auth/react";

const { data: session } = useSession();

{!session ? (
  <button onClick={() => signIn("google")} className="bg-red-600 text-white px-4 py-2 rounded">
    Connecter Google Calendar
  </button>
) : (
  <button onClick={() => signOut()} className="bg-gray-600 text-white px-4 py-2 rounded">
    Déconnecter
  </button>
)}
<a href="/tracking" className="text-blue-600 underline">📍 Suivi en direct</a>
<a href="/admin/overview" className="text-blue-600 underline">📊 Vue d’ensemble</a>
<a
  href={`/api/generate-report?email=${user.email}`}
  target="_blank"
  rel="noopener noreferrer"
  className="mt-4 inline-block bg-indigo-600 text-white px-4 py-2 rounded"
>
  📄 Télécharger Rapport PDF
</a>
