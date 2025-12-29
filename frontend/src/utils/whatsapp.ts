/**
 * Utilitários para integração com WhatsApp
 * 
 * FUTURO: Quando a API oficial do WhatsApp (Cloud API) for integrada,
 * esta função será implementada para envio automático de mensagens.
 * 
 * Exemplo de implementação futura:
 * 
 * export async function sendViaWhatsAppApi(
 *   phoneNumber: string,
 *   message: string,
 *   templateId?: string
 * ): Promise<{ success: boolean; messageId?: string; error?: string }> {
 *   try {
 *     const response = await fetch(
 *       `https://graph.facebook.com/v18.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
 *       {
 *         method: 'POST',
 *         headers: {
 *           'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
 *           'Content-Type': 'application/json',
 *         },
 *         body: JSON.stringify({
 *           messaging_product: 'whatsapp',
 *           to: phoneNumber,
 *           type: 'text',
 *           text: { body: message }
 *         })
 *       }
 *     );
 * 
 *     if (!response.ok) {
 *       throw new Error('Erro ao enviar mensagem via WhatsApp API');
 *     }
 * 
 *     const data = await response.json();
 *     return { success: true, messageId: data.messages[0].id };
 *   } catch (error) {
 *     return { 
 *       success: false, 
 *       error: error instanceof Error ? error.message : 'Erro desconhecido' 
 *     };
 *   }
 * }
 * 
 * Requisitos para implementação futura:
 * - Token de acesso do WhatsApp Business API
 * - Número de telefone verificado
 * - Template de mensagem aprovado (para mensagens transacionais)
 * - Ou uso de API de conversas (para mensagens interativas)
 * 
 * Por enquanto, usamos apenas links wa.me para envio manual.
 */

/**
 * Abre link do WhatsApp em nova aba
 * @param whatsappLink Link completo do WhatsApp (wa.me)
 */
export function openWhatsAppLink(whatsappLink: string): void {
  if (!whatsappLink) {
    console.error('Link do WhatsApp não fornecido');
    return;
  }
  
  // Abre em nova aba
  window.open(whatsappLink, '_blank');
}

/**
 * Copia texto para área de transferência
 * @param text Texto a ser copiado
 * @returns Promise<boolean> - true se copiado com sucesso
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Erro ao copiar para área de transferência:', error);
    return false;
  }
}

