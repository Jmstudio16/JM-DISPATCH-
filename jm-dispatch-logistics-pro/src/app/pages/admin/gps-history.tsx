import { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Polyline } from "@react-google-maps/api";
import { supabase } from "@/lib/supabase";

export default function GpsHistoryPage() {
  const [driver, setDriver] = useState("");
  const [date, setDate] = useState("");
  const [points, setPoints] = useState<{ lat: number; lng: number }[]>([]);

  const fetchHistory = async () => {
    const { data } = await supabase
      .from("gps_history")
      .select("lat, lng")
      .eq("driver_email", driver)
      .eq("date_only", date)
      .order("timestamp", { ascending: true });

    setPoints((data || []) as { lat: number; lng: number }[]);
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">🛰️ Historique GPS Chauffeur</h1>

      <div className="flex gap-4">
        <input type="email" placeholder="Email chauffeur" value={driver} onChange={(e) => setDriver(e.target.value)} />
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={fetchHistory}>Afficher Trajet</button>
      </div>

      <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "500px" }}
          center={points[0] || { lat: 25.77, lng: -80.19 }}
          zoom={6}
        >
          {points.length > 0 && (
            <Polyline
              path={points}
              options={{ strokeColor: "#ff0000", strokeOpacity: 0.8, strokeWeight: 3 }}
            />
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
}