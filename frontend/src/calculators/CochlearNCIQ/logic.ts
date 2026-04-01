export interface NCIQQuestion {
  id: number;
  text: string;
  domain: string;
}

export const NCIQ_QUESTIONS: NCIQQuestion[] = [
  // Som Básico e Avançado (Físico)
  { id: 1, text: 'Você escuta quando alguém chama seu nome em uma sala silenciosa?', domain: 'Físico' },
  { id: 2, text: 'Consegue identificar o som da chuva ou da água correndo?', domain: 'Físico' },
  { id: 3, text: 'Você entende bem o que é dito no rádio ou na televisão?', domain: 'Físico' },
  { id: 4, text: 'Consegue entender um estranho em um ambiente com barulho de fundo?', domain: 'Físico' },
  { id: 5, text: 'Você percebe de que direção os sons estão vindo na rua?', domain: 'Físico' },
  
  // Produção da Fala (Físico)
  { id: 6, text: 'As pessoas pedem frequentemente para você repetir o que disse?', domain: 'Físico' },
  { id: 7, text: 'Você consegue controlar o volume da sua própria voz?', domain: 'Físico' },
  
  // Autoestima e Psicológico
  { id: 8, text: 'Sente-se confiante ao se apresentar para pessoas que não conhece?', domain: 'Psicológico' },
  { id: 9, text: 'Você sente irritação ou frustração devido aos seus problemas auditivos?', domain: 'Psicológico' },
  { id: 10, text: 'Você se sente dependente de outras pessoas por causa da audição?', domain: 'Psicológico' },
  
  // Atividade e Interação Social (Social)
  { id: 11, text: 'Você evita ir a festas ou grandes reuniões devido à audição?', domain: 'Social' },
  { id: 12, text: 'Você visita lojas ou faz compras com confiança e facilidade?', domain: 'Social' },
  { id: 13, text: 'Sente-se isolado ou de fora das conversas em ambientes de grupo?', domain: 'Social' },
  { id: 14, text: 'Você se sente seguro ao realizar chamadas de telefone?', domain: 'Social' },
  { id: 15, text: 'Tem dificuldade ou tensão para manter uma conversa longa com amigos?', domain: 'Social' }
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
