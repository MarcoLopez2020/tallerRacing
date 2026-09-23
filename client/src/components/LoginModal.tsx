import { useState } from 'react';
import { LogIn, Lock, Mail, AlertCircle, Wrench } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface LoginProps {
  onLoginExitoso: () => void;
}

export default function LoginModal({ onLoginExitoso }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cargando, setCargando] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);
    setErrorMsg('');

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) throw error;
      onLoginExitoso();
    } catch (err: any) {
      setErrorMsg(
        err.message === 'Invalid login credentials'
          ? 'Credenciales incorrectas. Verifique correo y contraseña.'
          : err.message || 'Error al iniciar sesión'
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-sm w-full p-8 shadow-2xl text-white">
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center mb-3 shadow-lg shadow-red-600/30">
            <Wrench className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-black tracking-wider uppercase">ZONA RACING</h2>
          <p className="text-xs text-zinc-400 mt-1">Gestión de Taller • Iniciar Sesión</p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-950/60 border border-red-800 text-red-200 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-[11px] font-bold text-zinc-400 uppercase block mb-1">Correo Electrónico</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3 text-zinc-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="mecanico@zonaracing.com"
                className="w-full pl-9 pr-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-zinc-400 uppercase block mb-1">Contraseña</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3 text-zinc-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={cargando}
            className="w-full mt-2 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wide transition shadow-lg shadow-red-600/20 disabled:opacity-50 cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            {cargando ? 'Accediendo...' : 'Ingresar al Taller'}
          </button>
        </form>
      </div>
    </div>
  );
}