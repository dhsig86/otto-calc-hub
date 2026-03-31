import { useState } from 'react';
import { getLarynxTOptions, getLarynxNOptions, getLarynxMOptions, calculateLarynxStage, getLarynxPrognosis } from './larynxLogic';
import { getOralCavityTOptions, getOralCavityNOptions, getOralCavityMOptions, calculateOralCavityStage, getOralCavityPrognosis } from './oralCavityLogic';
import { getPharynxTOptions, getPharynxNOptions, getPharynxMOptions, calculatePharynxStage, getPharynxPrognosis } from './pharynxLogic';
import { getThyroidTOptions, getThyroidNOptions, getThyroidMOptions, calculateThyroidStage, getThyroidPrognosis } from './thyroidLogic';
import { getSalivaryTOptions, getSalivaryNOptions, getSalivaryMOptions, calculateSalivaryStage, getSalivaryPrognosis } from './salivaryLogic';

type Organ = 'laringe' | 'cavidade_oral' | 'faringe' | 'tireoide' | 'glandulas_salivares' | null;
interface Props { patientId: string; }

export default function TnmCalc({ patientId }: Props) {
  const [organ, setOrgan] = useState<Organ>(null);
  const [subsite, setSubsite] = useState<string>('');
  
  // States Universais TNM
  const [tValue, setTValue] = useState<string>('');
  const [nValue, setNValue] = useState<string>('');
  const [mValue, setMValue] = useState<string>('');
  
  // States Específicos
  const [hpv, setHpv] = useState<string>('negativo');
  const [ageCutoff, setAgeCutoff] = useState<string>('maior_55');
  const [histology, setHistology] = useState<string>('papilifero');
  
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [result, setResult] = useState<{stage: string, prognosis: string} | null>(null);
  const [copied, setCopied] = useState(false);

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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4 mt-2">
          {[{v:'glote', l:'Glote'}, {v:'supraglote', l:'Supraglote'}, {v:'subglote', l:'Subglote'}].map(opt => (
            <button key={opt.v} onClick={() => { setSubsite(opt.v); setTValue(''); }} className={`p-3 rounded-lg border-2 text-sm font-bold transition-all ${subsite === opt.v ? 'bg-[#00A0AF] text-white border-[#00A0AF] shadow' : 'bg-white text-slate-600 border-slate-200 hover:border-[#5CC6BA]'}`}>{opt.l}</button>
          ))}
        </div>
      );
    } else if (organ === 'cavidade_oral') {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4 mt-2">
          {[{v:'labios',l:'Lábios'},{v:'lingua',l:'Língua (2/3 Ant)'},{v:'assoalho',l:'Assoalho da Boca'},{v:'gengiva',l:'Gengiva'},{v:'palato_duro',l:'Palato Duro'},{v:'mucosa_bucal',l:'Mucosa Jugal'}].map(opt => (
            <button key={opt.v} onClick={() => { setSubsite(opt.v); setTValue(''); }} className={`p-3 rounded-lg border-2 text-sm font-bold transition-all ${subsite === opt.v ? 'bg-[#00A0AF] text-white border-[#00A0AF] shadow' : 'bg-white text-slate-600 border-slate-200 hover:border-[#5CC6BA]'}`}>{opt.l}</button>
          ))}
        </div>
      );
    } else if (organ === 'faringe') {
      return (
        <div className="space-y-4 mb-4 mt-2">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
             {[{v:'nasofaringe',l:'Nasofaringe'},{v:'orofaringe',l:'Orofaringe'},{v:'hipofaringe',l:'Hipofaringe'}].map(opt => (
              <button key={opt.v} onClick={() => { setSubsite(opt.v); setTValue(''); }} className={`p-3 rounded-lg border-2 text-sm font-bold transition-all ${subsite === opt.v ? 'bg-[#00A0AF] text-white border-[#00A0AF] shadow' : 'bg-white text-slate-600 border-slate-200 hover:border-[#5CC6BA]'}`}>{opt.l}</button>
             ))}
          </div>
          {subsite === 'orofaringe' && (
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200 mt-4">
               <label className="block text-sm font-bold text-orange-800 mb-3">Status p16 (Indutor de HPV):</label>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                 <button onClick={() => { setHpv('negativo'); setNValue(''); }} className={`p-3 rounded-lg border-2 text-sm font-bold transition-all ${hpv === 'negativo' ? 'bg-orange-500 text-white border-orange-500 shadow' : 'bg-white text-orange-700 border-orange-200 hover:border-orange-400'}`}>Negativo (Clássico AJCC)</button>
                 <button onClick={() => { setHpv('positivo'); setNValue(''); }} className={`p-3 rounded-lg border-2 text-sm font-bold transition-all ${hpv === 'positivo' ? 'bg-orange-500 text-white border-orange-500 shadow' : 'bg-white text-orange-700 border-orange-200 hover:border-orange-400'}`}>Positivo (Diferenciado HPV+)</button>
               </div>
            </div>
          )}
        </div>
      );
    } else if (organ === 'glandulas_salivares') {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4 mt-2">
          {[{v:'parotida',l:'Parótida'},{v:'submandibular',l:'Submandibular'},{v:'sublingual',l:'Sublingual'},{v:'glandulasMenores',l:'Gld. Menores'}].map(opt => (
            <button key={opt.v} onClick={() => { setSubsite(opt.v); setTValue(''); }} className={`p-3 rounded-lg border-2 text-sm font-bold transition-all ${subsite === opt.v ? 'bg-[#00A0AF] text-white border-[#00A0AF] shadow' : 'bg-white text-slate-600 border-slate-200 hover:border-[#5CC6BA]'}`}>{opt.l}</button>
          ))}
        </div>
      );
    } else if (organ === 'tireoide') {
      return (
        <div className="space-y-4 mb-4 mt-2">
           <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
               <label className="block text-sm font-bold text-blue-800 mb-3">Tipo Histológico:</label>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
                 {[{v:'papilifero',l:'Papilífero (Diferenciado)'},{v:'folicular',l:'Folicular (Diferenciado)'},{v:'medular',l:'Medular'},{v:'anaplasico',l:'Anaplásico (Indiferenc.)'}].map(opt => (
                   <button key={opt.v} onClick={() => { setHistology(opt.v); setTValue(''); }} className={`p-3 rounded-lg border-2 text-xs sm:text-sm font-bold transition-all ${histology === opt.v ? 'bg-blue-600 text-white border-blue-600 shadow' : 'bg-white text-blue-700 border-blue-200 hover:border-blue-400'}`}>{opt.l}</button>
                 ))}
               </div>

               {(histology === 'papilifero' || histology === 'folicular') && (
                 <>
                   <label className="block text-sm font-bold text-blue-800 mb-3">Idade do Paciente no Diagnóstico (Corte AJCC 8):</label>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                     <button onClick={() => setAgeCutoff('maior_55')} className={`p-3 rounded-lg border-2 text-sm font-bold transition-all ${ageCutoff === 'maior_55' ? 'bg-blue-600 text-white border-blue-600 shadow' : 'bg-white text-blue-700 border-blue-200 hover:border-blue-400'}`}>55 anos ou mais (≥ 55)</button>
                     <button onClick={() => setAgeCutoff('menor_55')} className={`p-3 rounded-lg border-2 text-sm font-bold transition-all ${ageCutoff === 'menor_55' ? 'bg-blue-600 text-white border-blue-600 shadow' : 'bg-white text-blue-700 border-blue-200 hover:border-blue-400'}`}>Menos de 55 anos (&lt; 55)</button>
                   </div>
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

  const handleCopy = () => {
    if (!result) return;
    const text = `OTTO CALC-HUB — Estadiamento Oncológico TNM (AJCC 8ª Ed)
Paciente: ${patientId || 'Não informado'}
Topografia: ${organ?.replace('_', ' ').toUpperCase()} ${subsite ? `(${subsite.toUpperCase()})` : ''}
Estágio: ${result.stage}
T: ${tValue} | N: ${nValue} | M: ${mValue}
${organ === 'faringe' && subsite === 'orofaringe' ? `p16/HPV: ${hpv.toUpperCase()}` : ''}${organ === 'tireoide' ? `Histologia: ${histology} | Idade: ${ageCutoff === 'menor_55' ? '< 55 anos' : '≥ 55 anos'}` : ''}
Prognóstico: ${result.prognosis}
Data: ${new Date().toLocaleDateString('pt-BR')}`;
    navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2500); });
  };

  if (result) {
    return (
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-4 text-center border-t-8 border-[#00A0AF]">
        <h2 className="text-4xl font-extrabold mb-2 text-[#00A0AF]">{result.stage}</h2>
        {patientId && <p className="text-slate-500 text-sm mb-2">Paciente: <strong>{patientId}</strong></p>}
        <p className="text-xl font-bold mb-6 text-slate-700">T{tValue.replace('t','')} N{nValue.replace('n','')} M{mValue.replace('m','')}</p>
        
        <div className="bg-slate-50 p-4 rounded-lg mb-6 text-left border border-slate-200">
          <h3 className="font-bold text-slate-700 mb-2 border-b pb-2">Topografia: {organ?.replace('_',' ').toUpperCase()} {subsite ? `(${subsite.toUpperCase()})` : ''}</h3>
          {organ === 'faringe' && subsite === 'orofaringe' && <p className="text-xs font-bold text-orange-600">Marcador p16: {hpv.toUpperCase()}</p>}
          {organ === 'tireoide' && <p className="text-xs font-bold text-blue-600">Histologia: {histology.toUpperCase()} | Idade: {ageCutoff === 'menor_55' ? '< 55 anos' : '≥ 55 anos'}</p>}
          <p className="text-slate-600 text-sm font-medium mt-3">{result.prognosis}</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={handleCopy} className={`py-3 px-6 rounded-lg font-bold border-2 transition-all ${copied ? 'bg-green-500 text-white border-green-500' : 'bg-white text-slate-600 border-slate-300 hover:border-[#00A0AF]'}`}>
            {copied ? '✅ Copiado!' : '📋 Copiar Estadiamento'}
          </button>
          <button onClick={resetForm} className="bg-[#00A0AF] hover:bg-[#00BCD4] text-white font-bold py-3 px-8 rounded-lg shadow-md transition-all">
            Novo Estadiamento
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6">
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-slate-100">
        <div className="mb-8 border-b border-slate-200 pb-6 text-center sm:text-left">
          <h2 className="text-2xl font-bold text-slate-800 mb-1">Estadiamento Oncológico TNM (AJCC 8ª Ed)</h2>
          <p className="text-slate-500 text-sm mb-2">Selecione a região cérvico-facial para carregar as árvores de estadiamento validadas.</p>
          {patientId && <p className="mt-2 text-sm font-semibold text-[#00A0AF] bg-[#e6f6f8] px-3 py-1.5 rounded-full inline-block">👤 Paciente: {patientId}</p>}
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
                  <label className="block text-md font-extrabold text-[#00A0AF] mb-3">T (Tumor Primário)</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {getTOptions().map(opt => (
                      <button key={opt.value} onClick={() => setTValue(opt.value)} className={`text-left p-3 rounded-lg border-2 text-sm font-medium transition-all ${tValue === opt.value ? 'bg-[#00A0AF] text-white border-[#00A0AF] shadow-md' : 'bg-white text-slate-700 border-slate-200 hover:border-[#5CC6BA] hover:bg-slate-50'}`}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-md font-extrabold text-[#00A0AF] mb-3">N (Linfonodo Regional)</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {getNOptions().map(opt => (
                      <button key={opt.value} onClick={() => setNValue(opt.value)} className={`text-left p-3 rounded-lg border-2 text-sm font-medium transition-all ${nValue === opt.value ? 'bg-[#00A0AF] text-white border-[#00A0AF] shadow-md' : 'bg-white text-slate-700 border-slate-200 hover:border-[#5CC6BA] hover:bg-slate-50'}`}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-md font-extrabold text-[#00A0AF] mb-3">M (Metástase à Distância)</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {getMOptions().map(opt => (
                      <button key={opt.value} onClick={() => setMValue(opt.value)} className={`text-left p-3 rounded-lg border-2 text-sm font-medium transition-all ${mValue === opt.value ? 'bg-[#00A0AF] text-white border-[#00A0AF] shadow-md' : 'bg-white text-slate-700 border-slate-200 hover:border-[#5CC6BA] hover:bg-slate-50'}`}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
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
