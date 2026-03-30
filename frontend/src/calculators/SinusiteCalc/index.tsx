import { useState } from 'react';
import { 
  EPOS_SYMPTOMS, 
  AAO_SYMPTOMS, 
  calculateEposChance, 
  calculateAaoChance, 
  getSinusitisInterpretation 
} from './logic';

type Guideline = 'EPOS' | 'AAO-HNSF' | null;

export default function SinusiteCalc() {
  const [guideline, setGuideline] = useState<Guideline>(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState<Set<string>>(new Set());
  const [patientId, setPatientId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedResult, setSubmittedResult] = useState<{chance: number, interpret: ReturnType<typeof getSinusitisInterpretation>} | null>(null);

  const toggleSymptom = (symptom: string) => {
    const newSet = new Set(selectedSymptoms);
    if (newSet.has(symptom)) {
      newSet.delete(symptom);
    } else {
      newSet.add(symptom);
    }
    setSelectedSymptoms(newSet);
  };

  const currentSymptomsList = guideline === 'EPOS' ? EPOS_SYMPTOMS : AAO_SYMPTOMS;

  const handleSubmit = async () => {
    if (!guideline) return;
    
    setIsSubmitting(true);
    const symptomsArray = Array.from(selectedSymptoms);
    const chance = guideline === 'EPOS' ? calculateEposChance(symptomsArray) : calculateAaoChance(symptomsArray);
    
    const payload = {
      patient_id: patientId || "anon_sinusite",
      calc_type: `sinusite_${guideline.toLowerCase()}`,
      score: chance,
      raw_answers: {
        guideline_used: guideline,
        symptoms: symptomsArray
      }
    };

    try {
      const response = await fetch('http://localhost:8000/api/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) console.warn("Erro ao salvar no back-end. Visualização apenas local.");
    } catch (e) {
      console.warn("API Error. Visualização apenas local.", e);
    } finally {
      setIsSubmitting(false);
      setSubmittedResult({ chance, interpret: getSinusitisInterpretation(chance) });
    }
  };

  const resetForm = () => {
    setSelectedSymptoms(new Set());
    setGuideline(null);
    setPatientId('');
    setSubmittedResult(null);
  };

  if (submittedResult) {
    const { chance, interpret } = submittedResult;
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-8 text-center border-t-8" style={{borderColor: interpret.color}}>
        <h2 className="text-3xl font-extrabold mb-2" style={{color: interpret.color}}>
          {chance}% de Chance
        </h2>
        <p className="text-xl font-bold mb-6 text-slate-700">{interpret.comment}</p>
        
        <div className="bg-slate-50 p-4 rounded-lg mb-8 text-left border border-slate-200">
          <h3 className="font-bold text-slate-700 mb-2 border-b pb-2">Diretriz: {guideline}</h3>
          <p className="text-sm text-slate-500 mb-3">Sintomas rastreados do paciente:</p>
          <ul className="list-disc pl-5 text-slate-600 space-y-1 text-sm font-medium">
            {Array.from(selectedSymptoms).length === 0 ? <li>Nenhum sintoma marcado</li> : null}
            {Array.from(selectedSymptoms).map(sym => <li key={sym}>{sym}</li>)}
          </ul>
        </div>
        
        <button 
          onClick={resetForm} 
          className="bg-[#00A0AF] hover:bg-[#00BCD4] text-white font-bold py-3 px-8 rounded-lg shadow-md transition-all">
          Realizar Novo Rastreio
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-slate-100">
        
        <div className="mb-8 border-b border-slate-200 pb-6 text-center sm:text-left">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Calculadora de Sinusite Bacteriana</h2>
          <p className="text-slate-500 text-sm">Probabilidade de infecção aguda através das diretrizes clínicas.</p>
        </div>

        {/* Escolha da Diretriz */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-slate-700 mb-4 text-center">Selecione o Guideline Médico Operacional</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => { setGuideline('EPOS'); setSelectedSymptoms(new Set()); }}
              className={`p-4 rounded-xl border-2 font-bold transition-all flex flex-col items-center justify-center ${guideline === 'EPOS' ? 'border-[#00A0AF] bg-[#e6f6f8] text-[#00A0AF] shadow-md transform scale-105' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}
            >
              <span className="text-xl">EPOS 2012</span>
              <span className="text-xs font-normal mt-1 opacity-80">Rinossinusite Europeia</span>
            </button>
            <button
              onClick={() => { setGuideline('AAO-HNSF'); setSelectedSymptoms(new Set()); }}
              className={`p-4 rounded-xl border-2 font-bold transition-all flex flex-col items-center justify-center ${guideline === 'AAO-HNSF' ? 'border-[#00A0AF] bg-[#e6f6f8] text-[#00A0AF] shadow-md transform scale-105' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}
            >
              <span className="text-xl">AAO-HNSF</span>
              <span className="text-xs font-normal mt-1 opacity-80">Academia Americana</span>
            </button>
          </div>
        </div>

        {/* Identificação (Opcional) */}
        {guideline && (
          <div className="mb-6 animate-fade-in">
             <input 
              type="text" 
              value={patientId}
              onChange={e => setPatientId(e.target.value)}
              placeholder="Identificação do Paciente (Para salvar histórico)"
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#5CC6BA] focus:outline-none"
            />
          </div>
        )}

        {/* Lista de Sintomas */}
        {guideline && (
          <div className="space-y-3 mb-8 animate-fade-in">
            <h3 className="text-sm font-bold text-slate-600 mb-4 uppercase tracking-wider border-b pb-2">Investigação Clínica OBRIGATÓRIA</h3>
            {currentSymptomsList.map((symptom, idx) => {
              const checked = selectedSymptoms.has(symptom);
              return (
                <label key={idx} className={`flex items-start p-4 border rounded-lg cursor-pointer transition-all ${checked ? 'bg-[#f0fbfb] border-[#5CC6BA]' : 'bg-white border-slate-200 hover:bg-slate-50'}`}>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleSymptom(symptom)}
                    className="mt-1 w-5 h-5 text-[#00A0AF] rounded border-gray-300 focus:ring-[#5CC6BA]"
                  />
                  <span className={`ml-4 font-medium ${checked ? 'text-[#00A0AF]' : 'text-slate-700'}`}>{symptom}</span>
                </label>
              );
            })}
          </div>
        )}

        {/* Rodapé e Navegação */}
        {guideline && (
          <div className="mt-8 flex justify-center border-t border-slate-200 pt-6 animate-fade-in">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-8 py-4 w-full sm:w-auto bg-[#00A0AF] hover:bg-[#00BCD4] text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all"
            >
              {isSubmitting ? 'Analisando Probabilidade...' : 'Processar e Calcular Chance Bacteriana'}
            </button>
          </div>
        )}

      </div>

      {/* REFERÊNCIA ACADÊMICA */}
      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 shadow-sm text-xs text-slate-500 text-center mt-6">
        <p className="font-bold mb-1">Referências Científicas Padrão-Ouro:</p>
        <p className="italic mb-1">1. Fokkens WJ, et al. European Position Paper on Rhinosinusitis and Nasal Polyps 2012. Eur Arch Otorhinolaryngol. 2012.</p>
        <p className="italic">2. Rosenfeld RM, et al. Clinical Practice Guideline (Update): Adult Sinusitis. Otolaryngol Head Neck Surg. 2015;152(2 Suppl):S1-S39.</p>
      </div>
    </div>
  );
}
