export const getPharynxTOptions = (subsite: string) => {
  if (subsite === 'nasofaringe') {
    return [
      { value: 'tx', label: 'Tx - O tumor primário não pode ser avaliado' },
      { value: 't0', label: 'T0 - Não há evidência de tumor primário' },
      { value: 'tis', label: 'Tis - Carcinoma in situ' },
      { value: 't1', label: 'T1 - Tumor restrito à nasofaringe' },
      { value: 't2', label: 'T2 - Estende-se à orofaringe e/ou cavidade nasal' },
      { value: 't3', label: 'T3 - Invade cavidade nasal/parofaringe/osso/seio paranasal' },
      { value: 't4', label: 'T4 - Invasão intracraniana, nervo craniano, hipofaringe, órbita' }
    ];
  } else if (subsite === 'orofaringe') {
    return [
      { value: 'tx', label: 'Tx - O tumor primário não pode ser avaliado' },
      { value: 't0', label: 'T0 - Não há evidência de tumor primário' },
      { value: 'tis', label: 'Tis - Carcinoma in situ' },
      { value: 't1', label: 'T1 - Tumor ≤ 2 cm em maior dimensão' },
      { value: 't2', label: 'T2 - Tumor > 2 cm até 4 cm em maior dimensão' },
      { value: 't3', label: 'T3 - Tumor > 4 cm ou invasão da face lingual da epiglote' },
      { value: 't4', label: 'T4 - Invade tecidos adjacentes (base de língua, músculos profundos)' }
    ];
  } else {
    // hipofaringe
    return [
      { value: 'tx', label: 'Tx - O tumor primário não pode ser avaliado' },
      { value: 't0', label: 'T0 - Não há evidência de tumor primário' },
      { value: 'tis', label: 'Tis - Carcinoma in situ' },
      { value: 't1', label: 'T1 - Restrito à hipofaringe e/ou 2 cm ou menos' },
      { value: 't2', label: 'T2 - Invade mais de um subsítio da hipofaringe ou 2-4 cm' },
      { value: 't3', label: 'T3 - Tumor > 4 cm ou com fixação da hemilaringe' },
      { value: 't4a', label: 'T4a - Invade cartilagem tireoide ou tecidos extrínsecos' },
      { value: 't4b', label: 'T4b - Invade fáscia pré-vertebral, carótida, ou mediastino' }
    ];
  }
};

export const getPharynxNOptions = (subsite: string, hpv: string = 'negativo') => {
  // AJCC 8 para Orofaringe HPV Positivo Clinico (cN)
  if (subsite === 'orofaringe' && hpv === 'positivo') {
    return [
      { value: 'nx', label: 'Nx - Linfonodos não podem ser avaliados' },
      { value: 'n0', label: 'N0 - Sem metástase linfonodal' },
      { value: 'n1', label: 'N1 - Linfonodo(s) ipsilateral(is), todos ≤ 6 cm' },
      { value: 'n2', label: 'N2 - Linfonodo(s) contralateral(is) ou bilateral(is), ≤ 6 cm' },
      { value: 'n3', label: 'N3 - Qualquer linfonodo > 6 cm' }
    ];
  }
  
  // Padrão Geral (HPv-, Hipofaringe, Nasofaringe adaptado)
  return [
    { value: 'nx', label: 'NX - Linfonodos regionais não podem ser avaliados' },
    { value: 'n0', label: 'N0 - Sem metástase linfonodal' },
    { value: 'n1', label: 'N1 - Único ipsilateral ≤ 3 cm, sem extensão extranodal (ENE-)' },
    { value: 'n2a', label: 'N2a - Único ipsilateral > 3 cm e ≤ 6 cm, ENE-' },
    { value: 'n2b', label: 'N2b - Múltiplos ipsilaterais ≤ 6 cm, ENE-' },
    { value: 'n2c', label: 'N2c - Bilaterais ou contralaterais ≤ 6 cm, ENE-' },
    { value: 'n3a', label: 'N3a - Linfonodo > 6 cm, ENE-' },
    { value: 'n3b', label: 'N3b - Qualquer linfonodo com ENE+ clínico' }
  ];
};

export const getPharynxMOptions = () => [
  { value: 'mx', label: 'Mx - Metástase à distância não pode ser avaliada' },
  { value: 'm0', label: 'M0 - Sem metástases à distância' },
  { value: 'm1', label: 'M1 - Metástases à distância presentes' }
];

export function calculatePharynxStage(t: string, n: string, m: string, subsite: string, hpv: string): string {
  const baseN = n.startsWith('n2') ? 'n2' : n.startsWith('n3') ? 'n3' : n;

  if (t === "tx" || baseN === "nx" || m === "mx") return "Estágio Indeterminado";
  if (t === "tis" && baseN === "n0" && m === "m0") return "Estágio 0";

  // Orofaringe HPV Positivo P16+
  if (subsite === 'orofaringe' && hpv === 'positivo') {
    if (m === 'm1') return 'Estágio IV';
    if (['t3', 't4'].includes(t) || baseN === 'n3') return 'Estágio III';
    if (['t1', 't2'].includes(t) && baseN === 'n2') return 'Estágio II';
    if (['t1', 't2', 't0'].includes(t) && ['n0', 'n1'].includes(baseN)) return 'Estágio I';
    return 'Estágio Clínico Não Tabelado';
  }

  // Padrão Faringe HPV- / Hipofaringe / Nasofaringe
  if (m === 'm1') return 'Estágio IVC';

  if (t === 't4b' || baseN === 'n3') return 'Estágio IVB';
  if (t === 't4a' || baseN === 'n2' || t === 't4') return 'Estágio IVA';

  if (['t1', 't2', 't3'].includes(t) && ['n0', 'n1', 'n2'].includes(baseN)) {
      if (t === 't3' || baseN === 'n1') return 'Estágio III';
      if (t === 't2' && baseN === 'n0') return 'Estágio II';
      if (t === 't1' && baseN === 'n0') return 'Estágio I';
  }

  return "Estágio Indeterminado";
}

export function getPharynxPrognosis(subsite: string, stage: string): string {
  if (stage.includes("IV")) return `Distante/Avançado - Sobrevida 5 anos (SEER): Aprox. ${subsite === 'nasofaringe' ? '48%' : '25%'}`;
  if (stage.includes("III") || stage.includes("II")) return `Regional - Sobrevida 5 anos (SEER): Aprox. ${subsite === 'nasofaringe' ? '73%' : '50% a 57%'}`;
  if (stage.includes("I")) return `Localizado - Sobrevida 5 anos (SEER): Aprox. ${subsite === 'nasofaringe' ? '81%' : '60%'}`;
  return "Consulte AJCC 8 para prognóstico detalhado.";
}
