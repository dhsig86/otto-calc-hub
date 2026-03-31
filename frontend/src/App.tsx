import { useState } from 'react';
import LundMckayCalc from './calculators/LundMckayCalc';
import NoseCalc from './calculators/NoseCalc';
import Snot22Calc from './calculators/Snot22Calc';
import SinusiteCalc from './calculators/SinusiteCalc';
import TnmCalc from './calculators/TnmCalc';
import RefluxCalc from './calculators/RefluxCalc';
import PediatricDosesCalc from './calculators/PediatricDosesCalc';

type CalcTab = 'sinusite' | 'nose' | 'lund' | 'snot22' | 'tnm' | 'refluxo' | 'pediatria';

export default function App() {
  const [activeTab, setActiveTab] = useState<CalcTab>('nose');
  const [doctorId, setDoctorId] = useState('');
  const [patientName, setPatientName] = useState('');

  const calculators: { id: CalcTab; name: string }[] = [
    { id: 'sinusite', name: 'Sinusite' },
    { id: 'nose', name: 'NOSE' },
    { id: 'lund', name: 'Lund-Mackay' },
    { id: 'snot22', name: 'SNOT-22' },
    { id: 'tnm', name: 'TNM' },
    { id: 'refluxo', name: 'RSI (Refluxo)' },
    { id: 'pediatria', name: 'Doses Pediátricas' }
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900">
      <header className="bg-[#00A0AF] text-white p-4 md:px-10 shadow-md z-10 relative">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="text-center sm:text-left">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">OTTO CALC-HUB</h1>
            <p className="text-[#5CC6BA] font-medium mt-0.5 text-sm">Painel Central de Escore e Diagnóstico Otorrino</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <div className="flex items-center bg-white/10 px-3 py-2 rounded-lg border border-white/20 gap-2">
              <span className="text-xs font-bold opacity-80 whitespace-nowrap">👤 Paciente:</span>
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="Nome ou ID do paciente"
                className="px-2 py-1 rounded text-slate-800 text-sm font-semibold outline-none focus:ring-2 focus:ring-white w-44 shadow-inner"
              />
            </div>
            <div className="flex items-center bg-white/10 px-3 py-2 rounded-lg border border-white/20 gap-2">
              <span className="text-xs font-bold opacity-80 whitespace-nowrap">🩺 Médico:</span>
              <input
                type="text"
                value={doctorId}
                onChange={(e) => setDoctorId(e.target.value)}
                placeholder="CRM ou nome"
                className="px-2 py-1 rounded text-slate-800 text-sm font-semibold outline-none focus:ring-2 focus:ring-white w-36 shadow-inner"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow p-2 sm:p-6 max-w-7xl mx-auto w-full flex flex-col">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap w-full gap-1 mb-6 border-b-2 border-slate-200 pb-0">
          {calculators.map((calc) => (
            <button
              key={calc.id}
              onClick={() => setActiveTab(calc.id)}
              className={`px-3 py-3 rounded-t-lg font-bold transition-all text-xs sm:text-sm flex-1 sm:flex-none ${
                activeTab === calc.id
                  ? 'bg-white text-[#00A0AF] border-t-4 border-x border-[#00A0AF] border-b-0 border-b-white shadow-sm -mb-[2px]'
                  : 'bg-slate-200 text-slate-500 hover:bg-slate-300'
              }`}
            >
              {calc.name}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="w-full">
          {activeTab === 'nose' && <NoseCalc patientId={patientName} doctorId={doctorId} />}
          {activeTab === 'lund' && <LundMckayCalc patientId={patientName} doctorId={doctorId} />}
          {activeTab === 'snot22' && <Snot22Calc patientId={patientName} doctorId={doctorId} />}
          {activeTab === 'sinusite' && <SinusiteCalc patientId={patientName} doctorId={doctorId} />}
          {activeTab === 'tnm' && <TnmCalc patientId={patientName} doctorId={doctorId} />}
          {activeTab === 'refluxo' && <RefluxCalc patientId={patientName} doctorId={doctorId} />}
          {activeTab === 'pediatria' && <PediatricDosesCalc patientId={patientName} doctorId={doctorId} />}
        </div>
      </main>

      <footer className="bg-white border-t p-4 text-center text-slate-400 text-xs mt-auto shadow-inner">
        © 2026 OTTO Triagem | Interface Otorrinolaringológica Clínica
      </footer>
    </div>
  );
}
