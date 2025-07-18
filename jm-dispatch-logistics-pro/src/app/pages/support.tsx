import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Support() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [tickets, setTickets] = useState<any[]>([]);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const submitTicket = async () => {
    if (!subject || !message) return alert("Veuillez remplir tous les champs");

    await supabase.from("tickets").insert([
      {
        user_email: user.email,
        subject,
        message,
        status: "ouvert",
      },
    ]);
    setSubject("");
    setMessage("");
    fetchTickets();
  };

  const fetchTickets = async () => {
    const { data } = await supabase.from("tickets").select("*").eq("user_email", user.email);
    if (data) setTickets(data);
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Assistance & Support</h1>

      <div className="space-y-2 mb-6">
        <input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Objet du ticket"
          className="border p-2 w-full"
        />
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Votre message..."
          className="border p-2 w-full h-24"
        />
        <button onClick={submitTicket} className="bg-blue-600 text-white px-4 py-2 rounded w-full">
          Soumettre le ticket
        </button>
      </div>

      <h2 className="text-xl font-semibold mb-2">Mes tickets</h2>
      <ul className="space-y-2">
        {tickets.map((t) => (
          <li key={t.id} className="border p-3 rounded bg-white">
            <strong>{t.subject}</strong> – <span className="capitalize">{t.status}</span>
            <p className="text-sm text-gray-700">{t.message}</p>
            {t.response && (
              <p className="text-sm mt-2 text-green-700">
                💬 Réponse du support : {t.response}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
