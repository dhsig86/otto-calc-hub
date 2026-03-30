export const EPOS_SYMPTOMS = [
  "Obstrução/congestão nasal",
  "Secreção nasal (anterior ou posterior)",
  "Dor facial / pressão",
  "Redução ou perda do olfato",
  "Febre alta (>38°C) e secreção purulenta nasal",
  "Sintomas graves ou sintomas durando mais de 10 dias"
];

export const AAO_SYMPTOMS = [
  "Dor ou Pressão facial",
  "Obstrução ou Congestão nasal",
  "Secreção nasal ou Gotejamento Posterior",
  "Redução ou Perda de olfato",
  "Temperatura maior que 38°C",
  "Secreção nasal purulenta ou Edema periorbitário",
  "Dor facial intensa ou piora dos sintomas unilateralmente",
  "Piora dos sintomas após o quinto dia ou sintomas persistentes após o décimo dia"
];

export function calculateEposChance(selectedSymptoms: string[]): number {
  if (selectedSymptoms.includes("Sintomas graves ou sintomas durando mais de 10 dias")) {
    return 95;
  }
  if (selectedSymptoms.includes("Febre alta (>38°C) e secreção purulenta nasal")) {
    return 75;
  }
  if (selectedSymptoms.length >= 3) {
    return 70;
  }
  if (selectedSymptoms.length >= 2) {
    return 50;
  }
  if (selectedSymptoms.length >= 1) {
    return 25;
  }
  return 0;
}

export function calculateAaoChance(selectedSymptoms: string[]): number {
  if (selectedSymptoms.includes("Piora dos sintomas após o quinto dia ou sintomas persistentes após o décimo dia")) {
    return 95;
  }
  if (selectedSymptoms.includes("Dor facial intensa ou piora dos sintomas unilateralmente")) {
    return 85;
  }
  if (selectedSymptoms.includes("Secreção nasal purulenta ou Edema periorbitário")) {
    return 70;
  }
  if (selectedSymptoms.length >= 3) {
    return 50;
  }
  if (selectedSymptoms.length >= 2) {
    return 35;
  }
  if (selectedSymptoms.length >= 1) {
    return 20;
  }
  return 0;
}

export function getSinusitisInterpretation(chance: number): { comment: string; color: string } {
  if (chance === 0) return { comment: "Sem critérios preenchidos", color: "#64748b" }; // slate-500
  if (chance < 33) return { comment: "Baixa probabilidade de sinusite bacteriana", color: "#16a34a" }; // verde
  if (chance < 66) return { comment: "Média probabilidade de sinusite bacteriana", color: "#d97706" }; // laranja (substituindo o amarelo fraco)
  return { comment: "Alta probabilidade de sinusite bacteriana", color: "#dc2626" }; // vermelho
}
