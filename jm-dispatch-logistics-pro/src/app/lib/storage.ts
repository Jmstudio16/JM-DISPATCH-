import { supabase } from "./supabase";

export async function uploadFile(loadId: string, file: File) {
  const filePath = `${loadId}/${Date.now()}-${file.name}`;
  const { data, error } = await supabase.storage
    .from("load-files")
    .upload(filePath, file);

  if (error) throw error;
  return data.path;
}

export async function getPublicUrl(path: string) {
  const { data } = supabase.storage.from("load-files").getPublicUrl(path);
  return data.publicUrl;
}
