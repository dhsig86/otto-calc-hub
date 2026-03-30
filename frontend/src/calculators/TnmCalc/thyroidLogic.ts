export const getThyroidTOptions = () => [
  { value: 'tx', label: 'Tx - O tumor primário não pode ser avaliado' },
  { value: 't1', label: 'T1 - Tumor ≤ 2 cm, limitado à tireoide' },
  { value: 't1a', label: 'T1a - Tumor ≤ 1 cm, limitado à tireoide' },
  { value: 't1b', label: 'T1b - Tumor > 1 cm e ≤ 2 cm, limitado à tireoide' },
  { value: 't2', label: 'T2 - Tumor > 2 cm e ≤ 4 cm, limitado à tireoide' },
  { value: 't3', label: 'T3 - Tumor > 4 cm ou com extensão extratireoideana macroscópica' },
  { value: 't3a', label: 'T3a - Tumor > 4 cm, limitado à tireoide' },
  { value: 't3b', label: 'T3b - Invasão macroscópica de musculatura pré-tireoideana' },
  { value: 't4a', label: 'T4a - Invasão de tecidos moles subcutâneos, laringe, traqueia, esôfago' },
  { value: 't4b', label: 'T4b - Invasão da fáscia pré-vertebral, carótida ou vasos mediastinais' }
];

export const getThyroidNOptions = () => [
  { value: 'nx', label: 'Nx - Linfonodos não podem ser avaliados' },
  { value: 'n0', label: 'N0 - Sem metástase em linfonodo regional' },
  { value: 'n1', label: 'N1 - Metástase em linfonodos regionais' },
  { value: 'n1a', label: 'N1a - Metástase no compartimento central (Nível VI, VII)' },
  { value: 'n1b', label: 'N1b - Metástase unilateral, bilateral, cervical lateral ou mediastinal superior' }
];

export const getThyroidMOptions = () => [
  { value: 'mx', label: 'Mx - Metástase à distância não pode ser avaliada' },
  { value: 'm0', label: 'M0 - Sem metástases à distância' },
  { value: 'm1', label: 'M1 - Metástases à distância presentes' }
];

export function calculateThyroidStage(t: string, n: string, m: string, histology: string, ageCutoff: string): string {
  const isAnaplastic = histology === 'anaplasico';
  const isMedullary = histology === 'medular';
  const isDifferentiated = (histology === 'papilifero' || histology === 'folicular');
  
  const baseT = t.slice(0, 2); // t1, t2, t3, t4...
  const baseN = n.slice(0, 2); // n0, n1...

  if (isAnaplastic) {
    if (m === 'm1') return 'Estágio IVC';
    if (['t4b'].includes(t)) return 'Estágio IVB';
    return 'Estágio IVA'; // T1-T4a
  }

  if (isDifferentiated) {
    if (ageCutoff === 'menor_55') {
       return m === 'm1' ? 'Estágio II' : 'Estágio I';
    } else {
       // Maior ou igual a 55 anos
       if (m === 'm1') return 'Estágio IVB';
       if (['t4a', 't4b'].includes(t)) return 'Estágio IVA'; // T4a e T4b AnyN
       if (baseT === 't3' || baseN === 'n1') return 'Estágio II'; // T1-T3 N1 ou T3 N0
       return 'Estágio I'; // T1-T2 N0 M0
    }
  }

  if (isMedullary) {
      if (m === 'm1') return 'Estágio IVC';
      if (t === 't4b') return 'Estágio IVB'; // Any N
      if (t === 't4a' || (baseT === 't3' && baseN === 'n1') || (['t1', 't2', 't3'].includes(baseT) && n === 'n1b')) return 'Estágio IVA';
      if (baseN === 'n1' || baseN === 'n1a') return 'Estágio III'; // T1-T2 N1a
      if (t === 't2' || t === 't3') return 'Estágio II'; // N0
      if (baseT === 't1') return 'Estágio I';
  }

  return "Estágio Indeterminado";
}

export function getThyroidPrognosis(histology: string, stage: string): string {
  if (histology === 'anaplasico') return "Tumor Agressivo. Sobrevida Relativa Global (SEER): Aprox 14%";
  
  if (stage.includes("IV")) return "Doença Avançada à Distância. TS(5a): ~51%";
  if (stage.includes("III")) return "Doença Regional Mais Extensa. TS(5a): ~88% a 93%";
  if (stage.includes("II") || stage.includes("I")) return "Doença Confinada ou Local: Prognóstico Excelente, TS(5a) próxima a 100%";
  
  return "Prognóstico em avaliação per AJCC 8 / SEER.";
}
