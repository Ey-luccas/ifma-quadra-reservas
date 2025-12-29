import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/Toast';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Footer } from '../components/Footer';
import api from '../config/api';

export function NewRequestPage() {
  const [formData, setFormData] = useState({
    date: '',
    startTime: '',
    endTime: '',
    optionalObservation: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await api.post('/requests', {
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        optionalObservation: formData.optionalObservation || undefined,
      });

      showToast('Requisição enviada com sucesso!', 'success');
      navigate('/student/requests');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro ao criar requisição';
      showToast(message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Define data mínima como hoje
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f7fa] to-[#e8ecf1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Título */}
        <h1 className="text-3xl md:text-4xl font-bold text-[#1a5f3f] mb-2">
          Nova Requisição
        </h1>
        <p className="text-gray-600 mb-8 text-base md:text-lg">
          Preencha os dados para solicitar uma reserva da quadra
        </p>

        {/* Formulário */}
        <div className="bg-white rounded-[5px] shadow-sm p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                label="Data"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                min={today}
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Horário de início"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  required
                />
                <Input
                  label="Horário de fim"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Observação (opcional)
              </label>
              <textarea
                className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-[5px] focus:outline-none focus:ring-2 focus:ring-[#2d8659] focus:ring-opacity-20 focus:border-[#2d8659] transition-all resize-y min-h-[100px]"
                value={formData.optionalObservation}
                onChange={(e) =>
                  setFormData({ ...formData, optionalObservation: e.target.value })
                }
                rows={4}
                placeholder="Adicione alguma observação sobre sua solicitação..."
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/student/requests')}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button type="submit" isLoading={isLoading} className="flex-1">
                Enviar Pedido
              </Button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}
