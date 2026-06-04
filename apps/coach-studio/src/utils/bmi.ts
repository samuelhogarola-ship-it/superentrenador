export function calculateBmi(weightKg?: number | null, heightCm?: number | null): number | null {
  if (!weightKg || !heightCm || weightKg <= 0 || heightCm <= 0) {
    return null;
  }

  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  return Number(bmi.toFixed(1));
}

export function getBmiLabel(bmi: number | null): string {
  if (bmi === null) {
    return 'Sin datos suficientes';
  }
  if (bmi < 18.5) {
    return 'Bajo peso';
  }
  if (bmi < 25) {
    return 'Normopeso';
  }
  if (bmi < 30) {
    return 'Sobrepeso';
  }
  return 'Obesidad';
}
