import { supabase } from "@/lib/supabase";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { load_id } = req.body;

  // 1. Trouver le meilleur chauffeur disponible
  const { data: drivers } = await supabase
    .from("users")
    .select("email, points")
    .eq("role", "driver")
    .eq("status", "actif")
    .order("points", { ascending: false });

  const bestDriver = drivers?.[0];
  if (!bestDriver) return res.status(404).json({ error: "Aucun chauffeur disponible" });

  // 2. Assigner le chauffeur au load
  const { error } = await supabase
    .from("loads")
    .update({
      assigned_to: bestDriver.email,
      status: "assigned"
    })
    .eq("id", load_id);

  if (error) return res.status(500).json({ error: "Échec assignation" });

  return res.status(200).json({ message: "Dispatch réussi", driver: bestDriver.email });
}
