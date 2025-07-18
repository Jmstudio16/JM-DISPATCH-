import { supabase } from "@/lib/supabase";

export async function addPoints(email: string, value: number) {
  const { data: user } = await supabase.from("users").select("points").eq("email", email).single();
  const current = user?.points || 0;

  await supabase.from("users").update({ points: current + value }).eq("email", email);
}
