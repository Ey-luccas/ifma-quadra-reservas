import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../components/Toast';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import api from '../config/api';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailNotVerified, setEmailNotVerified] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;

      login(token, user);
      showToast('Login realizado com sucesso!', 'success');

      // Redireciona baseado no role
      if (user.role === 'STUDENT') {
        navigate('/student/requests');
      } else if (user.role === 'ADMIN') {
        navigate('/admin/requests');
      } else if (user.role === 'GUARD') {
        navigate('/guard/agenda');
      }
    } catch (error: any) {
      const status = error.response?.status;
      const message = error.response?.data?.message || 'Erro ao fazer login';
      
      // Verifica se é erro de email não verificado (403)
      if (status === 403 && message.includes('Verifique seu e-mail')) {
        setEmailNotVerified(true);
        showToast(message, 'error');
      } else {
        showToast(message, 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a5f3f] to-[#0d3625] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decoração de quadra */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute w-full h-0.5 bg-white top-1/2"></div>
        <div className="absolute w-0.5 h-full bg-white left-1/2"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 border-2 border-white rounded-[5px]"></div>
      </div>

      <div className="bg-white rounded-[5px] shadow-2xl overflow-hidden max-w-5xl w-full flex flex-col md:flex-row relative z-10">
        {/* Painel Esquerdo */}
        <div className="flex-1 bg-gradient-to-br from-[#2d8659] to-[#1a5f3f] p-8 md:p-12 text-white flex flex-col justify-center relative">
          {/* Decorações */}
          <div className="absolute top-5 right-5 w-24 h-24 border-2 border-white/30 rounded-[5px]"></div>
          <div className="absolute bottom-5 left-5 w-20 h-20 bg-white/10 rounded-[5px] transform rotate-45"></div>

          <div className="relative z-10">
            <Link to="/login" className="flex items-center gap-3 mb-6 cursor-pointer hover:opacity-80 transition-opacity">
              <img 
                src="/logo-ifma.png" 
                alt="IFMA" 
                className="h-12 w-auto brightness-0 invert"
              />
            </Link>
            <h2 className="text-2xl font-semibold mb-4">
              Sistema de Reservas da Quadra Poliesportiva
            </h2>
            <p className="opacity-90 leading-relaxed mb-8 text-base">
              Reserve seu horário, acompanhe aprovações e mantenha tudo sob controle.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-[5px] bg-white/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs">•</span>
                </div>
                <span className="text-sm">Solicitação rápida de horários</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-[5px] bg-white/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs">•</span>
                </div>
                <span className="text-sm">Aprovação pela direção</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-[5px] bg-white/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs">•</span>
                </div>
                <span className="text-sm">Acompanhamento em tempo real</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-[5px] bg-white/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs">•</span>
                </div>
                <span className="text-sm">Notificações via WhatsApp</span>
              </div>
            </div>
          </div>
        </div>

        {/* Painel Direito */}
        <div className="flex-1 p-6 sm:p-8 md:p-12 flex items-center justify-center">
          <div className="w-full max-w-md">
            {/* Logotipo em mobile/tablet */}
            <Link to="/login" className="flex justify-center mb-6 md:hidden cursor-pointer hover:opacity-80 transition-opacity">
              <img 
                src="/logo-ifma.png" 
                alt="IFMA" 
                className="h-10 w-auto"
              />
            </Link>
            <div className="mt-8 md:mt-0 mb-6 md:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-[#1a5f3f] mb-2">Bem-vindo!</h1>
            </div>


            {/* Formulário de Login */}
            <form onSubmit={handleLogin} className="space-y-4 md:space-y-5 animate-fadeIn">
                <Input
                  label="E-mail ou Usuário"
                  type="text"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailNotVerified(false); // Reseta estado quando email muda
                  }}
                  required
                  placeholder="email@acad.ifma.edu.br ou nomeusuario"
                />
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Senha
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="w-full px-4 py-3 pr-12 text-sm border-2 rounded-[5px] focus:outline-none focus:ring-2 focus:ring-[#2d8659] focus:ring-opacity-20 focus:border-[#2d8659] transition-all border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                <Button type="submit" isLoading={isLoading} className="w-full">
                  Entrar
                </Button>
              </form>

            {/* Mensagem de email não verificado */}
            {emailNotVerified && (
              <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-[5px]">
                <p className="text-sm text-yellow-800 mb-3">
                  Verifique seu e-mail antes de entrar.
                </p>
                <Button
                  type="button"
                  onClick={() => navigate(`/verify-email?email=${encodeURIComponent(email)}`)}
                  className="w-full bg-yellow-600 hover:bg-yellow-700"
                >
                  Verificar e-mail
                </Button>
              </div>
            )}

            {/* Link para cadastro */}
            <div className="text-center mt-6">
              <Link
                to="/register"
                className="text-sm text-gray-600 hover:text-[#2d8659]"
              >
                Não tem conta? <span className="font-semibold">Cadastre-se</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
