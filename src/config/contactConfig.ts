// Frontend-only submission endpoints and placeholders (no backend server required)
// Replace YOUR_WEB3FORMS_ACCESS_KEY with your live key from https://web3forms.com

export const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';
export const WEB3FORMS_ACCESS_KEY = 'YOUR_WEB3FORMS_ACCESS_KEY';

// Official Grone Global WhatsApp: the Business short link for plain chats, the number for pre-filled messages
// (wa.me/message/ links cannot carry pre-filled text).
export const WHATSAPP_NUMBER = '2348147650319';
export const WHATSAPP_BUSINESS_LINK = 'https://wa.me/message/QCYVYDS3JX2TO1';

// Shown in the footer and the Paints quote section. Confirm the address is real before launch.
export const COMPANY_ADDRESS = 'Plot 14B Industrial Estate Layout, Lekki-Epe Expressway, Lagos, Nigeria (Grone Global Ltd Complex)';
export const COMPANY_PHONE_DISPLAY = '+234 814 765 0319';
export const COMPANY_PHONE_TEL = '+2348147650319';
export const COMPANY_EMAIL = 'info@groneglobal.com';

export function buildWhatsAppUrl(message?: string): string {
  if (!message) return WHATSAPP_BUSINESS_LINK;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
