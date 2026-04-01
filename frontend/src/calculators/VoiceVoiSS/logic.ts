export interface VoiSSQuestion {
  id: number;
  text: string;
}

// A VoiSS possui 30 itens originais avaliados em 5 pontos (0 a 4).
export const VOISS_QUESTIONS: VoiSSQuestion[] = [
  { id: 1, text: "Sua voz some no meio da conversa?" },
  { id: 2, text: "Sua voz é rouca?" },
  { id: 3, text: "Você pigarreia?" },
  { id: 4, text: "É difícil entender o que você fala em um lugar barulhento?" },
  { id: 5, text: "Sua garganta dói?" },
  { id: 6, text: "As pessoas perguntam 'o que há de errado com a sua voz'?" },
  { id: 7, text: "Você não consegue falar ou cantar em tons mais agudos?" },
  { id: 8, text: "As perdas da sua voz são difíceis de prever?" },
  { id: 9, text: "Sua voz soa grossa ou áspera?" },
  { id: 10, text: "Você tem problemas para falar no telefone?" },
  { id: 11, text: "Você fica sem ar quando fala?" },
  { id: 12, text: "Você tem a sensação de que tem algo preso na garganta?" },
  { id: 13, text: "Sua voz soa fraca ou baixa?" },
  { id: 14, text: "A sua voz falha?" },
  { id: 15, text: "Sua garganta fica seca?" },
  { id: 16, text: "Você fala muito?" },
  { id: 17, text: "Você tosse?" },
  { id: 18, text: "O ar da sua casa ou do seu local de trabalho faz mal para a sua voz?" },
  { id: 19, text: "As pessoas têm dificuldade em ouvir você numa sala silenciosa?" },
  { id: 20, text: "Falar causa dor na sua garganta?" },
  { id: 21, text: "Você se sente deprimido(a) por causa da sua voz?" },
  { id: 22, text: "Você tem pouca paciência com a sua voz?" },
  { id: 23, text: "A sua voz afeta seu trabalho?" },
  { id: 24, text: "Sua voz parece choro?" },
  { id: 25, text: "Você fica ansioso(a) por causa da sua voz?" },
  { id: 26, text: "Os seus problemas de voz fazem com que você perca dinheiro?" },
  { id: 27, text: "A sua voz afeta sua vida social?" },
  { id: 28, text: "Você tem vergonha da sua voz?" },
  { id: 29, text: "Você fica nervoso(a) com a sua voz?" },
  { id: 30, text: "Você acha necessário evitar que as pessoas falem com você?" }
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
