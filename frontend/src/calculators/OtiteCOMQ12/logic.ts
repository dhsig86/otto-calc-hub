export interface COMQQuestion {
  id: number;
  text: string;
}

export const COMQ_QUESTIONS: COMQQuestion[] = [
  { id: 1, text: "Ouvido vazou (houve secreção purulenta ou aquosa)?" },
  { id: 2, text: "O mau cheiro saindo do ouvido incomodou você?" },
  { id: 3, text: "Sua audição tem sido ruim / abafada em lugares silenciosos?" },
  { id: 4, text: "Sua audição tem sido ruim em lugares muito barulhentos?" },
  { id: 5, text: "Você teve sons incômodos, zumbidos ou chiados na orelha?" },
  { id: 6, text: "Sentiu-se com tontura, vertigem ou desequilíbrio na marcha?" },
  { id: 7, text: "Teve dor de ouvido aguda ou desconforto profundo?" },
  { id: 8, text: "Você teve dificuldade em acompanhar a televisão ou o rádio?" },
  { id: 9, text: "Você teve dificuldade em ouvir conversas com a sua família?" },
  { id: 10, text: "O problema de ouvido afastou você do trabalho ou dos estudos?" },
  { id: 11, text: "Precisou tomar remédios ou pingar antibióticos no ouvido?" },
  { id: 12, text: "Teve que ir com urgência ou mais vezes ao médico de ouvido?" }
];

export const COMQ_OPTIONS = [
  { label: 'Nenhum', value: 0 },
  { label: 'Leve', value: 1 },
  { label: 'Moderado', value: 2 },
  { label: 'Grave', value: 3 },
  { label: 'Extremo', value: 4 },
  { label: 'O pior possível', value: 5 }
];

export function getCOMQClassification(score: number): { label: string; color: string; recommendation: string } {
  // Score máximo original é 60 (12 perguntas x 5 pontos).
  if (score <= 15) return { label: 'Baixo Impacto', color: '#16a34a', recommendation: 'A otite crônica parece estar clinicamente estável. Manter profilaxia de molhar os ouvidos.' };
  if (score <= 35) return { label: 'Impacto Moderado', color: '#ca8a04', recommendation: 'Doença ativa causando morbidade limitante. Avaliar culturas de secreção e uso de tópicos Ciprofloxacino.' };
  return { label: 'Impacto Severo / Falha Clínica', color: '#dc2626', recommendation: 'Péssimo controle clínico. Risco de OMC Colesteatomatosa. Urge avaliação para cirurgia (Timpanomastoidectomia) sob risco de sequelas neuro-sensoriais.' };
}

export const REFERENCE_COMQ = 'Penido Nde O, et al. (2018). Translation, cultural adaptation and validation of the Chronic Otitis Media Questionnaire 12 (COMQ-12) in Brazilian Portuguese. Braz J Otorhinolaryngol. DOI: 10.1016/j.bjorl.2018.10.005';
