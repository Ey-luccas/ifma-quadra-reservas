import { useState } from 'react';
import { useToast } from '../components/Toast';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Footer } from '../components/Footer';
import api from '../config/api';

interface Guard {
  id: string;
  name: string;
  email: string;
  whatsapp: string | null;
  role: 'GUARD';
}

export function AdminGuardsPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    whatsapp: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [guards, setGuards] = useState<Guard[]>([]);
  const { showToast } = useToast();

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    // Email OU username deve ser fornecido
    if (!formData.email.trim() && !formData.username.trim()) {
      newErrors.email = 'E-mail ou nome de usuário é obrigatório';
    } else if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }

    if (formData.username.trim() && formData.username.length < 3) {
      newErrors.username = 'Username deve ter no mínimo 3 caracteres';
    }

    if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter no mínimo 6 caracteres';
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
      const response = await api.post('/admin/guards', {
        name: formData.name,
        email: formData.email.trim() || undefined,
        username: formData.username.trim() || undefined,
        password: formData.password,
        whatsapp: formData.whatsapp || undefined,
      });

      showToast('Vigia criado com sucesso!', 'success');
      
      // Limpa formulário
      setFormData({
        name: '',
        email: '',
        username: '',
        password: '',
        whatsapp: '',
      });
      setErrors({});

      // Adiciona o novo guard à lista (opcional)
      setGuards([...guards, response.data]);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro ao criar vigia';
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
    <div className="min-h-screen bg-gradient-to-br from-[#f5f7fa] to-[#e8ecf1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Título */}
        <h1 className="text-3xl md:text-4xl font-bold text-[#1a5f3f] mb-2">
          Cadastrar Vigia
        </h1>
        <p className="text-gray-600 mb-8 text-base md:text-lg">
          Crie uma conta para um novo vigia do sistema
        </p>

        {/* Formulário */}
        <div className="bg-white rounded-[5px] shadow-sm p-6 md:p-8 mb-8">
          <div className="flex items-center gap-2 mb-6">
            <h2 className="text-lg md:text-xl font-semibold text-gray-800">Dados do Vigia</h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Nome completo"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              error={errors.name}
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                E-mail ou Nome de usuário <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-500 mb-3">
                Preencha pelo menos um dos campos abaixo
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="E-mail (opcional)"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  error={errors.email}
                  placeholder="email@exemplo.com"
                />
                <Input
                  label="Nome de usuário (opcional)"
                  value={formData.username}
                  onChange={(e) => handleChange('username', e.target.value)}
                  error={errors.username}
                  placeholder="usuario123"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                label="WhatsApp (opcional)"
                type="tel"
                value={formData.whatsapp}
                onChange={(e) => handleChange('whatsapp', e.target.value)}
                placeholder="98999999999"
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
            </div>
            <div className="pt-4">
              <Button type="submit" isLoading={isLoading} className="w-full md:w-auto">
                Criar Vigia
              </Button>
            </div>
          </form>
        </div>

        {/* Lista de Vigias Cadastrados */}
        {guards.length > 0 && (
          <div className="bg-white rounded-[5px] shadow-sm p-6 md:p-8">
            <div className="flex items-center gap-2 mb-6">
              <h2 className="text-lg md:text-xl font-semibold text-gray-800">
                Vigias Cadastrados (Sessão)
              </h2>
            </div>
            <div className="space-y-3">
              {guards.map((guard) => (
                <div
                  key={guard.id}
                  className="p-4 bg-gray-50 rounded-[5px] border-l-4 border-l-[#2d8659]"
                >
                  <p className="font-semibold text-gray-800 mb-1">{guard.name}</p>
                  <p className="text-sm text-gray-600 mb-1">{guard.email}</p>
                  {guard.whatsapp && (
                    <p className="text-sm text-gray-600">WhatsApp: {guard.whatsapp}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
