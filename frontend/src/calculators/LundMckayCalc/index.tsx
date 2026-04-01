import { useState } from 'react';
import { API_BASE_URL } from '../../config';

const LUND_SINUSES = [
  { id: 'maxilar', label: 'Seio Maxilar', isOsteo: false },
  { id: 'etmoideAnt', label: 'Seio Etmoidal Anterior', isOsteo: false },
  { id: 'etmoidePos', label: 'Seio Etmoidal Posterior', isOsteo: false },
  { id: 'esfenoide', label: 'Seio Esfenoidal', isOsteo: false },
  { id: 'frontal', label: 'Seio Frontal', isOsteo: false },
  { id: 'ostiomeatal', label: 'Complexo Ostiomeatal', isOsteo: true }
];

interface Props { patientId: string; doctorId?: string; }

export default function LundMckayCalc({ patientId, doctorId }: Props) {
  const [rightSide, setRightSide] = useState<Record<string, number>>({});
  const [leftSide, setLeftSide] = useState<Record<string, number>>({});
  const [submittedResult, setSubmittedResult] = useState<{scoreLeft: number, scoreRight: number, total: number} | null>(null);
  const [copied, setCopied] = useState(false);

  const calculatePartial = (sideAnswers: Record<string, number>) =>
    Object.values(sideAnswers).reduce((acc, val) => acc + val, 0);

  const handleScoreChange = (side: 'L' | 'R', sinusId: string, value: number) => {
    if (side === 'L') setLeftSide(p => ({ ...p, [sinusId]: value }));
    else setRightSide(p => ({ ...p, [sinusId]: value }));
  };

  const handleSubmit = async () => {
    const scoreL = calculatePartial(leftSide);
    const scoreR = calculatePartial(rightSide);
    const scoreTotal = scoreL + scoreR;

    try {
      await fetch(`${API_BASE_URL}/api/results`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient_id: patientId || 'anon_lund',
          doctor_id: doctorId || null,
          calc_type: 'lund_mackay',
          score: scoreTotal,
          raw_answers: { left: leftSide, right: rightSide },
          hub_version: '1.3.0'
        })
      });
    } catch (e) { console.warn('FastAPI offline.', e); }
    finally { setSubmittedResult({ scoreLeft: scoreL, scoreRight: scoreR, total: scoreTotal }); }
  };

  const getInterpretation = (total: number) => {
    if (total <= 4) return { label: 'Doença Mínima / Normal', color: '#16a34a' };
    if (total <= 8) return { label: 'Doença Leve', color: '#ca8a04' };
    if (total <= 16) return { label: 'Doença Moderada', color: '#ea580c' };
    return { label: 'Doença Grave (Extensa)', color: '#dc2626' };
  };

  const handleCopy = () => {
    if (!submittedResult) return;
    const interp = getInterpretation(submittedResult.total);
    const text = `OTTO CALC-HUB — Lund-Mackay (TC de Seios)\nPaciente: ${patientId || 'Não informado'}\nScore Total: ${submittedResult.total}/24\nLado Direito: ${submittedResult.scoreRight}/12\nLado Esquerdo: ${submittedResult.scoreLeft}/12\nInterpretação: ${interp.label}\nData: ${new Date().toLocaleDateString('pt-BR')}`;
    navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2500); });
  };

  if (submittedResult) {
    const interp = getInterpretation(submittedResult.total);
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-4 text-center border-t-8" style={{borderColor: interp.color}}>
        <h2 className="text-3xl font-extrabold mb-2" style={{color: interp.color}}>
          Lund-Mackay Total: {submittedResult.total} / 24
        </h2>
        {patientId && <p className="text-slate-500 text-sm mb-2">Paciente: <strong>{patientId}</strong></p>}
        <p className="text-lg font-bold mb-4 text-slate-700">{interp.label}</p>
        <div className="flex justify-center gap-8 mb-6 text-slate-600 font-semibold text-sm">
          <p>🔵 Lado Direito: <strong>{submittedResult.scoreRight}</strong> / 12</p>
          <p>🟢 Lado Esquerdo: <strong>{submittedResult.scoreLeft}</strong> / 12</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={handleCopy} className={`py-3 px-6 rounded-lg font-bold border-2 transition-all ${copied ? 'bg-green-500 text-white border-green-500' : 'bg-white text-slate-600 border-slate-300 hover:border-[#00A0AF]'}`}>
            {copied ? '✅ Copiado!' : '📋 Copiar Resultado'}
          </button>
          <button onClick={() => { setLeftSide({}); setRightSide({}); setSubmittedResult(null); }} className="bg-[#00A0AF] hover:bg-[#00BCD4] text-white font-bold py-3 px-8 rounded-lg shadow-md transition-all">
            Nova Tomografia
          </button>
        </div>
      </div>
    );
  }

  const SidePanel = ({ side, state, label, color }: { side: 'L' | 'R'; state: Record<string, number>; label: string; color: string }) => (
    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
      <h3 className="text-lg font-bold text-center mb-5 py-2 rounded" style={{backgroundColor: `${color}20`, color}}>{label}</h3>
      {LUND_SINUSES.map((sinus) => {
        const val = state[sinus.id];
        const btnColor = side === 'R' ? 'blue' : 'green';
        const activeClass = `bg-${btnColor}-600 text-white border-${btnColor}-600 shadow`;
        const inactiveClass = `bg-white text-${btnColor}-700 border-${btnColor === 'blue' ? 'blue' : 'green'}-200 hover:border-${btnColor}-400`;
        return (
          <div key={sinus.id} className="mb-4">
            <label className="block text-sm font-bold text-slate-700 mb-2">{sinus.label}</label>
            <div className="flex gap-2">
              {[0, ...(!sinus.isOsteo ? [1] : []), 2].map(num => (
                <button key={num} onClick={() => handleScoreChange(side, sinus.id, num)}
                  className={`flex-1 py-2 sm:py-3 rounded-lg text-xs sm:text-sm font-bold border-2 transition-all ${val === num ? activeClass : inactiveClass}`}>
                  {num === 0 ? '0 (Normal)' : num === 1 ? '1 (Parcial)' : '2 (Total)'}
                </button>
              ))}
            </div>
          </div>
        );
      })}
      <div className="mt-4 text-center text-sm font-bold text-slate-600">
        Subtotal {label}: <span className="text-[#00A0AF] text-lg">{calculatePartial(state)}</span> / 12
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6">
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-slate-100">
        <div className="mb-8 border-b border-slate-200 pb-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-1">Escore Tomográfico Lund-Mackay</h2>
          <p className="text-slate-500 text-sm mb-2">Graduação radiológica do velamento rinossinusal em TC de face. Score máximo: 24.</p>
          {patientId && <p className="mt-2 text-sm font-semibold text-[#00A0AF] bg-[#e6f6f8] px-3 py-1.5 rounded-full inline-block">👤 Paciente: {patientId}</p>}
        </div>

        <div className="bg-sky-50 border border-sky-200 rounded-xl p-5 mb-6 text-sm text-sky-900 shadow-sm transition-all hover:shadow-md">
          <p className="mb-2"><strong className="text-sky-700 uppercase tracking-wide text-[10px] sm:text-xs">🎯 Para que serve:</strong><br/> <span className="opacity-90 font-medium">Dá uma nota para a gravidade da sinusite crônica usando a Tomografia.</span></p>
          <p><strong className="text-sky-700 uppercase tracking-wide text-[10px] sm:text-xs">💡 Como aplicar:</strong><br/> <span className="opacity-90 font-medium">Olhe os cortes da TC e pontue se cada seio da face está limpo, parcialmente velado ou todo fechado.</span></p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <SidePanel side="R" state={rightSide} label="Lado Direito" color="#2563eb" />
          <SidePanel side="L" state={leftSide} label="Lado Esquerdo" color="#16a34a" />
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 border-t border-slate-200 pt-6">
          <div className="text-center text-sm font-bold text-slate-600">
            Score Total: <span className="text-[#00A0AF] text-2xl font-extrabold">
              {calculatePartial(rightSide) + calculatePartial(leftSide)}
            </span> / 24
          </div>
          <button 
            disabled={Object.keys(rightSide).length < 6 || Object.keys(leftSide).length < 6}
            onClick={handleSubmit} 
            className="px-8 py-3 bg-[#00A0AF] hover:bg-[#00BCD4] text-white font-bold rounded-lg shadow transition-all disabled:opacity-50"
          >
            Calcular Lund-Mackay
          </button>
        </div>
      </div>

      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs text-slate-500 text-center">
        <p className="font-bold mb-1">Referência Científica Padrão-Ouro:</p>
        <p className="italic">Lund VJ, Mackay IS. Staging in rhinosinusitis. Rhinology. 1993;31(4):183-184. PMID: 8140385.</p>
      </div>
    </div>
  );
}
