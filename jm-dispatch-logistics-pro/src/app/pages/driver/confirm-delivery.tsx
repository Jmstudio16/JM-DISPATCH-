import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

const SignatureCanvas = dynamic(() => import("react-signature-canvas"), { ssr: false });

export default function ConfirmDelivery() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [loadId, setLoadId] = useState("");
  const sigCanvas = useRef<any>();

  const confirmDelivery = async () => {
    const sigData = sigCanvas.current.getTrimmedCanvas().toDataURL("image/png");

    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });

    await supabase.from("proof_of_delivery").insert({
      load_id: loadId,
      driver_email: user.email,
      signed_at: new Date().toISOString(),
      signature_url: sigData,
      location_lat: position.coords.latitude,
      location_lng: position.coords.longitude,
    });

    alert("✅ Livraison confirmée et signature enregistrée !");
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">📦 Confirmation de Livraison</h1>
      <input
        type="text"
        placeholder="ID du Load"
        value={loadId}
        onChange={(e) => setLoadId(e.target.value)}
        className="border p-2 w-full"
      />
      <p className="text-sm text-gray-500 mb-2">🖊️ Signature du client :</p>
      <div className="border">
        <SignatureCanvas
          ref={sigCanvas}
          penColor="black"
          canvasProps={{ width: 400, height: 200, className: "bg-white" }}
        />
      </div>
      <button onClick={confirmDelivery} className="mt-4 bg-green-600 text-white px-4 py-2 rounded">
        Confirmer Livraison
      </button>
    </div>
  );
}
