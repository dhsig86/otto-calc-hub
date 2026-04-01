export interface COMQQuestion {
  id: number;
  text: string;
}

// O banco de dados está preparado para expansão aos 12 itens originais. Itens atuais injetados como protótipo.
export const COMQ_QUESTIONS: COMQQuestion[] = [
  { id: 1, text: "Quanto o seu ouvido 'vazou' (teve secreção)?" },
  { id: 2, text: "Quanto o mau cheiro do ouvido te incomodou?" },
  { id: 3, text: "Quanta dificuldade você teve para ouvir em lugares silenciosos?" },
  { id: 4, text: "Quanta dificuldade você teve para ouvir em lugares barulhentos?" },
  { id: 5, text: "Quanto o incômodo no ouvido afetou seu trabalho/estudo?" }
];

export const COMQ_OPTIONS = [
  { label: 'Nenhum', value: 0 },
  { label: 'Leve', value: 1 },
  { label: 'Moderado', value: 2 },
  { label: 'Grave', value: 3 },
  { label: 'Extremo', value: 4 }
];

export function getCOMQClassification(score: number): { label: string; color: string; recommendation: string } {
  if (score <= 12) return { label: 'Baixo Impacto', color: '#16a34a', recommendation: 'A otite crônica parece estar clinicamente estável ou sob controle. Manter higiene e precauções com água.' };
  if (score <= 30) return { label: 'Impacto Moderado', color: '#ca8a04', recommendation: 'Doença ativa com impacto moderado. Considerar otimização do tratamento clínico (gotas antibióticas, ciprofloxacino) ou avaliação anatômica.' };
  return { label: 'Impacto Severo', color: '#dc2626', recommendation: 'Mau controle clínico evidente. Forte indicação para avaliação cirúrgica reconstrutora ou erradicadora (Timpanomastoidectomia).' };
}

export const REFERENCE_COMQ = 'Penido Nde O, et al. (2018). Translation, cultural adaptation and validation of the Chronic Otitis Media Questionnaire 12 (COMQ-12) in Brazilian Portuguese. Braz J Otorhinolaryngol. DOI: 10.1016/j.bjorl.2018.10.005';
