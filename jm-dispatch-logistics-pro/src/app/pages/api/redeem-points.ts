import { supabase } from "@/lib/supabase";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
});

export default async function handler(req, res) {
  const { email } = req.body;

  const { data: user } = await supabase.from("users").select("*").eq("email", email).single();

  if (!user || !user.stripe_account_id || user.points < 10) {
    return res.status(400).json({ error: "Inéligible au retrait" });
  }

  const payoutAmount = user.points * 100; // $1/point

  try {
    await stripe.transfers.create({
      amount: payoutAmount,
      currency: "usd",
      destination: user.stripe_account_id,
      description: "💵 Retrait des points JM Dispatch",
    });

    await supabase.from("users").update({ points: 0 }).eq("email", email);

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: "Stripe error", details: err });
  }
}
