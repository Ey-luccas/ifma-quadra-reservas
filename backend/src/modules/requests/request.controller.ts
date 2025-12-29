import { Request, Response, NextFunction } from 'express';
import { requestService } from './request.service';
import {
  createRequestSchema,
  updateRequestStatusSchema,
} from './request.types';
import { RequestStatus } from '@prisma/client';

/**
 * Controller de requisições de quadra
 * Lida com as requisições HTTP relacionadas a requisições
 */
export class RequestController {
  /**
   * POST /requests
   * Cria uma nova requisição de quadra (apenas STUDENT)
   */
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Usuário não autenticado' });
      }

      // Valida body da requisição
      const validatedData = createRequestSchema.parse(req.body);

      // Chama serviço
      const request = await requestService.createRequest(
        req.user.id,
        validatedData
      );

      res.status(201).json(request);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /requests/my
   * Busca todas as requisições do aluno logado (apenas STUDENT)
   */
  async getMyRequests(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Usuário não autenticado' });
      }

      const requests = await requestService.getMyRequests(req.user.id);
      res.json(requests);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /admin/requests
   * Lista todas as requisições com filtros opcionais (apenas ADMIN)
   */
  async getAllRequests(req: Request, res: Response, next: NextFunction) {
    try {
      const filters: {
        status?: RequestStatus;
        dateFrom?: string;
        dateTo?: string;
      } = {};

      if (req.query.status) {
        filters.status = req.query.status as RequestStatus;
      }
      if (req.query.dateFrom) {
        filters.dateFrom = req.query.dateFrom as string;
      }
      if (req.query.dateTo) {
        filters.dateTo = req.query.dateTo as string;
      }

      const requests = await requestService.getAllRequests(filters);
      res.json(requests);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /admin/requests/:id/status
   * Atualiza o status de uma requisição (apenas ADMIN)
   */
  async updateRequestStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;

      // Valida body da requisição
      const validatedData = updateRequestStatusSchema.parse(req.body);

      // Chama serviço
      const result = await requestService.updateRequestStatus(
        id,
        validatedData
      );

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /guard/agenda
   * Busca requisições aprovadas para uma data específica (apenas GUARD)
   */
  async getGuardAgenda(req: Request, res: Response, next: NextFunction) {
    try {
      const { date } = req.query;

      if (!date || typeof date !== 'string') {
        return res.status(400).json({
          message: 'Parâmetro "date" é obrigatório (formato: YYYY-MM-DD)',
        });
      }

      const requests = await requestService.getApprovedRequestsByDate(date);
      res.json(requests);
    } catch (error) {
      next(error);
    }
  }
}

export const requestController = new RequestController();

