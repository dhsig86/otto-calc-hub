import { useState } from 'react';
import LundMckayCalc from './calculators/LundMckayCalc';
import NoseCalc from './calculators/NoseCalc';
import Snot22Calc from './calculators/Snot22Calc';
import SinusiteCalc from './calculators/SinusiteCalc';
import TnmCalc from './calculators/TnmCalc';
import RefluxCalc from './calculators/RefluxCalc';
import PediatricDosesCalc from './calculators/PediatricDosesCalc';
import TinnitusTHI from './calculators/TinnitusTHI';
import DizzinessDHI from './calculators/DizzinessDHI';
import VoiceVHI10 from './calculators/VoiceVHI10';
import DysphagiaEAT10 from './calculators/DysphagiaEAT10';
import SleepApneaSTOPBang from './calculators/SleepApneaSTOPBang';
import SleepApneaEpworth from './calculators/SleepApneaEpworth';

// Novas importações (Lote 4)
import CochlearNCIQ from './calculators/CochlearNCIQ';
import OtiteCOMQ12 from './calculators/OtiteCOMQ12';
import VoiceVoiSS from './calculators/VoiceVoiSS';
import PediatricSN5 from './calculators/PediatricSN5';
import TraqueoCPSS from './calculators/TraqueoCPSS';
import NeckMalignancyCalc from './calculators/NeckMalignancyCalc';

// Novas importações (Lote 5)
import PharyngitisCentorCalc from './calculators/PharyngitisCentorCalc';

type CalcTab =
  | 'sinusite' | 'nose' | 'lund' | 'snot22' | 'tnm' | 'refluxo' | 'pediatria'
  | 'thi' | 'dhi' | 'vhi10' | 'eat10' | 'stopbang' | 'epworth'
  | 'nciq' | 'comq12' | 'voiss' | 'sn5' | 'cpss' | 'malig' | 'centor';

interface TabDef { id: CalcTab; name: string; area: string; }

const CALCULATORS: TabDef[] = [
  // Rinologia
  { id: 'sinusite', name: 'Sinusite', area: 'Rinologia' },
  { id: 'nose', name: 'NOSE', area: 'Rinologia' },
  { id: 'lund', name: 'Lund-Mackay', area: 'Rinologia' },
  { id: 'snot22', name: 'SNOT-22', area: 'Rinologia' },
  { id: 'sn5', name: 'SN-5 Pediátrico', area: 'Rinologia' },
  // Oncologia
  { id: 'tnm', name: 'TNM Oncológico', area: 'Oncologia' },
  { id: 'malig', name: 'Malignidade Cervical', area: 'Oncologia' },
  // Otologia
  { id: 'thi', name: 'THI — Zumbido', area: 'Otologia' },
  { id: 'dhi', name: 'DHI — Tontura', area: 'Otologia' },
  { id: 'nciq', name: 'NCIQ — Implante', area: 'Otologia' },
  { id: 'comq12', name: 'COMQ-12 — OMC', area: 'Otologia' },
  // Laringologia & Disfagia
  { id: 'vhi10', name: 'VHI-10 — Voz', area: 'Laringologia' },
  { id: 'eat10', name: 'EAT-10 — Disfagia', area: 'Laringologia' },
  { id: 'refluxo', name: 'RSI — Refluxo', area: 'Laringologia' },
  { id: 'voiss', name: 'VoiSS — Sintomas', area: 'Laringologia' },
  // Sono
  { id: 'epworth', name: 'Epworth — ESE', area: 'Sono' },
  { id: 'stopbang', name: 'STOP-Bang', area: 'Sono' },
  // Intensiva
  { id: 'cpss', name: 'CPSS — Pneumonia', area: 'Intensiva' },
  // Geral
  { id: 'centor', name: 'Centor — Faringite', area: 'Geral' },
  { id: 'pediatria', name: 'Doses Pediátricas', area: 'Geral' },
];

const AREA_ORDER = ['Rinologia', 'Oncologia', 'Otologia', 'Laringologia', 'Sono', 'Intensiva', 'Geral'];
const AREA_EMOJI: Record<string, string> = {
  Rinologia: '👃', Oncologia: '🔬', Otologia: '🦻', Laringologia: '🗣️', Sono: '😴', Intensiva: '🫁', Geral: '⚕️'
};

