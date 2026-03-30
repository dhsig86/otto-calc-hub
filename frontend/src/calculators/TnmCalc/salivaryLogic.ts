export const getSalivaryTOptions = () => [
  { value: 'tx', label: 'Tx - O tumor primário não pode ser avaliado' },
  { value: 't1', label: 'T1 - Tumor ≤ 2 cm sem extensão extraparenquimatosa' },
  { value: 't2', label: 'T2 - Tumor > 2 cm até 4 cm sem extensão extraparenquimatosa' },
  { value: 't3', label: 'T3 - Tumor > 4 cm e/ou tumor com extensão extraparenquimatosa clínica' },
  { value: 't4a', label: 'T4a - Invade pele, mandíbula, canal auditivo e/ou nervo facial' },
  { value: 't4b', label: 'T4b - Invade base de crânio e/ou assoalho do crânio pós pterigoideo ou carótida' }
];

export const getSalivaryNOptions = () => [
  { value: 'nx', label: 'NX - Linfonodos regionais não podem ser avaliados' },
  { value: 'n0', label: 'N0 - Sem metástase linfonodal ou ENE-' },
  { value: 'n1', label: 'N1 - Único ipsilateral ≤ 3 cm, ENE-' },
  { value: 'n2a', label: 'N2a - Único ipsilateral > 3 cm e ≤ 6 cm, ENE-' },
  { value: 'n2b', label: 'N2b - Múltiplos ipsilaterais ≤ 6cm, ENE-' },
  { value: 'n2c', label: 'N2c - Bilaterais/Contralaterais ≤ 6 cm, ENE-' },
  { value: 'n3a', label: 'N3a - Linfonodo > 6 cm, ENE-' },
  { value: 'n3b', label: 'N3b - Qualquer linfonodo com ENE+ (Extensão Extranodal Clínica)' }
];

export const getSalivaryMOptions = () => [
  { value: 'm0', label: 'M0 - Sem metástases à distância' },
  { value: 'm1', label: 'M1 - Metástases à distância presentes' }
];

export function calculateSalivaryStage(t: string, n: string, m: string): string {
  const baseN = n.startsWith('n2') ? 'n2' : n.startsWith('n3') ? 'n3' : n;

  if (m === 'm1') return 'Estágio IVC';
  
  if (['t4b'].includes(t) || baseN === 'n3') return 'Estágio IVB';
  
  if (['t4a'].includes(t) || baseN === 'n2') return 'Estágio IVA';

  if (t === 't3') {
    if (['n0', 'n1'].includes(baseN)) return 'Estágio III';
  }

  if (['t1', 't2'].includes(t) && baseN === 'n1') return 'Estágio III';

  if (t === 't2' && baseN === 'n0') return 'Estágio II';
  
  if (t === 't1' && baseN === 'n0') return 'Estágio I';
  
  return 'Indeterminado';
}

export function getSalivaryPrognosis(stage: string): string {
  if (stage.includes('IVA') || stage.includes('IVB') || stage.includes('IVC')) {
    return "Distante/Avançado - Sobrevida 5 Anos Relativa: Aprox. 43% (SEER)";
  } else if (stage.includes('III')) {
    return "Regional - Sobrevida 5 Anos Relativa: Aprox. 70% (SEER)";
  } else if (stage.includes('II') || stage.includes('I')) {
     return "Localizado - Sobrevida 5 Anos Relativa: Aprox. 94% (SEER)";
  }
  return "Diretriz Não Tabelada";
}
