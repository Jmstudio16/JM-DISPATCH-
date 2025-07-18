import Calendar from "react-calendar";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Planning() {
  const [date, setDate] = useState(new Date());
  const [loads, setLoads] = useState<any[]>([]);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const fetchLoads = async () => {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const { data } = await supabase
      .from("loads")
      .select("*")
      .gte("scheduled_at", start.toISOString())
      .lte("scheduled_at", end.toISOString());

    const filtered = user.role === "driver"
      ? data?.filter((l) => l.assigned_to === user.email)
      : user.role === "broker"
      ? data?.filter((l) => l.created_by === user.email)
      : data;

    setLoads(filtered || []);
  };

  useEffect(() => {
    fetchLoads();
  }, [date]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🗓️ Planning des Loads</h1>
      <Calendar onChange={(val) => setDate(val as Date)} value={date} />

      <div className="mt-6 space-y-2">
        <h2 className="text-lg font-semibold">Loads le {date.toLocaleDateString()} :</h2>
        {loads.length === 0 && <p>Aucun load prévu ce jour.</p>}
        {loads.map((l) => (
          <div key={l.id} className="border p-2 rounded">
            {l.origin} → {l.destination} | ${l.price} | {l.status}
            <div className="text-sm text-gray-500">Heure prévue : {new Date(l.scheduled_at).toLocaleTimeString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
