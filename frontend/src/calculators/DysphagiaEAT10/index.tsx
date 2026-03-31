import { useState } from 'react';
import { API_BASE_URL } from '../../config';
import { EAT10_QUESTIONS, EAT10_OPTIONS, getEAT10Classification, REFERENCE_EAT10 } from './logic';

interface Props { patientId: string; doctorId?: string; }

export default function DysphagiaEAT10({ patientId, doctorId }: Props) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<{ score: number; label: string; color: string; recommendation: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const totalAnswered = Object.keys(answers).length;
  const score = Object.values(answers).reduce((s, v) => s + v, 0);

  const handleSubmit = async () => {
    const cl = getEAT10Classification(score);
    setResult({ score, ...cl });
    try {
      await fetch(`${API_BASE_URL}/api/results`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patient_id: patientId || 'anon_eat10', doctor_id: doctorId || null, calc_type: 'eat10', score, raw_answers: answers, hub_version: '1.3.0' })
      });
    } catch {}
  };

  const handleCopy = () => {
    if (!result) return;
    const threshold = result.score >= 3 ? '⚠️ POSITIVO — Risco de Disfagia (≥3)' : '✅ NEGATIVO — Sem Risco Identificado';
    const text = `OTTO CALC-HUB — EAT-10 (Avaliação de Disfagia)\nPaciente: ${patientId || 'Não informado'}\nEscore EAT-10: ${result.score}/40\nTriagem: ${threshold}\nClassificação: ${result.label}\nData: ${new Date().toLocaleDateString('pt-BR')}`;
    navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2500); });
  };

  const NUM_COLORS = ['#16a34a', '#65a30d', '#ca8a04', '#ea580c', '#dc2626'];

  if (result) {
    const isPositive = result.score >= 3;
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-4 text-center border-t-8" style={{ borderColor: result.color }}>
        <h2 className="text-3xl font-extrabold mb-1" style={{ color: result.color }}>EAT-10: {result.score} / 40</h2>
        {patientId && <p className="text-slate-500 text-sm mb-2">Paciente: <strong>{patientId}</strong></p>}
        <div className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold mb-4 ${isPositive ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {isPositive ? '⚠️ POSITIVO — Risco de Disfagia (≥3)' : '✅ NEGATIVO — Sem Risco Identificado'}
        </div>
        <p className="text-lg font-bold mb-3 text-slate-700">{result.label}</p>
        <div className="bg-slate-50 p-4 rounded-lg mb-6 text-left border border-slate-200">
          <p className="text-sm font-semibold text-slate-600">📋 Orientação Clínica:</p>
          <p className="text-sm text-slate-700 mt-1">{result.recommendation}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={handleCopy} className={`py-3 px-6 rounded-lg font-bold border-2 transition-all ${copied ? 'bg-green-500 text-white border-green-500' : 'bg-white text-slate-600 border-slate-300 hover:border-[#00A0AF]'}`}>
            {copied ? '✅ Copiado!' : '📋 Copiar Resultado'}
          </button>
          <button onClick={() => { setAnswers({}); setResult(null); }} className="bg-[#00A0AF] hover:bg-[#00BCD4] text-white font-bold py-3 px-8 rounded-lg shadow-md transition-all">
            Novo EAT-10
          </button>
        </div>
        <div className="mt-6 bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs text-slate-500 text-left">
          <p className="font-bold mb-1">Referência:</p>
          <p className="italic">{REFERENCE_EAT10}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6">
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-slate-100">
        <div className="mb-8 border-b border-slate-200 pb-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-1">EAT-10 — Rastreio de Disfagia</h2>
          <p className="text-slate-500 text-sm mb-2">Eating Assessment Tool — 10 itens. Limiar diagnóstico: <strong>≥ 3 pontos</strong> sugere risco de disfagia.</p>
          {patientId && <p className="mt-2 text-sm font-semibold text-[#00A0AF] bg-[#e6f6f8] px-3 py-1.5 rounded-full inline-block">👤 Paciente: {patientId}</p>}
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 text-sm text-amber-800">
          <strong>Instrução:</strong> Para cada item abaixo, selecione o número que melhor descreve o seu problema. (0 = Nenhum problema, 4 = Problema grave)
        </div>

        <div className="space-y-5 mb-8">
          {EAT10_QUESTIONS.map((q) => {
            const selected = answers[q.id];
            return (
              <div key={q.id} className="bg-slate-50 p-4 rounded-lg border border-slate-200 border-l-4 border-l-[#5CC6BA]">
                <p className="font-semibold text-slate-700 mb-4 text-sm">
                  <span className="text-[#00A0AF] font-bold mr-2">{q.id}.</span>{q.text}
                </p>
                <div className="flex gap-2">
                  {EAT10_OPTIONS.map((opt, idx) => (
                    <button
                      key={opt.value}
                      onClick={() => setAnswers(p => ({ ...p, [q.id]: opt.value }))}
                      className={`flex-1 py-3 sm:py-4 rounded-lg font-extrabold text-base border-2 transition-all ${selected === opt.value ? 'text-white shadow-md scale-105' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'}`}
                      style={selected === opt.value ? { backgroundColor: NUM_COLORS[idx], borderColor: NUM_COLORS[idx] } : {}}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between text-[9px] text-slate-400 font-semibold mt-1 px-0.5">
                  <span className="text-green-600">Nenhum</span><span className="text-red-600">Grave</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-center border-t border-slate-200 pt-6">
          <button disabled={totalAnswered < 10} onClick={handleSubmit}
            className="px-8 py-3 bg-[#00A0AF] hover:bg-[#00BCD4] text-white font-bold rounded-lg shadow transition-all w-full sm:w-auto disabled:opacity-50">
            Calcular EAT-10
          </button>
        </div>
      </div>

      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs text-slate-500 text-center">
        <p className="font-bold mb-1">Referência Científica Padrão-Ouro:</p>
        <p className="italic">{REFERENCE_EAT10}</p>
      </div>
    </div>
  );
}
