import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../components/Toast';
import { Button } from '../components/Button';
import { Footer } from '../components/Footer';
import api from '../config/api';

interface CourtRequest {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  adminObservation: string | null;
  createdAt: string;
}

export function StudentRequestsPage() {
  const [requests, setRequests] = useState<CourtRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const response = await api.get('/requests/my');
      setRequests(response.data);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro ao carregar requisições';
      showToast(message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR');
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Pendente';
      case 'APPROVED':
        return 'Aprovado';
      case 'REJECTED':
        return 'Rejeitado';
      case 'CANCELLED':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-[#fff3cd] text-[#856404]';
      case 'APPROVED':
        return 'bg-[#d4edda] text-[#155724]';
      case 'REJECTED':
        return 'bg-[#f8d7da] text-[#721c24]';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCardBorderClass = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'border-l-[#ffc107]';
      case 'APPROVED':
        return 'border-l-[#28a745]';
      case 'REJECTED':
        return 'border-l-[#dc3545]';
      default:
        return 'border-l-transparent';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f5f7fa] to-[#e8ecf1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <p className="text-gray-600">Carregando...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f7fa] to-[#e8ecf1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Título */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#1a5f3f] mb-2">
              Minhas Requisições
            </h1>
            <p className="text-gray-600 text-base md:text-lg">
              Acompanhe o status das suas solicitações de reserva
            </p>
          </div>
          <Link to="/student/requests/new" className="mt-4 sm:mt-0">
            <Button className="w-full sm:w-auto">
              + Nova Requisição
            </Button>
          </Link>
        </div>

        {requests.length === 0 ? (
          <div className="bg-white rounded-[5px] p-12 text-center shadow-sm">
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">Nenhuma requisição encontrada</h3>
            <p className="text-gray-600 mb-6">Você ainda não fez nenhuma requisição.</p>
            <Link to="/student/requests/new">
              <Button>Fazer primeira requisição</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {requests.map((request) => (
              <div
                key={request.id}
                className={`bg-white rounded-[5px] p-6 shadow-sm border-l-4 transition-all hover:shadow-lg hover:-translate-y-0.5 ${getCardBorderClass(
                  request.status
                )}`}
              >
                {/* Header da Requisição */}
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-[#1a5f3f] mb-2">
                      Requisição de Reserva
                    </h3>
                  </div>
                  <span
                    className={`px-4 py-2 rounded-[5px] text-xs font-semibold uppercase tracking-wide ${getStatusBadgeClass(
                      request.status
                    )}`}
                  >
                    {getStatusLabel(request.status)}
                  </span>
                </div>

                {/* Detalhes da Requisição */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 bg-gray-50 rounded-[5px] mb-4">
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
                  <div>
                    <div className="text-xs uppercase text-gray-600 font-semibold tracking-wide mb-1">
                      Solicitado em
                    </div>
                    <div className="text-base font-medium text-gray-800">
                      {formatDateTime(request.createdAt)}
                    </div>
                  </div>
                </div>

                {/* Observações */}
                {request.adminObservation && (
                  <div className="p-4 bg-[#fff9e6] border-l-4 border-[#ffc107] rounded-[5px] mb-4">
                    <div className="text-xs uppercase text-[#856404] font-semibold mb-2">
                      Observações do Administrador
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
