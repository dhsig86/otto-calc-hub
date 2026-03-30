import { useState } from 'react';
import { getLarynxTOptions, getLarynxNOptions, getLarynxMOptions, calculateLarynxStage, getLarynxPrognosis } from './larynxLogic';
import { getOralCavityTOptions, getOralCavityNOptions, getOralCavityMOptions, calculateOralCavityStage, getOralCavityPrognosis } from './oralCavityLogic';

type Organ = 'laringe' | 'cavidade_oral' | null;

export default function TnmCalc() {
  const [organ, setOrgan] = useState<Organ>(null);
  const [subsite, setSubsite] = useState<string>('');
  
  const [tValue, setTValue] = useState<string>('');
  const [nValue, setNValue] = useState<string>('');
  const [mValue, setMValue] = useState<string>('');
  
  const [patientId, setPatientId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [result, setResult] = useState<{stage: string, prognosis: string} | null>(null);

  const resetForm = () => {
    setOrgan(null);
    setSubsite('');
    setTValue('');
    setNValue('');
    setMValue('');
    setResult(null);
  };

  const handleOrganSelect = (selected: Organ) => {
    resetForm();
    setOrgan(selected);
  };

  const calculateStage = () => {
    if (!tValue || !nValue || !mValue || !subsite) {
      alert("Por favor, preencha T, N, M e a sublocalização.");
      return;
    }
    
    let stage = '';
    let prognosis = '';

    if (organ === 'laringe') {
      stage = calculateLarynxStage(tValue, nValue, mValue);
      prognosis = getLarynxPrognosis(stage);
    } else if (organ === 'cavidade_oral') {
      stage = calculateOralCavityStage(tValue, nValue, mValue);
      prognosis = getOralCavityPrognosis(subsite, stage);
    }

    submitToBackend(stage, prognosis);
  };

  const submitToBackend = async (stage: string, prognosis: string) => {
    setIsSubmitting(true);
    const payload = {
      patient_id: patientId || "anon_tnm",
      calc_type: `tnm_${organ}`,
      score: 0, // Score abstrato em staging
      raw_answers: { organ, subsite, T: tValue, N: nValue, M: mValue, stage }
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
      setIsSubmitting(false);
      setResult({ stage, prognosis });
    }
  };

  const renderSubsites = () => {
    if (organ === 'laringe') {
      return (
        <select value={subsite} onChange={e => { setSubsite(e.target.value); setTValue(''); }} className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-[#00A0AF] outline-none">
          <option value="">Selecione o Subsítio da Laringe...</option>
          <option value="glote">Glote</option>
          <option value="supraglote">Supraglote</option>
          <option value="subglote">Subglote</option>
        </select>
      );
    } else if (organ === 'cavidade_oral') {
      return (
        <select value={subsite} onChange={e => { setSubsite(e.target.value); setTValue(''); }} className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-[#00A0AF] outline-none">
          <option value="">Selecione o Subsítio da Cavidade Oral...</option>
          <option value="labios">Lábios</option>
          <option value="lingua">Língua (2/3 Anteriores)</option>
          <option value="assoalho">Assoalho de Boca</option>
          <option value="gengiva">Gengiva</option>
          <option value="palato_duro">Palato Duro</option>
          <option value="mucosa_bucal">Mucosa Jugal</option>
        </select>
      );
    }
    return null;
  };

  const getTOptions = () => organ === 'laringe' && subsite ? getLarynxTOptions(subsite) : organ === 'cavidade_oral' && subsite ? getOralCavityTOptions() : [];
  const getNOptions = () => organ === 'laringe' ? getLarynxNOptions() : organ === 'cavidade_oral' ? getOralCavityNOptions() : [];
  const getMOptions = () => organ === 'laringe' ? getLarynxMOptions() : organ === 'cavidade_oral' ? getOralCavityMOptions() : [];

  if (result) {
    return (
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-8 text-center border-t-8 border-[#00A0AF] animate-fade-in">
        <h2 className="text-4xl font-extrabold mb-2 text-[#00A0AF]">{result.stage}</h2>
        <p className="text-xl font-bold mb-6 text-slate-700">T{tValue.replace('t','')} N{nValue.replace('n','')} M{mValue.replace('m','')}</p>
        
        <div className="bg-slate-50 p-4 rounded-lg mb-8 text-left border border-slate-200">
          <h3 className="font-bold text-slate-700 mb-2 border-b pb-2">Topografia: {organ?.replace('_',' ')} ({subsite})</h3>
          <p className="text-slate-600 space-y-1 text-sm font-medium mt-2">{result.prognosis}</p>
        </div>
        
        <button 
          onClick={resetForm} 
          className="bg-[#00A0AF] hover:bg-[#00BCD4] text-white font-bold py-3 px-8 rounded-lg shadow-md transition-all">
          Realizar Novo Estadiamento
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6">
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-slate-100">
        <div className="mb-8 border-b border-slate-200 pb-6 text-center sm:text-left">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Painel de Estadiamento Oncológico TNM (AJCC 8ª Ed)</h2>
          <p className="text-slate-500 text-sm mb-4">Escopo atual do sistema: Fase 1 (Laringe e Cavidade Oral).</p>
          <input 
            type="text" 
            value={patientId}
            onChange={e => setPatientId(e.target.value)}
            placeholder="Nome / Registro do Paciente"
            className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-[#5CC6BA] focus:outline-none"
          />
        </div>

        {/* ÓRGÃO */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-slate-700 mb-4">Escolha a Topografia Principal:</label>
          <div className="flex gap-4 flex-wrap">
            <button
              onClick={() => handleOrganSelect('laringe')}
              className={`p-3 rounded-lg border-2 font-bold w-full sm:w-auto flex-1 ${organ === 'laringe' ? 'border-[#00A0AF] bg-[#e6f6f8] text-[#00A0AF]' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}
            >
              Laringe
            </button>
            <button
              onClick={() => handleOrganSelect('cavidade_oral')}
              className={`p-3 rounded-lg border-2 font-bold w-full sm:w-auto flex-1 ${organ === 'cavidade_oral' ? 'border-[#00A0AF] bg-[#e6f6f8] text-[#00A0AF]' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}
            >
              Cavidade Oral
            </button>
          </div>
        </div>

        {/* SUBSÍTIO E FORMS */}
        {organ && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Subsítio Anatômico:</label>
              {renderSubsites()}
            </div>

            {subsite && (
              <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 space-y-6">
                <div>
                  <label className="block text-md font-extrabold text-[#00A0AF] mb-2">T (Tumor Primário)</label>
                  <select value={tValue} onChange={e => setTValue(e.target.value)} className="w-full p-3 border border-slate-300 rounded font-medium outline-none focus:border-[#00A0AF]">
                    <option value="">Selecione o tamanho/extensão (T)...</option>
                    {getTOptions().map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-md font-extrabold text-[#00A0AF] mb-2">N (Linfonodo Regional)</label>
                  <select value={nValue} onChange={e => setNValue(e.target.value)} className="w-full p-3 border border-slate-300 rounded font-medium outline-none focus:border-[#00A0AF]">
                    <option value="">Selecione as metástases regionais (N)...</option>
                    {getNOptions().map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-md font-extrabold text-[#00A0AF] mb-2">M (Metástase à Distância)</label>
                  <select value={mValue} onChange={e => setMValue(e.target.value)} className="w-full p-3 border border-slate-300 rounded font-medium outline-none focus:border-[#00A0AF]">
                    <option value="">Selecione as metástases à distância (M)...</option>
                    {getMOptions().map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
                
                <div className="pt-4 border-t border-slate-200 text-center">
                    <button
                        onClick={calculateStage}
                        disabled={isSubmitting}
                        className="px-8 py-3 bg-[#00A0AF] hover:bg-[#00BCD4] text-white font-bold rounded-lg shadow transition-all w-full sm:w-auto"
                    >
                        {isSubmitting ? 'Calculando e Salvando Central...' : 'Agrupar Clínicamente (TNM)'}
                    </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* REFERÊNCIA ACADÊMICA */}
      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 shadow-sm text-xs text-slate-500 text-center">
        <p className="font-bold mb-1">Referência Científica Padrão-Ouro:</p>
        <p className="italic">Amin MB, Edge S, Greene F, Byrd DR, et al. AJCC Cancer Staging Manual. 8th ed. New York: Springer; 2017. ISBN-13: 978-3319406176</p>
      </div>
    </div>
  );
}
