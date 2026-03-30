import { calculateSnot22Score, getSnot22Classification, getSnot22Color, Snot22Answers } from './logic';

describe('SNOT-22 Lógica Clínica', () => {
  it('deve calcular corretamente a soma das respostas (0 a 110)', () => {
    const answers: Snot22Answers = {
      q1: 5, q2: 5, q3: 0, q4: 1
    };
    expect(calculateSnot22Score(answers)).toBe(11);
  });

  it('deve classificar coretamente as bandas de impacto rinosinusal', () => {
    expect(getSnot22Classification(10)).toBe('Impacto leve');
    expect(getSnot22Classification(36)).toBe('Impacto leve');
    expect(getSnot22Classification(37)).toBe('Impacto moderado');
    expect(getSnot22Classification(74)).toBe('Impacto moderado');
    expect(getSnot22Classification(75)).toBe('Impacto grave');
    expect(getSnot22Classification(110)).toBe('Impacto grave');
  });

  it('deve gerar as classes CSS protetoras', () => {
    expect(getSnot22Color(15).fontColor).toBe('#16a34a'); // Green
    expect(getSnot22Color(50).fontColor).toBe('#ca8a04'); // Yellow
    expect(getSnot22Color(90).fontColor).toBe('#dc2626'); // Red
  });
});
