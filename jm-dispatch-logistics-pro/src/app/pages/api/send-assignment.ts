import type { NextApiRequest, NextApiResponse } from "next";
import { mg } from "@/lib/mailgun";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { driver_email, origin, destination } = req.body;

  if (!driver_email) return res.status(400).json({ error: "Email requis" });

  try {
    await mg.messages.create(process.env.MAILGUN_DOMAIN!, {
      from: process.env.MAILGUN_SENDER!,
      to: [driver_email],
      subject: "🚚 Nouveau Load Assigné",
      html: `<p>Un nouveau trajet vous a été assigné :</p>
             <p><strong>${origin} → ${destination}</strong></p>
             <p>Connectez-vous à JM Dispatch Logistics Pro pour accepter ou refuser ce load.</p>`,
    });

    res.status(200).json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Erreur d’envoi email" });
  }
}
