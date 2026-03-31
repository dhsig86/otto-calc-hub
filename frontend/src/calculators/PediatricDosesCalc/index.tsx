import { useState } from 'react';
import { API_BASE_URL } from '../../config';

const MEDICATIONS = [
  { id: 'paracetamol', group: 'Analgesia/Antitérmico', name: 'Paracetamol (200mg/ml)', minMg: 10, maxMg: 15, maxDayMg: 75, mgPerVol: 200, volMl: 1, freq: 4, type: 'mg_ml' },
  { id: 'dipirona', group: 'Analgesia/Antitérmico', name: 'Dipirona (50mg/ml)', minMg: 12.5, maxMg: 25, maxDayMg: 100, mgPerVol: 50, volMl: 1, freq: 4, type: 'mg_ml' },
  { id: 'ibu_50', group: 'Analgesia/Antitérmico', name: 'Ibuprofeno 50mg/ml (gotas)', dropsMin: 1, dropsMax: 2, dropsDayMax: 6, freq: 3, type: 'drops' },
  { id: 'ibu_100', group: 'Analgesia/Antitérmico', name: 'Ibuprofeno 100mg/ml (gotas)', dropsMin: 0.5, dropsMax: 1, dropsDayMax: 3, freq: 3, type: 'drops' },
  { id: 'amoxicilina', group: 'Antibiótico', name: 'Amoxicilina (250mg/5ml)', minMg: 45, maxMg: 70, maxDayMg: 90, mgPerVol: 250, volMl: 5, freq: 3, type: 'mg_ml' },
  { id: 'amoxi_clav', group: 'Antibiótico', name: 'Amoxicilina + Clavulanato (400mg/5ml)', minMg: 70, maxMg: 90, maxDayMg: 90, mgPerVol: 400, volMl: 5, freq: 2, type: 'mg_ml' },
  { id: 'azitromicina', group: 'Antibiótico', name: 'Azitromicina (200mg/5ml)', minMg: 10, maxMg: 30, maxDayMg: 30, mgPerVol: 200, volMl: 5, freq: 1, type: 'mg_ml' },
  { id: 'cefaclor', group: 'Antibiótico', name: 'Cefaclor (375mg/5ml)', minMg: 20, maxMg: 40, maxDayMg: 40, mgPerVol: 375, volMl: 5, freq: 2, type: 'mg_ml' },
  { id: 'cefuroxima', group: 'Antibiótico', name: 'Cefuroxima (50mg/ml)', minMg: 10, maxMg: 15, maxDayMg: 25, mgPerVol: 50, volMl: 1, freq: 2, type: 'mg_ml' },
  { id: 'claritro_25', group: 'Antibiótico', name: 'Claritromicina 125mg/5ml (25mg/ml)', minMg: 7.5, maxMg: 15, maxDayMg: 15, mgPerVol: 25, volMl: 1, freq: 2, type: 'mg_ml' },
  { id: 'claritro_50', group: 'Antibiótico', name: 'Claritromicina 250mg/5ml (50mg/ml)', minMg: 10, maxMg: 15, maxDayMg: 15, mgPerVol: 50, volMl: 1, freq: 2, type: 'mg_ml' },
  { id: 'pred_gotas', group: 'Corticoide', name: 'Prednisolona Gotas (11mg/ml)', dropsMin: 1, dropsMax: 2, dropsDayMax: 2, freq: 1, type: 'drops' },
  { id: 'pred_sol', group: 'Corticoide', name: 'Prednisolona Solução (3mg/ml)', minMg: 0.5, maxMg: 1, maxDayMg: 1, mgPerVol: 3, volMl: 1, freq: 1, type: 'mg_ml' },
  { id: 'dexa', group: 'Corticoide', name: 'Dexametasona Elixir (0.1mg/ml)', minMg: 0.15, maxMg: 0.6, maxDayMg: 0.6, mgPerVol: 0.1, volMl: 1, freq: 3, type: 'mg_ml' },
  { id: 'hidrox', group: 'Anti-Histamínico', name: 'Hidroxizina (2mg/ml)', minMg: 0.35, maxMg: 0.7, maxDayMg: 2.0, mgPerVol: 2, volMl: 1, freq: 3, type: 'mg_ml' },
] as const;

interface Props { patientId: string; doctorId?: string; }

