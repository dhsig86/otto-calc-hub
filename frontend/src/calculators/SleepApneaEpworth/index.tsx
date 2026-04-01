import { useState } from 'react';
import { API_BASE_URL } from '../../config';
import { EPWORTH_QUESTIONS, EPWORTH_OPTIONS, getEpworthClassification, REFERENCE_EPWORTH } from './logic';

interface Props { patientId: string; doctorId?: string; }

export default function SleepApneaEpworth({ patientId, doctorId }: Props) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<{ score: number; label: string; color: string; recommendation: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const totalAnswered = Object.keys(answers).length;
  const score = Object.values(answers).reduce((s, v) => s + v, 0);

  const handleSubmit = async () => {
    const cl = getEpworthClassification(score);
    setResult({ score, ...cl });
    try {
      await fetch(`${API_BASE_URL}/api/results`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patient_id: patientId || 'anon_epworth', doctor_id: doctorId || null, calc_type: 'epworth', score, raw_answers: answers, hub_version: '1.4.1' })
      });
    } catch {}
  };

  const handleCopy = () => {
    if (!result) return;
    const text = `OTTO CALC-HUB — Escala de Sonolência de Epworth (ESE)\nPaciente: ${patientId || 'Não informado'}\nEscore: ${result.score}/24\nClassificação: ${result.label}\nData: ${new Date().toLocaleDateString('pt-BR')}`;
    navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2500); });
  };

  const LIKERT_COLORS = ['#16a34a', '#84cc16', '#f97316', '#dc2626'];

  if (result) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-4 text-center border-t-8" style={{ borderColor: result.color }}>
        <h2 className="text-3xl font-extrabold mb-1" style={{ color: result.color }}>Epworth: {result.score} / 24</h2>
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
          <p className="italic">{REFERENCE_EPWORTH}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6">
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-slate-100">
        <div className="mb-8 border-b border-slate-200 pb-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-1">ESE — Escala de Sonolência de Epworth</h2>
          <p className="text-slate-500 text-sm mb-2">Avalia a probabilidade de cochilar durante o dia em diferentes situações rotineiras.</p>
          {patientId && <p className="mt-2 text-sm font-semibold text-[#00A0AF] bg-[#e6f6f8] px-3 py-1.5 rounded-full inline-block">👤 Paciente: {patientId}</p>}
        </div>

        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5 mb-6 text-sm text-indigo-900 shadow-sm transition-all hover:shadow-md">
          <p className="mb-2"><strong className="text-indigo-700 uppercase tracking-wide text-[10px] sm:text-xs">🎯 Para que serve:</strong><br/> <span className="opacity-90 font-medium">Mede o sono diurno para separar quem só dorme mal de quem tem apneia perigosa.</span></p>
          <p><strong className="text-indigo-700 uppercase tracking-wide text-[10px] sm:text-xs">💡 Como aplicar:</strong><br/> <span className="opacity-90 font-medium">O próprio paciente julga se apagaria fácil lendo ou no sinal vermelho. Super prático.</span></p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 text-sm text-amber-800">
          <strong>Instrução:</strong> Qual a probabilidade de você <strong>cochilar ou adormecer</strong> nas seguintes situações de vida recente? (Não considere apenas sensação de cansaço).
        </div>

        <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1 mb-4">
          <span className="text-green-600">Nenhuma chance (0)</span><span className="text-red-600">Alta chance (3)</span>
        </div>

        <div className="space-y-6 mb-8">
          {EPWORTH_QUESTIONS.map((q) => {
            const selected = answers[q.id];
            return (
              <div key={q.id} className="bg-slate-50 p-4 rounded-lg border border-slate-200 border-l-4 border-l-[#5CC6BA]">
                <p className="font-semibold text-slate-700 mb-4 text-sm">
                  <span className="text-[#00A0AF] font-bold mr-2">{q.id}.</span>{q.text}
                </p>
                <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                  {EPWORTH_OPTIONS.map((opt, idx) => (
                    <button
                      key={opt.value}
                      onClick={() => setAnswers(p => ({ ...p, [q.id]: opt.value }))}
                      className={`flex-1 py-2 sm:py-3 rounded-md font-bold text-xs sm:text-sm border-2 transition-all ${selected === opt.value ? 'text-white shadow-md scale-105' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'}`}
                      style={selected === opt.value ? { backgroundColor: LIKERT_COLORS[idx], borderColor: LIKERT_COLORS[idx] } : {}}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-center border-t border-slate-200 pt-6">
          <button disabled={totalAnswered < EPWORTH_QUESTIONS.length} onClick={handleSubmit}
            className="px-8 py-3 bg-[#00A0AF] hover:bg-[#00BCD4] text-white font-bold rounded-lg shadow transition-all w-full sm:w-auto disabled:opacity-50">
            Calcular Escore Epworth
          </button>
        </div>
      </div>

      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs text-slate-500 text-center">
        <p className="font-bold mb-1">Referência Científica Padrão-Ouro:</p>
        <p className="italic">{REFERENCE_EPWORTH}</p>
      </div>
    </div>
  );
}
