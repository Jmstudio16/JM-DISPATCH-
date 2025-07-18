import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

export default function AdminTickets() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [responses, setResponses] = useState<{ [key: string]: string }>({});

  const fetchTickets = async () => {
    const { data } = await supabase.from("tickets").select("*").order("created_at", { ascending: false });
    if (data) setTickets(data);
  };

  const handleResponse = async (id: string, status: string) => {
    const response = responses[id];
    const { error } = await supabase
      .from("tickets")
      .update({ response, status })
      .eq("id", id);
    if (!error) {
      toast.success("Réponse envoyée");
      fetchTickets();
    } else {
      toast.error("Erreur");
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🎧 Support - Tous les Tickets</h1>

      {tickets.map((ticket) => (
        <div key={ticket.id} className="border rounded p-4 mb-4 bg-white shadow">
          <p><strong>Utilisateur :</strong> {ticket.user_email}</p>
          <p><strong>Objet :</strong> {ticket.subject}</p>
          <p><strong>Message :</strong> {ticket.message}</p>
          <p><strong>Statut :</strong> <span className="capitalize">{ticket.status}</span></p>
          {ticket.response && (
            <p className="text-green-600 mt-2"><strong>Réponse envoyée :</strong> {ticket.response}</p>
          )}

          {!ticket.response && (
            <div className="mt-4 space-y-2">
              <textarea
                placeholder="Votre réponse..."
                className="border w-full p-2"
                onChange={(e) => setResponses({ ...responses, [ticket.id]: e.target.value })}
              />
              <div className="flex gap-2">
                <button
                  onClick={() => handleResponse(ticket.id, "résolu")}
                  className="bg-green-600 text-white px-3 py-1 rounded"
                >
                  Répondre et clôturer
                </button>
                <button
                  onClick={() => handleResponse(ticket.id, "en cours")}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Répondre (en cours)
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
useEffect(() => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  if (user.role !== "admin") {
    window.location.href = "/";
  }
}, []);
