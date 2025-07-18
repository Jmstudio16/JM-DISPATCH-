import { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="flex items-center justify-center h-screen">
      <form className="bg-white shadow-md p-8 rounded space-y-4">
        <h2 className="text-2xl font-bold">Connexion</h2>
        <input type="email" placeholder="Email" className="w-full border p-2" onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Mot de passe" className="w-full border p-2" onChange={e => setPassword(e.target.value)} />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">Connexion</button>
      </form>
    </div>
  );
}
const handleLogin = (e: any) => {
  e.preventDefault();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  if (user.email === email) {
    router.push(`/dashboard/${user.role}`);
  } else {
    alert("Utilisateur non trouvé");
  }
};
