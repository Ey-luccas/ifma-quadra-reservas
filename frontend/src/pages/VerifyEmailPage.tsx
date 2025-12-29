import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '../components/Toast';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import api from '../config/api';

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const emailFromUrl = searchParams.get('email') || '';
  
  const [email, setEmail] = useState(emailFromUrl);
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      showToast('Email é obrigatório', 'error');
      return;
    }

    if (code.length !== 4) {
      showToast('Código deve ter 4 dígitos', 'error');
      return;
    }

    setIsLoading(true);

    try {
      await api.post('/auth/verify-email', {
        email: email.trim(),
        code: code.trim(),
      });

      showToast('E-mail verificado com sucesso!', 'success');
      
      // Redireciona para login após 1 segundo
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro ao verificar código';
      showToast(message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Permite apenas números e limita a 4 dígitos
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setCode(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a5f3f] to-[#0d3625] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decoração de quadra */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute w-full h-0.5 bg-white top-1/2"></div>
        <div className="absolute w-0.5 h-full bg-white left-1/2"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 border-2 border-white rounded-[5px]"></div>
      </div>

      <div className="bg-white rounded-[5px] shadow-2xl overflow-hidden max-w-md w-full relative z-10">
        <div className="p-6 sm:p-8 md:p-12">
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1a5f3f] mb-2">
              Verifique seu e-mail
            </h1>
            <p className="text-gray-600 text-sm">
              Enviamos um código de 4 dígitos para seu e-mail.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="E-mail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="seu.nome@acad.ifma.edu.br"
              disabled={!!emailFromUrl}
            />

            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Código de verificação
              </label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={4}
                value={code}
                onChange={handleCodeChange}
                required
                placeholder="0000"
                className="w-full px-4 py-3 text-center text-2xl font-bold tracking-widest border-2 border-gray-200 rounded-[5px] focus:outline-none focus:ring-2 focus:ring-[#2d8659] focus:ring-opacity-20 focus:border-[#2d8659] transition-all"
              />
              <p className="mt-1 text-xs text-gray-500">
                Digite o código de 4 dígitos enviado para seu e-mail
              </p>
            </div>

            <Button type="submit" isLoading={isLoading} className="w-full">
              Confirmar código
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-sm text-gray-600 hover:text-[#2d8659]"
            >
              Voltar para login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

