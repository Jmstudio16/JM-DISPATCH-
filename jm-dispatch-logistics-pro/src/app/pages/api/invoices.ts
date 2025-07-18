// src/pages/api/invoices.ts
import { stripe } from "@/lib/stripe";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { customer_email } = req.body;

  try {
    const customers = await stripe.customers.list({ email: customer_email });
    const customer = customers.data[0];

    if (!customer) return res.status(404).json({ error: "Client introuvable." });

    const invoices = await stripe.invoices.list({ customer: customer.id });

    const formatted = invoices.data.map(inv => ({
      id: inv.id,
      amount_paid: inv.amount_paid / 100,
      currency: inv.currency,
      status: inv.status,
      created: new Date(inv.created * 1000).toLocaleDateString(),
      hosted_invoice_url: inv.hosted_invoice_url,
      invoice_pdf: inv.invoice_pdf,
    }));

    res.status(200).json({ invoices: formatted });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Erreur récupération factures." });
  }
}
