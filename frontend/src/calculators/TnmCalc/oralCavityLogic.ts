export const getOralCavityTOptions = () => [
  { value: 'tx', label: 'Tx - O tumor primário não pode ser avaliado' },
  { value: 'tis', label: 'Tis - Carcinoma in situ' },
  { value: 't1', label: 'T1 - Tumor ≤ 2 cm e DOI ≤ 5 mm' }, // AJCC 8 incorpora Depth of Invasion (DOI)
  { value: 't2', label: 'T2 - Tumor ≤ 2 cm e DOI > 5mm, OU > 2cm até 4cm com DOI ≤ 10mm' },
  { value: 't3', label: 'T3 - Tumor > 4 cm, OU qualquer tumor > 2cm com DOI > 10mm' },
  { value: 't4a', label: 'T4a - Doença local moderadamente avançada (invade cortical, assoalho, pele da face)' },
  { value: 't4b', label: 'T4b - Doença local muito avançada (espaço mastigador, carótida interna)' }
];

export const getOralCavityNOptions = () => [
  { value: 'nx', label: 'NX - Linfonodos regionais não podem ser avaliados' },
  { value: 'n0', label: 'N0 - Sem metástase linfonodal ou ENE-' },
  { value: 'n1', label: 'N1 - Único ipsilateral ≤ 3 cm, ENE-' },
  { value: 'n2a', label: 'N2a - Único ipsilateral > 3 cm e ≤ 6 cm, ENE-' },
  { value: 'n2b', label: 'N2b - Múltiplos ipsilaterais ≤ 6cm, ENE-' },
  { value: 'n2c', label: 'N2c - Bilaterais/Contralaterais ≤ 6 cm, ENE-' },
  { value: 'n3a', label: 'N3a - Linfonodo > 6 cm, ENE-' },
  { value: 'n3b', label: 'N3b - Qualquer linfonodo com ENE+ (Extensão Extranodal Clínica)' }
];

export const getOralCavityMOptions = () => [
  { value: 'm0', label: 'M0 - Sem metástases à distância' },
  { value: 'm1', label: 'M1 - Metástases à distância presentes' }
];

export function calculateOralCavityStage(t: string, n: string, m: string): string {
  // Padronizar N2 e N3 para capturar ENE
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
  if (t === 'tis' && baseN === 'n0') return 'Estágio 0';

  return 'Indeterminado';
}

export function getOralCavityPrognosis(subsite: string, stage: string): string {
  let survival = "Sobrevida relativa 5 anos (SEER): Aprox. 60%";
  
  if (subsite === 'labios' || subsite === 'lingua' || subsite === 'assoalho') {
    if (stage.includes('IVA') || stage.includes('IVB') || stage.includes('IVC')) {
      survival = "Distante/Regional Avançado - Sobrevida 5A: 20% a 40% (SEER)";
    } else if (stage.includes('III')) {
      survival = "Regional - Sobrevida 5A: Aprox. 68% (SEER)";
    } else if (stage.includes('II') || stage.includes('I')) {
       survival = "Localizado - Sobrevida 5A: Até 94% p/ Lábio, 80%+ p/ Língua/Assoalho (SEER)";
    }
  }
  
  return survival;
}
