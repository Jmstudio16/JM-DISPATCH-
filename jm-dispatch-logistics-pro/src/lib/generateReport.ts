import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export async function generateUserReport(user: any, stats: any, loads: any[]) {
  const doc = new jsPDF();
  const today = new Date();
  const month = today.toLocaleString("default", { month: "long" });

  doc.setFontSize(18);
  doc.text(`Rapport Mensuel — ${month}`, 14, 20);
  doc.setFontSize(12);
  doc.text(`Utilisateur : ${user.email}`, 14, 30);
  doc.text(`Rôle : ${user.role}`, 14, 36);
  doc.text(`Points : ${stats.points || 0}`, 14, 42);
  doc.text(`Total Loads : ${stats.totalLoads || 0}`, 14, 48);
  doc.text(`Revenus : $${stats.totalRevenue || 0}`, 14, 54);
  doc.text(`Note moyenne : ${stats.rating || "-"}`, 14, 60);

  autoTable(doc, {
    startY: 70,
    head: [["Origine", "Destination", "Statut", "Prix"]],
    body: loads.map((l) => [l.origin, l.destination, l.status, `$${l.price}`]),
  });

  doc.save(`rapport-${user.role}-${month}.pdf`);
}
