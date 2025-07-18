import { supabase } from "@/lib/supabase";
import { mg } from "@/lib/mailgun";

export default async function handler(req, res) {
  const now = new Date();
  const in1h = new Date(now.getTime() + 60 * 60 * 1000);

  const { data: loads } = await supabase
    .from("loads")
    .select("id, origin, destination, scheduled_at, assigned_to")
    .gte("scheduled_at", now.toISOString())
    .lte("scheduled_at", in1h.toISOString());

  for (const load of loads || []) {
    if (!load.assigned_to) continue;

    const msg = `⏰ Rappel : Vous avez un load prévu dans 1 heure. ${load.origin} → ${load.destination}`;

    // Envoyer email via Mailgun
    await mg.messages.create(process.env.MAILGUN_DOMAIN!, {
      from: process.env.MAILGUN_SENDER!,
      to: [load.assigned_to],
      subject: "🚚 Rappel - Load dans 1h",
      text: msg,
    });

    // Marquer notification
    await supabase.from("notifications").insert([
      {
        user_email: load.assigned_to,
        message: msg,
        type: "email",
        sent: true,
        load_id: load.id,
      },
    ]);
  }

  return res.status(200).json({ success: true });
}
