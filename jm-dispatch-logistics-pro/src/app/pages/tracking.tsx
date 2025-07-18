import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { GoogleMap, Marker, LoadScript } from "@react-google-maps/api";

export default function TrackingPage() {
  const [drivers, setDrivers] = useState<any[]>([]);

  const fetchLocations = async () => {
    const { data } = await supabase.from("locations").select("*");
    setDrivers(data || []);
  };

  useEffect(() => {
    fetchLocations();
    const interval = setInterval(fetchLocations, 15000); // update every 15 sec
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📍 Suivi des Chauffeurs</h1>
      <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
        <GoogleMap
          mapContainerStyle={{ height: "500px", width: "100%" }}
          center={{ lat: 25.774, lng: -80.19 }}
          zoom={5}
        >
          {drivers.map((d) => (
            <Marker key={d.email} position={{ lat: d.lat, lng: d.lng }} label={d.email} />
          ))}
        </GoogleMap>
      </LoadScript>
    </div>
  );
}
