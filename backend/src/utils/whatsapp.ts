import { CourtRequest, User } from '@prisma/client';

/**
 * Dados completos da requisição com informações do usuário
 */
export interface RequestWithUser extends CourtRequest {
  user: User | Pick<User, 'id' | 'name' | 'email' | 'whatsapp' | 'birthDate'>;
}

/**
 * Formata data para formato brasileiro (DD/MM/AAAA)
 */
function formatDate(date: Date): string {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Remove caracteres não numéricos do WhatsApp
 * @param whatsapp Número de WhatsApp (pode conter espaços, traços, parênteses)
 * @returns Número limpo apenas com dígitos
 */
function cleanWhatsAppNumber(whatsapp: string | null | undefined): string {
  if (!whatsapp) return '';
  return whatsapp.replace(/\D/g, '');
}

/**
 * Constrói mensagem de WhatsApp para o aluno baseada no status da requisição
 * @param request Requisição com dados do usuário
 * @returns Texto da mensagem formatada para WhatsApp
 */
export function buildWhatsAppMessage(request: RequestWithUser): string {
  const { user, date, startTime, endTime, status, adminObservation } = request;
  const formattedDate = formatDate(new Date(date));
  const studentName = user.name;

  let message = `Olá, ${studentName}.\n\n`;

  switch (status) {
    case 'APPROVED':
      message += `✅ Sua reserva da quadra do IFMA foi *APROVADA*.\n\n`;
      message += `📅 Data: ${formattedDate}\n`;
      message += `⏰ Horário: ${startTime} às ${endTime}\n`;
      
      if (adminObservation) {
        message += `\n📝 Observações:\n${adminObservation}\n`;
      }
      
      message += `\nQualquer dúvida, procure a coordenação.`;
      break;

    case 'REJECTED':
      message += `❌ Sua reserva da quadra do IFMA *NÃO foi aprovada*.\n\n`;
      message += `📅 Data solicitada: ${formattedDate}\n`;
      message += `⏰ Horário solicitado: ${startTime} às ${endTime}\n`;
      
      if (adminObservation) {
        message += `\n📝 Motivo/Observações:\n${adminObservation}\n`;
      } else {
        message += `\nPara mais informações, entre em contato com a coordenação.`;
      }
      break;

    case 'CANCELLED':
      message += `🚫 Sua reserva da quadra do IFMA foi *CANCELADA*.\n\n`;
      message += `📅 Data: ${formattedDate}\n`;
      message += `⏰ Horário: ${startTime} às ${endTime}\n`;
      
      if (adminObservation) {
        message += `\n📝 Observações:\n${adminObservation}\n`;
      }
      break;

    default:
      message += `Sua reserva da quadra do IFMA está com status: ${status}.\n\n`;
      message += `📅 Data: ${formattedDate}\n`;
      message += `⏰ Horário: ${startTime} às ${endTime}\n`;
  }

  return message;
}

/**
 * Constrói link do WhatsApp (wa.me) para envio de mensagem
 * @param request Requisição com dados do usuário
 * @returns URL completa do WhatsApp com mensagem codificada
 */
export function buildWhatsAppLink(request: RequestWithUser): string {
  const whatsappNumber = cleanWhatsAppNumber(request.user.whatsapp);
  
  if (!whatsappNumber) {
    throw new Error('Número de WhatsApp não encontrado para o aluno');
  }

  const message = buildWhatsAppMessage(request);
  const encodedMessage = encodeURIComponent(message);
  
  // Formato: https://wa.me/55NUMERO?text=MENSAGEM
  // O número deve incluir código do país (55 para Brasil) sem o 0 inicial
  const formattedNumber = whatsappNumber.startsWith('55') 
    ? whatsappNumber 
    : `55${whatsappNumber}`;

  return `https://wa.me/${formattedNumber}?text=${encodedMessage}`;
}

/**
 * Placeholder para futura integração com API oficial do WhatsApp
 * 
 * FUTURAMENTE: Esta função cuidará de enviar a mensagem
 * automaticamente pela API oficial do WhatsApp (Cloud API),
 * usando tokens e templates aprovados.
 * 
 * A API do WhatsApp Business requer:
 * - Token de acesso válido
 * - Número de telefone verificado
 * - Template de mensagem aprovado (para mensagens transacionais)
 * - Ou uso de API de conversas (para mensagens interativas)
 * 
 * Exemplo de implementação futura:
 * 
 * async function sendWhatsAppMessage(
 *   phoneNumber: string,
 *   message: string,
 *   templateId?: string
 * ): Promise<void> {
 *   const response = await fetch('https://graph.facebook.com/v18.0/{phone-number-id}/messages', {
 *     method: 'POST',
 *     headers: {
 *       'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
 *       'Content-Type': 'application/json',
 *     },
 *     body: JSON.stringify({
 *       messaging_product: 'whatsapp',
 *       to: phoneNumber,
 *       type: 'text',
 *       text: { body: message }
 *     })
 *   });
 *   // ... tratamento de resposta
 * }
 * 
 * @param request Requisição com dados do usuário
 * @returns Promise<void> - Futuramente enviará mensagem automaticamente
 */
export async function placeholderFutureApiMessage(
  request: RequestWithUser
): Promise<void> {
  // Esta função está preparada para futura implementação
  // Por enquanto, não faz nada - o envio é manual via link wa.me
  // 
  // Quando a integração com WhatsApp Cloud API estiver pronta:
  // 1. Adicionar variáveis de ambiente (WHATSAPP_ACCESS_TOKEN, etc.)
  // 2. Implementar chamada à API do WhatsApp
  // 3. Tratar erros e retries
  // 4. Logar envios para auditoria
  
  console.log('Placeholder: Futura integração com WhatsApp Cloud API');
  console.log('Por enquanto, use o link wa.me gerado para envio manual');
  
  // Não implementar ainda - apenas placeholder
  return Promise.resolve();
}

