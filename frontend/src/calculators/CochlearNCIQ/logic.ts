export interface NCIQQuestion {
  id: number;
  text: string;
  domain: string;
}

export const NCIQ_QUESTIONS: NCIQQuestion[] = [
  { id: 1, text: 'Você consegue entender um conhecido em uma sala silenciosa?', domain: 'Físico' },
  { id: 2, text: 'Você consegue entender um estranho em um ambiente barulhento?', domain: 'Físico' },
  { id: 3, text: 'Você se sente confiante ao usar o telefone?', domain: 'Psicológico' },
  { id: 4, text: 'Você se sente menos isolado por causa do implante?', domain: 'Social' },
  { id: 5, text: 'Você participa de atividades em grupo com facilidade?', domain: 'Social' }
];

export const NCIQ_OPTIONS = [
  { label: 'Nunca / Nada', value: 1 },
  { label: 'Raramente', value: 2 },
  { label: 'Às vezes', value: 3 },
  { label: 'Frequentemente', value: 4 },
  { label: 'Sempre / Totalmente', value: 5 }
];

export function getNCIQClassification(scorePercent: number): { label: string; color: string; recommendation: string } {
  if (scorePercent <= 40) return { label: 'Qualidade de Vida Reduzida', color: '#dc2626', recommendation: 'Avaliação crítica com fonoaudiologia e mapeamento do processador sugerida.' };
  if (scorePercent <= 70) return { label: 'Qualidade de Vida Moderada', color: '#ca8a04', recommendation: 'Bom benefício clínico. Manter acompanhamento semi-semestral.' };
  return { label: 'Qualidade de Vida Elevada', color: '#16a34a', recommendation: 'Excelente adaptação biopsicossocial ao dispositivo implantável.' };
}

export const REFERENCE_NCIQ = 'Caporali SA, et al. (2011). Nijmegen Cochlear Implant Questionnaire (NCIQ): translation and cross-cultural adaptation to Brazilian Portuguese. Braz J Otorhinolaryngol. DOI: 10.1590/S1808-86942011000400008';
