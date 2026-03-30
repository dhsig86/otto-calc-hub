import { useState } from 'react';
import { getLarynxTOptions, getLarynxNOptions, getLarynxMOptions, calculateLarynxStage, getLarynxPrognosis } from './larynxLogic';
import { getOralCavityTOptions, getOralCavityNOptions, getOralCavityMOptions, calculateOralCavityStage, getOralCavityPrognosis } from './oralCavityLogic';
import { getPharynxTOptions, getPharynxNOptions, getPharynxMOptions, calculatePharynxStage, getPharynxPrognosis } from './pharynxLogic';
import { getThyroidTOptions, getThyroidNOptions, getThyroidMOptions, calculateThyroidStage, getThyroidPrognosis } from './thyroidLogic';
import { getSalivaryTOptions, getSalivaryNOptions, getSalivaryMOptions, calculateSalivaryStage, getSalivaryPrognosis } from './salivaryLogic';

type Organ = 'laringe' | 'cavidade_oral' | 'faringe' | 'tireoide' | 'glandulas_salivares' | null;

export default function TnmCalc() {
  const [organ, setOrgan] = useState<Organ>(null);
  const [subsite, setSubsite] = useState<string>('');
  
  // States Universais TNM
  const [tValue, setTValue] = useState<string>('');
  const [nValue, setNValue] = useState<string>('');
  const [mValue, setMValue] = useState<string>('');
  
  // States Específicos
  const [hpv, setHpv] = useState<string>('negativo'); // Faringe (Orofaringe)
  const [ageCutoff, setAgeCutoff] = useState<string>('maior_55'); // Tireoide
  const [histology, setHistology] = useState<string>('papilifero'); // Tireoide
  
  const [patientId, setPatientId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [result, setResult] = useState<{stage: string, prognosis: string} | null>(null);

  const resetForm = () => {
    setOrgan(null);
    setSubsite('');
    setTValue('');
    setNValue('');
    setMValue('');
    setHpv('negativo');
    setAgeCutoff('maior_55');
    setHistology('papilifero');
    setResult(null);
  };

  const handleOrganSelect = (selected: Organ) => {
    resetForm();
    setOrgan(selected);
  };

  const calculateStage = () => {
    if (!tValue || !nValue || !mValue) {
      alert("Por favor, preencha T, N e M.");
      return;
    }
    if ((organ !== 'tireoide' && organ !== 'glandulas_salivares') && !subsite) {
      alert("Por favor, selecione a sublocalização.");
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
    } else if (organ === 'faringe') {
      stage = calculatePharynxStage(tValue, nValue, mValue, subsite, hpv);
      prognosis = getPharynxPrognosis(subsite, stage);
    } else if (organ === 'tireoide') {
      stage = calculateThyroidStage(tValue, nValue, mValue, histology, ageCutoff);
      prognosis = getThyroidPrognosis(histology, stage);
    } else if (organ === 'glandulas_salivares') {
      stage = calculateSalivaryStage(tValue, nValue, mValue);
      prognosis = getSalivaryPrognosis(stage);
    }

    submitToBackend(stage, prognosis);
  };

  const submitToBackend = async (stage: string, prognosis: string) => {
    setIsSubmitting(true);
    const payload = {
      patient_id: patientId || "anon_tnm",
      calc_type: `tnm_${organ}`,
      score: 0, 
      raw_answers: { organ, subsite, T: tValue, N: nValue, M: mValue, hpv, ageCutoff, histology, stage }
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

  const renderSubsitesAndSpecials = () => {
    if (organ === 'laringe') {
      return (
        <select value={subsite} onChange={e => { setSubsite(e.target.value); setTValue(''); }} className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-[#00A0AF] outline-none mb-4">
          <option value="">Selecione o Subsítio da Laringe...</option>
          <option value="glote">Glote</option>
          <option value="supraglote">Supraglote</option>
          <option value="subglote">Subglote</option>
        </select>
      );
    } else if (organ === 'cavidade_oral') {
      return (
        <select value={subsite} onChange={e => { setSubsite(e.target.value); setTValue(''); }} className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-[#00A0AF] outline-none mb-4">
          <option value="">Selecione o Subsítio da Cavidade Oral...</option>
          <option value="labios">Lábios</option>
          <option value="lingua">Língua (2/3 Anteriores)</option>
          <option value="assoalho">Assoalho de Boca</option>
          <option value="gengiva">Gengiva</option>
          <option value="palato_duro">Palato Duro</option>
          <option value="mucosa_bucal">Mucosa Jugal</option>
        </select>
      );
    } else if (organ === 'faringe') {
      return (
        <div className="space-y-4 mb-4">
          <select value={subsite} onChange={e => { setSubsite(e.target.value); setTValue(''); }} className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-[#00A0AF] outline-none">
            <option value="">Selecione o Subsítio da Faringe...</option>
            <option value="nasofaringe">Nasofaringe</option>
            <option value="orofaringe">Orofaringe</option>
            <option value="hipofaringe">Hipofaringe</option>
          </select>
          {subsite === 'orofaringe' && (
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
               <label className="block text-sm font-bold text-orange-800 mb-2">Status p16 (Indutor de HPV):</label>
               <select value={hpv} onChange={e => { setHpv(e.target.value); setNValue(''); }} className="w-full p-2 border border-orange-300 rounded outline-none bg-white">
                  <option value="negativo">p16 Negativo (Comportamento Clássico AJCC)</option>
                  <option value="positivo">p16 Positivo (Estadiamento Diferenciado HPV+)</option>
               </select>
            </div>
          )}
        </div>
      );
    } else if (organ === 'glandulas_salivares') {
      return (
        <select value={subsite} onChange={e => { setSubsite(e.target.value); setTValue(''); }} className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-[#00A0AF] outline-none mb-4">
          <option value="">Selecione a Glândula Base...</option>
          <option value="parotida">Parótida</option>
          <option value="submandibular">Submandibular</option>
          <option value="sublingual">Sublingual</option>
          <option value="glandulasMenores">Glândulas Salivares Menores</option>
        </select>
      );
    } else if (organ === 'tireoide') {
      return (
        <div className="space-y-4 mb-4">
           <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
               <label className="block text-sm font-bold text-blue-800 mb-2">Tipo Histológico:</label>
               <select value={histology} onChange={e => { setHistology(e.target.value); setTValue(''); }} className="w-full p-2 mb-4 border border-blue-300 rounded outline-none bg-white">
                  <option value="papilifero">Papilífero (Diferenciado)</option>
                  <option value="folicular">Folicular (Diferenciado)</option>
                  <option value="medular">Medular</option>
                  <option value="anaplasico">Anaplásico (Indiferenciado)</option>
               </select>

               {(histology === 'papilifero' || histology === 'folicular') && (
                 <>
                   <label className="block text-sm font-bold text-blue-800 mb-2">Idade do Paciente no Diagnóstico (Corte AJCC 8):</label>
                   <select value={ageCutoff} onChange={e => setAgeCutoff(e.target.value)} className="w-full p-2 border border-blue-300 rounded outline-none bg-white">
                      <option value="maior_55">55 anos ou mais (≥ 55)</option>
                      <option value="menor_55">Menos de 55 anos (&lt; 55)</option>
                   </select>
                 </>
               )}
            </div>
        </div>
      );
    }
    return null;
  };

  const getTOptions = () => {
    if (organ === 'laringe') return subsite ? getLarynxTOptions(subsite) : [];
    if (organ === 'cavidade_oral') return getOralCavityTOptions();
    if (organ === 'faringe') return subsite ? getPharynxTOptions(subsite) : [];
    if (organ === 'tireoide') return getThyroidTOptions();
    if (organ === 'glandulas_salivares') return getSalivaryTOptions();
    return [];
  };
  const getNOptions = () => {
    if (organ === 'laringe') return getLarynxNOptions();
    if (organ === 'cavidade_oral') return getOralCavityNOptions();
    if (organ === 'faringe') return getPharynxNOptions(subsite, hpv);
    if (organ === 'tireoide') return getThyroidNOptions();
    if (organ === 'glandulas_salivares') return getSalivaryNOptions();
    return [];
  };
  const getMOptions = () => {
    if (organ === 'laringe') return getLarynxMOptions();
    if (organ === 'cavidade_oral') return getOralCavityMOptions();
    if (organ === 'faringe') return getPharynxMOptions();
    if (organ === 'tireoide') return getThyroidMOptions();
    if (organ === 'glandulas_salivares') return getSalivaryMOptions();
    return [];
  };

  if (result) {
    return (
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-8 text-center border-t-8 border-[#00A0AF] animate-fade-in">
        <h2 className="text-4xl font-extrabold mb-2 text-[#00A0AF]">{result.stage}</h2>
        <p className="text-xl font-bold mb-6 text-slate-700">T{tValue.replace('t','')} N{nValue.replace('n','')} M{mValue.replace('m','')}</p>
        
        <div className="bg-slate-50 p-4 rounded-lg mb-8 text-left border border-slate-200">
          <h3 className="font-bold text-slate-700 mb-2 border-b pb-2">Topografia: {organ?.replace('_',' ').toUpperCase()} {subsite ? `(${subsite.toUpperCase()})` : ''}</h3>
          
          {organ === 'faringe' && subsite === 'orofaringe' && <p className="text-xs font-bold text-orange-600">Marcador p16: {hpv.toUpperCase()}</p>}
          {organ === 'tireoide' && <p className="text-xs font-bold text-blue-600">Histologia: {histology.toUpperCase()} | Idade: {ageCutoff === 'menor_55' ? '< 55 anos' : '≥ 55 anos'}</p>}
          
          <p className="text-slate-600 space-y-1 text-sm font-medium mt-3">{result.prognosis}</p>
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
          <p className="text-slate-500 text-sm mb-4">Escolha a região cérvico-facial para ativar as árvores lógicas oficiais de estadiamento.</p>
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
          <label className="block text-sm font-semibold text-slate-700 mb-4">Topografia Principal:</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <button onClick={() => handleOrganSelect('laringe')} className={`p-3 rounded-lg border-2 font-bold text-sm ${organ === 'laringe' ? 'border-[#00A0AF] bg-[#e6f6f8] text-[#00A0AF]' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}>Laringe</button>
            <button onClick={() => handleOrganSelect('cavidade_oral')} className={`p-3 rounded-lg border-2 font-bold text-sm ${organ === 'cavidade_oral' ? 'border-[#00A0AF] bg-[#e6f6f8] text-[#00A0AF]' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}>Cavidade Oral</button>
            <button onClick={() => handleOrganSelect('faringe')} className={`p-3 rounded-lg border-2 font-bold text-sm ${organ === 'faringe' ? 'border-[#00A0AF] bg-[#e6f6f8] text-[#00A0AF]' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}>Faringe</button>
            <button onClick={() => handleOrganSelect('tireoide')} className={`p-3 rounded-lg border-2 font-bold text-sm ${organ === 'tireoide' ? 'border-[#00A0AF] bg-[#e6f6f8] text-[#00A0AF]' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}>Tireoide</button>
            <button onClick={() => handleOrganSelect('glandulas_salivares')} className={`p-3 rounded-lg border-2 font-bold text-sm ${organ === 'glandulas_salivares' ? 'border-[#00A0AF] bg-[#e6f6f8] text-[#00A0AF]' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}>Gld. Salivares</button>
          </div>
        </div>

        {/* SUBSÍTIO E FORMS */}
        {organ && (
          <div className="space-y-6 animate-fade-in">
            {renderSubsitesAndSpecials()}

            {((organ === 'tireoide' || organ === 'glandulas_salivares') || subsite) && (
              <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 space-y-6">
                <div>
                  <label className="block text-md font-extrabold text-[#00A0AF] mb-2">T (Tumor Primário)</label>
                  <select value={tValue} onChange={e => setTValue(e.target.value)} className="w-full p-3 border border-slate-300 rounded text-sm md:text-base font-medium outline-none focus:border-[#00A0AF]">
                    <option value="">Selecione o tamanho/extensão (T)...</option>
                    {getTOptions().map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-md font-extrabold text-[#00A0AF] mb-2">N (Linfonodo Regional)</label>
                  <select value={nValue} onChange={e => setNValue(e.target.value)} className="w-full p-3 border border-slate-300 rounded text-sm md:text-base font-medium outline-none focus:border-[#00A0AF]">
                    <option value="">Selecione as metástases regionais (N)...</option>
                    {getNOptions().map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-md font-extrabold text-[#00A0AF] mb-2">M (Metástase à Distância)</label>
                  <select value={mValue} onChange={e => setMValue(e.target.value)} className="w-full p-3 border border-slate-300 rounded text-sm md:text-base font-medium outline-none focus:border-[#00A0AF]">
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
