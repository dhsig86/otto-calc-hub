export interface PromsQuestion {
  id: number;
  text: string;
}

export interface PromsOption {
  label: string;
  value: number;
}

export const THI_QUESTIONS: PromsQuestion[] = [
  { id: 1, text: 'Por causa do seu zumbido, é difícil para você se concentrar?' },
  { id: 2, text: 'A intensidade do seu zumbido torna difícil para você ouvir as pessoas?' },
  { id: 3, text: 'O seu zumbido faz você ficar com raiva?' },
  { id: 4, text: 'O seu zumbido faz você se sentir confuso(a)?' },
  { id: 5, text: 'Por causa do seu zumbido, você se sente desesperado(a)?' },
  { id: 6, text: 'Você reclama muito sobre o seu zumbido?' },
  { id: 7, text: 'Por causa do seu zumbido, você tem dificuldade para dormir à noite?' },
  { id: 8, text: 'Você sente como se não pudesse escapar do seu zumbido?' },
  { id: 9, text: 'O seu zumbido interfere na sua capacidade de desfrutar de atividades sociais?' },
  { id: 10, text: 'Por causa do seu zumbido, você se sente frustrado(a)?' },
  { id: 11, text: 'Por causa do seu zumbido, você sente que tem uma doença terrível?' },
  { id: 12, text: 'O seu zumbido torna difícil para você aproveitar a vida?' },
  { id: 13, text: 'O seu zumbido interfere com suas responsabilidades no trabalho ou em casa?' },
  { id: 14, text: 'Por causa do seu zumbido, você percebe que está frequentemente irritado(a)?' },
  { id: 15, text: 'Por causa do seu zumbido, é difícil para você ler?' },
  { id: 16, text: 'O seu zumbido deixa você chateado(a)?' },
  { id: 17, text: 'Você sente que seu zumbido colocou estresse em seu relacionamento com família e amigos?' },
  { id: 18, text: 'Você acha difícil desviar sua atenção do zumbido para outras coisas?' },
  { id: 19, text: 'Você sente que não tem controle sobre o seu zumbido?' },
  { id: 20, text: 'Por causa do seu zumbido, você frequentemente se sente cansado(a)?' },
  { id: 21, text: 'Por causa do seu zumbido, você se sente deprimido(a)?' },
  { id: 22, text: 'O seu zumbido faz você se sentir ansioso(a)?' },
  { id: 23, text: 'Você sente que não consegue mais lidar com o seu zumbido?' },
  { id: 24, text: 'O seu zumbido piora quando você está sob estresse?' },
  { id: 25, text: 'O seu zumbido faz você se sentir inseguro(a)?' },
];

export const THI_OPTIONS: PromsOption[] = [
  { label: 'Não', value: 0 },
  { label: 'Às vezes', value: 2 },
  { label: 'Sim', value: 4 },
];

export function getTHIClassification(score: number): { label: string; color: string; recommendation: string } {
  if (score <= 16) return { label: 'Grau 1: Desprezível', color: '#16a34a', recommendation: 'O zumbido é percebido apenas em ambientes silenciosos e é facilmente mascarado. Geralmente não requer intervenção.' };
  if (score <= 36) return { label: 'Grau 2: Leve', color: '#65a30d', recommendation: 'O zumbido pode ser ignorado com esforço e não interfere no sono. Aconselhamento e orientação podem ser suficientes.' };
  if (score <= 56) return { label: 'Grau 3: Moderado', color: '#ca8a04', recommendation: 'O zumbido é percebido durante as atividades diárias e pode interferir no sono. Intervenção audiológica é recomendada.' };
  if (score <= 76) return { label: 'Grau 4: Severo', color: '#ea580c', recommendation: 'O zumbido interfere em quase todas as atividades e perturba o sono. Tratamento ativo é necessário.' };
  return { label: 'Grau 5: Catastrófico', color: '#dc2626', recommendation: 'O zumbido é o foco principal da atenção do paciente e interfere em todas as áreas da vida. Requer intervenção multidisciplinar.' };
}

export const REFERENCE_THI = 'Ferreira PE, et al. (2005). Tinnitus handicap inventory: adaptação cultural para o Português brasileiro. Rev Soc Bras Fonoaudiol. DOI: 10.1590/S1516-80342005000400007';
