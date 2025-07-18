import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Leave = {
  id: string;
  driver_email: string;
  start_date: string;
  end_date: string;
  reason: string;
  status: string;
};

export default function LeaveRequests() {
  const [leaves, setLeaves] = useState<Leave[]>([]);

  const fetchLeaves = async () => {
    const { data } = await supabase
      .from("leaves")
      .select("*")
      .order("requested_at", { ascending: false });
    setLeaves(data || []);
  };

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("leaves").update({ status }).eq("id", id);
    fetchLeaves();
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">📅 Demandes de congé</h1>
      {leaves.map((l) => (
        <div key={l.id} className="border p-4 mb-2 rounded">
          <p><strong>Email :</strong> {l.driver_email}</p>
          <p><strong>Du :</strong> {l.start_date} <strong>au</strong> {l.end_date}</p>
          <p><strong>Motif :</strong> {l.reason}</p>
          <p><strong>Statut :</strong> {l.status}</p>
          {l.status === "pending" && (
            <div className="mt-2">
              <button
                className="bg-green-600 text-white px-3 py-1 mr-2 rounded"
                onClick={() => updateStatus(l.id, "approved")}
              >
                ✅ Approuver
              </button>
              <button
                className="bg-red-600 text-white px-3 py-1 rounded"
                onClick={() => updateStatus(l.id, "rejected")}
              >
                ❌ Rejeter
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
