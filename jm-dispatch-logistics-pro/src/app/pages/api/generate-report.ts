import { supabase } from "@/lib/supabase";
import PDFDocument from "pdfkit";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email } = req.query;

  const { data: user } = await supabase.from("users").select("*").eq("email", email).single();
  const { data: loads } = await supabase
    .from("loads")
    .select("*")
    .eq("assigned_to", email)
    .gte("created_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

  const totalLoads = loads.length;
  const totalRevenue = loads.reduce((sum, l) => sum + (l.price || 0), 0);
  const points = user.points || 0;

  const doc = new PDFDocument();
  let buffers: Uint8Array[] = [];

  doc.on("data", buffers.push.bind(buffers));
  doc.on("end", () => {
    const pdfData = Buffer.concat(buffers);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=${email}_rapport.pdf`);
    res.send(pdfData);
  });

  doc.fontSize(20).text("🧾 Rapport Mensuel JM Dispatch", { align: "center" });
  doc.moveDown();
  doc.fontSize(14).text(`Nom : ${user.full_name || email}`);
  doc.text(`Email : ${email}`);
  doc.text(`Nombre de Loads : ${totalLoads}`);
  doc.text(`Revenu Total : $${totalRevenue.toFixed(2)}`);
  doc.text(`Points disponibles : ${points}`);
  doc.text(`Date : ${new Date().toLocaleDateString()}`);
  doc.moveDown();

  doc.text("📍 Loads récents :", { underline: true });
  loads.slice(0, 5).forEach((l) => {
    doc.text(`• ${l.origin} → ${l.destination} | $${l.price}`);
  });

  doc.end();
}
