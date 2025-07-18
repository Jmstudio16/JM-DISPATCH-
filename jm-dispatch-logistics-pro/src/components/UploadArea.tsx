import { useState } from "react";
import { uploadFile } from "@/lib/storage";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

interface Props {
  loadId: string;
}

export default function UploadArea({ loadId }: Props) {
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = async () => {
    if (!file) return;
    try {
      const path = await uploadFile(loadId, file);
      await supabase
        .from("loads")
        .update({ attachments: supabase.raw("array_append(attachments, ?)", [path]) })
        .eq("id", loadId);
      toast.success("Fichier joint avec succès !");
      setFile(null);
    } catch (e) {
      toast.error("Erreur lors de l’envoi");
      console.error(e);
    }
  };

  return (
    <div className="space-y-2">
      <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      <button onClick={handleUpload} className="bg-blue-600 text-white px-4 py-1 rounded">
        Ajouter au Load
      </button>
    </div>
  );
}
