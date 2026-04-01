export function getCentorClassification(score: number): { label: string; color: string; recommendation: string } {
  // Ajuste do piso para interpretação: Scores negativos (-1) equivalem à faixa de '0' na tabela clínica.
  const adjustedScore = score < 0 ? 0 : score;

  if (adjustedScore === 0) return { label: '2-3% de Hipótese (Muito Baixa)', color: '#16a34a', recommendation: 'Streptococcus improvável. Sem cultura ou antibiótico. Focar em sintomáticos.' };
  if (adjustedScore === 1) return { label: '4-6% de Hipótese (Baixa)', color: '#84cc16', recommendation: 'Streptococcus improvável. Sem cultura ou antibiótico. Observação e sintomáticos.' };
  if (adjustedScore === 2) return { label: '10-12% de Hipótese (Média)', color: '#eab308', recommendation: 'Suspeita limítrofe. Realizar cultura / teste rápido e tratar _se_ for positivo.' };
  if (adjustedScore === 3) return { label: '27-28% de Hipótese (Alta)', color: '#f97316', recommendation: 'Forte suspeita. Realizar cultura / teste rápido e tratar _se_ for positivo.' };
  return { label: '38-63% de Hipótese (Muito Alta)', color: '#dc2626', recommendation: 'Elevada suspeita patológica clínica. Realizar cultura e tratar se positivo na base probabilística (Antibioticoterapia empírica considerável na demora de swabs).' };
}

export const REFERENCE_CENTOR = 'McIsaac WJ, et al. A clinical score to reduce unnecessary antibiotic use in patients with sore throat. CMAJ. 1998. PubMed: 9475915 | Fine AM, et al. Large-scale validation of Centor/McIsaac scores. Arch Intern Med. 2012.';
