export default function Success() {
  return (
    <div className="flex justify-center items-center h-screen">
      <h1 className="text-2xl font-bold text-green-600">Paiement réussi ! Merci pour votre abonnement.</h1>
    </div>
  );
}
import { useEffect } from "react";

export default function Success() {
  useEffect(() => {
    // On sauvegarde un "abonnement actif"
    localStorage.setItem("subscription", "active");
  }, []);

  return (
    <div className="flex justify-center items-center h-screen">
      <h1 className="text-2xl font-bold text-green-600">Paiement réussi ! Votre abonnement est actif.</h1>
    </div>
  );
}
useEffect(() => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  localStorage.setItem("subscription", "active");

  fetch("/api/send-confirmation", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: user.email }),
  });
}, []);
import { supabase } from "@/lib/supabase";

useEffect(() => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  localStorage.setItem("subscription", "active");

  // Update in Supabase
  supabase.from("users").update({ subscribed: true }).eq("email", user.email);

  // Envoi email
  fetch("/api/send-confirmation", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: user.email }),
  });
}, []);
