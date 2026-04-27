import { jsPDF } from "jspdf";
import QRCode from "qrcode";
import { COUNTING_DAY, ELECTION_TIMELINE } from "@/data/timelines";
import type { ConfidenceModel, MythDebates, Profile } from "@/lib/types";
import { formatDateLong } from "@/lib/utils";

export async function exportElectionPassport(input: {
  profile: Profile;
  confidence: ConfidenceModel;
  mythDebates: MythDebates;
  graphImage?: string;
}) {
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "a4",
  });

  const stateDates = ELECTION_TIMELINE.filter((item) => item.state === input.profile.state)
    .map((item) => `${item.phaseLabel}: ${formatDateLong(item.date)}`)
    .join("  |  ");

  pdf.setFillColor(8, 17, 31);
  pdf.rect(0, 0, 595, 842, "F");
  pdf.setFillColor(17, 29, 49);
  pdf.roundedRect(32, 32, 531, 778, 16, 16, "F");

  pdf.setTextColor(244, 248, 255);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(22);
  pdf.text("Electra 2026 Election Passport", 48, 72);

  pdf.setFontSize(11);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(159, 176, 200);
  pdf.text(`${input.profile.name || "Anonymous voter"} | ${input.profile.state}`, 48, 96);
  pdf.text(`Polling: ${stateDates}`, 48, 114);
  pdf.text(`Counting: ${formatDateLong(COUNTING_DAY)}`, 48, 132);

  pdf.setDrawColor(36, 55, 83);
  pdf.line(48, 148, 547, 148);

  pdf.setTextColor(76, 132, 255);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(16);
  pdf.text(`Readiness ${input.confidence.readiness}%`, 48, 184);

  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(243, 247, 253);
  pdf.setFontSize(12);
  pdf.text(`Documents ${input.confidence.documents}%`, 48, 208);
  pdf.text(`EVM ${input.confidence.evm}%`, 168, 208);
  pdf.text(`Rights ${input.confidence.rights}%`, 258, 208);
  pdf.text(`Timelines ${input.confidence.timelines}%`, 362, 208);
  pdf.text(`Myths ${input.confidence.myths}%`, 482, 208);

  if (input.graphImage) {
    pdf.addImage(input.graphImage, "PNG", 48, 230, 500, 180);
  }

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(15);
  pdf.setTextColor(12, 166, 120);
  pdf.text("Debate badges", 48, 450);

  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(243, 247, 253);
  const badges = input.mythDebates.badges.length
    ? input.mythDebates.badges.join("  |  ")
    : "No badges earned yet";
  pdf.text(badges, 48, 472, { maxWidth: 500 });

  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(76, 132, 255);
  pdf.text("Latest myth verdicts", 48, 520);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(243, 247, 253);

  let y = 544;
  for (const record of input.mythDebates.records.slice(0, 3)) {
    pdf.text(`• ${record.mythTitle} - ${record.finalVerdict}`, 56, y, { maxWidth: 472 });
    y += 22;
  }

  const qr = await QRCode.toDataURL("https://voters.eci.gov.in");
  pdf.addImage(qr, "PNG", 438, 650, 90, 90);
  pdf.setTextColor(159, 176, 200);
  pdf.setFontSize(10);
  pdf.text("Scan for ECI voter services", 410, 752);

  return pdf.output("datauristring");
}
