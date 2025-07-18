import { useState } from "react";
import { useRouter } from "next/router";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("broker");
  const router = useRouter();

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // Ici, tu enregistres dans la base ou le localStorage
    localStorage.setItem("user", JSON.stringify({ email, role }));
    router.push(`/dashboard/${role}`);
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form className="bg-white shadow p-8 rounded space-y-4" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-2">Créer un compte</h2>
        <input type="email" placeholder="Email" className="w-full border p-2" onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Mot de passe" className="w-full border p-2" onChange={(e) => setPassword(e.target.value)} required />
        
        <select className="w-full border p-2" value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="broker">Broker</option>
          <option value="dispatcher">Dispatcher</option>
          <option value="driver">Driver</option>
        </select>

        <button type="submit" className="bg-green-600 text-white w-full p-2 rounded">Créer le compte</button>
      </form>
    </div>
  );
}
import { supabase } from "@/lib/supabase";

// Dans handleSubmit
const { data, error } = await supabase.from("users").insert([
  {
    email,
    role,
    subscribed: false,
  },
]);
if (error) {
  console.error(error);
  return;
}
localStorage.setItem("user", JSON.stringify({ email, role }));
router.push(`/dashboard/${role}`);
