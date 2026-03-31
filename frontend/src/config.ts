// URL base da API do backend OTTO CALC-HUB
// Em desenvolvimento: http://localhost:8000
// Em produção (Vercel): aponta para a variável de ambiente VITE_API_URL
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
