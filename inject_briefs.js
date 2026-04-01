const fs = require('fs');
const path = require('path');

const calculators = {
  "NoseCalc": {
    "color": "sky", // Rinologia
    "serve": "Quantificar a severidade subjetiva da obstrução nasal e seu real impacto na qualidade de vida do paciente.",
    "aplicar": "Autoaplicável pelo paciente. Ideal para documentação pré-operatória (ex: desvio septal, hipertrofia) e validação de sucesso no pós-operatório (delta de handicap pré x pós)."
  },
  "LundMckayCalc": {
    "color": "sky",
    "serve": "Estadiamento tomográfico objetivo da rinossinusite crônica.",
    "aplicar": "O médico examinador avalia os cortes da Tomografia Computadorizada (TC) e pontua radiologicamente a opacificação de cada seio e a perviedade do complexo ostiomeatal."
  },
  "Snot22Calc": {
    "color": "sky",
    "serve": "Avaliar o impacto e peso sintomático da rinossinusite crônica (com ou sem polipose) na qualidade de vida e sono.",
    "aplicar": "Paciente pontua as 22 queixas. Aplicar na triagem cirúrgica e como métrica de eficácia analítica no seguimento pós-tratamento."
  },
  "SinusiteCalc": {
    "color": "sky",
    "serve": "Algoritmo clínico diagnóstico fenotípico de Rinossinusite Aguda ou Crônica segundo consensus EPOS 2020.",
    "aplicar": "O prescritor preenche o questionário durante a anamnese guiada para blindar o diagnóstico exato e embasar antibiótocoterapia sistêmica ou tópica."
  },
  "PediatricSN5": {
    "color": "sky",
    "serve": "Aferir quantitativamente a alteração fisiológica por problemas sinonasais crônicos na faixa pediátrica.",
    "aplicar": "Os pais ou cuidadores avaliam a constância clínica do último mês usando a escala VAS de 1-7. Funciona como evidência validada para a indicação de adenoidectomia."
  },

  "TnmCalc": {
    "color": "slate", // Oncologia
    "serve": "Estadiamento oncológico anatômico clinicamente unificado para câncer de cabeça e pescoço (UICC/AJCC).",
    "aplicar": "O médico consolida os dados unificados da biópsia prévia, estigmas do exame físico e macro-limites de imagem para classificar estágio, indicando a cirurgia apropriada."
  },
  "NeckMalignancyCalc": {
    "color": "slate",
    "serve": "Rastrear de forma modelada a probabilidade de uma massa / tumoração cervical ter berço oncológico perigoso.",
    "aplicar": "O clínico avalia dados epidemiológicos (idade, hábitos tabágistas) e as variantes do exame físico (mobilidade elástica) logrando decisão estatística por citologia PAAF guiada ou ressecção."
  },

  "TinnitusTHI": {
    "color": "amber", // Otologia
    "serve": "Mensurar o impacto incapacitante do tinido (zumbido) na vida laboral, qualidade social e saúde mental do indivíduo a longo prazo.",
    "aplicar": "Paciente autodenomina as limitações decorrentes acústicas. Essencial como baseline de gravidade que justifica terapia TRT ou ansiolíticos adjuvantes."
  },
  "DizzinessDHI": {
    "color": "amber",
    "serve": "Classificar objetivamente quão desabilitante psicologicamente é a tontura (labirintopatia) na performance diária de pacientes com vetigem crônica.",
    "aplicar": "Paciente responde às questões baseadas em reflexos diários limitantes devidos à ilusão vestibular."
  },
  "CochlearNCIQ": {
    "color": "amber",
    "serve": "Validar a transição qualitativa global (domínios cognitivo/telefônico, convívio tátil social) que o dispositivo de implante cirúrgico gerou.",
    "aplicar": "Discutido e acompanhado prospectivamente com o paciente por meses depois das ativações auditórias mensais (mapeamentos fonológicos da unidade de controle)."
  },
  "OtiteCOMQ12": {
    "color": "amber",
    "serve": "Parametrizar de ponta a ponta a morbidade limitadora gerada pelos surtos fétidos de Otite Média Crônica persistente.",
    "aplicar": "Paciente descreve com rigor a piora otológica da última janela de 4 semanas, balizando se as lavagens com tópicos bastaram ou urge de intervenção anatômica."
  },

  "VoiceVHI10": {
    "color": "rose", // Laringologia
    "serve": "Índice abreviado ágil para quantificar distúrbios da emissão perante rouquidão e disfonias suspeitas de danos fonoarticulatórios orgânicos ou cistos.",
    "aplicar": "Lido e assinalado pelo paciente na espera do consultório. Alta chance preditiva para lesões antes mesmo do escopo endoscópio adentrar a glote."
  },
  "DysphagiaEAT10": {
    "color": "rose",
    "serve": "Testar sistematicamente deficiências silenciosas e disfagias obstrutivas no esôfago proximal garantindo proteção orofaríngea de base.",
    "aplicar": "O paciente elenca 0-4 na dor e angústia das refeições deglutidas de hoje e pregressas. Respostas com pontuações focais ditam endoscopia digestiva ou videodeglutograma urgente."
  },
  "RefluxCalc": {
    "color": "rose",
    "serve": "Aglutinar dados crônicos atípicos do DRGE silencioso isolando e detectando a clássica Doença do Refluxo Laringofaríngeo retrograda silenciosa (DRLF).",
    "aplicar": "Paciente reflete em escala 0-5 a acidez e secreção da garganta. Valores limiares cruzados fornecem prescrições IBP precisas antes da phmetria padrão ouro ocorrer."
  },
  "VoiceVoiSS": {
    "color": "rose",
    "serve": "Ferramenta vocal superlativa de avaliação, unicamente englobante na caça de dor muscular paralela aos desvios primários da prega fibótica vocal.",
    "aplicar": "Autoaplicação protocolada exigindo atenção contínua. Excelente como matriz fonoaudiológica balizadora ou checklist pós anestesia profunda da via glótica."
  },

  "SleepApneaSTOPBang": {
    "color": "indigo", // Sono
    "serve": "Rastrear ativamente por meio de dados biomorfofisiológicos e roncopatias ruidosas noturnas subjacentes episódios da Síndrome da Apneia Obstrutiva.",
    "aplicar": "A parte I exige preenchimento sintomático declarado e a II, medidas fisiológicas cruciais do observador cruzando circunferência cervical, faixas hipertensivas, BMI denso."
  },
  "SleepApneaEpworth": {
    "color": "indigo",
    "serve": "Discernir e estigmatizar de fato a hipersonia (doença patológica de sede diurna do sono profundo) da fadiga crônica simples metabólica natural.",
    "aplicar": "Sem atritos cognitivos o paciente julga as perdas súbitas da consciência perante letargias corriqueiras em repouso basal diário."
  },

  "TraqueoCPSS": {
    "color": "orange", // UTI
    "serve": "Diferenciar a mera colonização da via aérea por tubo perante reais patógenos inflamatórios bacterianos na pneumonia intrínseca às secreções.",
    "aplicar": "Checklist diário intensivo por via médica para unificar os desvios térmicos aos decaimentos de oxigênio PaO2 guiando antimicrobianos endovenosos em leito cirúrgico ou UTI."
  },

  "PediatricDosesCalc": {
    "color": "emerald", // Geral / Pediátrico - `#70CD9B` base (emerald)
    "serve": "Assegurar agilidade irretocável provendo alíquotas infalíveis com miligramagens diárias padronizadas pela literatura médica na pediatria ORL aguda.",
    "aplicar": "Lança-se confiavelmente o peso fidedigno da criança aferido no último minuto e prescreve-se os resgates otalgiários infantis em xarope contornando over-doses e erros em decimais de cálculos falhos."
  }
};

