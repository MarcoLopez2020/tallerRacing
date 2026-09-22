import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '⚠️ Faltan las variables VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY en client/.env. Revisa la configuración y reinicia Vite.'
  );
}

// Fallback a strings válidos mínimos para evitar que createClient lance excepción al importar
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key'
);