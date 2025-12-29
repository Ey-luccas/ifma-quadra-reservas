import { useState, useEffect } from 'react';
import { useToast } from '../components/Toast';
import { Button } from '../components/Button';
import { Footer } from '../components/Footer';
import { openWhatsAppLink, copyToClipboard as copyText } from '../utils/whatsapp';
import api from '../config/api';

interface CourtRequest {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  adminObservation: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    whatsapp: string | null;
    birthDate: string | null;
  };
}

export function AdminRequestsPage() {
  const [requests, setRequests] = useState<CourtRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    dateFrom: '',
    dateTo: '',
  });
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<'APPROVED' | 'REJECTED' | null>(null);
  const [observation, setObservation] = useState('');
  const [whatsappData, setWhatsappData] = useState<{
    message: string;
    link: string | null;
  } | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    loadRequests();
  }, [filters]);

  const loadRequests = async () => {
    setIsLoading(true);
    try {
      const params: any = {};
      if (filters.status) params.status = filters.status;
      if (filters.dateFrom) params.dateFrom = filters.dateFrom;
      if (filters.dateTo) params.dateTo = filters.dateTo;

      const response = await api.get('/admin/requests', { params });
      setRequests(response.data);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro ao carregar requisições';
      showToast(message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!selectedRequest || !pendingAction) return;

    try {
      const response = await api.patch(`/admin/requests/${selectedRequest}/status`, {
        status: pendingAction,
        adminObservation: observation || undefined,
      });

      setWhatsappData({
        message: response.data.whatsappMessagePreview,
        link: response.data.whatsappLink || null,
      });
      
      showToast('Status atualizado com sucesso!', 'success');
      setSelectedRequest(null);
      setPendingAction(null);
      setObservation('');
      loadRequests();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro ao atualizar status';
      showToast(message, 'error');
    }
  };

  const openActionModal = (requestId: string, action: 'APPROVED' | 'REJECTED') => {
    setSelectedRequest(requestId);
    setPendingAction(action);
    setObservation('');
  };

  const handleCopyMessage = async () => {
    if (!whatsappData) return;
    const success = await copyText(whatsappData.message);
    if (success) {
      showToast('Mensagem copiada!', 'success');
    } else {
      showToast('Erro ao copiar mensagem', 'error');
    }
  };

  const handleSendWhatsApp = () => {
    if (!whatsappData?.link) {
      showToast('Link do WhatsApp não disponível', 'error');
      return;
    }
    openWhatsAppLink(whatsappData.link);
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
        <h1 className="text-3xl md:text-4xl font-bold text-[#1a5f3f] mb-2">
          Painel do Diretor
        </h1>
        <p className="text-gray-600 mb-8 text-base md:text-lg">
          Gerencie as solicitações de reserva da quadra poliesportiva
        </p>

        {/* Filtros */}
        <div className="bg-white rounded-[5px] p-6 md:p-8 mb-8 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <h2 className="text-lg md:text-xl font-semibold text-gray-800">Filtros</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-[5px] text-sm focus:outline-none focus:ring-2 focus:ring-[#2d8659] focus:ring-opacity-20 focus:border-[#2d8659] transition-all"
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              >
                <option value="">Todos</option>
                <option value="PENDING">Pendente</option>
                <option value="APPROVED">Aprovado</option>
                <option value="REJECTED">Rejeitado</option>
                <option value="CANCELLED">Cancelado</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Data Inicial</label>
              <input
                type="date"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-[5px] text-sm focus:outline-none focus:ring-2 focus:ring-[#2d8659] focus:ring-opacity-20 focus:border-[#2d8659] transition-all"
                value={filters.dateFrom}
                onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Data Final</label>
              <input
                type="date"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-[5px] text-sm focus:outline-none focus:ring-2 focus:ring-[#2d8659] focus:ring-opacity-20 focus:border-[#2d8659] transition-all"
                value={filters.dateTo}
                onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={loadRequests}
                className="w-full px-6 py-3 bg-gradient-to-r from-[#2d8659] to-[#1a5f3f] text-white rounded-[5px] font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all text-sm"
              >
                Filtrar
              </button>
            </div>
          </div>
        </div>

        {/* Lista de Requisições */}
        {requests.length === 0 ? (
          <div className="bg-white rounded-[5px] p-12 text-center shadow-sm">
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">Nenhuma requisição encontrada</h3>
            <p className="text-gray-600">Não há requisições que correspondam aos filtros selecionados.</p>
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
                      {request.user.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                      <span>✉️</span>
                      <span>{request.user.email}</span>
                    </div>
                    {request.user.whatsapp && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>WhatsApp: {request.user.whatsapp}</span>
                      </div>
                    )}
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
                      Observações
                    </div>
                    <div className="text-sm text-gray-700 leading-relaxed">
                      {request.adminObservation}
                    </div>
                  </div>
                )}

                {/* Ações */}
                <div className="flex flex-wrap gap-3">
                  {request.status === 'PENDING' ? (
                    <>
                      {selectedRequest === request.id ? (
                        <div className="w-full space-y-3 p-4 bg-gray-50 rounded-[5px]">
                          <p className="text-sm text-gray-600 font-medium">
                            {pendingAction === 'APPROVED' ? 'Aprovar' : 'Recusar'} requisição
                          </p>
                          <textarea
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-[5px] text-sm focus:outline-none focus:ring-2 focus:ring-[#2d8659] focus:ring-opacity-20 focus:border-[#2d8659] resize-y min-h-[100px]"
                            placeholder="Observação para o aluno (opcional)"
                            value={observation}
                            onChange={(e) => setObservation(e.target.value)}
                          />
                          <div className="flex gap-3">
                            <Button
                              variant={pendingAction === 'APPROVED' ? 'primary' : 'danger'}
                              onClick={handleStatusUpdate}
                              className="flex-1"
                            >
                              Confirmar
                            </Button>
                            <Button
                              variant="secondary"
                              onClick={() => {
                                setSelectedRequest(null);
                                setPendingAction(null);
                                setObservation('');
                              }}
                              className="flex-1"
                            >
                              Cancelar
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <Button
                            variant="primary"
                            onClick={() => openActionModal(request.id, 'APPROVED')}
                            className="flex items-center gap-2"
                          >
                            Aprovar
                          </Button>
                          <Button
                            variant="danger"
                            onClick={() => openActionModal(request.id, 'REJECTED')}
                            className="flex items-center gap-2"
                          >
                            <span>✗</span>
                            <span>Recusar</span>
                          </Button>
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      {request.status === 'APPROVED' && request.user.whatsapp && (
                        <button
                          onClick={() => {
                            // Gera link do WhatsApp para requisição aprovada
                            if (!request.user.whatsapp) return;
                            const message = encodeURIComponent(
                              `Olá ${request.user.name}! Sua reserva da quadra foi aprovada.\n\nData: ${formatDate(request.date)}\nHorário: ${request.startTime} às ${request.endTime}${request.adminObservation ? `\n\nObservações: ${request.adminObservation}` : ''}`
                            );
                            const phone = request.user.whatsapp.replace(/\D/g, '');
                            const formattedPhone = phone.startsWith('55') ? phone : `55${phone}`;
                            window.open(`https://wa.me/${formattedPhone}?text=${message}`, '_blank');
                          }}
                          className="px-5 py-2.5 bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white rounded-[5px] font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2"
                        >
                          WhatsApp
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal de mensagem WhatsApp */}
        {whatsappData && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fadeIn">
            <div className="bg-white rounded-[5px] p-6 md:p-8 max-w-lg w-full animate-slideUp shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-semibold text-gray-800">Mensagem para o aluno</h3>
                <button
                  onClick={() => setWhatsappData(null)}
                  className="text-gray-500 hover:text-gray-700 text-3xl leading-none"
                >
                  ×
                </button>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preview da mensagem:
                </label>
                <textarea
                  readOnly
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-[5px] bg-gray-50 text-sm text-gray-700 resize-none"
                  value={whatsappData.message}
                  rows={8}
                />
              </div>
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  onClick={handleCopyMessage}
                  className="flex-1"
                >
                  Copiar mensagem
                </Button>
                {whatsappData.link && (
                  <Button
                    onClick={handleSendWhatsApp}
                    className="flex-1 bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:shadow-lg"
                  >
                    Enviar no WhatsApp
                  </Button>
                )}
              </div>
              {!whatsappData.link && (
                <p className="text-xs text-gray-500 text-center mt-4">
                  WhatsApp não cadastrado para este aluno
                </p>
              )}
              <Button
                variant="secondary"
                onClick={() => setWhatsappData(null)}
                className="w-full mt-4"
              >
                Fechar
              </Button>
            </div>
          </div>
        )}
      </div>

      <Footer />

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
