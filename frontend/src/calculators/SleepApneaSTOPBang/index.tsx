import { useState } from 'react';
import { STOPBANG_QUESTIONS, STOPBANG_OPTIONS, getSTOPBangClassification, REFERENCE_STOPBANG } from './logic';

interface Props { patientId: string; doctorId?: string; }

export default function SleepApneaSTOPBang({ patientId, doctorId }: Props) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<{ score: number; label: string; color: string; recommendation: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const totalAnswered = Object.keys(answers).length;
  const score = Object.values(answers).reduce((s, v) => s + v, 0);

  const handleSubmit = async () => {
    const cl = getSTOPBangClassification(score);
    setResult({ score, ...cl });
    try {
      await fetch('http://localhost:8000/api/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patient_id: patientId || 'anon_stopbang', doctor_id: doctorId || null, calc_type: 'stop_bang', score, raw_answers: answers, hub_version: '1.3.0' })
      });
    } catch {}
  };

  const handleCopy = () => {
    if (!result) return;
    const text = `OTTO CALC-HUB — STOP-Bang (Rastreio de Apneia do Sono)\nPaciente: ${patientId || 'Não informado'}\nEscore STOP-Bang: ${result.score}/8\nRisco: ${result.label}\nOrientação: ${result.recommendation}\nData: ${new Date().toLocaleDateString('pt-BR')}`;
    navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2500); });
  };

  if (result) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-4 text-center border-t-8" style={{ borderColor: result.color }}>
        <h2 className="text-4xl font-extrabold mb-1" style={{ color: result.color }}>{result.score} / 8</h2>
        <p className="text-xs text-slate-400 uppercase tracking-widest mb-2">Pontos Positivos (STOP-Bang)</p>
        {patientId && <p className="text-slate-500 text-sm mb-2">Paciente: <strong>{patientId}</strong></p>}
        <p className="text-xl font-bold mb-3 text-slate-700">{result.label}</p>
        <div className="bg-slate-50 p-4 rounded-lg mb-6 text-left border border-slate-200">
          <p className="text-sm font-semibold text-slate-600">📋 Orientação Clínica:</p>
          <p className="text-sm text-slate-700 mt-1">{result.recommendation}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={handleCopy} className={`py-3 px-6 rounded-lg font-bold border-2 transition-all ${copied ? 'bg-green-500 text-white border-green-500' : 'bg-white text-slate-600 border-slate-300 hover:border-[#00A0AF]'}`}>
            {copied ? '✅ Copiado!' : '📋 Copiar Resultado'}
          </button>
          <button onClick={() => { setAnswers({}); setResult(null); }} className="bg-[#00A0AF] hover:bg-[#00BCD4] text-white font-bold py-3 px-8 rounded-lg shadow-md transition-all">
            Nova Triagem
          </button>
        </div>
        <div className="mt-6 bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs text-slate-500 text-left">
          <p className="font-bold mb-1">Referência:</p>
          <p className="italic">{REFERENCE_STOPBANG}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6">
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-slate-100">
        <div className="mb-8 border-b border-slate-200 pb-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-1">STOP-Bang — Rastreio de Apneia do Sono</h2>
          <p className="text-slate-500 text-sm mb-2">Ferramenta validada para triagem de Apneia Obstrutiva do Sono (AOS). 8 perguntas Sim/Não.</p>
          {patientId && <p className="mt-2 text-sm font-semibold text-[#00A0AF] bg-[#e6f6f8] px-3 py-1.5 rounded-full inline-block">👤 Paciente: {patientId}</p>}
        </div>

        {/* Legenda de risco */}
        <div className="grid grid-cols-3 gap-2 mb-6 text-xs font-bold text-center">
          <div className="bg-green-50 border border-green-200 rounded-lg p-2 text-green-700">0-2 pontos<br/>Baixo Risco</div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 text-yellow-700">3-4 pontos<br/>Risco Intermediário</div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-2 text-red-700">5-8 pontos<br/>Alto Risco</div>
        </div>

        <div className="space-y-4 mb-8">
          {STOPBANG_QUESTIONS.map((q) => {
            const selected = answers[q.id];
            return (
              <div key={q.id} className={`p-4 rounded-lg border-2 transition-all ${selected === 1 ? 'bg-red-50 border-red-300' : selected === 0 ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-200'}`}>
                <p className="font-bold text-slate-700 mb-4 text-sm leading-relaxed">{q.text}</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setAnswers(p => ({ ...p, [q.id]: 0 }))}
                    className={`flex-1 py-3 rounded-lg font-bold text-sm border-2 transition-all ${selected === 0 ? 'bg-green-500 text-white border-green-500 shadow-md' : 'bg-white text-green-700 border-green-200 hover:border-green-400'}`}
                  >
                    ✗ Não
                  </button>
                  <button
                    onClick={() => setAnswers(p => ({ ...p, [q.id]: 1 }))}
                    className={`flex-1 py-3 rounded-lg font-bold text-sm border-2 transition-all ${selected === 1 ? 'bg-red-500 text-white border-red-500 shadow-md' : 'bg-white text-red-700 border-red-200 hover:border-red-400'}`}
                  >
                    ✓ Sim
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {totalAnswered > 0 && (
          <div className="text-center text-sm font-bold text-slate-500 mb-4">
            Pontos positivos até agora: <span className="text-[#00A0AF] text-xl font-extrabold">{score}</span> / 8
          </div>
        )}

        <div className="flex justify-center border-t border-slate-200 pt-6">
          <button disabled={totalAnswered < 8} onClick={handleSubmit}
            className="px-8 py-3 bg-[#00A0AF] hover:bg-[#00BCD4] text-white font-bold rounded-lg shadow transition-all w-full sm:w-auto disabled:opacity-50">
            Calcular Risco STOP-Bang
          </button>
        </div>
      </div>

      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs text-slate-500 text-center">
        <p className="font-bold mb-1">Referência Científica Padrão-Ouro:</p>
        <p className="italic">{REFERENCE_STOPBANG}</p>
      </div>
    </div>
  );
}