export default function PediatricDosesCalc({ patientId, doctorId }: Props) {
  const [weight, setWeight] = useState('');
  const [medId, setMedId] = useState('');
  const [freq, setFreq] = useState(3);
  const [result, setResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const med = MEDICATIONS.find(m => m.id === medId);

  const calculateDose = () => {
    const w = parseFloat(weight);
    if (!w || w < 2 || w > 60) {
      alert('Por favor, insira um peso válido (2 a 60 kg).');
      return;
    }
    if (!med) return;

    if (freq > med.freq) {
      alert(`O medicamento ${med.name} não deve ser dado ${freq}x ao dia. Máximo recomendado: ${med.freq}x/dia.`);
      return;
    }

    let output = '';

    if (med.type === 'drops') {
      const minDrops = (w * (med as any).dropsMin) / freq;
      const maxDrops = (w * (med as any).dropsMax) / freq;
      const maxDay = w * (med as any).dropsDayMax;
      output = `Administrar de ${minDrops.toFixed(0)} a ${maxDrops.toFixed(0)} gotas por tomada.\nFrequência: a cada ${24 / freq} horas.\nTeto Diário Máximo: ${maxDay.toFixed(0)} gotas/dia`;
    } else {
      const m = med as any;
      const minMgDose = (w * m.minMg) / freq;
      const maxMgDose = (w * m.maxMg) / freq;
      const concentration = m.mgPerVol / m.volMl;
      const minMl = minMgDose / concentration;
      const maxMl = maxMgDose / concentration;
      const maxDayMg = w * m.maxDayMg;
      output = `Administrar de ${minMl.toFixed(1)} ml a ${maxMl.toFixed(1)} ml por tomada.\nFrequência: a cada ${24 / freq} horas.\nDose por tomada: ${minMgDose.toFixed(0)} mg – ${maxMgDose.toFixed(0)} mg\nTeto Diário Máximo: ${maxDayMg.toFixed(0)} mg/dia`;
    }

    setResult(output);
    try {
      fetch(`${API_BASE_URL}/api/results`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient_id: patientId || 'anon_pediatric',
          doctor_id: doctorId || null,
          calc_type: 'dose_pediatrica',
          score: parseFloat(weight),
          raw_answers: { weight, drug: med?.name, freq, prescription: output },
          hub_version: '1.3.0'
        })
      });
    } catch {}
  };

  const handleCopy = () => {
    if (!result || !med) return;
    const text = `OTTO CALC-HUB — Posologia Pediátrica\nPaciente: ${patientId || 'Não informado'}\nMedicamento: ${med.name}\nPeso: ${weight} kg\n\n${result}\n\nData: ${new Date().toLocaleDateString('pt-BR')}`;
    navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2500); });
  };

  const groups = [...new Set(MEDICATIONS.map(m => m.group))];

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6">
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-slate-100">
        <div className="mb-8 border-b border-slate-200 pb-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-1">Calculadora Posológica Pediátrica</h2>
          <p className="text-slate-500 text-sm mb-2">Prescrições em mg/kg ou gotas para os principais insumos otorrinolaringológicos pediátricos.</p>
          {patientId && <p className="mt-2 text-sm font-semibold text-[#00A0AF] bg-[#e6f6f8] px-3 py-1.5 rounded-full inline-block">👤 Paciente: {patientId}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <label className="block text-sm font-extrabold text-[#00A0AF] mb-2">Peso da Criança (kg):</label>
            <input
              type="number" step="0.1"
              value={weight} onChange={e => { setWeight(e.target.value); setResult(null); }}
              className="w-full p-3 border border-slate-300 rounded font-medium outline-none focus:border-[#00A0AF] text-lg"
              placeholder="Ex: 14.5"
            />
          </div>

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <label className="block text-sm font-extrabold text-[#00A0AF] mb-2">Medicamento Alvo:</label>
            <select
              value={medId} onChange={e => { setMedId(e.target.value); setResult(null); }}
              className="w-full p-3 border border-slate-300 rounded font-medium outline-none focus:border-[#00A0AF]"
            >
              <option value="">Selecione o medicamento...</option>
              {groups.map(group => (
                <optgroup key={group} label={group}>
                  {MEDICATIONS.filter(m => m.group === group).map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
        </div>

        {medId && (
          <div className="mb-8 bg-blue-50 p-6 rounded-lg border border-blue-200">
            <label className="block text-sm font-extrabold text-blue-800 mb-3">Frequência Diária:</label>
            <div className="flex gap-2 flex-wrap text-sm">
              {[1, 2, 3, 4].map(f => (
                <button key={f} onClick={() => setFreq(f)} className={`px-4 py-2 rounded-lg font-bold border-2 transition-all ${freq === f ? 'bg-blue-600 text-white border-blue-600 shadow' : 'bg-white text-blue-700 border-blue-200 hover:border-blue-400'}`}>
                  {f}x/dia ({24/f}/{24/f}h)
                </button>
              ))}
            </div>
            <div className="mt-6 text-center">
              <button onClick={calculateDose} className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow transition-all w-full">
                Calcular Dosagem
              </button>
            </div>
          </div>
        )}

        {result && (
          <div className="bg-emerald-50 border-l-8 border-emerald-500 p-6 rounded-r-lg shadow-sm">
            <h3 className="font-bold text-emerald-800 text-lg mb-3">Prescrição Gerada:</h3>
            <p className="text-slate-700 whitespace-pre-wrap leading-relaxed font-medium">{result}</p>
            <div className="mt-4">
              <button onClick={handleCopy} className={`py-2.5 px-6 rounded-lg font-bold border-2 text-sm transition-all ${copied ? 'bg-green-500 text-white border-green-500' : 'bg-white text-slate-600 border-slate-300 hover:border-emerald-500'}`}>
                {copied ? '✅ Copiado!' : '📋 Copiar Prescrição'}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs text-slate-500 text-center">
        <p className="font-bold mb-1">⚠️ Nota de Segurança:</p>
        <p className="italic">Os cálculos baseiam-se nos tetos de bula pediátricos vigentes (mg/kg/dia). Sempre corrobore a prescrição final com as comorbidades e alergias da criança. Este instrumento não substitui o julgamento clínico.</p>
      </div>
    </div>
  );
}
