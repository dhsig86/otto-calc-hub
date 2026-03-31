import { useState } from 'react';
import { API_BASE_URL } from '../../config';

const NOSE_QUESTIONS = [
  { id: 'q1', text: 'Congestão nasal' },
  { id: 'q2', text: 'Obstrução nasal parcial ou completa' },
  { id: 'q3', text: 'Problema para respirar pelo nariz' },
  { id: 'q4', text: 'Problema para dormir (devido ao nariz trancado)' },
  { id: 'q5', text: 'Dificuldade para realizar exercícios físicos devido à respiração nasal' }
];

interface Props { patientId: string; doctorId?: string; }

export default function NoseCalc({ patientId, doctorId }: Props) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submittedResult, setSubmittedResult] = useState<{score: number, classification: string} | null>(null);
  const [copied, setCopied] = useState(false);

  const getClassification = (score: number) => {
    if (score <= 20) return { label: 'Obstrução Leve', color: '#16a34a' };
    if (score <= 50) return { label: 'Obstrução Moderada', color: '#ca8a04' };
    if (score <= 75) return { label: 'Obstrução Grave', color: '#ea580c' };
    return { label: 'Obstrução Extrema', color: '#dc2626' };
  };

  const handleScoreChange = (qId: string, value: number) => {
    setAnswers(prev => ({ ...prev, [qId]: value }));
  };

  const handleSubmit = async () => {
    const rawSum = Object.values(answers).reduce((acc, val) => acc + val, 0);
    const score = rawSum * 5;
    const classInfo = getClassification(score);

    const payload = {
      patient_id: patientId || 'anon_nose',
      doctor_id: doctorId || null,
      calc_type: 'nose_score',
      score,
      raw_answers: { answers, classification: classInfo.label },
      hub_version: '1.3.0'
    };

    try {
      await fetch(`${API_BASE_URL}/api/results`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (e) {
      console.warn('Backend offline. Fallback visual.', e);
    } finally {
      setSubmittedResult({ score, classification: classInfo.label });
    }
  };

  const handleCopy = () => {
    if (!submittedResult) return;
    const text = `OTTO CALC-HUB — Escala NOSE\nPaciente: ${patientId || 'Não informado'}\nEscore NOSE: ${submittedResult.score}/100\nCategoría: ${submittedResult.classification}\nData: ${new Date().toLocaleDateString('pt-BR')}`;
    navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2500); });
  };

  if (submittedResult) {
    const classInfo = getClassification(submittedResult.score);
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-4 text-center border-t-8" style={{borderColor: classInfo.color}}>
        <h2 className="text-3xl font-extrabold mb-2" style={{color: classInfo.color}}>
          Escore NOSE: {submittedResult.score} / 100
        </h2>
        {patientId && <p className="text-slate-500 text-sm mb-2">Paciente: <strong>{patientId}</strong></p>}
        <p className="text-xl font-bold mb-6 text-slate-700">{submittedResult.classification}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={handleCopy} className={`py-3 px-6 rounded-lg font-bold border-2 transition-all ${copied ? 'bg-green-500 text-white border-green-500' : 'bg-white text-slate-600 border-slate-300 hover:border-[#00A0AF]'}`}>
            {copied ? '✅ Copiado!' : '📋 Copiar Resultado'}
          </button>
          <button onClick={() => { setAnswers({}); setSubmittedResult(null); }} className="bg-[#00A0AF] hover:bg-[#00BCD4] text-white font-bold py-3 px-8 rounded-lg shadow-md transition-all">
            Novo Teste
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6">
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-slate-100">
        <div className="mb-8 border-b border-slate-200 pb-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-1">Escala NOSE</h2>
          <p className="text-slate-500 text-sm">Nasal Obstruction Symptom Evaluation — Gradue o impacto de cada sintoma de 0 (nenhum) a 4 (grave).</p>
          {patientId && <p className="mt-3 text-sm font-semibold text-[#00A0AF] bg-[#e6f6f8] px-3 py-1.5 rounded-full inline-block">👤 Paciente: {patientId}</p>}
        </div>

        <div className="space-y-6 mb-8">
          {NOSE_QUESTIONS.map((q, idx) => {
            const val = answers[q.id];
            return (
              <div key={idx} className="bg-slate-50 p-4 rounded-lg border border-slate-200 border-l-4 border-l-[#5CC6BA]">
                <h3 className="font-bold text-slate-700 mb-3">{idx + 1}. {q.text}</h3>
                <div className="flex justify-between gap-1 sm:gap-2">
                  {[0, 1, 2, 3, 4].map((num) => (
                    <button
                      key={num}
                      onClick={() => handleScoreChange(q.id, num)}
                      className={`flex-1 py-3 sm:py-4 rounded-lg font-bold text-sm sm:text-base border-2 transition-all ${val === num ? 'bg-[#00A0AF] text-white border-[#00A0AF] shadow-md scale-105' : 'bg-white text-slate-600 border-slate-200 hover:border-[#5CC6BA]'}`}
                    >{num}</button>
                  ))}
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 font-semibold mt-2 px-1 uppercase tracking-wide">
                  <span>0: Nada</span><span>2: Moderado</span><span>4: Grave</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-center border-t border-slate-200 pt-6">
          <button 
            disabled={Object.keys(answers).length < NOSE_QUESTIONS.length} 
            onClick={handleSubmit} 
            className="px-8 py-3 bg-[#00A0AF] hover:bg-[#00BCD4] text-white font-bold rounded-lg shadow transition-all w-full sm:w-auto disabled:opacity-50"
          >
            Calcular Escore NOSE
          </button>
        </div>
      </div>

      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs text-slate-500 text-center">
        <p className="font-bold mb-1">Referência Científica Padrão-Ouro:</p>
        <p className="italic">Stewart MG, et al. Development and validation of the Nasal Obstruction Symptom Evaluation (NOSE) scale. Otolaryngol Head Neck Surg. 2004;130(2):157-163. doi:10.1016/j.otohns.2003.09.016</p>
      </div>
    </div>
  );
}
