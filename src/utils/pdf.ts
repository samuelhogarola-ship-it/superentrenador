import { jsPDF } from "jspdf";
import {
  NutritionTemplate,
  PDFExport,
  ProgressEntry,
  PTClient,
  RoutineTemplate,
  TrainerProfile
} from "../types";
import { formatDate } from "./format";

interface ExportBundle {
  type: PDFExport["type"];
  trainer: TrainerProfile;
  client: PTClient;
  routine?: RoutineTemplate;
  nutrition?: NutritionTemplate;
  progressEntries?: ProgressEntry[];
}

function drawHeader(doc: jsPDF, trainer: TrainerProfile, title: string, clientName: string) {
  doc.setFont("times", "bold");
  doc.setFontSize(28);
  doc.text("Super Entrenador", 48, 56);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text(title, 48, 92);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text(`Entrenador: ${trainer.displayName}`, 48, 116);
  doc.text(`Cliente: ${clientName}`, 48, 134);
  doc.text(`Fecha: ${formatDate(new Date().toISOString())}`, 48, 152);
  doc.setDrawColor(219, 92, 39);
  doc.line(48, 168, 548, 168);
}

export function generateCoachPdf(bundle: ExportBundle) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const clientName = `${bundle.client.name} ${bundle.client.surname}`;

  if (bundle.type === "routine" && bundle.routine) {
    drawHeader(doc, bundle.trainer, "Rutina personalizada", clientName);
    let y = 210;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(13);
    doc.text(
      `${bundle.routine.title} · ${bundle.routine.daysPerWeek} días/semana · ${bundle.routine.level}`,
      48,
      y
    );
    y += 28;
    doc.text(bundle.routine.notes, 48, y, { maxWidth: 500 });
    y += 34;

    bundle.routine.days.forEach((day) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(15);
      doc.text(`${day.dayLabel}: ${day.focus}`, 48, y);
      y += 20;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.text(`${day.durationMinutes} · ${day.level}`, 48, y);
      y += 18;

      day.blocks.forEach((block) => {
        doc.text(
          `• ${block.exerciseName} — ${block.sets} x ${block.repRange} · descanso ${block.restSeconds}s · RIR ${block.rir}`,
          60,
          y,
          { maxWidth: 480 }
        );
        y += 16;
      });

      y += 12;
    });
  }

  if (bundle.type === "nutrition" && bundle.nutrition) {
    drawHeader(doc, bundle.trainer, "Plan nutricional", clientName);
    let y = 210;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);
    doc.text(bundle.nutrition.title, 48, y);
    y += 20;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(
      `${bundle.nutrition.caloriesTarget} kcal · ${bundle.nutrition.macrosSummary}`,
      48,
      y
    );
    y += 28;

    doc.text(bundle.nutrition.notes, 48, y, { maxWidth: 500 });
    y += 30;

    bundle.nutrition.structure.forEach((line) => {
      doc.text(`• ${line}`, 60, y, { maxWidth: 470 });
      y += 18;
    });
  }

  if (bundle.type === "progress" && bundle.progressEntries) {
    drawHeader(doc, bundle.trainer, "Seguimiento corporal", clientName);
    let y = 210;

    bundle.progressEntries.slice(0, 6).forEach((entry) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text(formatDate(entry.date), 48, y);
      y += 18;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.text(
        `Peso ${entry.weightKg} kg · Cintura ${entry.waistCm} cm · Cadera ${entry.hipCm} cm · Pecho ${entry.chestCm} cm · Fotos ${entry.photoCount}`,
        60,
        y,
        { maxWidth: 470 }
      );
      y += 16;
      doc.text(`Coach: ${entry.noteByTrainer}`, 60, y, { maxWidth: 470 });
      y += 28;
    });
  }

  const safeName = clientName.toLowerCase().replace(/\s+/g, "-");
  const fileName = `${bundle.type}-${safeName}.pdf`;
  doc.save(fileName);
  return fileName;
}
