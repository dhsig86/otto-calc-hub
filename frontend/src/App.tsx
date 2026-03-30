import { useState } from 'react';
import LundMckayCalc from './calculators/LundMckayCalc';
import NoseCalc from './calculators/NoseCalc';
import Snot22Calc from './calculators/Snot22Calc';
import SinusiteCalc from './calculators/SinusiteCalc';

export default function App() {
  const [activeTab, setActiveTab] = useState<'nose' | 'lund' | 'snot22' | 'sinusite'>('nose');

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900">
      <header className="bg-[#00A0AF] text-white p-6 md:px-10 shadow-md flex justify-between items-center z-10 relative">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">OTTO CALC-HUB</h1>
          <p className="text-[#5CC6BA] font-medium mt-1 text-sm md:text-base">Painel Central de Escore e Diagnóstico</p>
        </div>
      </header>
      
      <main className="flex-grow p-4 sm:p-8 max-w-7xl mx-auto w-full flex flex-col items-center">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center w-full gap-2 mb-8 border-b-2 border-slate-200 pb-2 relative z-0">
          <button 
            onClick={() => setActiveTab('nose')}
            className={`px-6 py-4 rounded-t-xl font-bold transition-all text-sm md:text-base flex-1 md:flex-none max-w-xs ${activeTab === 'nose' ? 'bg-white text-[#00A0AF] border-t-4 border-[#00A0AF] shadow-sm transform translate-y-[2px]' : 'bg-slate-200 text-slate-500 hover:bg-slate-300'}`}
          >
            NOSE
          </button>
          <button 
            onClick={() => setActiveTab('lund')}
            className={`px-6 py-4 rounded-t-xl font-bold transition-all text-sm md:text-base flex-1 md:flex-none max-w-xs ${activeTab === 'lund' ? 'bg-white text-[#00A0AF] border-t-4 border-[#00A0AF] shadow-sm transform translate-y-[2px]' : 'bg-slate-200 text-slate-500 hover:bg-slate-300'}`}
          >
            Lund-Mackay (TC)
          </button>
          <button 
            onClick={() => setActiveTab('snot22')}
            className={`px-6 py-4 rounded-t-xl font-bold transition-all text-sm md:text-base flex-1 md:flex-none max-w-xs ${activeTab === 'snot22' ? 'bg-white text-[#00A0AF] border-t-4 border-[#00A0AF] shadow-sm transform translate-y-[2px]' : 'bg-slate-200 text-slate-500 hover:bg-slate-300'}`}
          >
            SNOT-22
          </button>
          <button 
            onClick={() => setActiveTab('sinusite')}
            className={`px-6 py-4 rounded-t-xl font-bold transition-all text-sm md:text-base flex-1 md:flex-none max-w-xs ${activeTab === 'sinusite' ? 'bg-white text-[#00A0AF] border-t-4 border-[#00A0AF] shadow-sm transform translate-y-[2px]' : 'bg-slate-200 text-slate-500 hover:bg-slate-300'}`}
          >
            Sinusite (EPOS/AAO)
          </button>
        </div>

        {/* Content Area */}
        <div className="w-full">
          {activeTab === 'nose' && <NoseCalc />}
          {activeTab === 'lund' && <LundMckayCalc />}
          {activeTab === 'snot22' && <Snot22Calc />}
          {activeTab === 'sinusite' && <SinusiteCalc />}
        </div>
      </main>

      <footer className="bg-white border-t p-6 text-center text-slate-500 text-sm mt-auto shadow-inner">
        &copy; 2026 OTTO Triagem | Interface Otorrinolaringológica
      </footer>
    </div>
  );
}
