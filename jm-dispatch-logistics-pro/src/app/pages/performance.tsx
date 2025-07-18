import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Performance() {
  const [totalLoads, setTotalLoads] = useState(0);
  const [acceptedLoads, setAcceptedLoads] = useState(0);
  const [rejectedLoads, setRejectedLoads] = useState(0);
  const [assignedLoads, setAssignedLoads] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const fetchStats = async () => {
    const { data: allLoads } = await supabase
      .from("loads")
      .select("*");

    let filtered = allLoads || [];

    if (user.role === "broker") {
      filtered = filtered.filter((l) => l.created_by === user.email);
    } else if (user.role === "driver") {
      filtered = filtered.filter((l) => l.assigned_to === "driver-001");
    }

    setTotalLoads(filtered.length);
    setAcceptedLoads(filtered.filter((l) => l.status === "accepted").length);
    setRejectedLoads(filtered.filter((l) => l.status === "rejected").length);
    setAssignedLoads(filtered.filter((l) => l.status === "assigned").length);
    setTotalRevenue(
      filtered
        .filter((l) => l.status === "accepted")
        .reduce((acc, cur) => acc + cur.price, 0)
    );
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Tableau de Bord - Performance</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white shadow p-4 rounded">
          <p className="text-gray-500">Total Loads</p>
          <h2 className="text-3xl font-bold">{totalLoads}</h2>
        </div>
        <div className="bg-white shadow p-4 rounded">
          <p className="text-gray-500">Loads Acceptés</p>
          <h2 className="text-3xl font-bold">{acceptedLoads}</h2>
        </div>
        <div className="bg-white shadow p-4 rounded">
          <p className="text-gray-500">Loads Rejetés</p>
          <h2 className="text-3xl font-bold">{rejectedLoads}</h2>
        </div>
        <div className="bg-white shadow p-4 rounded">
          <p className="text-gray-500">Loads Assignés</p>
          <h2 className="text-3xl font-bold">{assignedLoads}</h2>
        </div>
        <div className="bg-white shadow p-4 rounded">
          <p className="text-gray-500">Revenus estimés ($)</p>
          <h2 className="text-3xl font-bold">${totalRevenue}</h2>
        </div>
      </div>
    </div>
  );
}
import { generateUserReport } from "@/lib/generateReport";

...

<button
  onClick={() => generateUserReport(user, {
    points,
    totalLoads,
    totalRevenue,
    rating: "4.7"
  }, loads)}
  className="mt-6 bg-blue-600 text-white px-4 py-2 rounded"
>
  📄 Télécharger mon rapport PDF
</button>
