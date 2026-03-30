import { calculateEposChance, calculateAaoChance, getSinusitisInterpretation } from './logic';

describe('Sinusite Lógica Bacteriológica', () => {
  it('EPOS - Identifica sintoma grave com 95% de chance', () => {
    expect(calculateEposChance(['Sintomas graves ou sintomas durando mais de 10 dias'])).toBe(95);
  });

  it('EPOS - Calcula 70% chance para 3 sintomas comuns', () => {
    expect(calculateEposChance(['Obstrução/congestão nasal', 'Secreção nasal (anterior ou posterior)', 'Dor facial / pressão'])).toBe(70);
  });

  it('AAO - Identifica piora após o quinto dia como 95% de chance', () => {
    expect(calculateAaoChance(['Piora dos sintomas após o quinto dia ou sintomas persistentes após o décimo dia'])).toBe(95);
  });

  it('Gera as cores corretas baseado na chance percentual', () => {
    expect(getSinusitisInterpretation(20).color).toBe('#16a34a'); // Green
    expect(getSinusitisInterpretation(50).color).toBe('#d97706'); // Orange
    expect(getSinusitisInterpretation(85).color).toBe('#dc2626'); // Red
  });
});
