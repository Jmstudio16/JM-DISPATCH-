import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Load {
  id: string;
  origin: string;
  destination: string;
  price: number;
  status: string;
  assigned_to?: string;
  created_by: string;
}

export default function Historique() {
  const [loads, setLoads] = useState<Load[]>([]);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const fetchHistoricLoads = async () => {
    const { data } = await supabase
      .from("loads")
      .select("*")
      .in("status", ["accepted", "rejected", "completed"]);

    // Filtrage par rôle
    let filtered: Load[] = [];
    if (user.role === "broker") {
      filtered = data?.filter(l => l.created_by === user.email) || [];
    } else if (user.role === "driver") {
      filtered = data?.filter(l => l.assigned_to === "driver-001") || [];
    } else {
      filtered = data || [];
    }

    setLoads(filtered);
  };

  useEffect(() => {
    fetchHistoricLoads();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Historique des Loads</h1>

      {loads.length === 0 ? (
        <p>Aucun load terminé ou rejeté trouvé.</p>
      ) : (
        <table className="w-full table-auto border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Origine</th>
              <th className="p-2 border">Destination</th>
              <th className="p-2 border">Prix</th>
              <th className="p-2 border">Statut</th>
            </tr>
          </thead>
          <tbody>
            {loads.map((load) => (
              <tr key={load.id}>
                <td className="p-2 border">{load.origin}</td>
                <td className="p-2 border">{load.destination}</td>
                <td className="p-2 border">${load.price}</td>
                <td className="p-2 border capitalize">{load.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
import dynamic from "next/dynamic";
const ReviewForm = dynamic(() => import("@/components/ReviewForm"), { ssr: false });

...

{loads.map((load) => (
  <div key={load.id} className="border p-4 mb-4 rounded shadow">
    <p>{load.origin} → {load.destination} - ${load.price} | {load.status}</p>

    {/* Montrer formulaire seulement si load accepté et non déjà noté */}
    {load.status === "accepted" && (
      <ReviewForm
        loadId={load.id}
        revieweeEmail={load.created_by}
        onSubmitted={() => alert("Merci pour votre évaluation !")}
      />
    )}
  </div>
))}
import { getPublicUrl } from "@/lib/storage";

...

{load.attachments?.map((path: string, idx: number) => (
  <a
    key={idx}
    href={getPublicUrl(path)}
    target="_blank"
    rel="noopener noreferrer"
    className="text-blue-600 underline block"
  >
    📎 Pièce jointe {idx + 1}
  </a>
))}
