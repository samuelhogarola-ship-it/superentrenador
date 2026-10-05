const COMMERCIAL_NAME_TERMS = [
  "academy", "academia", "box", "center", "centro", "club", "crossfit",
  "escuela", "equipo", "fitness", "gimnasio", "gym", "studio", "team",
  "training", "wellness",
];

function normalizeName(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("es").replace(/[^a-z0-9]+/g, " ").trim();
}

export function isCommercialTrainerName(value: string) {
  return COMMERCIAL_NAME_TERMS.some((term) => normalizeName(value).split(" ").includes(term));
}

export const COMMERCIAL_NAME_ERROR = "Usa tu nombre real. Los nombres comerciales de gimnasios, clubes, estudios o marcas no están permitidos.";
