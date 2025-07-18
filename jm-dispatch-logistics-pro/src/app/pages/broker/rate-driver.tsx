import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function RateDriver() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [loadId, setLoadId] = useState("");
  const [driverEmail, setDriverEmail] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const submitRating = async () => {
    await supabase.from("ratings").insert({
      load_id: loadId,
      driver_email: driverEmail,
      client_email: user.email,
      rating,
      comment,
    });

    // Mise à jour moyenne :
    const { data } = await supabase
      .from("ratings")
      .select("rating")
      .eq("driver_email", driverEmail);

    const avg = data.reduce((sum, r) => sum + r.rating, 0) / data.length;

    await supabase
      .from("users")
      .update({ rating_avg: avg })
      .eq("email", driverEmail);

    alert("✅ Évaluation envoyée !");
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">⭐ Évaluer un chauffeur</h1>

      <input
        type="text"
        placeholder="ID du Load"
        value={loadId}
        onChange={(e) => setLoadId(e.target.value)}
        className="border p-2 block w-full mb-2"
      />
      <input
        type="email"
        placeholder="Email du chauffeur"
        value={driverEmail}
        onChange={(e) => setDriverEmail(e.target.value)}
        className="border p-2 block w-full mb-2"
      />
      <label>Note :</label>
      <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="border p-2 mb-2 block">
        {[5, 4, 3, 2, 1].map((r) => (
          <option key={r} value={r}>{r} étoile{r > 1 ? "s" : ""}</option>
        ))}
      </select>
      <textarea
        placeholder="Commentaire"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="border p-2 block w-full mb-2"
      />
      <button onClick={submitRating} className="bg-blue-600 text-white px-4 py-2 rounded">
        Envoyer l’évaluation
      </button>
    </div>
  );
}
<td>{driver.rating_avg ? `${driver.rating_avg.toFixed(1)} ⭐` : "Non noté"}</td>
