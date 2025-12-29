import { RequestStatus } from '@prisma/client';
import { prisma } from '../../prisma/client';
import { createError } from '../../middleware/errorMiddleware';
import { buildWhatsAppMessage, buildWhatsAppLink } from '../../utils/whatsapp';
import {
  CreateRequestInput,
  UpdateRequestStatusInput,
} from './request.types';

/**
 * Serviço de requisições de quadra
 * Contém toda a lógica de negócio relacionada a requisições
 */
export class RequestService {
  /**
   * Cria uma nova requisição de quadra (apenas para STUDENT)
   */
  async createRequest(userId: string, input: CreateRequestInput) {
    // Converte data de string ISO para Date
    const date = new Date(input.date);

    // Valida se a data não é no passado
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    if (date < now) {
      throw createError('Não é possível criar requisição para datas passadas', 400);
    }

    // Cria a requisição com status PENDING
    const request = await prisma.courtRequest.create({
      data: {
        userId,
        date,
        startTime: input.startTime,
        endTime: input.endTime,
        status: RequestStatus.PENDING,
        adminObservation: null,
      },
      include: {
        user: true,
      },
    });

    return request;
  }

  /**
   * Busca todas as requisições do aluno logado
   */
  async getMyRequests(userId: string) {
    const requests = await prisma.courtRequest.findMany({
      where: {
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            whatsapp: true,
            birthDate: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
    });

    return requests;
  }

  /**
   * Lista todas as requisições (para ADMIN)
   * Permite filtros opcionais por status e intervalo de datas
   */
  async getAllRequests(filters: {
    status?: RequestStatus;
    dateFrom?: string;
    dateTo?: string;
  }) {
    const where: any = {};

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.dateFrom || filters.dateTo) {
      where.date = {};
      if (filters.dateFrom) {
        where.date.gte = new Date(filters.dateFrom);
      }
      if (filters.dateTo) {
        // Adiciona 1 dia para incluir o dia final
        const dateTo = new Date(filters.dateTo);
        dateTo.setDate(dateTo.getDate() + 1);
        where.date.lt = dateTo;
      }
    }

    const requests = await prisma.courtRequest.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            whatsapp: true,
            birthDate: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
    });

    return requests;
  }

  /**
   * Atualiza o status de uma requisição (apenas ADMIN)
   * Retorna a requisição atualizada e a mensagem de WhatsApp
   */
  async updateRequestStatus(
    requestId: string,
    input: UpdateRequestStatusInput
  ) {
    // Busca a requisição
    const request = await prisma.courtRequest.findUnique({
      where: { id: requestId },
      include: {
        user: true,
      },
    });

    if (!request) {
      throw createError('Requisição não encontrada', 404);
    }

    // Atualiza a requisição
    const updatedRequest = await prisma.courtRequest.update({
      where: { id: requestId },
      data: {
        status: input.status as RequestStatus,
        adminObservation: input.adminObservation || null,
      },
      include: {
        user: true,
      },
    });

    // Gera mensagem de WhatsApp e link
    const whatsappMessage = buildWhatsAppMessage(updatedRequest);
    let whatsappLink: string | null = null;

    try {
      // Tenta gerar o link do WhatsApp
      // Se o aluno não tiver WhatsApp cadastrado, o link será null
      whatsappLink = buildWhatsAppLink(updatedRequest);
    } catch (error) {
      // Se não houver WhatsApp, o link fica null
      // O frontend pode mostrar apenas a mensagem para copiar
      whatsappLink = null;
    }

    return {
      request: updatedRequest,
      whatsappMessagePreview: whatsappMessage,
      whatsappLink,
    };
  }

  /**
   * Busca requisições aprovadas para uma data específica (para GUARD)
   */
  async getApprovedRequestsByDate(date: string) {
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    
    const nextDay = new Date(targetDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const requests = await prisma.courtRequest.findMany({
      where: {
        status: RequestStatus.APPROVED,
        date: {
          gte: targetDate,
          lt: nextDay,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            whatsapp: true,
            birthDate: true,
          },
        },
      },
      orderBy: {
        startTime: 'asc',
      },
    });

    return requests;
  }
}

export const requestService = new RequestService();

