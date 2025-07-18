import { supabase } from "@/lib/supabase";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
});

export default async function handler(req, res) {
  const { data: users } = await supabase.from("users").select("*").eq("role", "driver");

  for (const user of users || []) {
    const { data: loads } = await supabase
      .from("loads")
      .select("price")
      .eq("assigned_to", user.email)
      .gte("created_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

    const totalRevenue = loads?.reduce((sum, l) => sum + (l.price || 0), 0);
    const totalLoads = loads?.length || 0;

    let bonus = 0;
    if (totalLoads >= 50) bonus += 50;
    if (totalRevenue >= 5000) bonus += 75;

    // ➕ Ajouter les points fidélité
    await supabase.from("users").update({ points: (user.points || 0) + bonus }).eq("email", user.email);

    // 💰 Envoyer un paiement via Stripe (si Stripe ID présent)
    if (user.stripe_account_id && bonus >= 50) {
      await stripe.transfers.create({
        amount: bonus * 100,
        currency: "usd",
        destination: user.stripe_account_id,
        description: "🎉 Bonus performance mensuel JM Dispatch",
      });
    }
  }

  return res.status(200).json({ success: true });
}