const dir = 'frontend/src/calculators';
let injectedCount = 0;

for (const [folder, data] of Object.entries(calculators)) {
  const filePath = path.join(dir, folder, 'index.tsx');
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Prevent double injection
    if (content.includes('🎯 Para que serve:')) {
      console.log(`[PASS] Já atualizado: ${folder}`);
      continue;
    }
    
    // Hard string index lookup bypassing unpredictable regex whitespace logic
    const patientIndex = content.indexOf('👤 Paciente: {patientId}</p>}');
    if (patientIndex !== -1) {
      const divCloseIndex = content.indexOf('</div>', patientIndex);
      if (divCloseIndex !== -1) {
        const insertPosition = divCloseIndex + 6; // insere logo depois do </div>
        
        const injectionBlock = `\n\n        <div className="bg-${data.color}-50 border border-${data.color}-200 rounded-xl p-5 mb-6 text-sm text-${data.color}-900 shadow-sm transition-all hover:shadow-md">\n          <p className="mb-2"><strong className="text-${data.color}-700 uppercase tracking-wide text-[10px] sm:text-xs">🎯 Para que serve:</strong><br/> <span className="opacity-90 font-medium">${data.serve}</span></p>\n          <p><strong className="text-${data.color}-700 uppercase tracking-wide text-[10px] sm:text-xs">💡 Como aplicar:</strong><br/> <span className="opacity-90 font-medium">${data.aplicar}</span></p>\n        </div>`;
        
        content = content.slice(0, insertPosition) + injectionBlock + content.slice(insertPosition);
        fs.writeFileSync(filePath, content);
        console.log(`[SUCESSO] ${folder} atualizado com a paleta temática ${data.color}.`);
        injectedCount++;
      }
    } else {
      console.log(`[ALERTA] Ancôra 👤 Paciente não encontrada em ${folder}`);
    }
  } else {
    console.log(`[ERRO] pasta não encontrada: ${folder}`);
  }
}

console.log(`\nOperação Finalizada. Total Injetado Adicional: \${injectedCount}/19`);
