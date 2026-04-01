export interface VoiSSQuestion {
  id: number;
  text: string;
}

// O banco de dados está preparado para expansão aos 30 itens originais. Itens atuais injetados como protótipo.
export const VOISS_QUESTIONS: VoiSSQuestion[] = [
  { id: 1, text: "Sua voz some no meio da conversa?" },
  { id: 2, text: "Você sente pigarro ou catarro na garganta?" },
  { id: 3, text: "Sua voz soa rouca?" },
  { id: 4, text: "Você se sente deprimido por causa da sua voz?" },
  { id: 5, text: "Sua garganta dói ou fica seca ao falar?" }
];

export const VOISS_OPTIONS = [
  { label: 'Nunca', value: 0 },
  { label: 'Raramente', value: 1 },
  { label: 'Às vezes', value: 2 },
  { label: 'Frequentemente', value: 3 },
  { label: 'Sempre', value: 4 }
];

export function getVoiSSClassification(score: number): { label: string; color: string; recommendation: string } {
  if (score <= 15) return { label: 'Voz Dentro da Normalidade', color: '#16a34a', recommendation: 'Sintomas vocais desprezíveis. Não requer intervenção fonoaudiológica primária.' };
  return { label: 'Alteração Vocal Significativa', color: '#dc2626', recommendation: 'Escore preditivo para patologia laríngea funcional ou orgânica. Forte recomendação de videolaringoscopia com estroboscopia e fonoterapia avaliativa.' };
}

export const REFERENCE_VOISS = 'Moreti F, et al. (2014). Voice Symptom Scale (VoiSS) impairment: Brazilian Portuguese cultural adaptation and validation. J Voice. DOI: 10.1016/j.jvoice.2013.10.019';
