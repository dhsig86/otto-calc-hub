import { useState } from 'react';

const LUND_SINUSES = [
  { id: 'maxilar', label: 'Seio Maxilar', max: 2 },
  { id: 'etmoideAnt', label: 'Seio Etmoidal Anterior', max: 2 },
  { id: 'etmoidePos', label: 'Seio Etmoidal Posterior', max: 2 },
  { id: 'esfenoide', label: 'Seio Esfenoidal', max: 2 },
  { id: 'frontal', label: 'Seio Frontal', max: 2 },
  { id: 'ostiomeatal', label: 'Complexo Ostiomeatal', max: 2, isOsteo: true }
];

export default function LundMckayCalc() {
  const [rightSide, setRightSide] = useState<Record<string, number>>({});
  const [leftSide, setLeftSide] = useState<Record<string, number>>({});
  const [patientId, setPatientId] = useState<string>('');
  const [submittedResult, setSubmittedResult] = useState<{scoreLeft: number, scoreRight: number, total: number} | null>(null);

  const calculatePartial = (sideAnswers: Record<string, number>) => {
    return Object.values(sideAnswers).reduce((acc, val) => acc + val, 0);
  };

  const handleScoreChange = (side: 'L' | 'R', sinusId: string, value: number) => {
    if (side === 'L') setLeftSide(p => ({ ...p, [sinusId]: value }));
    else setRightSide(p => ({ ...p, [sinusId]: value }));
  };

  const handleSubmit = async () => {
    const scoreL = calculatePartial(leftSide);
    const scoreR = calculatePartial(rightSide);
    const scoreTotal = scoreL + scoreR;

    const payload = {
      patient_id: patientId || "anon_lund",
      calc_type: "lund_mackay",
      score: scoreTotal,
      raw_answers: { left: leftSide, right: rightSide }
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
      setSubmittedResult({ scoreLeft: scoreL, scoreRight: scoreR, total: scoreTotal });
    }
  };

  if (submittedResult) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-8 text-center border-t-8 border-[#00A0AF]">
        <h2 className="text-3xl font-extrabold mb-4 text-[#00A0AF]">
          Lund-Mackay Total: {submittedResult.total} / 24
        </h2>
        <div className="flex justify-center gap-8 mb-6 text-slate-700 font-bold">
          <p>Lado Direito: {submittedResult.scoreRight} / 12</p>
          <p>Lado Esquerdo: {submittedResult.scoreLeft} / 12</p>
        </div>
        <button 
          onClick={() => { setLeftSide({}); setRightSide({}); setSubmittedResult(null); setPatientId(''); }} 
          className="bg-[#00A0AF] hover:bg-[#00BCD4] text-white font-bold py-3 px-8 rounded-lg shadow-md transition-all">
          Avaliar Nova Tomografia
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6">
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-slate-100">
        <div className="mb-8 border-b border-slate-200 pb-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Escore Tomográfico Lund-Mackay</h2>
          <p className="text-slate-500 text-sm mb-4">Graduação do nível de velamento tomográfico rinossinusal.</p>
          <input 
            type="text" 
            value={patientId}
            onChange={e => setPatientId(e.target.value)}
            placeholder="Nome / Registro do Paciente"
            className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-[#5CC6BA] focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* LADO DIREITO */}
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <h3 className="text-xl font-bold text-center mb-6 py-2 bg-blue-100 text-blue-800 rounded">Lado Direito</h3>
            {LUND_SINUSES.map((sinus) => {
              const val = rightSide[sinus.id] || 0;
              return (
                <div key={`R_${sinus.id}`} className="mb-4">
                  <label className="block text-sm font-bold text-slate-700 mb-1">{sinus.label}</label>
                  <select 
                    value={val} 
                    onChange={e => handleScoreChange('R', sinus.id, parseInt(e.target.value, 10))}
                    className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-[#00A0AF] bg-white outline-none"
                  >
                    <option value="0">0 - Normal</option>
                    {!sinus.isOsteo && <option value="1">1 - Velamento Parcial</option>}
                    <option value="2">2 - Velamento Total</option>
                  </select>
                </div>
              );
            })}
          </div>

          {/* LADO ESQUERDO */}
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <h3 className="text-xl font-bold text-center mb-6 py-2 bg-green-100 text-green-800 rounded">Lado Esquerdo</h3>
            {LUND_SINUSES.map((sinus) => {
              const val = leftSide[sinus.id] || 0;
              return (
                <div key={`L_${sinus.id}`} className="mb-4">
                  <label className="block text-sm font-bold text-slate-700 mb-1">{sinus.label}</label>
                  <select 
                    value={val} 
                    onChange={e => handleScoreChange('L', sinus.id, parseInt(e.target.value, 10))}
                    className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-[#00A0AF] bg-white outline-none"
                  >
                    <option value="0">0 - Normal</option>
                    {!sinus.isOsteo && <option value="1">1 - Velamento Parcial</option>}
                    <option value="2">2 - Velamento Total</option>
                  </select>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-center border-t border-slate-200 pt-6">
          <button
            onClick={handleSubmit}
            className="px-8 py-3 bg-[#00A0AF] hover:bg-[#00BCD4] text-white font-bold rounded-lg shadow transition-all"
          >
            Calcular Lund-Mackay
          </button>
        </div>
      </div>

      {/* REFERÊNCIA ACADÊMICA */}
      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 shadow-sm text-xs text-slate-500 text-center">
        <p className="font-bold mb-1">Referência Científica Padrão-Ouro:</p>
        <p className="italic">Lund VJ, Mackay IS. Staging in rhinosinusitis. Rhinology. 1993;31(4):183-184. PMID: 8140385.</p>
      </div>
    </div>
  );
}
