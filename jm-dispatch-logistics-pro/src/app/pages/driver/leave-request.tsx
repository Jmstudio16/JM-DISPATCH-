import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LeaveRequest() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [reason, setReason] = useState("");

  const submitLeave = async () => {
    await supabase.from("leaves").insert({
      driver_email: user.email,
      start_date: start,
      end_date: end,
      reason,
      status: "pending",
    });
    alert("✅ Demande de congé envoyée");
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">📝 Demande de congé</h1>
      <input type="date" value={start} onChange={(e) => setStart(e.target.value)} className="border p-2 mb-2 block" />
      <input type="date" value={end} onChange={(e) => setEnd(e.target.value)} className="border p-2 mb-2 block" />
      <textarea
        placeholder="Motif du congé"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        className="border p-2 mb-2 block w-full"
      />
      <button onClick={submitLeave} className="bg-blue-600 text-white px-4 py-2 rounded">
        Envoyer la demande
      </button>
    </div>
  );
}
