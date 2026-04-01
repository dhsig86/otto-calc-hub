import { useState } from 'react';
import { API_BASE_URL } from '../../config';
import { SN5_QUESTIONS, SN5_OPTIONS, getSN5Classification, REFERENCE_SN5 } from './logic';

interface Props { patientId: string; doctorId?: string; }

export default function PediatricSN5({ patientId, doctorId }: Props) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<{ averageScore: number; label: string; color: string; recommendation: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const totalAnswered = Object.keys(answers).length;
  const rawSum = Object.values(answers).reduce((s, v) => s + v, 0);

  const handleSubmit = async () => {
    // Cálculo: Média de 1 a 7 (com 1 casa decimal)
    const avg = parseFloat((rawSum / totalAnswered).toFixed(1));
    const cl = getSN5Classification(avg);
    setResult({ averageScore: avg, ...cl });
    
    try {
      await fetch(`${API_BASE_URL}/api/results`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patient_id: patientId || 'anon_sn5', doctor_id: doctorId || null, calc_type: 'sn5', score: avg, raw_answers: answers, hub_version: '1.4.0' })
      });
    } catch {}
  };

  const handleCopy = () => {
    if (!result) return;
    const text = `OTTO CALC-HUB — SN-5 (Qualidade de Vida Sinonasal Pediátrica)\nPaciente: ${patientId || 'Não informado'}\nEscore Médio SN-5: ${result.averageScore}/7\nClassificação: ${result.label}\nData: ${new Date().toLocaleDateString('pt-BR')}`;
    navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2500); });
  };

  // Cores dinâmicas para a escala VAS de 7 pontos
  const vasColor = (val: number) => {
    if (val <= 2) return '#16a34a'; // verde
    if (val <= 5) return '#ca8a04'; // amarelo/laranja
    return '#dc2626'; // vermelho
  };

  if (result) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-4 text-center border-t-8" style={{ borderColor: result.color }}>
        <h2 className="text-3xl font-extrabold mb-1" style={{ color: result.color }}>Média Ponderada: {result.averageScore} / 7</h2>
        {patientId && <p className="text-slate-500 text-sm mb-2">Paciente: <strong>{patientId}</strong></p>}
        <p className="text-xl font-bold mb-3 text-slate-700">{result.label}</p>
        <div className="bg-slate-50 p-4 rounded-lg mb-6 text-left border border-slate-200">
          <p className="text-sm font-semibold text-slate-600">📋 Orientação Clínica:</p>
          <p className="text-sm text-slate-700 mt-1">{result.recommendation}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
          <button onClick={handleCopy} className={`py-3 px-6 rounded-lg font-bold border-2 transition-all ${copied ? 'bg-green-500 text-white border-green-500' : 'bg-white text-slate-600 border-slate-300 hover:border-[#00A0AF]'}`}>
            {copied ? '✅ Copiado!' : '📋 Copiar Resultado'}
          </button>
          <button onClick={() => { setAnswers({}); setResult(null); }} className="bg-[#00A0AF] hover:bg-[#00BCD4] text-white font-bold py-3 px-8 rounded-lg shadow-md transition-all">
            Novo Questionário
          </button>
        </div>
        <div className="mt-6 bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs text-slate-500 text-left">
          <p className="font-bold mb-1">Referência Científica Padrão-Ouro:</p>
          <p className="italic">{REFERENCE_SN5}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6">
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-slate-100">
        <div className="mb-8 border-b border-slate-200 pb-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-1">Sino-nasal Five (SN-5)</h2>
          <p className="text-slate-500 text-sm mb-2">Qualidade de vida em crianças com rinite/adenoides. Escala VAS de 7 pontos.</p>
          {patientId && <p className="mt-2 text-sm font-semibold text-[#00A0AF] bg-[#e6f6f8] px-3 py-1.5 rounded-full inline-block">👤 Paciente: {patientId}</p>}
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 text-sm text-amber-800">
          <strong>Para os Pais/Cuidadores:</strong> Avalie o impacto de cada sintoma no paciente pediátrico nas últimas 4 semanas de 1 (Nunca) a 7 (Sempre).
        </div>

        <div className="space-y-6 mb-8">
          {SN5_QUESTIONS.map((q) => {
            const selected = answers[q.id];
            return (
              <div key={q.id} className="bg-slate-50 p-4 rounded-lg border border-slate-200 border-l-4 border-l-[#5CC6BA]">
                <p className="font-semibold text-slate-700 mb-4 text-sm">
                  <span className="text-[#00A0AF] font-bold mr-2">{q.id}.</span>{q.text}
                </p>
                <div className="flex gap-1">
                  {SN5_OPTIONS.map((val) => (
                    <button
                      key={val}
                      onClick={() => setAnswers(p => ({ ...p, [q.id]: val }))}
                      className={`flex-1 py-2 sm:py-3 rounded-md font-bold text-xs sm:text-sm border-2 transition-all ${selected === val ? 'text-white shadow-md scale-105' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'}`}
                      style={selected === val ? { backgroundColor: vasColor(val), borderColor: vasColor(val) } : {}}
                    >
                      {val}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between text-[10px] uppercase font-bold text-slate-400 mt-2 px-1">
                  <span>1 - Nunca</span><span>7 - Sempre</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-center border-t border-slate-200 pt-6">
          <button disabled={totalAnswered < SN5_QUESTIONS.length} onClick={handleSubmit}
            className="px-8 py-3 bg-[#00A0AF] hover:bg-[#00BCD4] text-white font-bold rounded-lg shadow transition-all w-full sm:w-auto disabled:opacity-50">
            Calcular Média VAS 
          </button>
        </div>
      </div>

      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs text-slate-500 text-center">
        <p className="font-bold mb-1">Referência Científica Padrão-Ouro:</p>
        <p className="italic">{REFERENCE_SN5}</p>
      </div>
    </div>
  );
}
