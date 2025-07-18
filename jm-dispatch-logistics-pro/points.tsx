import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function PointsPage() {
  const [points, setPoints] = useState(0);
  const [badge, setBadge] = useState("Débutant");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user?.email) return;

    const fetchPoints = async () => {
      const { data } = await supabase
        .from("users")
        .select("points")
        .eq("email", user.email)
        .single();

      const pts = data?.points || 0;
      setPoints(pts);

      if (pts >= 100) setBadge("🚀 Pro");
      else if (pts >= 50) setBadge("🔥 Actif");
      else if (pts >= 20) setBadge("📦 Régulier");
      else setBadge("🔰 Débutant");
    };

    fetchPoints();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🎖️ Fidélité & Badge</h1>
      <p><strong>Points cumulés :</strong> {points}</p>
      <p><strong>Badge :</strong> {badge}</p>
    </div>
  );
}
