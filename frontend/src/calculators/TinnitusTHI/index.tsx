import { useState } from 'react';
import { API_BASE_URL } from '../../config';
import { THI_QUESTIONS, THI_OPTIONS, getTHIClassification, REFERENCE_THI } from './logic';

interface Props { patientId: string; doctorId?: string; }

const QUESTIONS_PER_PAGE = 5;
const TOTAL_PAGES = Math.ceil(25 / QUESTIONS_PER_PAGE);

export default function TinnitusTHI({ patientId, doctorId }: Props) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [page, setPage] = useState(1);
  const [result, setResult] = useState<{ score: number; label: string; color: string; recommendation: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const pageQuestions = THI_QUESTIONS.slice((page - 1) * QUESTIONS_PER_PAGE, page * QUESTIONS_PER_PAGE);
  const answeredOnPage = pageQuestions.every(q => answers[q.id] !== undefined);
  const totalAnswered = Object.keys(answers).length;
  const score = Object.values(answers).reduce((s, v) => s + v, 0);

  const handleSelect = (qId: number, value: number) => setAnswers(p => ({ ...p, [qId]: value }));

  const handleSubmit = async () => {
    const cl = getTHIClassification(score);
    setResult({ score, ...cl });
    try {
      await fetch(`${API_BASE_URL}/api/results`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patient_id: patientId || 'anon_thi', doctor_id: doctorId || null, calc_type: 'thi_25', score, raw_answers: answers, hub_version: '1.3.0' })
      });
    } catch {}
  };

  const handleCopy = () => {
    if (!result) return;
    const text = `OTTO CALC-HUB — THI (Inventário de Desvantagem do Zumbido)\nPaciente: ${patientId || 'Não informado'}\nEscore THI: ${result.score}/100\nClassificação: ${result.label}\nRecomendação: ${result.recommendation}\nData: ${new Date().toLocaleDateString('pt-BR')}`;
    navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2500); });
  };

  const optionColors: Record<number, string> = { 0: '#16a34a', 2: '#ca8a04', 4: '#dc2626' };

  if (result) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-4 text-center border-t-8" style={{ borderColor: result.color }}>
        <h2 className="text-3xl font-extrabold mb-1" style={{ color: result.color }}>THI: {result.score} / 100</h2>
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
          <button onClick={() => { setAnswers({}); setPage(1); setResult(null); }} className="bg-[#00A0AF] hover:bg-[#00BCD4] text-white font-bold py-3 px-8 rounded-lg shadow-md transition-all">
            Novo THI
          </button>
        </div>
        <div className="mt-6 bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs text-slate-500 text-left">
          <p className="font-bold mb-1">Referência:</p>
          <p className="italic">{REFERENCE_THI}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6">
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-slate-100">
        <div className="mb-6 border-b border-slate-200 pb-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-1">THI — Inventário de Desvantagem do Zumbido</h2>
          <p className="text-slate-500 text-sm mb-2">Tinnitus Handicap Inventory (25 itens). Responda conforme sua experiência com o zumbido.</p>
          {patientId && <p className="mt-2 text-sm font-semibold text-[#00A0AF] bg-[#e6f6f8] px-3 py-1.5 rounded-full inline-block">👤 Paciente: {patientId}</p>}
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6 text-sm text-amber-900 shadow-sm transition-all hover:shadow-md">
          <p className="mb-2"><strong className="text-amber-700 uppercase tracking-wide text-[10px] sm:text-xs">🎯 Para que serve:</strong><br/> <span className="opacity-90 font-medium">Mensurar o impacto incapacitante do tinido (zumbido) na vida laboral, qualidade social e saúde mental do indivíduo a longo prazo.</span></p>
          <p><strong className="text-amber-700 uppercase tracking-wide text-[10px] sm:text-xs">💡 Como aplicar:</strong><br/> <span className="opacity-90 font-medium">Paciente autodenomina as limitações decorrentes acústicas. Essencial como baseline de gravidade que justifica terapia TRT ou ansiolíticos adjuvantes.</span></p>
        </div>

        {/* Barra de Progresso */}
        <div className="mb-6">
          <div className="flex justify-between text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
            <span>Grupo {page} de {TOTAL_PAGES}</span>
            <span>{totalAnswered}/25 respondidas</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div className="bg-[#00A0AF] h-2 rounded-full transition-all duration-300" style={{ width: `${(totalAnswered / 25) * 100}%` }}></div>
          </div>
        </div>

        {/* Instruções */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 text-sm text-amber-800">
          <strong>Instrução:</strong> Identifique as dificuldades causadas pelo seu zumbido. Selecione <strong>Sim</strong>, <strong>Às vezes</strong> ou <strong>Não</strong> para cada item.
        </div>

        {/* Perguntas */}
        <div className="space-y-6">
          {pageQuestions.map((q) => {
            const selected = answers[q.id];
            return (
              <div key={q.id} className="bg-slate-50 p-4 rounded-lg border border-slate-200 border-l-4 border-l-[#5CC6BA]">
                <p className="font-semibold text-slate-700 mb-4 text-sm leading-relaxed">
                  <span className="text-[#00A0AF] font-bold mr-2">{q.id}.</span>{q.text}
                </p>
                <div className="flex gap-2 sm:gap-3">
                  {THI_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => handleSelect(q.id, opt.value)}
                      className={`flex-1 py-3 rounded-lg font-bold text-sm border-2 transition-all ${selected === opt.value ? 'text-white shadow-md scale-105' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'}`}
                      style={selected === opt.value ? { backgroundColor: optionColors[opt.value], borderColor: optionColors[opt.value] } : {}}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Navegação */}
        <div className="mt-8 pt-6 border-t border-slate-200 flex justify-between items-center">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
            className="px-6 py-2 text-slate-600 font-bold disabled:opacity-30 hover:bg-slate-100 rounded-lg transition-colors">
            ← Anterior
          </button>

          {page < TOTAL_PAGES ? (
            <button disabled={!answeredOnPage} onClick={() => setPage(p => p + 1)}
              className="px-8 py-3 bg-[#00A0AF] hover:bg-[#00BCD4] text-white font-bold rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all">
              Próximo →
            </button>
          ) : (
            <button disabled={totalAnswered < 25} onClick={handleSubmit}
              className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-md disabled:opacity-50 transition-all">
              Calcular Escore THI
            </button>
          )}
        </div>
      </div>

      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs text-slate-500 text-center">
        <p className="font-bold mb-1">Referência Científica Padrão-Ouro:</p>
        <p className="italic">{REFERENCE_THI}</p>
      </div>
    </div>
  );
}
