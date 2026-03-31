import { useState } from 'react';
import { API_BASE_URL } from '../../config';
import {
  SNOT22_QUESTIONS,
  Snot22Answers,
  calculateSnot22Score,
  getSnot22Classification,
  getSnot22Color
} from './logic';

interface Props { patientId: string; doctorId?: string; }

export default function Snot22Calc({ patientId, doctorId }: Props) {
  const [answers, setAnswers] = useState<Snot22Answers>({});
  const [topSymptoms, setTopSymptoms] = useState<Set<string>>(new Set());
  const [currentGroup, setCurrentGroup] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedResult, setSubmittedResult] = useState<{score: number, classification: string} | null>(null);
  const [copied, setCopied] = useState(false);

  const maxGroups = 6;
  const currentQuestions = SNOT22_QUESTIONS.filter(q => q.group === currentGroup);

  const handleScoreChange = (qId: string, value: number) => {
    setAnswers(prev => ({ ...prev, [qId]: value }));
  };

  const toggleTopSymptom = (qId: string) => {
    setTopSymptoms(prev => {
      const newSet = new Set(prev);
      if (newSet.has(qId)) { newSet.delete(qId); }
      else {
        if (newSet.size >= 5) { alert('Selecione no máximo 5 sintomas principais.'); return prev; }
        newSet.add(qId);
      }
      return newSet;
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const score = calculateSnot22Score(answers);
    const topSymptomsArray = Array.from(topSymptoms).map(id => SNOT22_QUESTIONS.find(q => q.id === id)?.text || id);

    try {
      await fetch(`${API_BASE_URL}/api/results`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient_id: patientId || 'anon_snot22',
          doctor_id: doctorId || null,
          calc_type: 'snot22',
          score,
          raw_answers: { answers, top_symptoms: topSymptomsArray },
          hub_version: '1.3.0'
        })
      });
    } catch (e) { console.warn('Backend offline.', e); }
    finally {
      setIsSubmitting(false);
      setSubmittedResult({ score, classification: getSnot22Classification(score) });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const resetForm = () => {
    setAnswers({}); setTopSymptoms(new Set()); setCurrentGroup(1); setSubmittedResult(null);
  };

  const handleCopy = () => {
    if (!submittedResult) return;
    const topList = Array.from(topSymptoms).map(id => SNOT22_QUESTIONS.find(q => q.id === id)?.text).join(', ');
    const text = `OTTO CALC-HUB — SNOT-22\nPaciente: ${patientId || 'Não informado'}\nEscore SNOT-22: ${submittedResult.score}/110\nCategoria: ${submittedResult.classification}\nTop Sintomas: ${topList || 'Nenhum'}\nData: ${new Date().toLocaleDateString('pt-BR')}`;
    navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2500); });
  };

  if (submittedResult) {
    const colorSet = getSnot22Color(submittedResult.score);
    return (
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-4 text-center border-t-8" style={{borderColor: colorSet.fontColor}}>
        <h2 className="text-3xl font-extrabold mb-2" style={{color: colorSet.fontColor}}>
          Escore SNOT-22: {submittedResult.score} / 110
        </h2>
        {patientId && <p className="text-slate-500 text-sm mb-2">Paciente: <strong>{patientId}</strong></p>}
        <p className="text-xl font-semibold mb-6 text-slate-700">Categoria: <span style={{color: colorSet.fontColor}}>{submittedResult.classification}</span></p>

        <div className="bg-slate-50 p-4 rounded-lg mb-6 text-left border border-slate-200">
          <h3 className="font-bold text-slate-700 mb-2 border-b pb-2">Top Sintomas (Mais Agravantes):</h3>
          <ul className="list-disc pl-5 text-slate-600 space-y-1">
            {Array.from(topSymptoms).length === 0 ? <li className="italic">Nenhum sintoma marcado como principal.</li> : null}
            {Array.from(topSymptoms).map(id => <li key={id}>{SNOT22_QUESTIONS.find(q => q.id === id)?.text}</li>)}
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={handleCopy} className={`py-3 px-6 rounded-lg font-bold border-2 transition-all ${copied ? 'bg-green-500 text-white border-green-500' : 'bg-white text-slate-600 border-slate-300 hover:border-[#00A0AF]'}`}>
            {copied ? '✅ Copiado!' : '📋 Copiar Resultado'}
          </button>
          <button onClick={resetForm} className="bg-[#00A0AF] hover:bg-[#00BCD4] text-white font-bold py-3 px-8 rounded-lg shadow-md transition-all">
            Novo Questionário
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-slate-100">
        <div className="mb-8 border-b border-slate-200 pb-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-1">Avaliação Rinossinusal (SNOT-22)</h2>
          <p className="text-slate-500 mb-3 text-sm">Gradue de 0 a 5 o impacto de cada sintoma nas últimas duas semanas.</p>
          {patientId && <p className="text-sm font-semibold text-[#00A0AF] bg-[#e6f6f8] px-3 py-1.5 rounded-full inline-block">👤 Paciente: {patientId}</p>}
        </div>

        {/* Barra de Progresso */}
        <div className="mb-8 flex flex-col items-center">
          <div className="w-full bg-slate-200 rounded-full h-2 mb-2">
            <div className="bg-[#00A0AF] h-2 rounded-full transition-all duration-300" style={{ width: `${((currentGroup - 1) / maxGroups) * 100}%` }}></div>
          </div>
          <span className="text-xs font-bold text-slate-400 tracking-wider uppercase">Grupo {currentGroup} de {maxGroups}</span>
        </div>

        {/* Perguntas */}
        <div className="space-y-8 min-h-[400px]">
          {currentQuestions.map((q) => {
            const val = (answers as any)[q.id];
            const isTop = topSymptoms.has(q.id);
            return (
              <div key={q.id} className="bg-slate-50 p-5 rounded-lg border border-slate-200 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#5CC6BA]"></div>
                <h3 className="font-bold text-slate-700 mb-4 ml-2">
                  <span className="text-[#00A0AF] mr-2">{q.id.replace('q', '')}.</span>{q.text}
                </h3>
                <div className="ml-2 mb-4">
                  <div className="flex justify-between gap-1 sm:gap-2">
                    {[0, 1, 2, 3, 4, 5].map((num) => (
                      <button key={num} onClick={() => handleScoreChange(q.id, num)}
                        className={`flex-1 py-3 sm:py-4 rounded-lg font-bold text-sm sm:text-base border-2 transition-all ${val === num ? 'bg-[#00A0AF] text-white border-[#00A0AF] shadow-md scale-105' : 'bg-white text-slate-600 border-slate-200 hover:border-[#5CC6BA]'}`}
                      >{num}</button>
                    ))}
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 font-semibold mt-2 px-1 uppercase tracking-wide">
                    <span>Nenhum (0)</span><span>Moderado (3)</span><span>Grave (5)</span>
                  </div>
                </div>
                <div className="ml-2 flex items-center bg-white p-3 rounded-md border border-slate-200">
                  <input type="checkbox" id={`top-${q.id}`} checked={isTop} onChange={() => toggleTopSymptom(q.id)} className="w-5 h-5 text-[#00A0AF] rounded mr-3" />
                  <label htmlFor={`top-${q.id}`} className="text-sm font-medium text-slate-700 cursor-pointer flex-1">Incluir no TOP 5 piores sintomas</label>
                  {isTop && <span className="bg-[#5CC6BA] text-white text-xs px-2 py-1 rounded-full font-bold">Top 5</span>}
                </div>
              </div>
            );
          })}
        </div>

        {/* Navegação */}
        <div className="mt-10 flex justify-between items-center border-t border-slate-200 pt-6">
          <button disabled={currentGroup === 1} onClick={() => setCurrentGroup(g => g - 1)} className="px-6 py-2 text-slate-600 font-bold disabled:opacity-30 hover:bg-slate-100 rounded-lg transition-colors">← Anterior</button>
          {currentGroup < maxGroups ? (
            <button onClick={() => setCurrentGroup(g => g + 1)} className="px-8 py-3 bg-[#00A0AF] hover:bg-[#00BCD4] text-white font-bold rounded-lg shadow-md">Próximo →</button>
          ) : (
            <button 
              disabled={isSubmitting || Object.keys(answers).length < SNOT22_QUESTIONS.length} 
              onClick={handleSubmit} 
              className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-md disabled:opacity-50"
            >
              {isSubmitting ? 'Gravando...' : 'Finalizar e Calcular'}
            </button>
          )}
        </div>
      </div>

      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs text-slate-500 text-center mt-6">
        <p className="font-bold mb-1">Referência Científica Padrão-Ouro:</p>
        <p className="italic">Hopkins C, et al. Psychometric validity of the 22-item Sinonasal Outcome Test. Clin Otolaryngol. 2009;34(5):447-454. doi:10.1111/j.1749-4486.2009.01995.x</p>
      </div>
    </div>
  );
}
