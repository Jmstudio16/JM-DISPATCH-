import { useEffect, useState } from "react";

interface Invoice {
  id: string;
  amount_paid: number;
  currency: string;
  status: string;
  created: string;
  invoice_pdf: string;
}

export default function Invoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    fetch("/api/invoices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customer_email: user.email }),
    })
      .then(res => res.json())
      .then(data => setInvoices(data.invoices || []));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Mes Factures</h1>
      <table className="w-full table-auto border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Date</th>
            <th className="p-2 border">Montant</th>
            <th className="p-2 border">Statut</th>
            <th className="p-2 border">Lien PDF</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((inv) => (
            <tr key={inv.id}>
              <td className="border p-2">{inv.created}</td>
              <td className="border p-2">${inv.amount_paid}</td>
              <td className="border p-2 capitalize">{inv.status}</td>
              <td className="border p-2">
                <a href={inv.invoice_pdf} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                  Télécharger
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
