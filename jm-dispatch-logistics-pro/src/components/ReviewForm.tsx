import { useState } from "react";
import { supabase } from "@/lib/supabase";

interface Props {
  loadId: string;
  revieweeEmail: string;
  onSubmitted: () => void;
}

export default function ReviewForm({ loadId, revieweeEmail, onSubmitted }: Props) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const submitReview = async () => {
    await supabase.from("reviews").insert([
      {
        load_id: loadId,
        reviewer: user.email,
        reviewee: revieweeEmail,
        rating,
        comment,
      },
    ]);
    onSubmitted();
  };

  return (
    <div className="space-y-2 border p-4 rounded bg-white shadow">
      <h3 className="text-lg font-semibold">Laisser un avis</h3>
      <label>Note :</label>
      <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="border p-2 w-full">
        {[1, 2, 3, 4, 5].map((r) => (
          <option key={r} value={r}>{r} ⭐</option>
        ))}
      </select>
      <textarea
        className="border w-full p-2"
        placeholder="Commentaire (optionnel)"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <button onClick={submitReview} className="bg-blue-600 text-white px-4 py-2 rounded w-full">
        Envoyer l’avis
      </button>
    </div>
  );
}
