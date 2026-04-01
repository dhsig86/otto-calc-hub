export interface SN5Question {
  id: number;
  text: string;
}

export const SN5_QUESTIONS: SN5Question[] = [
  { id: 1, text: 'Nível de Obstrução nasal (nariz entupido)?' },
  { id: 2, text: 'Frequência de Infecção de seios da face?' },
  { id: 3, text: 'Alergia nasal detectada?' },
  { id: 4, text: 'Sofrimento emocional da criança e família?' },
  { id: 5, text: 'Limitação de atividades devido aos sintomas?' }
];

export const SN5_OPTIONS = [1, 2, 3, 4, 5, 6, 7];

export function getSN5Classification(averageScore: number): { label: string; color: string; recommendation: string } {
  if (averageScore <= 3) return { label: 'Impacto Leve', color: '#16a34a', recommendation: 'Monitoramento clínico regular e higiene nasal continuada.' };
  if (averageScore <= 5) return { label: 'Impacto Moderado', color: '#ca8a04', recommendation: 'Otimização do tratamento medicamentoso local/sistêmico rigoroso.' };
  return { label: 'Impacto Grave na Qualidade de Vida', color: '#dc2626', recommendation: 'Forte indicação para intervenção cirúrgica (Adenoidectomia / FESS pediátrica).' };
}

export const REFERENCE_SN5 = 'Ribeiro DO, et al. (2015). Validation of the Brazilian Portuguese version of the Sino-Nasal-5 (SN-5) questionnaire. J Pediatr (Rio J). DOI: 10.1016/j.jped.2015.08.006';
