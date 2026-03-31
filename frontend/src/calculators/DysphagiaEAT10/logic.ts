export interface PromsQuestion {
  id: number;
  text: string;
}

export interface PromsOption {
  label: string;
  value: number;
}

export const EAT10_QUESTIONS: PromsQuestion[] = [
  { id: 1, text: 'Meu problema para engolir resultou em perda de peso.' },
  { id: 2, text: 'Meu problema para engolir interfere na minha capacidade de sair para comer.' },
  { id: 3, text: 'Engolir líquidos exige esforço.' },
  { id: 4, text: 'Engolir sólidos exige esforço.' },
  { id: 5, text: 'Engolir pílulas exige esforço.' },
  { id: 6, text: 'Engolir é doloroso.' },
  { id: 7, text: 'O prazer de me alimentar é afetado pelo meu problema para engolir.' },
  { id: 8, text: 'Quando engulo, a comida gruda na minha garganta.' },
  { id: 9, text: 'Eu tusso quando como.' },
  { id: 10, text: 'Engolir me deixa estressado(a).' },
];

export const EAT10_OPTIONS: PromsOption[] = [
  { label: '0', value: 0 },
  { label: '1', value: 1 },
  { label: '2', value: 2 },
  { label: '3', value: 3 },
  { label: '4', value: 4 },
];

export function getEAT10Classification(score: number): { label: string; color: string; recommendation: string } {
  if (score <= 2) return { label: 'Normal — Sem Risco de Disfagia', color: '#16a34a', recommendation: 'Não há indicação de disfagia pelo instrumento EAT-10. Monitorar em consultas de rotina.' };
  return { label: 'Anormal — Risco de Disfagia', color: '#dc2626', recommendation: 'EAT-10 ≥ 3 pontos sugere risco de disfagia. Recomenda-se avaliação fonoaudiológica e/ou médica especializada com urgência relativa.' };
}

export const REFERENCE_EAT10 = 'Gonçalves MIR, et al. (2013). Cultural equivalence of the Brazilian version of the Eating Assessment Tool - EAT-10. CoDAS. DOI: 10.1590/s2317-17822013000200020';
