import { useState } from 'react';
import { 
  SNOT22_QUESTIONS, 
  Snot22Answers, 
  calculateSnot22Score, 
  getSnot22Classification, 
  getSnot22Color 
} from './logic';

export default function Snot22Calc() {
  const [answers, setAnswers] = useState<Snot22Answers>({});
  const [topSymptoms, setTopSymptoms] = useState<Set<string>>(new Set());
  const [currentGroup, setCurrentGroup] = useState<number>(1);
  const [patientId, setPatientId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedResult, setSubmittedResult] = useState<{score: number, classification: string} | null>(null);

  const maxGroups = 6;
  const currentQuestions = SNOT22_QUESTIONS.filter(q => q.group === currentGroup);
  
  const handleScoreChange = (qId: string, value: number) => {
    setAnswers(prev => ({ ...prev, [qId]: value }));
  };

  const toggleTopSymptom = (qId: string) => {
    setTopSymptoms(prev => {
      const newSet = new Set(prev);
      if (newSet.has(qId)) {
        newSet.delete(qId);
      } else {
        if (newSet.size >= 5) {
          alert('Você só pode selecionar até 5 sintomas como os mais impactantes.');
          return prev;
        }
        newSet.add(qId);
      }
      return newSet;
    });
  };

  const handleNext = () => {
    if (currentGroup < maxGroups) setCurrentGroup(g => g + 1);
  };
  
  const handlePrev = () => {
    if (currentGroup > 1) setCurrentGroup(g => g - 1);
  };

  const handleSubmit = async () => {
    if (!patientId.trim()) {
      alert("Por favor, digite um identificador ou nome do paciente antes de finalizar.");
      return;
    }
    
    setIsSubmitting(true);
    const score = calculateSnot22Score(answers);
    const topSymptomsArray = Array.from(topSymptoms).map(id => {
      return SNOT22_QUESTIONS.find(q => q.id === id)?.text || id;
    });

    const payload = {
      patient_id: patientId,
      calc_type: "snot22",
      score: score,
      raw_answers: {
        answers: answers,
        top_symptoms: topSymptomsArray
      }
    };

    try {
      const response = await fetch('http://localhost:8000/api/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
         console.warn("Backend não respondeu ou indisponível. Gravando apenas no state visual.");
      }
    } catch (e) {
      console.warn("Erro de rede com a API. Exibindo resultado fall-back.", e);
    } finally {
      setIsSubmitting(false);
      setSubmittedResult({ score, classification: getSnot22Classification(score) });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const resetForm = () => {
    setAnswers({});
    setTopSymptoms(new Set());
    setCurrentGroup(1);
    setPatientId('');
    setSubmittedResult(null);
  };

  if (submittedResult) {
    const colorSet = getSnot22Color(submittedResult.score);
    return (
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-8 text-center animate-fade-in border-t-8" style={{borderColor: colorSet.fontColor}}>
        <h2 className="text-3xl font-extrabold mb-4" style={{color: colorSet.fontColor}}>
          Escore de SNOT-22: {submittedResult.score} / 110
        </h2>
        <p className="text-xl font-semibold mb-6 text-slate-700">Categoria: <span style={{color: colorSet.fontColor}}>{submittedResult.classification}</span></p>
        
        <div className="bg-slate-50 p-4 rounded-lg mb-8 text-left border border-slate-200">
          <h3 className="font-bold text-slate-700 mb-2 border-b pb-2">Top Sintomas (Mais Agravantes):</h3>
          <ul className="list-disc pl-5 text-slate-600 space-y-1">
            {Array.from(topSymptoms).length === 0 ? <li className="italic">Nenhum sintoma marcado como principal.</li> : null}
            {Array.from(topSymptoms).map(id => {
              const text = SNOT22_QUESTIONS.find(q => q.id === id)?.text;
              return <li key={id}>{text}</li>;
            })}
          </ul>
        </div>
        
        <button 
          onClick={resetForm} 
          className="bg-[#00A0AF] hover:bg-[#00BCD4] text-white font-bold py-3 px-8 rounded-lg shadow-md transition-all">
          Realizar Novo Questionário
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-slate-100">
        
        {/* Header e Identificação */}
        <div className="mb-8 border-b border-slate-200 pb-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Avaliação Rinossinusal (SNOT-22)</h2>
          <p className="text-slate-500 mb-6 text-sm">Gradue de 0 a 5 o impacto de cada sintoma nas últimas duas semanas.</p>
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-2">Identificação do Paciente</label>
            <input 
              type="text" 
              value={patientId}
              onChange={e => setPatientId(e.target.value)}
              placeholder="Nome ou ID (Obrigatório para o Banco)"
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#5CC6BA] focus:outline-none"
            />
          </div>
        </div>

        {/* Barra de Progresso */}
        <div className="mb-8 flex flex-col items-center">
          <div className="w-full bg-slate-200 rounded-full h-2 mb-2">
            <div className="bg-[#00A0AF] h-2 rounded-full transition-all duration-300" style={{ width: `${((currentGroup - 1) / maxGroups) * 100}%` }}></div>
          </div>
          <span className="text-xs font-bold text-slate-400 tracking-wider uppercase">Grupo {currentGroup} de {maxGroups}</span>
        </div>

        {/* Perguntas Dinâmicas */}
        <div className="space-y-8 min-h-[400px]">
          {currentQuestions.map((q) => {
            const val = answers[q.id] || 0;
            const isTop = topSymptoms.has(q.id);
            return (
              <div key={q.id} className="bg-slate-50 p-5 rounded-lg border border-slate-200 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#5CC6BA]"></div>
                
                <h3 className="font-bold text-slate-700 mb-4 ml-2">
                  <span className="text-[#00A0AF] mr-2">{q.id.replace('q', '')}.</span>{q.text}
                </h3>
                
                <div className="ml-2 mb-6">
                  <div className="flex justify-between text-xs text-slate-500 font-semibold mb-2 px-1">
                    <span>Nenhum (0)</span>
                    <span>Moderado (3)</span>
                    <span>Grave (5)</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="5"
                    step="1"
                    value={val}
                    onChange={(e) => handleScoreChange(q.id, parseInt(e.target.value, 10))}
                    className="w-full h-2 bg-slate-300 rounded-lg appearance-none cursor-pointer accent-[#00A0AF]"
                  />
                  <div className="text-center mt-3 font-bold text-lg text-[#00A0AF]">
                    Grau Selecionado: {val}
                  </div>
                </div>

                <div className="ml-2 flex items-center bg-white p-3 rounded-md border border-slate-200">
                  <input
                    type="checkbox"
                    id={`top-${q.id}`}
                    checked={isTop}
                    onChange={() => toggleTopSymptom(q.id)}
                    className="w-5 h-5 text-[#00A0AF] rounded border-gray-300 focus:ring-[#5CC6BA] mr-3"
                  />
                  <label htmlFor={`top-${q.id}`} className="text-sm font-medium text-slate-700 cursor-pointer flex-1">
                    Incluir no TOP 5 piores sintomas
                  </label>
                  {isTop && <span className="bg-[#5CC6BA] text-white text-xs px-2 py-1 rounded-full font-bold">Top 5</span>}
                </div>
              </div>
            );
          })}
        </div>

        {/* Rodapé e Navegação */}
        <div className="mt-10 flex justify-between items-center border-t border-slate-200 pt-6">
          <button
            disabled={currentGroup === 1}
            onClick={handlePrev}
            className="px-6 py-2 text-slate-600 font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 rounded-lg transition-colors"
          >
            ← Anterior
          </button>
          
          {currentGroup < maxGroups ? (
            <button
              onClick={handleNext}
              className="px-8 py-3 bg-[#00A0AF] hover:bg-[#00BCD4] text-white font-bold rounded-lg shadow-md transition-colors"
            >
              Próximo Grupo →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-8 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg shadow-md transition-colors flex items-center"
            >
              {isSubmitting ? 'Gravando...' : 'Finalizar Questionário e Gravar'}
            </button>
          )}
        </div>

      </div>

      {/* REFERÊNCIA ACADÊMICA */}
      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 shadow-sm text-xs text-slate-500 text-center mt-6">
        <p className="font-bold mb-1">Referência Científica Padrão-Ouro:</p>
        <p className="italic">Hopkins C, Gillett S, Slack R, Lund VJ, Browne JP. Psychometric validity of the 22-item Sinonasal Outcome Test. Clin Otolaryngol. 2009;34(5):447-454. doi:10.1111/j.1749-4486.2009.01995.x</p>
      </div>
    </div>
  );
}
