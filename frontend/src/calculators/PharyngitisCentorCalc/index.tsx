import { useState } from 'react';
import { API_BASE_URL } from '../../config';
import { getCentorClassification, REFERENCE_CENTOR } from './logic';

interface Props { patientId: string; doctorId?: string; }

export default function PharyngitisCentorCalc({ patientId, doctorId }: Props) {
  // Estados para as 5 variaveis
  const [age, setAge] = useState<number | null>(null);
  const [temp, setTemp] = useState<number | null>(null);
  const [cough, setCough] = useState<number | null>(null); // Tosse: Nao=1, Sim=0
  const [nodes, setNodes] = useState<number | null>(null);
  const [exudate, setExudate] = useState<number | null>(null);

  const [result, setResult] = useState<{ score: number; label: string; color: string; recommendation: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const totalAnswered = (age !== null ? 1 : 0) + (temp !== null ? 1 : 0) + (cough !== null ? 1 : 0) + (nodes !== null ? 1 : 0) + (exudate !== null ? 1 : 0);

  const handleSubmit = async () => {
    if (totalAnswered < 5) return;
    
    const score = age! + temp! + cough! + nodes! + exudate!;
    const cl = getCentorClassification(score);
    setResult({ score, ...cl });
    try {
      await fetch(`${API_BASE_URL}/api/results`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patient_id: patientId || 'anon_centor', doctor_id: doctorId || null, calc_type: 'centor', score, raw_answers: { age, temp, cough, nodes, exudate }, hub_version: '1.5.0' })
      });
    } catch {}
  };

  const handleCopy = () => {
    if (!result) return;
    const text = `OTTO CALC-HUB — Critérios de Centor/McIsaac (Faringite)\\nPaciente: ${patientId || 'Não informado'}\\nEscore: ${result.score}\\nProbabilidade: ${result.label}\\nData: ${new Date().toLocaleDateString('pt-BR')}`;
    navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2500); });
  };

  const resetAll = () => {
    setAge(null); setTemp(null); setCough(null); setNodes(null); setExudate(null); setResult(null);
  };

  if (result) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-4 text-center border-t-8" style={{ borderColor: result.color }}>
        <h2 className="text-3xl font-extrabold mb-1" style={{ color: result.color }}>Centor: {result.score} Pontos</h2>
        {patientId && <p className="text-slate-500 text-sm mb-2">Paciente: <strong>{patientId}</strong></p>}
        <p className="text-xl font-bold mb-3 text-slate-700">{result.label}</p>
        <div className="bg-slate-50 p-4 rounded-lg mb-6 text-left border border-slate-200">
          <p className="text-sm font-semibold text-slate-600">📋 Conduta Baseada em Evidência:</p>
          <p className="text-sm text-slate-700 mt-1">{result.recommendation}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
          <button onClick={handleCopy} className={`py-3 px-6 rounded-lg font-bold border-2 transition-all ${copied ? 'bg-green-500 text-white border-green-500' : 'bg-white text-slate-600 border-slate-300 hover:border-[#00A0AF]'}`}>
            {copied ? '✅ Copiado!' : '📋 Copiar Resultado'}
          </button>
          <button onClick={resetAll} className="bg-[#00A0AF] hover:bg-[#00BCD4] text-white font-bold py-3 px-8 rounded-lg shadow-md transition-all">
            Novo Questionário
          </button>
        </div>
        <div className="mt-6 bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs text-slate-500 text-left">
          <p className="font-bold mb-1">Referência Científica Padrão-Ouro:</p>
          <p className="italic">{REFERENCE_CENTOR}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6">
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-slate-100">
        <div className="mb-4 border-b border-slate-200 pb-4">
          <h2 className="text-2xl font-bold text-slate-800 mb-1">Escore de Centor Modificado (McIsaac)</h2>
          <p className="text-slate-500 text-sm mb-2">Critérios clínicos de predição para faringite por Streptococcus do grupo A.</p>
          {patientId && <p className="mt-2 text-sm font-semibold text-[#00A0AF] bg-[#e6f6f8] px-3 py-1.5 rounded-full inline-block">👤 Paciente: {patientId}</p>}
        </div>

        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 mb-6 text-sm text-emerald-900 shadow-sm transition-all hover:shadow-md">
          <p className="mb-2"><strong className="text-emerald-700 uppercase tracking-wide text-[10px] sm:text-xs">🎯 Para que serve:</strong><br/> <span className="opacity-90 font-medium">Estimar a probabilidade e a hipótese de uma faringoamigdalite ter etiologia bacteriana (Estreptocócica), reduzindo drasticamente o uso desnecessário e abusivo de antibióticos empíricos.</span></p>
          <p><strong className="text-emerald-700 uppercase tracking-wide text-[10px] sm:text-xs">💡 Como aplicar:</strong><br/> <span className="opacity-90 font-medium">À beira do leito ou consultório, o médico sinaliza a idade do paciente e cruza com estigmas de exame físico da orofaringe e queixas adjacentes (tosse, adenopatia).</span></p>
        </div>

        <div className="space-y-5 mb-8">
          
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 border-l-4 border-l-[#5CC6BA]">
            <p className="font-semibold text-slate-700 mb-3 text-sm">Idade do Paciente</p>
            <div className="flex flex-wrap sm:flex-nowrap gap-2">
              {[
                { label: '< 15 anos', val: 1 },
                { label: '15 - 44 anos', val: 0 },
                { label: '≥ 45 anos', val: -1 }
              ].map(opt => (
                <button key={opt.val} onClick={() => setAge(opt.val)}
                  className={`flex-1 py-2 sm:py-3 px-1 rounded-md font-bold text-xs border-2 transition-all ${age === opt.val ? 'bg-[#00A0AF] text-white border-[#00A0AF] shadow-md scale-105' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'}`}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 border-l-4 border-l-[#5CC6BA]">
            <p className="font-semibold text-slate-700 mb-3 text-sm">Temperatura</p>
            <div className="flex flex-wrap sm:flex-nowrap gap-2">
              {[
                { label: 'Febre (> 38°C)', val: 1 },
                { label: 'Afebril (≤ 38°C)', val: 0 }
              ].map(opt => (
                <button key={opt.val} onClick={() => setTemp(opt.val)}
                  className={`flex-1 py-2 sm:py-3 rounded-md font-bold text-xs border-2 transition-all ${temp === opt.val ? 'bg-[#00A0AF] text-white border-[#00A0AF] shadow-md scale-105' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'}`}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 border-l-4 border-l-[#5CC6BA]">
            <p className="font-semibold text-slate-700 mb-3 text-sm">Tosse</p>
            <div className="flex flex-wrap sm:flex-nowrap gap-2">
              {[
                { label: 'Ausência (Não)', val: 1 },
                { label: 'Presença (Sim)', val: 0 }
              ].map(opt => (
                <button key={opt.val} onClick={() => setCough(opt.val)}
                  className={`flex-1 py-2 sm:py-3 rounded-md font-bold text-xs border-2 transition-all ${cough === opt.val ? 'bg-[#00A0AF] text-white border-[#00A0AF] shadow-md scale-105' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'}`}>
                  {opt.label}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-slate-400 mt-2 font-medium">Nota: No Escore Centor, a ausência de tosse soma 1 ponto.</p>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 border-l-4 border-l-[#5CC6BA]">
            <p className="font-semibold text-slate-700 mb-3 text-sm">Linfadenopatia</p>
            <div className="flex flex-wrap sm:flex-nowrap gap-2">
              {[
                { label: 'Nódulos cervicais dolorosos', val: 1 },
                { label: 'Ausente', val: 0 }
              ].map(opt => (
                <button key={opt.val} onClick={() => setNodes(opt.val)}
                  className={`flex-1 py-2 sm:py-3 rounded-md font-bold text-xs border-2 transition-all ${nodes === opt.val ? 'bg-[#00A0AF] text-white border-[#00A0AF] shadow-md scale-105' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'}`}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 border-l-4 border-l-[#5CC6BA]">
            <p className="font-semibold text-slate-700 mb-3 text-sm">Achado Amigdaliano</p>
            <div className="flex flex-wrap sm:flex-nowrap gap-2">
              {[
                { label: 'Edema ou exsudato', val: 1 },
                { label: 'Ausente / Normal', val: 0 }
              ].map(opt => (
                <button key={opt.val} onClick={() => setExudate(opt.val)}
                  className={`flex-1 py-2 sm:py-3 rounded-md font-bold text-xs border-2 transition-all ${exudate === opt.val ? 'bg-[#00A0AF] text-white border-[#00A0AF] shadow-md scale-105' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'}`}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

        </div>

        <div className="flex justify-center border-t border-slate-200 pt-6">
          <button disabled={totalAnswered < 5} onClick={handleSubmit}
            className="px-8 py-3 bg-[#00A0AF] hover:bg-[#00BCD4] text-white font-bold rounded-lg shadow transition-all w-full sm:w-auto disabled:opacity-50">
            Calcular Centor
          </button>
        </div>
      </div>

      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs text-slate-500 text-center">
        <p className="font-bold mb-1">Referência Científica Padrão-Ouro:</p>
        <p className="italic">{REFERENCE_CENTOR}</p>
      </div>
    </div>
  );
}
