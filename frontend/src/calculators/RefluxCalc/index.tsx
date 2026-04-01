import { useState } from 'react';
import { API_BASE_URL } from '../../config';

const REFLUX_QUESTIONS = [
  { id: 'rouquidao', text: '1. Rouquidão ou problema com a voz' },
  { id: 'pigarro', text: '2. Pigarro (necessidade de limpar a garganta)' },
  { id: 'mucoGarganta', text: '3. Excesso de muco na garganta ou gotejamento pós-nasal' },
  { id: 'dificuldadeEngolir', text: '4. Dificuldade para engolir alimentos, líquidos ou comprimidos' },
  { id: 'tosseAposComer', text: '5. Tosse depois de comer ou deitar-se' },
  { id: 'dificuldadeRespirar', text: '6. Dificuldade para respirar ou episódios de engasgo' },
  { id: 'tosseSemResfriado', text: '7. Tosse incômoda ou irritante' },
  { id: 'noduloGarganta', text: '8. Sensação de algo parado na garganta (globus/nó)' },
  { id: 'azia', text: '9. Azia, dor no peito, indigestão ou ácido subindo' }
];

interface Props { patientId: string; doctorId?: string; }

export default function RefluxCalc({ patientId, doctorId }: Props) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submittedResult, setSubmittedResult] = useState<{score: number, classification: string, color: string} | null>(null);
  const [copied, setCopied] = useState(false);

  const getClassification = (score: number) => {
    if (score <= 13) return { label: 'Normal / Sem RLF Significativo', color: '#16a34a' };
    if (score <= 21) return { label: 'RLF Leve a Moderado', color: '#ca8a04' };
    return { label: 'RLF Moderado a Grave', color: '#ea580c' };
  };

  const handleScoreChange = (qId: string, value: number) => {
    setAnswers(prev => ({ ...prev, [qId]: value }));
  };

  const handleSubmit = async () => {
    const score = REFLUX_QUESTIONS.reduce((acc, q) => acc + (answers[q.id] || 0), 0);
    const classInfo = getClassification(score);

    try {
      await fetch(`${API_BASE_URL}/api/results`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient_id: patientId || 'anon_rsi',
          doctor_id: doctorId || null,
          calc_type: 'refluxo_rsi',
          score,
          raw_answers: answers,
          hub_version: '1.3.0'
        })
      });
    } catch (e) { console.warn('FastAPI offline.', e); }
    finally {
      setSubmittedResult({ score, classification: classInfo.label, color: classInfo.color });
    }
  };

  const handleCopy = () => {
    if (!submittedResult) return;
    const text = `OTTO CALC-HUB — RSI (Refluxo Laringofaríngeo)\nPaciente: ${patientId || 'Não informado'}\nEscore RSI: ${submittedResult.score}/45\nCategoria: ${submittedResult.classification}\nLimiar diagnóstico: > 13 pontos sugere RLF\nData: ${new Date().toLocaleDateString('pt-BR')}`;
    navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2500); });
  };

  if (submittedResult) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-4 text-center border-t-8" style={{borderColor: submittedResult.color}}>
        <h2 className="text-3xl font-extrabold mb-2" style={{color: submittedResult.color}}>
          Escore RSI: {submittedResult.score} / 45
        </h2>
        {patientId && <p className="text-slate-500 text-sm mb-2">Paciente: <strong>{patientId}</strong></p>}
        <p className="text-xl font-bold mb-6 text-slate-700">{submittedResult.classification}</p>
        <p className="text-xs text-slate-400 mb-6 italic">Limiar diagnóstico de RLF: &gt; 13 pontos (Belafsky et al., 2002)</p>
        <div className="bg-slate-50 p-4 rounded-lg mb-6 text-xs text-slate-500 text-center border border-slate-200">
          <p className="font-bold mb-1">Referência Científica Padrão-Ouro:</p>
          <p className="italic">Belafsky PC, et al. (2002). The validity and reliability of the reflux symptom index (RSI). J Voice. PMID: 12150380.</p>
        </div>
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
          <h2 className="text-2xl font-bold text-slate-800 mb-1">Índice de Sintomas de Refluxo (RSI)</h2>
          <p className="text-slate-500 text-sm mb-2">Reflux Symptom Index — Escores &gt; 13 são sugestivos de Refluxo Laringofaríngeo (RLF).</p>
          {patientId && <p className="mt-2 text-sm font-semibold text-[#00A0AF] bg-[#e6f6f8] px-3 py-1.5 rounded-full inline-block">👤 Paciente: {patientId}</p>}
        </div>

        <div className="bg-rose-50 border border-rose-200 rounded-xl p-5 mb-6 text-sm text-rose-900 shadow-sm transition-all hover:shadow-md">
          <p className="mb-2"><strong className="text-rose-700 uppercase tracking-wide text-[10px] sm:text-xs">🎯 Para que serve:</strong><br/> <span className="opacity-90 font-medium">Aglutinar dados crônicos atípicos do DRGE silencioso isolando e detectando a clássica Doença do Refluxo Laringofaríngeo retrograda silenciosa (DRLF).</span></p>
          <p><strong className="text-rose-700 uppercase tracking-wide text-[10px] sm:text-xs">💡 Como aplicar:</strong><br/> <span className="opacity-90 font-medium">Paciente reflete em escala 0-5 a acidez e secreção da garganta. Valores limiares cruzados fornecem prescrições IBP precisas antes da phmetria padrão ouro ocorrer.</span></p>
        </div>

        <div className="space-y-6 mb-8">
          <p className="text-sm font-bold text-slate-700 bg-slate-50 p-3 rounded">
            Nos últimos 30 dias, qual o nível de impacto dos problemas abaixo? (0 = Nenhum, 5 = Grave)
          </p>
          {REFLUX_QUESTIONS.map((q) => {
            const val = answers[q.id];
            return (
              <div key={q.id} className="bg-white p-4 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                <h3 className="font-semibold text-slate-700 mb-3 text-sm">{q.text}</h3>
                <div className="flex justify-between gap-1 sm:gap-2">
                  {[0, 1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      onClick={() => handleScoreChange(q.id, num)}
                      className={`flex-1 py-3 sm:py-4 rounded-lg font-bold text-sm sm:text-base border-2 transition-all ${val === num ? 'bg-[#00A0AF] text-white border-[#00A0AF] shadow-md scale-105' : 'bg-white text-slate-600 border-slate-200 hover:border-[#5CC6BA]'}`}
                    >{num}</button>
                  ))}
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 font-semibold mt-2 px-1 uppercase tracking-wide">
                  <span>0: Nenhum</span><span>5: Grave</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-center border-t border-slate-200 pt-6">
          <button 
            disabled={Object.keys(answers).length < REFLUX_QUESTIONS.length}
            onClick={handleSubmit} 
            className="px-8 py-3 bg-[#00A0AF] hover:bg-[#00BCD4] text-white font-bold rounded-lg shadow transition-all w-full sm:w-auto disabled:opacity-50"
          >
            Calcular RSI
          </button>
        </div>
      </div>

      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs text-slate-500 text-center">
        <p className="font-bold mb-1">Referência Científica Padrão-Ouro:</p>
        <p className="italic">Belafsky PC, Postma GN, Koufman JA. Validity and reliability of the reflux symptom index (RSI). J Voice. 2002;16(2):274-277. doi:10.1016/s0892-1997(02)00097-8.</p>
      </div>
    </div>
  );
}
