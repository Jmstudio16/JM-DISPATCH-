import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { GoogleMap, HeatmapLayer, LoadScript } from "@react-google-maps/api";

export default function OverviewAdmin() {
  const [stats, setStats] = useState({ users: 0, loads: 0, revenue: 0 });
  const [heatData, setHeatData] = useState<google.maps.LatLng[]>([]);

  const fetchStats = async () => {
    const { data: users } = await supabase.from("users").select("id");
    const { data: loads } = await supabase.from("loads").select("*");
    const revenue = loads?.reduce((sum, l) => sum + (l.price || 0), 0);

    setStats({
      users: users?.length || 0,
      loads: loads?.length || 0,
      revenue: revenue || 0,
    });
  };

  const fetchHeatmap = async () => {
    const { data: locations } = await supabase.from("locations").select("lat, lng");
    const formatted = locations?.map((loc) => new window.google.maps.LatLng(loc.lat, loc.lng)) || [];
    setHeatData(formatted);
  };

  useEffect(() => {
    fetchStats();
    fetchHeatmap();
  }, []);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">📊 Vue d’ensemble — Admin</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Stat label="Utilisateurs" value={stats.users} />
        <Stat label="Loads" value={stats.loads} />
        <Stat label="Revenus Total" value={`$${stats.revenue}`} />
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">📍 Heatmap des Chauffeurs</h2>
        <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
          <GoogleMap
            mapContainerStyle={{ height: "500px", width: "100%" }}
            center={{ lat: 25.774, lng: -80.19 }}
            zoom={5}
          >
            {heatData.length > 0 && (
              <HeatmapLayer data={heatData} options={{ radius: 30 }} />
            )}
          </GoogleMap>
        </LoadScript>
      </div>

      <a
        href={`/api/generate-report?email=${user.email}`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-block bg-indigo-600 text-white px-4 py-2 rounded"
      >
        📄 Télécharger Rapport PDF
      </a>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: any }) {
  return (
    <div className="bg-white shadow p-4 rounded text-center">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
}
