// broker.tsx
import { useState, useEffect } from "react";
// @ts-ignore
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";
import { useSession, signIn, signOut } from "next-auth/react";
import Calendar from "react-calendar";
import ProtectedRoute from "@/components/ProtectedRoute";
import "react-calendar/dist/Calendar.css";

interface Load {
  id: string;
  origin: string;
  destination: string;
  price: number;
  status: string;
  created_by: string;
  scheduled_at?: string;
}

export default function BrokerDashboard() {
  const [loads, setLoads] = useState<Load[]>([]);
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [price, setPrice] = useState(0);
  const [date, setDate] = useState<Date | null>(null);
  const { data: session } = useSession();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const fetchLoads = async () => {
    const { data } = await supabase
      .from("loads")
      .select("*")
      .eq("created_by", user.email);
    if (data) setLoads(data);
  };

  const createLoad = async () => {
    const newLoad = {
      id: uuidv4(),
      origin,
      destination,
      price,
      status: "available",
      created_by: user.email,
      scheduled_at: date?.toISOString(),
    };

    const { error } = await supabase.from("loads").insert([newLoad]);
    if (!error) {
      toast.success("✅ Load créé avec succès !");
      setOrigin("");
      setDestination("");
      setPrice(0);
      setDate(null);
      fetchLoads();

      if (session) {
        await fetch("/api/create-event", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token: (session as any).accessToken,
            title: `🚚 Load : ${origin} → ${destination}`,
            date: date?.toISOString(),
            description: "Load planifié depuis JM Dispatch Logistics Pro",
          }),
        });
      }
    } else {
      toast.error("❌ Erreur lors de la création du load");
    }
  };

  useEffect(() => {
    fetchLoads();
    const channel = supabase
      .channel("realtime:loads")
      .on("postgres_changes", { event: "*", schema: "public", table: "loads" }, () => {
        fetchLoads();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <ProtectedRoute>
      <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold">🚛 Tableau de bord - Broker</h1>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <input
              className="border p-2 w-full"
              placeholder="Origine"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
            />
            <input
              className="border p-2 w-full"
              placeholder="Destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
            <input
              className="border p-2 w-full"
              type="number"
              placeholder="Prix"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
            />
            <Calendar onChange={(val) => setDate(val as Date)} value={date} />
            <button
              onClick={createLoad}
              className="bg-blue-600 text-white py-2 px-4 rounded w-full"
            >
              ➕ Créer Load
            </button>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">📦 Mes Loads</h2>
            <ul className="space-y-2">
              {loads.map((load) => (
                <li key={load.id} className="border p-2 rounded">
                  {load.origin} → {load.destination} | ${load.price} | {load.status}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6">
          {!session ? (
            <button
              onClick={() => signIn("google")}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Connecter Google Calendar
            </button>
          ) : (
            <button
              onClick={() => signOut()}
              className="bg-gray-600 text-white px-4 py-2 rounded"
            >
              Déconnecter
            </button>
          )}
        </div>

        <div className="mt-4 flex flex-col md:flex-row gap-4">
          <a href="/chat" className="text-blue-500 underline">💬 Ouvrir le chat</a>
          <a href="/historique" className="text-blue-500 underline">📄 Voir l’historique</a>
          <a href="/support" className="text-blue-500 underline">📞 Contacter le support</a>
          <a href="/performance" className="text-blue-500 underline">📊 Voir mes statistiques</a>
          <a href="/planning" className="text-blue-600 underline">📅 Voir le planning</a>
        </div>
      </div>
    </ProtectedRoute>
  );
}
