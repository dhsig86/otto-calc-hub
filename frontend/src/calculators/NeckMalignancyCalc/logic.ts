export interface MalignancyField {
  id: string;
  label: string;
  options: { label: string; value: number }[];
}

export const MALIG_FIELDS: MalignancyField[] = [
  {
    id: 'idade', label: 'Idade do Paciente',
    options: [{ label: '< 40 anos', value: 0 }, { label: '40 - 60 anos', value: 2 }, { label: '> 60 anos (Alto Risco)', value: 5 }]
  },
  {
    id: 'tabaco', label: 'Tabagismo / Etilismo',
    options: [{ label: 'Ausente', value: 0 }, { label: 'Ex-fumante', value: 2 }, { label: 'Tóxico Ativo', value: 5 }]
  },
  {
    id: 'cons', label: 'Consistência do Nódulo',
    options: [{ label: 'Cístico / Macio', value: 0 }, { label: 'Elástico', value: 2 }, { label: 'Pétreo (Duro)', value: 10 }]
  },
  {
    id: 'fixo', label: 'Mobilidade',
    options: [{ label: 'Móvel', value: 0 }, { label: 'Fixo a planos profundos', value: 10 }]
  },
  {
    id: 'tempo', label: 'Tempo de Evolução',
    options: [{ label: 'Dias (Infeccioso)', value: 0 }, { label: 'Anos (Benigno)', value: 1 }, { label: 'Meses (Suspeito)', value: 5 }]
  }
];

export function getMalignancyClassification(score: number): { label: string; color: string; recommendation: string } {
  if (score <= 10) return { label: 'Risco Baixo', color: '#16a34a', recommendation: 'Provável causa reacional/infecciosa. Observar clinicamente por 2-3 semanas.' };
  if (score <= 20) return { label: 'Risco Moderado', color: '#ca8a04', recommendation: 'Solicitar Ultrassonografia Cervical. Considerar PAAF caso nódulo seja maior que 1cm ou suspeito ao Doppler.' };
  return { label: 'Risco Elevado', color: '#dc2626', recommendation: 'Urgência oncológica provável. Encaminhar para PAAF guiada por USG e exame endoscópico minucioso de VADS.' };
}

export const REFERENCE_MALIG = 'Critérios PANDORA e Modelos Matemáticos de Regressão Logística para massas cervicais - Consenso Brasileiro de Cirurgia de Cabeça e Pescoço.';
