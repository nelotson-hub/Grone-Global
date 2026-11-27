import React from 'react';
import { MapPin, Phone, Mail, Send } from 'lucide-react';
import { NavView, SubdivisionMode, BRAND_LOGO_URL, PAINTS_SECTION_LINKS } from '../data/groneData';
import { COMPANY_ADDRESS, COMPANY_EMAIL, COMPANY_PHONE_DISPLAY, COMPANY_PHONE_TEL } from '../config/contactConfig';

interface FooterProps {
  onNavigate: (view: NavView) => void;
  onSwitchSubdivision: (mode: SubdivisionMode) => void;
  onOpenContact: (subject?: string) => void;
  onOpenLegal: (type: 'terms' | 'privacy') => void;
  onOpenInstallment: () => void;
  onGoToPaintsSection: (id: string) => void;
}

const linkClass = 'text-slate-400 hover:text-white transition-colors cursor-pointer text-left';

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onSwitchSubdivision,
  onOpenContact,
  onOpenLegal,
  onOpenInstallment,
  onGoToPaintsSection,
}) => {
  return (
    <footer className="bg-[#0F172A] text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-8 sm:gap-10 pb-10 border-b border-slate-800">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4 space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-xl bg-white p-1.5 flex items-center justify-center shrink-0">
                <img src={BRAND_LOGO_URL} alt="Grone Global Ltd Official Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <p className="text-lg font-extrabold tracking-tight text-white">Grone Global Ltd</p>
                <p className="text-[11px] font-semibold tracking-wider uppercase text-[#D97706]">Building A Greater Tomorrow</p>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Parent company of <strong className="text-white">Grone Global Paints</strong> and{' '}
              <strong className="text-white">General Contracting &amp; International Procurement</strong>.
            </p>
          </div>

          {/* Grone Global Paints */}
          <div className="md:col-span-2 space-y-3">
            <h3 className="text-xs font-bold text-white tracking-wider uppercase">Grone Global Paints</h3>
            <ul className="space-y-2 text-sm">
              {PAINTS_SECTION_LINKS.map((link) => (
                <li key={link.id}>
                  <button type="button" onClick={() => onGoToPaintsSection(link.id)} className={linkClass}>
                    {link.label}
                  </button>
                </li>
              ))}
              <li>
                <button type="button" onClick={() => onNavigate('order')} className={linkClass}>
                  Order Online
                </button>
              </li>
            </ul>
          </div>

          {/* Grone Global Ltd corporate */}
          <div className="md:col-span-2 space-y-3">
            <h3 className="text-xs font-bold text-white tracking-wider uppercase">Grone Global Ltd</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button type="button" onClick={() => onNavigate('about')} className={linkClass}>
                  About Us
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('services')} className={linkClass}>
                  All Services
                </button>
              </li>
              <li>
                <button type="button" onClick={onOpenInstallment} className={linkClass}>
                  Installment Payment Plan
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSwitchSubdivision('contracting')}
                  className="text-[#5EEAD4] hover:text-white font-semibold transition-colors cursor-pointer text-left"
                >
                  General Contracting &amp; International Procurement →
                </button>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-2 md:col-span-4 space-y-3.5">
            <h3 className="text-xs font-bold text-white tracking-wider uppercase">Head Office</h3>
            <div className="flex items-start gap-3 text-sm">
              <MapPin className="w-4 h-4 text-[#D97706] shrink-0 mt-1" />
              <span>{COMPANY_ADDRESS}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Phone className="w-4 h-4 text-[#D97706] shrink-0" />
              <a href={`tel:${COMPANY_PHONE_TEL}`} className="font-mono text-white hover:text-[#D97706] transition-colors">
                {COMPANY_PHONE_DISPLAY}
              </a>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Mail className="w-4 h-4 text-[#D97706] shrink-0" />
              <a href={`mailto:${COMPANY_EMAIL}`} className="font-mono hover:text-white transition-colors">
                {COMPANY_EMAIL}
              </a>
            </div>
            <button
              type="button"
              onClick={() => onOpenContact('Footer Inquiry — Grone Global Ltd')}
              className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-[#D97706] hover:bg-[#B45309] rounded-lg transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              Contact Us
            </button>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>&copy; {new Date().getFullYear()} Grone Global Ltd. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <button type="button" onClick={() => onOpenLegal('terms')} className="hover:text-white underline underline-offset-4 cursor-pointer">
              Terms &amp; Conditions
            </button>
            <span aria-hidden="true">·</span>
            <button type="button" onClick={() => onOpenLegal('privacy')} className="hover:text-white underline underline-offset-4 cursor-pointer">
              Privacy Policy
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
