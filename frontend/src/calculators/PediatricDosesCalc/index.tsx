import { useState } from 'react';

const MEDICATIONS = [
  { id: 'paracetamol', group: 'Analgesia/Antitérmico', name: 'Paracetamol', minMg: 10, maxMg: 15, maxDayMg: 75, mgPerVol: 200, volMl: 1, freq: 4, type: 'mg_ml' },
  { id: 'dipirona', group: 'Analgesia/Antitérmico', name: 'Dipirona', minMg: 12.5, maxMg: 25, maxDayMg: 100, mgPerVol: 50, volMl: 1, freq: 4, type: 'mg_ml' },
  { id: 'ibu_50', group: 'Analgesia/Antitérmico', name: 'Ibuprofeno 50mg/ml', dropsMin: 1, dropsMax: 2, dropsDayMax: 6, freq: 3, type: 'drops' },
  { id: 'ibu_100', group: 'Analgesia/Antitérmico', name: 'Ibuprofeno 100mg/ml', dropsMin: 0.5, dropsMax: 1, dropsDayMax: 3, freq: 3, type: 'drops' },
  { id: 'amoxicilina', group: 'Antibiótico', name: 'Amoxicilina (250mg/5ml)', minMg: 45, maxMg: 70, maxDayMg: 90, mgPerVol: 250, volMl: 5, freq: 3, type: 'mg_ml' },
  { id: 'amoxi_clav', group: 'Antibiótico', name: 'Amoxicilina + Clav. (400mg/5ml)', minMg: 70, maxMg: 90, maxDayMg: 90, mgPerVol: 400, volMl: 5, freq: 2, type: 'mg_ml' },
  { id: 'azitromicina', group: 'Antibiótico', name: 'Azitromicina (200mg/5ml)', minMg: 10, maxMg: 30, maxDayMg: 30, mgPerVol: 200, volMl: 5, freq: 1, type: 'mg_ml' },
  { id: 'cefaclor', group: 'Antibiótico', name: 'Cefaclor (375mg/5ml)', minMg: 20, maxMg: 40, maxDayMg: 40, mgPerVol: 375, volMl: 5, freq: 2, type: 'mg_ml' },
  { id: 'cefuroxima', group: 'Antibiótico', name: 'Cefuroxima 250mg/5ml (50mg/ml)', minMg: 10, maxMg: 15, maxDayMg: 25, mgPerVol: 50, volMl: 1, freq: 2, type: 'mg_ml' },
  { id: 'claritro_25', group: 'Antibiótico', name: 'Claritromicina 125mg/5ml', minMg: 7.5, maxMg: 15, maxDayMg: 15, mgPerVol: 25, volMl: 1, freq: 2, type: 'mg_ml' },
  { id: 'claritro_50', group: 'Antibiótico', name: 'Claritromicina 250mg/5ml', minMg: 10, maxMg: 15, maxDayMg: 15, mgPerVol: 50, volMl: 1, freq: 2, type: 'mg_ml' },
  { id: 'pred_gotas', group: 'Corticoide', name: 'Prednisolona Gotas (11mg/ml)', dropsMin: 1, dropsMax: 2, dropsDayMax: 2, freq: 1, type: 'drops' },
  { id: 'pred_sol', group: 'Corticoide', name: 'Prednisolona Solução (3mg/ml)', minMg: 0.5, maxMg: 1, maxDayMg: 1, mgPerVol: 3, volMl: 1, freq: 1, type: 'mg_ml' },
  { id: 'dexa', group: 'Corticoide', name: 'Dexametasona Elixir (0.1mg/ml)', minMg: 0.15, maxMg: 0.6, maxDayMg: 0.6, mgPerVol: 0.1, volMl: 1, freq: 3, type: 'mg_ml' },
  { id: 'hidrox', group: 'Anti-Histamínico', name: 'Hidroxizina (2mg/ml)', minMg: 0.35, maxMg: 0.7, maxDayMg: 2.0, mgPerVol: 2, volMl: 1, freq: 3, type: 'mg_ml' },
];

