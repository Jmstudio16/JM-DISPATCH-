import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ShiftsPage() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [shifts, setShifts] = useState([]);
  const [date, setDate] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const fetchShifts = async () => {
    const { data } = await supabase
      .from("shifts")
      .select("*")
      .eq("driver_email", user.email);
    setShifts(data || []);
  };

  const createShift = async () => {
    await supabase.from("shifts").insert([
      {
        driver_email: user.email,
        date,
        start_time: start,
        end_time: end,
        status: "actif",
      },
    ]);
    fetchShifts();
  };

  useEffect(() => {
    fetchShifts();
  }, []);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">📆 Mes Disponibilités</h1>

      <div className="flex gap-4">
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <input type="time" value={start} onChange={(e) => setStart(e.target.value)} />
        <input type="time" value={end} onChange={(e) => setEnd(e.target.value)} />
        <button
          onClick={createShift}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Ajouter Shift
        </button>
      </div>

      <div>
        <h2 className="font-semibold mt-4 mb-2">📋 Shifts programmés</h2>
        {shifts.map((s) => (
          <div key={s.id} className="border p-2 rounded">
            {s.date} : {s.start_time} → {s.end_time} | {s.status}
          </div>
        ))}
      </div>
    </div>
  );
}
