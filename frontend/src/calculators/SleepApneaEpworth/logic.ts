export interface EpworthQuestion {
  id: number;
  text: string;
}

export const EPWORTH_QUESTIONS: EpworthQuestion[] = [
  { id: 1, text: 'Sentar e ler' },
  { id: 2, text: 'Assistir à TV' },
  { id: 3, text: 'Ficar sentado, sem fazer nada, em um local público' },
  { id: 4, text: 'Ficar sentado, por uma hora, como passageiro em um carro' },
  { id: 5, text: 'Deitar à tarde para descansar' },
  { id: 6, text: 'Sentar e conversar com outra pessoa' },
  { id: 7, text: 'Sentar, em silêncio, depois do almoço (sem ingestão de álcool)' },
  { id: 8, text: 'Sentado em um carro, parado por alguns minutos por causa de trânsito' }
];

export const EPWORTH_OPTIONS = [
  { label: 'Nenhuma', value: 0 },
  { label: 'Leve', value: 1 },
  { label: 'Moderada', value: 2 },
  { label: 'Alta', value: 3 }
];

export function getEpworthClassification(score: number): { label: string; color: string; recommendation: string } {
  if (score <= 10) return { label: 'Sono Normal', color: '#16a34a', recommendation: 'Sem evidências clínicas de sonolência diurna patológica.' };
  if (score <= 14) return { label: 'Sonolência Leve à Moderada', color: '#eab308', recommendation: 'Aumento da sonolência diurna. Investigar qualidade da higiene do sono, restrição de sono ou SAOS leve.' };
  if (score <= 24) return { label: 'Sonolência Anormal (Grave)', color: '#dc2626', recommendation: 'Forte suspeita de patologia do sono (SAOS grave ou Narcolepsia). Sugere-se polissonografia / avaliação especializada urgente.' };
  return { label: 'Erro de Cálculo', color: '#000', recommendation: '' };
}

export const REFERENCE_EPWORTH = 'Johns MW. A new method for measuring daytime sleepiness: the Epworth sleepiness scale. Sleep. 1991;14:540-5. PubMed ID: 1798888';
