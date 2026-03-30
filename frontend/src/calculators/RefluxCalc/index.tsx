import { useState } from 'react';

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

export default function RefluxCalc() {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [patientId, setPatientId] = useState<string>('');
  const [submittedResult, setSubmittedResult] = useState<{score: number, classification: string} | null>(null);

  const getClassification = (score: number) => {
    if (score <= 13) return { label: 'Normal / Sem RLF Significativo', color: '#16a34a' }; // Verde
    if (score <= 21) return { label: 'RLF Leve a Moderado', color: '#ca8a04' }; // Amarelo
    return { label: 'RLF Moderado a Grave', color: '#ea580c' }; // Laranja/Vermelho
  };

  const handleScoreChange = (qId: string, value: number) => {
    setAnswers(prev => ({ ...prev, [qId]: value }));
  };

  const handleSubmit = async () => {
    const score = REFLUX_QUESTIONS.reduce((acc, q) => acc + (answers[q.id] || 0), 0);
    const classInfo = getClassification(score);

    const payload = {
      patient_id: patientId || "anon_rsi",
      calc_type: "refluxo_rsi",
      score: score,
      raw_answers: answers
    };

    try {
      const response = await fetch('http://localhost:8000/api/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) console.warn('FastAPI Offline.');
    } catch (e) {
      console.warn('FastAPI error.', e);
    } finally {
      setSubmittedResult({ score, classification: classInfo.label });
    }
  };

  if (submittedResult) {
    const classInfo = getClassification(submittedResult.score);
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-8 text-center border-t-8" style={{borderColor: classInfo.color}}>
        <h2 className="text-3xl font-extrabold mb-2" style={{color: classInfo.color}}>
          Escore RSI: {submittedResult.score} / 45
        </h2>
        <p className="text-xl font-bold mb-6 text-slate-700">Categoria: {submittedResult.classification}</p>
        <button 
          onClick={() => { setAnswers({}); setSubmittedResult(null); setPatientId(''); }} 
          className="bg-[#00A0AF] hover:bg-[#00BCD4] text-white font-bold py-3 px-8 rounded-lg shadow-md transition-all">
          Realizar Novo Teste
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6">
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-slate-100">
        <div className="mb-8 border-b border-slate-200 pb-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Índice de Sintomas de Refluxo (RSI)</h2>
          <p className="text-slate-500 text-sm mb-4">Mede a gravidade do Refluxo Laringofaríngeo (RLF). Escores &gt; 13 são sugestivos de RLF.</p>
          <input 
            type="text" 
            value={patientId}
            onChange={e => setPatientId(e.target.value)}
            placeholder="Nome / Registro do Paciente"
            className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-[#5CC6BA] focus:outline-none"
          />
        </div>

        <div className="space-y-6 mb-8">
          <p className="text-sm font-bold text-slate-700 mb-4 bg-slate-50 p-3 rounded">
            Nos últimos 30 dias, qual o nível de impacto dos problemas abaixo?
          </p>
          {REFLUX_QUESTIONS.map((q) => {
            const val = answers[q.id] || 0;
            return (
              <div key={q.id} className="bg-white p-4 rounded border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <h3 className="font-semibold text-slate-700 mb-3 text-sm">{q.text}</h3>
                <div className="flex justify-between text-xs text-slate-500 mb-1 px-1 font-bold">
                  <span>0 (Nenhum)</span>
                  <span>5 (Grave)</span>
                </div>
                <input
                  type="range" min="0" max="5" step="1"
                  value={val} onChange={(e) => handleScoreChange(q.id, parseInt(e.target.value, 10))}
                  className="w-full h-2 bg-slate-200 rounded cursor-pointer accent-[#00A0AF]"
                />
                <div className="text-center font-bold text-[#00A0AF] mt-2 text-sm">Escala Atual: {val}</div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-center border-t border-slate-200 pt-6">
          <button
            onClick={handleSubmit}
            className="px-8 py-3 bg-[#00A0AF] hover:bg-[#00BCD4] text-white font-bold rounded-lg shadow transition-all"
          >
            Calcular RSI
          </button>
        </div>
      </div>

      {/* REFERÊNCIA ACADÊMICA */}
      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 shadow-sm text-xs text-slate-500 text-center">
        <p className="font-bold mb-1">Referência Científica Padrão-Ouro:</p>
        <p className="italic">Belafsky PC, Postma GN, Koufman JA. Validity and reliability of the reflux symptom index (RSI). J Voice. 2002;16(2):274-277. doi: 10.1016/s0892-1997(02)00097-8.</p>
      </div>
    </div>
  );
}
