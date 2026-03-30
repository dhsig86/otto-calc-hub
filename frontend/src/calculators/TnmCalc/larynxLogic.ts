export const getLarynxTOptions = (subsite: string) => {
  if (subsite === 'glote') {
    return [
      { value: 'tx', label: 'Tx - O tumor primário não pode ser avaliado' },
      { value: 't1a', label: 'T1a - Tumor limitado a uma corda vocal, mobilidade normal' },
      { value: 't1b', label: 'T1b - Tumor invade ambas cordas vocais, mobilidade normal' },
      { value: 't2', label: 'T2 - Invade laringe extrínseca ou diminui mobilidade da corda vocal' },
      { value: 't3', label: 'T3 - Limitado à laringe com fixação da corda vocal' },
      { value: 't4a', label: 'T4a - Invade cartilagem tireoide/laringe extrínseca' },
      { value: 't4b', label: 'T4b - Invade espaço pré-vertebral, encobre carótida interna ou envolve estruturas mediastinais' }
    ];
  } else if (subsite === 'supraglote') {
    return [
      { value: 'tx', label: 'Tx - O tumor primário não pode ser avaliado' },
      { value: 't1', label: 'T1 - Limitado à supraglote unifocal com normalidade das cordas' },
      { value: 't2', label: 'T2 - Invade mucosa de > 1 subsítio supraglótico ou região glótica' },
      { value: 't3', label: 'T3 - Limitado à laringe com fixação da corda vocal ou espaço pré-epiglótico' },
      { value: 't4a', label: 'T4a - Invade cartilagem tireoide/extrínseca da laringe' },
      { value: 't4b', label: 'T4b - Invade tecidos pré-vertebrais, cartilagem cricoide, etc' }
    ];
  } else {
    // subglote
    return [
      { value: 'tx', label: 'Tx - O tumor primário não pode ser avaliado' },
      { value: 't1', label: 'T1 - Tumor limitado à subglote' },
      { value: 't2', label: 'T2 - Tumor se estende às cordas vocais (mobilidade normal ou prejudicada)' },
      { value: 't3', label: 'T3 - Tumor limitado à laringe com fixação da corda vocal' },
      { value: 't4a', label: 'T4a - Invade cricoide ou cartilagem tireoide e/ou tecidos extralaríngeos' },
      { value: 't4b', label: 'T4b - Invade espaço pré-vertebral, encobre carótida interna ou envolve estruturas mediastinais' }
    ];
  }
};

export const getLarynxNOptions = () => [
  { value: 'nx', label: 'Nx - Linfonodos regionais não podem ser avaliados' },
  { value: 'n0', label: 'N0 - Sem metástase em linfonodo regional' },
  { value: 'n1', label: 'N1 - Único linfonodo ipsilateral, ≤ 3 cm' },
  { value: 'n2a', label: 'N2a - Único linfonodo ipsilateral, > 3 cm e ≤ 6 cm' },
  { value: 'n2b', label: 'N2b - Múltiplos ipsilaterais, nenhum > 6 cm' },
  { value: 'n2c', label: 'N2c - Bilaterais ou contralaterais, nenhum > 6 cm' },
  { value: 'n3a', label: 'N3a - Metástase em linfonodo > 6 cm, sem ENE' },
  { value: 'n3b', label: 'N3b - Metástase em linfonodo > 3 cm, com ENE clínico' }
];

export const getLarynxMOptions = () => [
  { value: 'mx', label: 'Mx - Metástase à distância não pode ser avaliada' },
  { value: 'm0', label: 'M0 - Sem metástases à distância' },
  { value: 'm1', label: 'M1 - Metástases à distância presentes' }
];

export function calculateLarynxStage(t: string, n: string, m: string): string {
  if (t === "tx" || n === "nx" || m === "mx") return "Estágio Ix (Não agrupado)";
  if (m === "m1") return "Estágio IVC";

  // Agrupamento Clínico Laringe
  if (['t4b'].includes(t)) return "Estágio IVB";
  
  if (['t4a'].includes(t)) {
    if (['n0', 'n1', 'n2a', 'n2b', 'n2c'].includes(n) || n.startsWith('n3')) return "Estágio IVA";
    return "Estágio IVB"; // Fallback por segurança
  }

  if (['t3'].includes(t)) {
    if (['n0', 'n1'].includes(n)) return "Estágio III";
    return "Estágio IVA"; // N2-N3
  }

  if (['t1', 't1a', 't1b', 't2'].includes(t)) {
    if (n === 'n0') return t === 't2' ? "Estágio II" : "Estágio I";
    if (n === 'n1') return "Estágio III";
    if (['n2', 'n2a', 'n2b', 'n2c', 'n3', 'n3a', 'n3b'].includes(n)) return "Estágio IVA";
  }

  return "Indeterminado";
}

export function getLarynxPrognosis(stage: string): string {
  if (stage.includes("I")) {
    if (stage.includes("IVA")) return "Sobrevida OS (5 anos): Varia de 35% a 45% (SEER)";
    if (stage.includes("IVB")) return "Sobrevida OS (5 anos): Aprox. 25% (SEER)";
    if (stage.includes("IVC")) return "Sobrevida OS (5 anos): Aprox. 10% (SEER)";
    if (stage.includes("III")) return "Sobrevida OS (5 anos): Aprox. 55% (SEER)";
    if (stage.includes("II")) return "Sobrevida OS (5 anos): Aprox. 60% (SEER)";
    return "Sobrevida OS (5 anos): Aprox. 75% (SEER)";
  }
  return "Diretriz de sobrevida não tabelada (AJCC 8a Ed / SEER)";
}