export default function App() {
  const [activeTab, setActiveTab] = useState<CalcTab>('nose');
  const [doctorId, setDoctorId] = useState('');
  const [patientName, setPatientName] = useState('');

  const sharedProps = { patientId: patientName, doctorId };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900">
      <header className="bg-[#00A0AF] text-white p-4 md:px-10 shadow-md z-10 relative">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="text-center sm:text-left">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">OTTO CALC-HUB</h1>
            <p className="text-[#5CC6BA] font-medium mt-0.5 text-sm">20 Instrumentos Clínicos em Otorrinolaringologia</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <div className="flex items-center bg-white/10 px-3 py-2 rounded-lg border border-white/20 gap-2">
              <span className="text-xs font-bold opacity-80 whitespace-nowrap">👤 Paciente:</span>
              <input type="text" value={patientName} onChange={(e) => setPatientName(e.target.value)}
                placeholder="Nome ou ID"
                className="px-2 py-1 rounded text-slate-800 text-sm font-semibold outline-none focus:ring-2 focus:ring-white w-44 shadow-inner" />
            </div>
            <div className="flex items-center bg-white/10 px-3 py-2 rounded-lg border border-white/20 gap-2">
              <span className="text-xs font-bold opacity-80 whitespace-nowrap">🩺 Médico:</span>
              <input type="text" value={doctorId} onChange={(e) => setDoctorId(e.target.value)}
                placeholder="CRM ou nome"
                className="px-2 py-1 rounded text-slate-800 text-sm font-semibold outline-none focus:ring-2 focus:ring-white w-36 shadow-inner" />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow p-2 sm:p-6 max-w-7xl mx-auto w-full flex flex-col">
        {/* Navigation por área */}
        <div className="w-full mb-6 flex flex-wrap justify-center gap-x-8 gap-y-4">
          {AREA_ORDER.map(area => {
            const tabs = CALCULATORS.filter(c => c.area === area);
            return (
              <div key={area} className="flex flex-col items-center gap-1">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest text-center mb-0.5">
                  {AREA_EMOJI[area]} {area}
                </span>
                <div className="flex flex-wrap justify-center gap-1">
                  {tabs.map(calc => (
                    <button key={calc.id} onClick={() => setActiveTab(calc.id)}
                      className={`px-3 py-2 rounded-lg font-bold transition-all text-xs sm:text-sm border-2 ${
                        activeTab === calc.id
                          ? 'bg-[#00A0AF] text-white border-[#00A0AF] shadow-sm'
                          : 'bg-white text-slate-500 border-slate-200 hover:border-[#5CC6BA] hover:text-[#00A0AF]'
                      }`}>
                      {calc.name}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="w-full">
          {activeTab === 'nose' && <NoseCalc {...sharedProps} />}
          {activeTab === 'lund' && <LundMckayCalc {...sharedProps} />}
          {activeTab === 'snot22' && <Snot22Calc {...sharedProps} />}
          {activeTab === 'sinusite' && <SinusiteCalc {...sharedProps} />}
          {activeTab === 'tnm' && <TnmCalc {...sharedProps} />}
          {activeTab === 'refluxo' && <RefluxCalc {...sharedProps} />}
          {activeTab === 'pediatria' && <PediatricDosesCalc {...sharedProps} />}
          {activeTab === 'thi' && <TinnitusTHI {...sharedProps} />}
          {activeTab === 'dhi' && <DizzinessDHI {...sharedProps} />}
          {activeTab === 'vhi10' && <VoiceVHI10 {...sharedProps} />}
          {activeTab === 'eat10' && <DysphagiaEAT10 {...sharedProps} />}
          {activeTab === 'stopbang' && <SleepApneaSTOPBang {...sharedProps} />}
          {activeTab === 'epworth' && <SleepApneaEpworth {...sharedProps} />}
          
          {/* Lote 4 Novidades */}
          {activeTab === 'nciq' && <CochlearNCIQ {...sharedProps} />}
          {activeTab === 'comq12' && <OtiteCOMQ12 {...sharedProps} />}
          {activeTab === 'voiss' && <VoiceVoiSS {...sharedProps} />}
          {activeTab === 'sn5' && <PediatricSN5 {...sharedProps} />}
          {activeTab === 'cpss' && <TraqueoCPSS {...sharedProps} />}
          {activeTab === 'malig' && <NeckMalignancyCalc {...sharedProps} />}
          
          {/* Lote 5 Novidades */}
          {activeTab === 'centor' && <PharyngitisCentorCalc {...sharedProps} />}
        </div>
      </main>

      <footer className="bg-white border-t p-4 text-center text-slate-400 text-xs mt-auto shadow-inner">
        © 2026 OTTO Triagem | 20 Instrumentos Clínicos Validados em ORL
      </footer>
    </div>
  );
}
