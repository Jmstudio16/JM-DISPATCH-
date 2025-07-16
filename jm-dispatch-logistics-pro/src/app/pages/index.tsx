import Link from "next/link";
export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold text-center">JM Dispatch Logistics Pro</h1>
      <p className="text-center mt-4">Connectez les brokers, dispatchers, chauffeurs avec un système load board révolutionnaire.</p>
      <Link href="/login" className="mt-6 bg-blue-600 text-white px-4 py-2 rounded">Se connecter</Link>
    </div>
  );
}
