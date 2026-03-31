export interface PromsQuestion {
  id: number;
  text: string;
}

export interface PromsOption {
  label: string;
  value: number;
}

export const STOPBANG_QUESTIONS: PromsQuestion[] = [
  { id: 1, text: 'S — RONCA alto o suficiente para ser ouvido através de portas fechadas?' },
  { id: 2, text: 'T — CANSADO? Sente-se frequentemente cansado, fadigado ou sonolento durante o dia?' },
  { id: 3, text: 'O — OBSERVADO? Alguém já observou você parar de respirar durante o sono?' },
  { id: 4, text: 'P — PRESSÃO? Você tem ou está em tratamento para pressão arterial alta?' },
  { id: 5, text: 'B — IMC? Índice de Massa Corporal maior que 35 kg/m²?' },
  { id: 6, text: 'A — IDADE acima de 50 anos?' },
  { id: 7, text: 'N — PESCOÇO? Circunferência do pescoço maior que 40 cm?' },
  { id: 8, text: 'G — GÊNERO masculino?' },
];

export const STOPBANG_OPTIONS: PromsOption[] = [
  { label: '✗ Não', value: 0 },
  { label: '✓ Sim', value: 1 },
];

export function getSTOPBangClassification(score: number): { label: string; color: string; recommendation: string } {
  if (score <= 2) return { label: 'Baixo Risco de AOS', color: '#16a34a', recommendation: 'A probabilidade de ter Apneia Obstrutiva do Sono (AOS) moderada a grave é baixa. Reavaliar se surgirem novos sintomas.' };
  if (score <= 4) return { label: 'Risco Intermediário de AOS', color: '#ca8a04', recommendation: 'Probabilidade intermediária de AOS moderada a grave. Consideração de polissonografia ou avaliação especializada é indicada.' };
  return { label: 'Alto Risco de AOS', color: '#dc2626', recommendation: 'Alta probabilidade de AOS moderada a grave. Avaliação por especialista em Medicina do Sono ou Otorrinolaringologia é fortemente recomendada.' };
}

export const REFERENCE_STOPBANG = 'Chung F, et al. (2008). STOP questionnaire: a tool to screen patients for obstructive sleep apnea. Anesthesiology. DOI: 10.1097/ALN.0b013e31816d83e4';
