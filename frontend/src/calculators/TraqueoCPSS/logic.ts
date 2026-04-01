export interface CPSSField {
  id: string;
  label: string;
  options: { label: string; value: number }[];
}

export const CPSS_FIELDS: CPSSField[] = [
  {
    id: 'temp', label: 'Temperatura Corporal (°C)',
    options: [{ label: '36.5 - 38.4', value: 0 }, { label: '38.5 - 38.9', value: 1 }, { label: '≥ 39.0 ou ≤ 36.0', value: 2 }]
  },
  {
    id: 'leuko', label: 'Leucócitos (mm³)',
    options: [{ label: '4.000 - 11.000', value: 0 }, { label: '< 4.000 ou > 11.000', value: 1 }, { label: 'Acima + Formas Jovens', value: 2 }]
  },
  {
    id: 'secre', label: 'Secreções Traqueais',
    options: [{ label: 'Ausentes / Escassas', value: 0 }, { label: 'Abundantes Não Purulentas', value: 1 }, { label: 'Abundantes Purulentas', value: 2 }]
  },
  {
    id: 'oxig', label: 'Oxigenação (PaO2/FiO2)',
    options: [{ label: '> 240 ou ARDS', value: 0 }, { label: '≤ 240 e Sem ARDS', value: 2 }]
  },
  {
    id: 'rx', label: 'Raio-X de Tórax',
    options: [{ label: 'Sem infiltrado', value: 0 }, { label: 'Infiltrado Difuso', value: 1 }, { label: 'Infiltrado Localizado', value: 2 }]
  }
];

export function getCPSSClassification(score: number): { label: string; color: string; recommendation: string } {
  if (score <= 6) return { label: 'Baixa Probabilidade de Pneumonia', color: '#16a34a', recommendation: 'Manter vigilância clínica.' };
  return { label: 'Alta Probabilidade de Pneumonia', color: '#dc2626', recommendation: 'Forte indicação de PAVM (Pneumonia Associada à Ventilação/Traqueostomia). Iniciar ou ajustar antibioticoterapia.' };
}

export const REFERENCE_CPSS = 'Pugin J, Auckenthaler R, Mili N, Janssens JP, Lew DP, Suter PM. Diagnosis of ventilator-associated pneumonia by bacteriologic analysis of bronchoscopic and nonbronchoscopic "blind" bronchoalveolar lavage fluid. Am Rev Respir Dis. 1991;143(5 Pt 1):1121-1129.';
