import { useState, useEffect } from 'react';
import { useToast } from '../components/Toast';
import { Input } from '../components/Input';
import { Footer } from '../components/Footer';
import api from '../config/api';

interface CourtRequest {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  adminObservation: string | null;
  user: {
    id: string;
    name: string;
    whatsapp: string | null;
  };
}

export function GuardAgendaPage() {
  const [date, setDate] = useState(() => {
    // Data padrão: hoje
    return new Date().toISOString().split('T')[0];
  });
  const [requests, setRequests] = useState<CourtRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (date) {
      loadAgenda();
    }
  }, [date]);

  const loadAgenda = async () => {
    if (!date) return;

    setIsLoading(true);
    try {
      const response = await api.get('/guard/agenda', {
        params: { date },
      });
      setRequests(response.data);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro ao carregar agenda';
      showToast(message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f7fa] to-[#e8ecf1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Título */}
        <h1 className="text-3xl md:text-4xl font-bold text-[#1a5f3f] mb-2">
          Agenda do Vigia
        </h1>
        <p className="text-gray-600 mb-8 text-base md:text-lg">
          Visualize as reservas aprovadas para a data selecionada
        </p>

        {/* Filtro de Data */}
        <div className="bg-white rounded-[5px] p-6 md:p-8 mb-8 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-lg md:text-xl font-semibold text-gray-800">Selecionar Data</h2>
          </div>
          <Input
            label="Data"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        {/* Lista de Reservas */}
        {isLoading ? (
          <div className="bg-white rounded-[5px] p-12 text-center shadow-sm">
            <p className="text-gray-600">Carregando...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="bg-white rounded-[5px] p-12 text-center shadow-sm">
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">Nenhuma reserva encontrada</h3>
            <p className="text-gray-600">Não há reservas aprovadas para {formatDate(date)}.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {requests.map((request) => (
              <div
                key={request.id}
                className="bg-white rounded-[5px] p-6 shadow-sm border-l-4 border-l-[#28a745] transition-all hover:shadow-lg hover:-translate-y-0.5"
              >
                {/* Header da Reserva */}
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-[#1a5f3f] mb-2">
                      {request.user.name}
                    </h3>
                    {request.user.whatsapp && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>WhatsApp: {request.user.whatsapp}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Detalhes da Reserva */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 bg-gray-50 rounded-[5px] mb-4">
                  <div>
                    <div className="text-xs uppercase text-gray-600 font-semibold tracking-wide mb-1">
                      Data
                    </div>
                    <div className="text-base font-medium text-gray-800">
                      {formatDate(request.date)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs uppercase text-gray-600 font-semibold tracking-wide mb-1">
                      Horário
                    </div>
                    <div className="text-base font-medium text-gray-800">
                      {request.startTime} às {request.endTime}
                    </div>
                  </div>
                </div>

                {/* Observações */}
                {request.adminObservation && (
                  <div className="p-4 bg-[#fff9e6] border-l-4 border-[#ffc107] rounded-[5px]">
                    <div className="text-xs uppercase text-[#856404] font-semibold mb-2">
                      Observações
                    </div>
                    <div className="text-sm text-gray-700 leading-relaxed">
                      {request.adminObservation}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
