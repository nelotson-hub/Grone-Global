// Frontend-only submission endpoints and placeholders (no backend server required)
// Replace YOUR_WEB3FORMS_ACCESS_KEY with your live key from https://web3forms.com
// Replace YOUR_WHATSAPP_NUMBER with your international WhatsApp number (digits only, e.g. 2348030004766)

export const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';
export const WEB3FORMS_ACCESS_KEY = 'YOUR_WEB3FORMS_ACCESS_KEY';
export const WHATSAPP_NUMBER = 'YOUR_WHATSAPP_NUMBER';

export function buildWhatsAppUrl(message?: string): string {
  const baseUrl = `https://wa.me/${WHATSAPP_NUMBER}`;
  if (!message) return baseUrl;
  return `${baseUrl}?text=${encodeURIComponent(message)}`;
}
