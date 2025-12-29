import { z } from 'zod';
import { RequestStatus } from '@prisma/client';

/**
 * Schema de validação para criação de requisição de quadra
 */
export const createRequestSchema = z.object({
  date: z.string().refine(
    (date) => !isNaN(Date.parse(date)),
    'Data inválida'
  ),
  startTime: z.string().min(1, 'Horário de início é obrigatório'),
  endTime: z.string().min(1, 'Horário de fim é obrigatório'),
  optionalObservation: z.string().optional(),
});

/**
 * Schema de validação para atualização de status da requisição
 */
export const updateRequestStatusSchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED', 'CANCELLED']),
  adminObservation: z.string().optional(),
});

export type CreateRequestInput = z.infer<typeof createRequestSchema>;
export type UpdateRequestStatusInput = z.infer<typeof updateRequestStatusSchema>;

