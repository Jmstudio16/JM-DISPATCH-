import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useLoadStore } from "@/context/loadStore";
import dynamic from "next/dynamic";
import { addPoints } from "@/lib/points";
import { signIn, signOut, useSession } from "next-auth/react";
import ProtectedRoute from "@/components/ProtectedRoute";
import toast from "react-toastify";

const Map = dynamic(() => import("@/components/Map"), { ssr: false });

export default function DriverDashboard() {
  const [loads, setLoads] = useState<any[]>([]);
  const [moyenne, setMoyenne] = useState<string>("0.0");
  const { data: session } = useSession();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const fetchMyLoads = async () => {
    const { data } = await supabase.from("loads").select("*").eq("assigned_to", user.email);
    if (data) setLoads(data);
  };

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("loads").update({ status }).eq("id", id);
    await addPoints(user.email, 10);
  };

  const fetchMoyenne = async () => {
    const { data } = await supabase.from("reviews").select("rating").eq("reviewee", user.email);
    if (data && data.length > 0) {
      const avg = data.reduce((sum, r) => sum + r.rating, 0) / data.length;
      setMoyenne(avg.toFixed(1));
    }
  };

  useEffect(() => {
    fetchMyLoads();
    fetchMoyenne();
    const channel = supabase
      .channel("realtime:loads")
      .on("postgres_changes", { event: "*", schema: "public", table: "loads" }, fetchMyLoads)
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      const { data } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_email", user.email)
        .eq("type", "toast")
        .eq("sent", false);

      data?.forEach((notif) => {
        toast.info(notif.message);
        supabase.from("notifications").update({ sent: true }).eq("id", notif.id);
      });
    };
    fetchNotifications();
  }, []);

  useEffect(() => {
    const sendPosition = (position: GeolocationPosition) => {
      const { latitude, longitude } = position.coords;
      const now = new Date();
      supabase.from("gps_history").insert({
        driver_email: user.email,
        lat: latitude,
        lng: longitude,
        timestamp: now.toISOString(),
        date_only: now.toISOString().split("T")[0],
      });
    };

    const track = () => navigator.geolocation.getCurrentPosition(sendPosition);
    const interval = setInterval(track, 30000);
    track();
    return () => clearInterval(interval);
  }, []);

  const handleRedeem = async () => {
    const res = await fetch("/api/redeem-points", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: user.email }),
    });
    const result = await res.json();
    if (result.success) {
      alert("✅ Points convertis et paiement envoyé !");
      window.location.reload();
    } else {
      alert("❌ Échec du paiement : " + result.error);
    }
  };

  return (
    <ProtectedRoute>
      <div className="p-6">
        <h1 className="text-2xl font-bold">🚚 Dashboard Chauffeur</h1>
        <p>📍 Suivi GPS actif</p>
        <p>🎁 Points cumulés : {user.points} pts</p>
        <p>⭐ Moyenne des avis : {moyenne}</p>

        <ul className="mt-4 space-y-4">
          {loads.map((load) => (
            <li key={load.id} className="border p-4 rounded">
              {load.origin} → {load.destination} - ${load.price}
              <div className="mt-2 space-x-2">
                <button onClick={() => updateStatus(load.id, "accepted")} className="bg-green-600 text-white px-3 py-1 rounded">Accepter</button>
                <button onClick={() => updateStatus(load.id, "rejected")} className="bg-red-600 text-white px-3 py-1 rounded">Refuser</button>
              </div>
              <Map origin={load.origin} destination={load.destination} />
            </li>
          ))}
        </ul>

        {user.points >= 10 && (
          <button onClick={handleRedeem} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
            💵 Convertir points en argent
          </button>
        )}

        <a href="/planning" className="block mt-4 text-blue-600 underline">📅 Voir Planning</a>
        <a href="/chat" className="block text-blue-600 underline">💬 Ouvrir Chat</a>
        <a href="/support" className="block text-blue-600 underline">🆘 Support</a>
        <a href={`/api/generate-report?email=${user.email}`} target="_blank" rel="noopener noreferrer" className="block mt-4 text-indigo-600 underline">📄 Télécharger Rapport PDF</a>
        {!session ? (
          <button onClick={() => signIn("google")} className="mt-4 bg-red-600 text-white px-4 py-2 rounded">Connecter Google</button>
        ) : (
          <button onClick={() => signOut()} className="mt-4 bg-gray-600 text-white px-4 py-2 rounded">Déconnecter</button>
        )}
      </div>
    </ProtectedRoute>
  );
}