import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Leaderboard() {
  const [users, setUsers] = useState<{ email: string; points: number }[]>([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const { data } = await supabase
        .from("users")
        .select("email, points")
        .order("points", { ascending: false });

      if (data) setUsers(data);
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🏆 Classement Général</h1>
      <ul className="space-y-2">
        {users.map((u, idx) => (
          <li key={u.email} className="border p-2 rounded bg-white shadow">
            <span className="font-bold">{idx + 1}. {u.email}</span> — {u.points} pts
          </li>
        ))}
      </ul>
    </div>
  );
}
