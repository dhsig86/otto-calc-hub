export type Snot22Answers = Record<string, number>;
export type TopSymptoms = string[];

export interface QuestionDef {
  id: string;
  text: string;
  group: number;
}

export const SNOT22_QUESTIONS: QuestionDef[] = [
  { id: 'q1', text: 'Necessidade de assoar o nariz', group: 1 },
  { id: 'q2', text: 'Espirros', group: 1 },
  { id: 'q3', text: 'Nariz escorrendo', group: 1 },
  { id: 'q4', text: 'Tosse', group: 1 },
  { id: 'q5', text: 'Sensação de secreção ou catarro descendo pela parte detrás do seu nariz', group: 2 },
  { id: 'q6', text: 'Secreção nasal grossa', group: 2 },
  { id: 'q7', text: 'Abafamento no ouvido (entupimento do ouvido)', group: 2 },
  { id: 'q8', text: 'Tontura', group: 2 },
  { id: 'q9', text: 'Dor de ouvido', group: 3 },
  { id: 'q10', text: 'Dor ou Pressão na face', group: 3 },
  { id: 'q11', text: 'Dificuldade de pegar no sono', group: 3 },
  { id: 'q12', text: 'Acordar no meio da noite', group: 3 },
  { id: 'q13', text: 'Falta de uma boa noite de sono', group: 4 },
  { id: 'q14', text: 'Acordar cansado de manhã', group: 4 },
  { id: 'q15', text: 'Cansaço/Fadiga ao longo do dia', group: 4 },
  { id: 'q16', text: 'Produtividade diminuída (menor rendimento)', group: 4 },
  { id: 'q17', text: 'Concentração reduzida', group: 5 },
  { id: 'q18', text: 'Frustrado / Impaciente / Irritado', group: 5 },
  { id: 'q19', text: 'Triste', group: 5 },
  { id: 'q20', text: 'Constrangido (Envergonhado com a doença)', group: 5 },
  { id: 'q21', text: 'Percepção do olfato (cheiro) ou do gosto', group: 6 },
  { id: 'q22', text: 'Nariz trancado/entupido', group: 6 }
];

export function calculateSnot22Score(answers: Snot22Answers): number {
  return Object.values(answers).reduce((sum, val) => sum + (val || 0), 0);
}

export function getSnot22Classification(score: number): string {
  if (score >= 0 && score <= 36) return 'Impacto leve';
  if (score >= 37 && score <= 74) return 'Impacto moderado';
  if (score >= 75 && score <= 110) return 'Impacto grave';
  return '';
}

export function getSnot22Color(score: number): { fontColor: string; backgroundColor: string } {
  if (score >= 0 && score <= 36) {
    return { fontColor: '#16a34a', backgroundColor: '#dcfce7' }; // Verde (safe)
  } else if (score >= 37 && score <= 74) {
    return { fontColor: '#ca8a04', backgroundColor: '#fef08a' }; // Amarelo (warning)
  } else if (score >= 75 && score <= 110) {
    return { fontColor: '#dc2626', backgroundColor: '#fee2e2' }; // Vermelho (danger)
  }
  return { fontColor: '#000000', backgroundColor: 'transparent' };
}
