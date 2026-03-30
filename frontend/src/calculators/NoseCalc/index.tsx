import { useState } from 'react';

const NOSE_QUESTIONS = [
  { id: 'q1', text: 'Congestão nasal' },
  { id: 'q2', text: 'Obstrução nasal parcial ou completa' },
  { id: 'q3', text: 'Problema para respirar pelo nariz' },
  { id: 'q4', text: 'Problema para dormir (devido ao nariz trancado)' },
  { id: 'q5', text: 'Dificuldade para realizar exercícios físicos devido à respiração nasal' }
];

export default function NoseCalc() {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [patientId, setPatientId] = useState<string>('');
  const [submittedResult, setSubmittedResult] = useState<{score: number, classification: string} | null>(null);

  const getClassification = (score: number) => {
    if (score <= 20) return { label: 'Obstrução Leve', color: '#16a34a' }; // Verde
    if (score <= 50) return { label: 'Obstrução Moderada', color: '#ca8a04' }; // Amarelo
    if (score <= 75) return { label: 'Obstrução Grave', color: '#ea580c' }; // Laranja Escuro
    return { label: 'Obstrução Extrema', color: '#dc2626' }; // Vermelho
  };

  const handleScoreChange = (qId: string, value: number) => {
    setAnswers(prev => ({ ...prev, [qId]: value }));
  };

  const handleSubmit = async () => {
    const rawSum = Object.values(answers).reduce((acc, val) => acc + val, 0);
    const score = rawSum * 5; // Multiplica por 5 na matemática oficial de 0-100
    const classInfo = getClassification(score);

    const payload = {
      patient_id: patientId || "anon_nose",
      calc_type: "nose_score",
      score: score,
      raw_answers: answers
    };

    try {
      const response = await fetch('http://localhost:8000/api/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) console.warn('Falha na ponte com API Bckend. Visualizando via frontend apenas.');
    } catch (e) {
      console.warn('Backend inativo no ambiente local. Fallback Visual acionado.', e);
    } finally {
      setSubmittedResult({ score, classification: classInfo.label });
    }
  };

  if (submittedResult) {
    const classInfo = getClassification(submittedResult.score);
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-8 text-center border-t-8" style={{borderColor: classInfo.color}}>
        <h2 className="text-3xl font-extrabold mb-2" style={{color: classInfo.color}}>
          Escore NOSE: {submittedResult.score} / 100
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
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-slate-100 relative">
        <div className="mb-8 border-b border-slate-200 pb-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Escala NOSE (Nasal Obstruction Symptom Evaluation)</h2>
          <p className="text-slate-500 text-sm mb-4">Mede o impacto e a gravidade da obstrução nasal na respiração do paciente.</p>
          <input 
            type="text" 
            value={patientId}
            onChange={e => setPatientId(e.target.value)}
            placeholder="Nome / Registro do Paciente"
            className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-[#5CC6BA] focus:outline-none"
          />
        </div>

        <div className="space-y-6 mb-8">
          {NOSE_QUESTIONS.map((q, idx) => {
            const val = answers[q.id] || 0;
            return (
              <div key={idx} className="bg-slate-50 p-4 rounded border border-slate-200 shadow-sm border-l-4 border-l-[#5CC6BA]">
                <h3 className="font-bold text-slate-700 mb-3">{idx + 1}. {q.text}</h3>
                <div className="mt-3">
                  <div className="flex justify-between gap-1 sm:gap-2">
                    {[0, 1, 2, 3, 4].map((num) => (
                      <button
                        key={num}
                        onClick={() => handleScoreChange(q.id, num)}
                        className={`flex-1 py-3 sm:py-4 rounded-lg font-bold text-sm sm:text-base border-2 transition-all cursor-pointer ${
                          val === num 
                            ? 'bg-[#00A0AF] text-white border-[#00A0AF] shadow-md transform scale-105' 
                            : 'bg-white text-slate-600 border-slate-200 hover:border-[#5CC6BA] hover:bg-slate-50'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between text-[10px] sm:text-xs text-slate-400 font-semibold mt-2 px-1 uppercase tracking-wide">
                    <span>0: Nada</span>
                    <span>2: Moderado</span>
                    <span>4: Grave</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-center border-t border-slate-200 pt-6">
          <button
            onClick={handleSubmit}
            className="px-8 py-3 bg-[#00A0AF] hover:bg-[#00BCD4] text-white font-bold rounded-lg shadow transition-all"
          >
            Calcular NOSE
          </button>
        </div>
      </div>

      {/* REFERÊNCIA ACADÊMICA */}
      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 shadow-sm text-xs text-slate-500 text-center">
        <p className="font-bold mb-1">Referência Científica Padrão-Ouro:</p>
        <p className="italic">Stewart MG, Witsell DL, Smith TL, Weaver EM, Yueh B, Hannley MT. Development and validation of the Nasal Obstruction Symptom Evaluation (NOSE) scale. Otolaryngol Head Neck Surg. 2004;130(2):157-163. doi:10.1016/j.otohns.2003.09.016</p>
      </div>
    </div>
  );
}
