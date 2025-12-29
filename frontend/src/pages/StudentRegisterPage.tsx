import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '../components/Toast';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import api from '../config/api';

export function StudentRegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    birthDate: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!formData.email.includes('@acad.ifma.edu.br')) {
      newErrors.email = 'E-mail deve ser do domínio @acad.ifma.edu.br';
    }

    if (!formData.whatsapp.trim()) {
      newErrors.whatsapp = 'WhatsApp é obrigatório';
    }

    if (!formData.birthDate) {
      newErrors.birthDate = 'Data de nascimento é obrigatória';
    }

    if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter no mínimo 6 caracteres';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Senhas não coincidem';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsLoading(true);

    try {
      await api.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        whatsapp: formData.whatsapp,
        birthDate: formData.birthDate,
        password: formData.password,
      });

      // Não loga automaticamente - redireciona para verificação
      showToast('Verifique seu e-mail e digite o código enviado.', 'success');
      navigate(`/verify-email?email=${encodeURIComponent(formData.email)}`);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro ao realizar cadastro';
      showToast(message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Limpa erro do campo quando o usuário começa a digitar
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
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
        <div className="flex-1 bg-gradient-to-br from-[#2d8659] to-[#1a5f3f] p-6 md:p-8 lg:p-12 text-white flex flex-col justify-center relative min-h-[200px] md:min-h-0">
          {/* Decorações */}
          <div className="absolute top-5 right-5 w-24 h-24 border-2 border-white/30 rounded-[5px]"></div>
          <div className="absolute bottom-5 left-5 w-20 h-20 bg-white/10 rounded-[5px] transform rotate-45"></div>

          <div className="relative z-10">
            <Link to="/login" className="flex items-center justify-center md:justify-start gap-3 mb-4 md:mb-6 cursor-pointer hover:opacity-80 transition-opacity">
              <img 
                src="/logo-ifma.png" 
                alt="IFMA" 
                className="h-10 md:h-12 w-auto brightness-0 invert"
              />
            </Link>
            <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4 text-center md:text-left">
              Sistema de Reservas da Quadra Poliesportiva
            </h2>
            <p className="opacity-90 leading-relaxed mb-6 md:mb-8 text-sm md:text-base text-center md:text-left">
              Reserve seu horário, acompanhe aprovações e mantenha tudo sob controle.
            </p>
            
            <div className="space-y-3 md:space-y-4 hidden md:block">
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
        <div className="flex-1 p-6 sm:p-8 md:p-12 flex items-start md:items-center justify-center overflow-y-auto max-h-screen">
          <div className="w-full max-w-md pt-[40px] md:pt-0">
            {/* Logotipo em mobile/tablet */}
            <Link to="/login" className="flex justify-center mb-6 md:hidden cursor-pointer hover:opacity-80 transition-opacity">
              <img 
                src="/logo-ifma.png" 
                alt="IFMA" 
                className="h-10 w-auto"
              />
            </Link>
            <div className="mt-4 md:mt-5 mb-6 md:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-[#1a5f3f] mb-2">Meu Cadastro</h1>
              <p className="text-gray-600 text-sm">Preencha os dados para criar sua conta</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Nome completo"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                error={errors.name}
                required
                placeholder="João Silva"
              />
              <Input
                label="E-mail Institucional"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                error={errors.email}
                helperText="Use seu e-mail institucional @acad.ifma.edu.br"
                required
                placeholder="seu.nome@acad.ifma.edu.br"
              />
              <Input
                label="WhatsApp"
                type="tel"
                value={formData.whatsapp}
                onChange={(e) => handleChange('whatsapp', e.target.value)}
                error={errors.whatsapp}
                placeholder="98999999999"
                required
              />
              <Input
                label="Data de nascimento"
                type="date"
                value={formData.birthDate}
                onChange={(e) => handleChange('birthDate', e.target.value)}
                error={errors.birthDate}
                required
              />
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  required
                  placeholder="Mínimo 6 caracteres"
                  className={`w-full px-4 py-3 pr-12 text-sm border-2 rounded-[5px] focus:outline-none focus:ring-2 focus:ring-[#2d8659] focus:ring-opacity-20 focus:border-[#2d8659] transition-all ${
                    errors.password ? 'border-red-500' : 'border-gray-200'
                  }`}
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
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirmar senha
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  required
                  placeholder="Digite a senha novamente"
                  className={`w-full px-4 py-3 pr-12 text-sm border-2 rounded-[5px] focus:outline-none focus:ring-2 focus:ring-[#2d8659] focus:ring-opacity-20 focus:border-[#2d8659] transition-all ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-200'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {showConfirmPassword ? (
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
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>
              <Button type="submit" isLoading={isLoading} className="w-full">
                Criar Conta
              </Button>
            </form>

            <div className="text-center mt-6">
              <Link
                to="/login"
                className="text-sm text-gray-600 hover:text-[#2d8659]"
              >
                Já tem uma conta? <span className="font-semibold">Entrar</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
