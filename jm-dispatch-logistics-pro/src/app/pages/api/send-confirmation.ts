// src/pages/api/send-confirmation.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { mg } from '@/lib/mailgun';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email } = req.body;

  if (!email) return res.status(400).json({ error: 'Email requis' });

  try {
    await mg.messages.create(process.env.MAILGUN_DOMAIN!, {
      from: process.env.MAILGUN_SENDER!,
      to: [email],
      subject: "Confirmation d'abonnement - JM Dispatch Logistics",
      html: `
        <h2>Merci pour votre abonnement !</h2>
        <p>Votre compte est maintenant actif avec l’accès complet à notre système load board.</p>
        <p>Visitez <a href="https://www.jmdispatchlogistics.com/dashboard">votre tableau de bord</a> pour commencer.</p>
      `,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur envoi email' });
  }
}
