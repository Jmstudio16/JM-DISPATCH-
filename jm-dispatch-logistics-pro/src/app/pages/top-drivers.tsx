import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Driver = {
  email: string;
  full_name: string;
  state: string;
  vehicle_type: string;
  loads_completed: number;
  rating_avg: number;
  on_time_pct: number;
  acceptance_pct?: number;
};

export default function TopDrivers() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [state, setState] = useState("");

  const fetchDrivers = async () => {
    let query = supabase.from("users").select("*").eq("role", "driver").order("loads_completed", { ascending: false });

    if (state) query = query.eq("state", state);

    const { data } = await query.limit(20);
    setDrivers(data as Driver[]);
  };

  useEffect(() => {
    fetchDrivers();
  }, [state]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">🚚 Top 20 Chauffeurs JM Dispatch</h1>

      <div className="mb-4">
        <label className="mr-2 font-semibold">Filtrer par État :</label>
        <select value={state} onChange={(e) => setState(e.target.value)} className="border p-2">
          <option value="">Tous</option>
          <option value="FL">Florida</option>
          <option value="GA">Georgia</option>
          <option value="TX">Texas</option>
        </select>
      </div>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">#</th>
            <th>Nom</th>
            <th>État</th>
            <th>Véhicule</th>
            <th>Loads</th>
            <th>⭐ Note</th>
            <th>⏱️ Ponctualité</th>
          </tr>
        </thead>
        <tbody>
          {drivers.map((d, i) => (
            <tr key={d.email} className="border-t">
              <td className="p-2">{i + 1}</td>
              <td>{d.full_name}</td>
              <td>{d.state}</td>
              <td>{d.vehicle_type}</td>
              <td>{d.loads_completed}</td>
              <td>{d.rating_avg?.toFixed(1) || "N/A"}</td>
              <td>{d.on_time_pct ? `${d.on_time_pct.toFixed(1)}%` : "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function calculateScore({ loads_completed, rating_avg, on_time_pct, acceptance_pct }: Driver): number {
  return (
    loads_completed * 0.4 +
    rating_avg * 20 * 0.3 +
    on_time_pct * 0.2 +
    (acceptance_pct || 0) * 0.1
  );
}