export default function PediatricDosesCalc() {
  const [weight, setWeight] = useState<string>('');
  const [medId, setMedId] = useState<string>('');
  const [patientId, setPatientId] = useState<string>('');
  const [freq, setFreq] = useState<number>(3);
  const [result, setResult] = useState<string | null>(null);

  const calculateDose = () => {
    const w = parseFloat(weight);
    if (!w || w < 2 || w > 60) {
      alert("Por favor, insira um peso válido (2 a 60kg).");
      return;
    }
    
    const med = MEDICATIONS.find(m => m.id === medId);
    if (!med) return;

    if (freq > med.freq) {
      alert(`O medicamento ${med.name} não deve ser dado ${freq}x ao dia. O máximo recomendado na bula é ${med.freq}x ao dia.`);
      return;
    }

    let output = '';
    
    if (med.type === 'drops') {
      const minDrops = (w * med.dropsMin!) / freq;
      const maxDrops = (w * med.dropsMax!) / freq;
      const maxDay = w * med.dropsDayMax!;
      
      output = `Administrar de **${minDrops.toFixed(0)} a ${maxDrops.toFixed(0)} gotas** por tomada.\n\nFrequência: Dê a cada ${24/freq} horas.\n(Teto Diário Máximo Seguro: ${maxDay.toFixed(0)} gotas/dia)`;
    } else {
      const minMgDose = (w * med.minMg!) / freq;
      const maxMgDose = (w * med.maxMg!) / freq;
      
      const concentration = med.mgPerVol! / med.volMl!; // mg per 1 ml
      
      const minMl = minMgDose / concentration;
      const maxMl = maxMgDose / concentration;
      const maxDayMg = w * med.maxDayMg!;
      
      output = `Administrar de **${minMl.toFixed(1)}ml a ${maxMl.toFixed(1)}ml** por tomada.\n\nFrequência: Dê a cada ${24/freq} horas.\n(A dose por tomada equivale a ${minMgDose.toFixed(0)}mg - ${maxMgDose.toFixed(0)}mg)\n(Teto Diário Máximo Seguro para o peso: ${maxDayMg.toFixed(0)}mg/dia)`;
    }

    setResult(output);
    saveToBackend(w, med.name, output);
  };

  const saveToBackend = async (w: number, drug: string, prescription: string) => {
    try {
      await fetch('http://localhost:8000/api/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient_id: patientId || "anon_pediatric",
          calc_type: "dose_pediatrica",
          score: w,
          raw_answers: { weight: w, drug, prescription, freq }
        })
      });
    } catch (e) {
      console.warn("FastAPI Offline.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6">
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-slate-100 relative">
        <div className="mb-8 border-b border-slate-200 pb-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Calculadora Posológica Pediátrica</h2>
          <p className="text-slate-500 text-sm mb-4">Geração automática de prescrições em mg/kg ou gotas para os principais insumos otorrinolaringológicos.</p>
          <input 
            type="text" 
            value={patientId}
            onChange={e => setPatientId(e.target.value)}
            placeholder="Nome / Registro da Criança"
            className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-[#5CC6BA] focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <label className="block text-sm font-extrabold text-[#00A0AF] mb-2">Peso da Criança (Kg):</label>
                <input 
                    type="number" step="0.1" 
                    value={weight} onChange={e => setWeight(e.target.value)} 
                    className="w-full p-3 border border-slate-300 rounded font-medium outline-none focus:border-[#00A0AF] text-lg" 
                    placeholder="Ex: 14.5"
                />
            </div>
            
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <label className="block text-sm font-extrabold text-[#00A0AF] mb-2">Medicamento Alvo:</label>
                <select 
                    value={medId} onChange={e => {setMedId(e.target.value); setResult(null);}} 
                    className="w-full p-3 border border-slate-300 rounded font-medium outline-none focus:border-[#00A0AF]"
                >
                    <option value="">Selecione a Droga...</option>
                    {MEDICATIONS.map(m => <option key={m.id} value={m.id}>({m.group}) {m.name}</option>)}
                </select>
            </div>
        </div>

        {medId && (
            <div className="mb-8 bg-blue-50 p-6 rounded-lg border border-blue-200">
                <label className="block text-sm font-extrabold text-blue-800 mb-3">Frequência da Prescrição Desejada:</label>
                <div className="flex gap-2 flex-wrap text-sm">
                    <button onClick={() => setFreq(1)} className={`px-4 py-2 rounded font-bold border ${freq === 1 ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border-blue-200 hover:bg-blue-100'}`}>1x/dia (24/24h)</button>
                    <button onClick={() => setFreq(2)} className={`px-4 py-2 rounded font-bold border ${freq === 2 ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border-blue-200 hover:bg-blue-100'}`}>2x/dia (12/12h)</button>
                    <button onClick={() => setFreq(3)} className={`px-4 py-2 rounded font-bold border ${freq === 3 ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border-blue-200 hover:bg-blue-100'}`}>3x/dia (8/8h)</button>
                    <button onClick={() => setFreq(4)} className={`px-4 py-2 rounded font-bold border ${freq === 4 ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border-blue-200 hover:bg-blue-100'}`}>4x/dia (6/6h)</button>
                </div>
                
                <div className="mt-6 text-center">
                    <button
                        onClick={calculateDose}
                        className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow transition-all w-full"
                    >
                        Emitir Dosagem
                    </button>
                </div>
            </div>
        )}

        {result && (
             <div className="bg-emerald-50 border-l-8 border-emerald-500 p-6 rounded-r-lg shadow-sm animate-fade-in">
                <h3 className="font-bold text-emerald-800 text-lg mb-3">Linha de Prescrição Gerada:</h3>
                <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{result}</p>
             </div>
        )}

      </div>

      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 shadow-sm text-xs text-slate-500 text-center">
        <p className="font-bold mb-1">Nota de Segurança:</p>
        <p className="italic">Os cálculos baseiam-se nos tetos de bula pediátricos vigentes (mg/kg/dia). Sempre corrobore a prescrição final com as comorbidades subjacentes da criança.</p>
      </div>
    </div>
  );
}
