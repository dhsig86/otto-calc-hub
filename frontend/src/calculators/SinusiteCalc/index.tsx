import { useState } from 'react';
import { API_BASE_URL } from '../../config';
import {
  EPOS_SYMPTOMS,
  AAO_SYMPTOMS,
  calculateEposChance,
  calculateAaoChance,
  getSinusitisInterpretation
} from './logic';

type Guideline = 'EPOS' | 'AAO-HNSF' | null;
interface Props { patientId: string; doctorId?: string; }

export default function SinusiteCalc({ patientId, doctorId }: Props) {
  const [guideline, setGuideline] = useState<Guideline>(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedResult, setSubmittedResult] = useState<{chance: number, interpret: ReturnType<typeof getSinusitisInterpretation>} | null>(null);
  const [copied, setCopied] = useState(false);

  const toggleSymptom = (symptom: string) => {
    const newSet = new Set(selectedSymptoms);
    if (newSet.has(symptom)) newSet.delete(symptom); else newSet.add(symptom);
    setSelectedSymptoms(newSet);
  };

  const currentSymptomsList = guideline === 'EPOS' ? EPOS_SYMPTOMS : AAO_SYMPTOMS;

  const handleSubmit = async () => {
    if (!guideline) return;
    setIsSubmitting(true);
    const symptomsArray = Array.from(selectedSymptoms);
    const chance = guideline === 'EPOS' ? calculateEposChance(symptomsArray) : calculateAaoChance(symptomsArray);

    try {
      await fetch(`${API_BASE_URL}/api/results`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient_id: patientId || 'anon_sinusite',
          doctor_id: doctorId || null,
          calc_type: `sinusite_${guideline?.toLowerCase()}`,
          score: chance,
          raw_answers: { guideline_used: guideline, symptoms: symptomsArray },
          hub_version: '1.3.0'
        })
      });
    } catch (e) { console.warn('API offline.', e); }
    finally {
      setIsSubmitting(false);
      setSubmittedResult({ chance, interpret: getSinusitisInterpretation(chance) });
    }
  };

  const resetForm = () => {
    setSelectedSymptoms(new Set()); setGuideline(null); setSubmittedResult(null);
  };

  const handleCopy = () => {
    if (!submittedResult) return;
    const text = `OTTO CALC-HUB — Sinusite Bacteriana\nPaciente: ${patientId || 'Não informado'}\nDiretriz: ${guideline}\nProbabilidade: ${submittedResult.chance}%\nInterpretação: ${submittedResult.interpret.comment}\nSintomas: ${Array.from(selectedSymptoms).join(', ') || 'Nenhum'}\nData: ${new Date().toLocaleDateString('pt-BR')}`;
    navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2500); });
  };

  if (submittedResult) {
    const { chance, interpret } = submittedResult;
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-4 text-center border-t-8" style={{borderColor: interpret.color}}>
        <h2 className="text-3xl font-extrabold mb-2" style={{color: interpret.color}}>{chance}% de Probabilidade</h2>
        {patientId && <p className="text-slate-500 text-sm mb-2">Paciente: <strong>{patientId}</strong></p>}
        <p className="text-xl font-bold mb-6 text-slate-700">{interpret.comment}</p>

        <div className="bg-slate-50 p-4 rounded-lg mb-6 text-left border border-slate-200">
          <h3 className="font-bold text-slate-700 mb-2 border-b pb-2">Diretriz: {guideline}</h3>
          <ul className="list-disc pl-5 text-slate-600 space-y-1 text-sm">
            {Array.from(selectedSymptoms).length === 0 ? <li>Nenhum sintoma marcado</li> : null}
            {Array.from(selectedSymptoms).map(sym => <li key={sym}>{sym}</li>)}
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={handleCopy} className={`py-3 px-6 rounded-lg font-bold border-2 transition-all ${copied ? 'bg-green-500 text-white border-green-500' : 'bg-white text-slate-600 border-slate-300 hover:border-[#00A0AF]'}`}>
            {copied ? '✅ Copiado!' : '📋 Copiar Resultado'}
          </button>
          <button onClick={resetForm} className="bg-[#00A0AF] hover:bg-[#00BCD4] text-white font-bold py-3 px-8 rounded-lg shadow-md transition-all">
            Novo Rastreio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-slate-100">
        <div className="mb-8 border-b border-slate-200 pb-6 text-center sm:text-left">
          <h2 className="text-2xl font-bold text-slate-800 mb-1">Sinusite Bacteriana Aguda</h2>
          <p className="text-slate-500 text-sm mb-2">Probabilidade de infecção bacteriana por diretrizes clínicas validadas.</p>
          {patientId && <p className="mt-2 text-sm font-semibold text-[#00A0AF] bg-[#e6f6f8] px-3 py-1.5 rounded-full inline-block">👤 Paciente: {patientId}</p>}
        </div>

        {/* Escolha da Diretriz */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-slate-700 mb-4 text-center">Selecione o Guideline:</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(['EPOS', 'AAO-HNSF'] as const).map(gl => (
              <button key={gl} onClick={() => { setGuideline(gl); setSelectedSymptoms(new Set()); }}
                className={`p-4 rounded-xl border-2 font-bold transition-all flex flex-col items-center ${guideline === gl ? 'border-[#00A0AF] bg-[#e6f6f8] text-[#00A0AF] shadow-md scale-105' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                <span className="text-xl">{gl}</span>
                <span className="text-xs font-normal mt-1 opacity-80">{gl === 'EPOS' ? 'Rinossinusite Europeia' : 'Academia Americana'}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Lista de Sintomas */}
        {guideline && (
          <div className="space-y-3 mb-8">
            <h3 className="text-sm font-bold text-slate-600 mb-4 uppercase tracking-wider border-b pb-2">Sintomas Clínicos</h3>
            {currentSymptomsList.map((symptom, idx) => {
              const checked = selectedSymptoms.has(symptom);
              return (
                <label key={idx} className={`flex items-start p-4 border rounded-lg cursor-pointer transition-all ${checked ? 'bg-[#f0fbfb] border-[#5CC6BA]' : 'bg-white border-slate-200 hover:bg-slate-50'}`}>
                  <input type="checkbox" checked={checked} onChange={() => toggleSymptom(symptom)} className="mt-1 w-5 h-5 text-[#00A0AF] rounded mr-4" />
                  <span className={`font-medium ${checked ? 'text-[#00A0AF]' : 'text-slate-700'}`}>{symptom}</span>
                </label>
              );
            })}
          </div>
        )}

        {guideline && (
          <div className="flex justify-center border-t border-slate-200 pt-6">
            <button onClick={handleSubmit} disabled={isSubmitting} className="px-8 py-4 w-full sm:w-auto bg-[#00A0AF] hover:bg-[#00BCD4] text-white font-bold rounded-lg shadow-lg transition-all">
              {isSubmitting ? 'Analisando...' : 'Calcular Probabilidade Bacteriana'}
            </button>
          </div>
        )}
      </div>

      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs text-slate-500 text-center mt-6">
        <p className="font-bold mb-1">Referências Científicas Padrão-Ouro:</p>
        <p className="italic mb-1">1. Fokkens WJ, et al. European Position Paper on Rhinosinusitis and Nasal Polyps 2012. Eur Arch Otorhinolaryngol. 2012.</p>
        <p className="italic">2. Rosenfeld RM, et al. Clinical Practice Guideline (Update): Adult Sinusitis. Otolaryngol Head Neck Surg. 2015;152(2 Suppl):S1-S39.</p>
      </div>
    </div>
  );
}
