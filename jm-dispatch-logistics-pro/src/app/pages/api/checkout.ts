// src/pages/api/checkout.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { stripe } from '@/lib/stripe';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée' });

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            recurring: { interval: 'month' },
            unit_amount: 5000, // $50.00
            product_data: {
              name: 'JM Dispatch Logistics - Abonnement Premium',
              description: 'Accès complet au système de load board',
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${req.headers.origin}/success`,
      cancel_url: `${req.headers.origin}/cancel`,
    });

    res.status(200).json({ url: session.url });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la création de la session Stripe' });
  }
}
