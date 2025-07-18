import { supabase } from "@/lib/supabase";

export default async function handler(req, res) {
  const { email } = req.query;

  const { data: user } = await supabase.from("users").select("*").eq("email", email).single();
  if (!user || !user.is_available) return res.status(200).json([]);

  const { data: loads } = await supabase
    .from("loads")
    .select("*")
    .eq("status", "new")
    .eq("vehicle_type", user.vehicle_type);

  // Simple scoring: distance + rating
  const scored = loads.map((l) => {
    const distance = Math.sqrt(
      Math.pow(user.lat - l.origin_lat, 2) + Math.pow(user.lng - l.origin_lng, 2)
    );
    const score = user.rating_avg / (distance + 1); // Bonus pour bonne note, pénalité pour éloignement
    return { ...l, score };
  });

  const sorted = scored.sort((a, b) => b.score - a.score).slice(0, 5); // Top 5
  return res.status(200).json(sorted);
}
