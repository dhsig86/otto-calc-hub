# Ideias Futuras / Roadmap

## 1. Integração com OTTO Triagem (CDSS)
- **Objetivo**: Integrar o pacote atual de calculadoras (PROMs e Escores Clínicos) diretamente no OTTO Triagem, consolidando um Sistema de Suporte à Decisão Clínica (CDSS).
- **Localização Planejada**: Aba PROMs dentro do painel médico (`area-medica.html`).
- **Fluxo de Uso**: As ferramentas servirão como apoio diagnóstico ativo ou para avaliação sequencial evolutiva do paciente na plataforma principal.
- **Exportação de Dados**: Garantir que as classificações, topografias e escores finais sejam exportáveis/integraveis não apenas visualmente, mas através de injeção em prontuário eletrônico.

## 2. Persistência e Arquitetura de Banco de Dados
- **Cenário Atual**: Devido à ausência de *Render Disk* no plano atual do projeto OTTO CALC-HUB, o SQLite é provisório e sofre *wipe* nos deploys.
- **Roadmap Imediato**: Migrar a persistência atual (Backend do Hub) para o **Supabase** (gratuito) utilizando PostgreSQL. Isso garantirá a retenção segura dos laudos gerados sem custos adicionais de nuvem.
- **Integração Futura (OTTO Triagem)**: O projeto do OTTO Triagem hospeda seu núcleo PostgreSQL no **Heroku** (plano Essential-0). A ideia é, futuramente, estabelecer um pipeline (ou compartilhar a *connection string* em um *schema* unificado) para que a base do Supabase alimente diretamente o prontuário do Heroku, centralizando as avaliações no painel médico do Triagem.

## 3. Refinamento de UI/UX
- Manter o padrão de referências visíveis sempre ao final do uso da ferramenta, de forma estática e documentada para resguardo médico legal em processos de auditoria estrutural.
- Exportação facilitada: Evoluir o botão "Copiar Resultado" para, de repente, gerar um micro-PDF assinado digitalmente ou formatado estruturado para o laudo médico no OTTO Triagem.