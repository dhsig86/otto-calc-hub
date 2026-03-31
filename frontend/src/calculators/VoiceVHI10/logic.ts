export interface PromsQuestion {
  id: number;
  text: string;
}

export interface PromsOption {
  label: string;
  value: number;
}

export const VHI10_QUESTIONS: PromsQuestion[] = [
  { id: 1, text: 'Minha voz me deixa tenso(a).' },
  { id: 2, text: 'As pessoas têm dificuldade em me ouvir.' },
  { id: 3, text: 'As pessoas pedem para eu repetir quando falo cara a cara.' },
  { id: 4, text: 'Sinto-me excluído(a) de conversas por causa da minha voz.' },
  { id: 5, text: 'Minha voz varia ao longo do dia.' },
  { id: 6, text: 'Fico ansioso(a) ou frustrado(a) por causa da minha voz.' },
  { id: 7, text: 'Eu me esforço para usar minha voz.' },
  { id: 8, text: 'Fico sem ar quando falo.' },
  { id: 9, text: 'Minha voz soa rouca e seca.' },
  { id: 10, text: 'Acho que as pessoas não entendem meu problema de voz.' },
];

export const VHI10_OPTIONS: PromsOption[] = [
  { label: 'Nunca', value: 0 },
  { label: 'Quase Nunca', value: 1 },
  { label: 'Às vezes', value: 2 },
  { label: 'Quase Sempre', value: 3 },
  { label: 'Sempre', value: 4 },
];

export function getVHI10Classification(score: number): { label: string; color: string; recommendation: string } {
  if (score <= 10) return { label: 'Desvantagem Leve ou Ausente', color: '#16a34a', recommendation: 'Autopercepção de desvantagem vocal mínima. Pode não requerer intervenção terapêutica imediata.' };
  return { label: 'Desvantagem Moderada a Severa', color: '#ea580c', recommendation: 'Indica desvantagem vocal significativa. Avaliação laringológica e terapia fonoaudiológica são recomendadas.' };
}

export const REFERENCE_VHI10 = 'Costa T, et al. (2004). The short version of the Voice Handicap Index (VHI-10) adapted to Brazilian Portuguese. 33rd Annual Symposium: Care of the Professional Voice.';
