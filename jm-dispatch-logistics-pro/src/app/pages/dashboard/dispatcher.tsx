export default function DispatcherDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Tableau de bord - Dispatcher</h1>
      <p>Assignez des loads, suivez les trajets, communiquez avec les chauffeurs.</p>
    </div>
  );
}
import { useLoadStore } from "@/context/loadStore";

export default function DispatcherDashboard() {
  const { loads, assignLoad } = useLoadStore();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dispatcher Dashboard</h1>
      <h2 className="text-xl font-semibold">Loads disponibles</h2>
      <ul className="space-y-2">
        {loads.filter(l => l.status === "available").map(load => (
          <li key={load.id} className="border p-2 rounded">
            {load.origin} → {load.destination} - ${load.price}
            <button
              className="ml-4 bg-blue-600 text-white px-2 py-1 rounded"
              onClick={() => assignLoad(load.id, "driver-001")}
            >
              Assigner
            </button>
          </li>
        ))}
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
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function DispatcherDashboard() {
  const [loads, setLoads] = useState<any[]>([]);

  const fetchLoads = async () => {
    const { data } = await supabase.from("loads").select("*").eq("status", "available");
    if (data) setLoads(data);
  };

  const assignLoad = async (id: string) => {
    await supabase.from("loads").update({
      status: "assigned",
      assigned_to: "driver-001" // À remplacer plus tard par vrai ID
    }).eq("id", id);
  };

  useEffect(() => {
    fetchLoads();
    const channel = supabase.channel("realtime:loads")
      .on("postgres_changes", { event: "*", schema: "public", table: "loads" }, () => fetchLoads())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Dispatcher Dashboard</h1>
      <ul className="space-y-2">
        {loads.map((l) => (
          <li key={l.id} className="border p-2 rounded">
            {l.origin} → {l.destination} - ${l.price}
            <button className="ml-4 bg-green-600 text-white px-2 py-1 rounded" onClick={() => assignLoad(l.id)}>
              Assigner
            </button>
          </li>
        ))}
      </ul>
    </div>
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
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function DispatcherDashboard() {
  const [loads, setLoads] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("recent");

  const fetchLoads = async () => {
    const { data } = await supabase.from("loads").select("*");

    let filtered = data || [];

    // Filtrer par statut
    if (statusFilter !== "all") {
      filtered = filtered.filter((l) => l.status === statusFilter);
    }

    // Filtrer par mot-clé
    if (search.trim()) {
      filtered = filtered.filter(
        (l) =>
          l.origin.toLowerCase().includes(search.toLowerCase()) ||
          l.destination.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Trier
    if (sortOrder === "price") {
      filtered.sort((a, b) => a.price - b.price);
    } else {
      filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    setLoads(filtered);
  };

  useEffect(() => {
    fetchLoads();

    const channel = supabase
      .channel("realtime:loads")
      .on("postgres_changes", { event: "*", schema: "public", table: "loads" }, fetchLoads)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [search, statusFilter, sortOrder]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dispatcher Dashboard</h1>

      <div className="mb-4 space-y-2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Rechercher une ville ou destination"
          className="w-full border p-2 rounded"
        />
        <div className="flex gap-4">
          <select className="border p-2 rounded" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">Tous les statuts</option>
            <option value="available">Disponible</option>
            <option value="assigned">Assigné</option>
            <option value="accepted">Accepté</option>
            <option value="rejected">Rejeté</option>
          </select>
          <select className="border p-2 rounded" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
            <option value="recent">Plus récents</option>
            <option value="price">Prix croissant</option>
          </select>
        </div>
      </div>

      <ul className="space-y-2">
        {loads.map((load) => (
          <li key={load.id} className="border p-2 rounded">
            {load.origin} → {load.destination} - ${load.price} | {load.status}
          </li>
        ))}
      </ul>
    </div>
  );
}
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
await fetch("/api/send-assignment", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    driver_email: "driver-001@email.com",
    origin: load.origin,
    destination: load.destination,
  }),
});
toast.success("Chauffeur notifié par email !");
const autoDispatch = async (id: string) => {
  const res = await fetch("/api/auto-dispatch", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ load_id: id }),
  });
  const data = await res.json();
  if (data.driver) {
    toast.success(`Load assigné à ${data.driver}`);
  } else {
    toast.error("Aucun chauffeur disponible");
  }
};
<button
  onClick={() => autoDispatch(load.id)}
  className="ml-2 bg-indigo-600 text-white px-2 py-1 rounded"
>
  ⚡ Auto-Dispatch
</button>
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
if (session) {
  await fetch("/api/create-event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      token: session.accessToken,
      title: `🚚 Load : ${origin} → ${destination}`,
      date: date?.toISOString(),
      description: "Load planifié depuis JM Dispatch Logistics Pro",
    }),
  });
}
<a href="/tracking" className="text-blue-600 underline">📍 Suivi en direct</a>
const fetchDriverAvailability = async (email: string, date: string) => {
  const { data } = await supabase
    .from("shifts")
    .select("*")
    .eq("driver_email", email)
    .eq("date", date);

  if (!data?.length) {
    alert("❌ Ce chauffeur est OFF ce jour-là");
    return false;
  }

  return true;
};
