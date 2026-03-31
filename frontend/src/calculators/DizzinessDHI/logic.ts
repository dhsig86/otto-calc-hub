export interface PromsQuestion {
  id: number;
  text: string;
}

export interface PromsOption {
  label: string;
  value: number;
}

export const DHI_QUESTIONS: PromsQuestion[] = [
  { id: 1, text: 'Olhar para cima aumenta seu problema?' },
  { id: 2, text: 'Por causa do seu problema, você se sente frustrado(a)?' },
  { id: 3, text: 'Por causa do seu problema, você restringe suas viagens a negócios ou lazer?' },
  { id: 4, text: 'Andar no corredor de um supermercado aumenta seu problema?' },
  { id: 5, text: 'Por causa do seu problema, você tem dificuldade para entrar ou sair da cama?' },
  { id: 6, text: 'Seu problema restringe significativamente sua participação em atividades sociais?' },
  { id: 7, text: 'Por causa do seu problema, você tem dificuldade para ler?' },
  { id: 8, text: 'Realizar atividades como esportes ou tarefas domésticas aumenta seu problema?' },
  { id: 9, text: 'Por causa do seu problema, você tem medo de sair de casa sem ter alguém com você?' },
  { id: 10, text: 'Por causa do seu problema, você já ficou envergonhado(a) na frente dos outros?' },
  { id: 11, text: 'Movimentos rápidos da cabeça aumentam seu problema?' },
  { id: 12, text: 'Por causa do seu problema, você evita alturas?' },
  { id: 13, text: 'Virar-se na cama aumenta seu problema?' },
  { id: 14, text: 'Por causa do seu problema, é difícil para você fazer trabalhos domésticos pesados?' },
  { id: 15, text: 'Por causa do seu problema, você tem medo que as pessoas pensem que você está embriagado(a)?' },
  { id: 16, text: 'Por causa do seu problema, é difícil para você caminhar sozinho(a)?' },
  { id: 17, text: 'Andar na calçada aumenta seu problema?' },
  { id: 18, text: 'Por causa do seu problema, é difícil para você se concentrar?' },
  { id: 19, text: 'Por causa do seu problema, é difícil para você andar pela sua casa no escuro?' },
  { id: 20, text: 'Por causa do seu problema, você tem medo de ficar em casa sozinho(a)?' },
  { id: 21, text: 'Por causa do seu problema, você se sente incapacitado(a)?' },
  { id: 22, text: 'Seu problema colocou estresse em seu relacionamento com família ou amigos?' },
  { id: 23, text: 'Por causa do seu problema, você está deprimido(a)?' },
  { id: 24, text: 'Seu problema interfere com seu trabalho ou responsabilidades domésticas?' },
  { id: 25, text: 'Curvar-se aumenta seu problema?' },
];

export const DHI_OPTIONS: PromsOption[] = [
  { label: 'Não', value: 0 },
  { label: 'Às vezes', value: 2 },
  { label: 'Sim', value: 4 },
];

export function getDHIClassification(score: number): { label: string; color: string; recommendation: string } {
  if (score <= 30) return { label: 'Desvantagem Leve', color: '#16a34a', recommendation: 'Impacto mínimo nas atividades diárias. Pode se beneficiar de educação e manobras de reposicionamento, se aplicável.' };
  if (score <= 60) return { label: 'Desvantagem Moderada', color: '#ca8a04', recommendation: 'Impacto significativo na qualidade de vida. Reabilitação vestibular é fortemente recomendada.' };
  return { label: 'Desvantagem Severa', color: '#dc2626', recommendation: 'Impacto incapacitante. Requer avaliação completa e programa de reabilitação intensivo.' };
}

export const REFERENCE_DHI = 'Castro ASO, et al. (2007). Versão brasileira do Dizziness Handicap Inventory. Pró-Fono Rev Atualização Científica. DOI: 10.1590/s0104-56872007000100011';
