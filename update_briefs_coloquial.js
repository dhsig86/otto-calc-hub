const fs = require('fs');
const path = require('path');

const simplifiedText = {
  "NoseCalc": {
    "serve": "Mede o quanto o nariz entupido atrapalha a vida do paciente.",
    "aplicar": "Deixe o paciente responder. É ótimo para provar a melhora dele após uma cirurgia de desvio de septo ou carne esponjosa."
  },
  "LundMckayCalc": {
    "serve": "Dá uma nota para a gravidade da sinusite crônica usando a Tomografia.",
    "aplicar": "Olhe os cortes da TC e pontue se cada seio da face está limpo, parcialmente velado ou todo fechado."
  },
  "Snot22Calc": {
    "serve": "Mostra o peso que a rinossinusite crônica tem no sono e bem-estar geral.",
    "aplicar": "O paciente dá nota nas 22 queixas. Use na triagem cirúrgica e para ver se o tratamento funcionou."
  },
  "SinusiteCalc": {
    "serve": "Ajuda a confirmar rápido se a sinusite é bacteriana (EPOS 2020).",
    "aplicar": "Vá ticando os sintomas durante a consulta para justificar se vai prescrever antibiótico ou só corticoide."
  },
  "PediatricSN5": {
    "serve": "Avalia o incômodo da sinusite e rinite crônica nas crianças.",
    "aplicar": "Os pais dizem como foi o último mês. Funciona super bem no prontuário para justificar a cirurgia de adenoide."
  },
  "TnmCalc": {
    "serve": "Faz o estadiamento rápido e oficial do câncer de cabeça e pescoço.",
    "aplicar": "Cruze o que você viu no exame com a ressonância e biópsia para classificar o tumor e definir se opera ou irradia."
  },
  "NeckMalignancyCalc": {
    "serve": "Calcula a chance de um caroço no pescoço ser câncer.",
    "aplicar": "Junte idade, hábitos e como o nódulo é ao toque (ex: móvel ou duro) para saber se a biópsia (PAAF) é urgente."
  },
  "TinnitusTHI": {
    "serve": "Mede o estrago que o zumbido faz no lado emocional e na rotina do paciente.",
    "aplicar": "O paciente preenche as limitações. É a prova inicial que você precisa para começar terapia sonora ou remédios."
  },
  "DizzinessDHI": {
    "serve": "Mostra o quanto a tontura (labirintite) assusta e trava a vida do paciente.",
    "aplicar": "O paciente responde pensando no dia a dia dele. Perfeito para ver se a reabilitação labiríntica está dando certo."
  },
  "CochlearNCIQ": {
    "serve": "Avalia o sucesso e o ganho de vida de quem colocou o Implante Coclear.",
    "aplicar": "Converse com o paciente nos meses após ligar o aparelho para entender se ele socializa e ouve bem na rua."
  },
  "OtiteCOMQ12": {
    "serve": "Avalia o sufoco que a Otite Média Crônica (doença do ouvido vazando) causa.",
    "aplicar": "O paciente lembra das últimas 4 semanas e pontua gotejamento e audição. Ajuda a cravar a hora de operar."
  },
  "VoiceVHI10": {
    "serve": "Triagem rápida para ver se a rouquidão está prejudicando a vida do paciente.",
    "aplicar": "Ele preenche na sala de espera. A nota já te diz se pode ter nódulos ou pólipos antes mesmo da laringoscopia."
  },
  "DysphagiaEAT10": {
    "serve": "Rastreio prático para pacientes que engasgam ou têm dor para engolir.",
    "aplicar": "O paciente avalia de 0 a 4 suas dificuldades nas refeições. Se der alto, peça endoscopia ou videodeglutograma rápido."
  },
  "RefluxCalc": {
    "serve": "Diagnostica o Refluxo Laringofaríngeo (o refluxo silencioso que inflama a garganta).",
    "aplicar": "O paciente dá nota para pigarro, tosse e bolo na faringe. Pontuação alta serve para iniciar omeprazol na hora, antes de exames chatos."
  },
  "VoiceVoiSS": {
    "serve": "A escala vocal mais completa! Caça problemas musculares paralelos à rouquidão.",
    "aplicar": "Ótima para guiar a terapia com fonoaudióloga. O paciente pontua detalhes finos de cansaço e dor na voz."
  },
  "SleepApneaSTOPBang": {
    "serve": "Filtro rápido para descobrir se o paciente tem alto risco de Apneia do Sono grave.",
    "aplicar": "Mistura os sintomas dele (ronco, cansaço) com o que você vê (pescoço largo, obesidade). Se der alto, mande pra polissonografia."
  },
  "SleepApneaEpworth": {
    "serve": "Mede o sono diurno para separar quem só dorme mal de quem tem apneia perigosa.",
    "aplicar": "O próprio paciente julga se apagaria fácil lendo ou no sinal vermelho. Super prático."
  },
  "TraqueoCPSS": {
    "serve": "Na UTI, separa se o paciente entubado está com pneumonia ou apenas soltando catarro inofensivo.",
    "aplicar": "Some a febre, a gosma, o raio-x e o oxigênio dele. A pontuação guia o uso do antimicrobiano venoso na hora."
  },
  "PediatricDosesCalc": {
    "serve": "Garante que a sua prescrição pediátrica na madrugada não tenha erro.",
    "aplicar": "Só digite o peso da criança e a API joga os mililitros perfeitos de Dipirona, Ibuprofeno e antibióticos sem errar vírgula."
  },
  "PharyngitisCentorCalc": {
    "serve": "Evita dar antibiótico à toa tentando adivinhar se a dor de garganta é por bactéria (Strep).",
    "aplicar": "Bata o olho na idade, febre, tosse e nas placas da amígdala do paciente na sua frente. O painel diz se vale a pena colher Swab ou ir com Azitromicina."
  }
};

const dir = 'frontend/src/calculators';
let count = 0;

for (const [folder, texts] of Object.entries(simplifiedText)) {
  const filePath = path.join(dir, folder, 'index.tsx');
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Trocar a frase de "🎯 Para que serve"
    const regexServe = /🎯 Para que serve:<\/strong><br\/>\s*<span className="opacity-90 font-medium">[^<]*<\/span>/;
    const newServe = `🎯 Para que serve:</strong><br/> <span className="opacity-90 font-medium">${texts.serve}</span>`;
    
    // Trocar a frase de "💡 Como aplicar"
    const regexAplicar = /💡 Como aplicar:<\/strong><br\/>\s*<span className="opacity-90 font-medium">[^<]*<\/span>/;
    const newAplicar = `💡 Como aplicar:</strong><br/> <span className="opacity-90 font-medium">${texts.aplicar}</span>`;

    let replaced = false;
    if (regexServe.test(content) && regexAplicar.test(content)) {
      content = content.replace(regexServe, newServe);
      content = content.replace(regexAplicar, newAplicar);
      replaced = true;
    }

    if (replaced) {
      fs.writeFileSync(filePath, content);
      console.log(`[OK] ${folder} modificado para coloquial.`);
      count++;
    } else {
      console.log(`[ERRO] Regex falhou (nao achou as tags) no arquivo: ${folder}`);
    }
  }
}
console.log(`Finalizado: ${count}/20 operacoes bem sucedidas.`);
