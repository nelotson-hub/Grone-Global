import React from 'react';
import { MapPin, Phone, MessageCircle, Mail, Send } from 'lucide-react';
import { NavView, SubdivisionMode, BRAND_LOGO_URL } from '../data/groneData';

interface FooterProps {
  onNavigate: (view: NavView) => void;
  onSwitchSubdivision: (mode: SubdivisionMode) => void;
  onOpenContact: (subject?: string) => void;
  onOpenLegal: (type: 'terms' | 'privacy') => void;
  onOpenInstallment: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onSwitchSubdivision,
  onOpenContact,
  onOpenLegal,
  onOpenInstallment,
}) => {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-9 sm:py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-7 sm:gap-10 pb-8 sm:pb-10 border-b border-slate-800">
          {/* Column 1: Parent Brand & Official Subdivisions */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-xl bg-white p-1.5 flex items-center justify-center shrink-0 shadow-sm">
                <img
                  src={BRAND_LOGO_URL}
                  alt="Grone Global Ltd Official Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <p className="text-lg font-extrabold tracking-tight text-white">
                  Grone Global Ltd
                </p>
                <p className="text-[11px] font-semibold tracking-wider uppercase text-amber-400">
                  Building A Greater Tomorrow
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-md">
              Parent corporate organization uniting <strong className="text-white">Grone Global Paints</strong>{' '}
              (architectural paint production, screeding &amp; putty production, contract painting, and formulation
              tutorials) and <strong className="text-white">Grone Global Ltd General Contracting Subdivision</strong>{' '}
              (global &amp; China procurement led by Changan/GAC electric vehicles &amp; machinery, local civil works
              &amp; Nigerian building materials supply, turnkey construction, and renovations).
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  onSwitchSubdivision('paints');
                  onNavigate('home');
                }}
                className="px-3 py-1.5 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-amber-400 border border-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                Grone Global Paints
              </button>
              <button
                type="button"
                onClick={() => {
                  onSwitchSubdivision('contracting');
                  onNavigate('home');
                }}
                className="px-3 py-1.5 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                Grone Global Ltd General Contracting Subdivision
              </button>
            </div>
          </div>

          {/* Column 2: Quick Portal Navigation */}
          <div className="md:col-span-3 space-y-3">
            <h3 className="text-xs font-bold text-white tracking-wider uppercase">
              Portal Navigation
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('home')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Home (2-in-1 Portal)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('about')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  About Grone Global Ltd
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('services')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Services (Paints &amp; Contracting)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('order')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Order Now (Paint &amp; Screeding Putty)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenInstallment}
                  className="text-amber-400 hover:text-amber-300 font-medium transition-colors cursor-pointer"
                >
                  Installmental Payment Plan
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Strict Required Contact Block */}
          <div className="md:col-span-4 space-y-3.5">
            <h3 className="text-xs font-bold text-white tracking-wider uppercase">
              Corporate Headquarters &amp; Direct Lines
            </h3>

            {/* Company Address with Map Pin Icon beside it */}
            <div className="flex items-start gap-3 text-sm text-slate-300">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-1" />
              <span>
                Plot 14B Industrial Estate Layout, Lekki-Epe Expressway, Lagos, Nigeria (Grone Global Ltd Complex)
              </span>
            </div>

            {/* Phone Icon with clickable Phone Number beside it */}
            <div className="flex items-center gap-3 text-sm">
              <Phone className="w-4 h-4 text-amber-400 shrink-0" />
              <a
                href="tel:+2348030004766"
                className="font-mono text-white hover:text-amber-400 transition-colors"
              >
                +234 803 000 4766
              </a>
            </div>

            {/* WhatsApp Icon with clickable WhatsApp Number beside it */}
            <div className="flex items-center gap-3 text-sm">
              <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <a
                href="https://wa.me/2348030004766"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-white hover:text-emerald-400 transition-colors"
              >
                +234 803 000 4766 (WhatsApp Desk)
              </a>
            </div>

            {/* Official Email Address positioned underneath */}
            <div className="flex items-center gap-3 text-sm pt-0.5">
              <Mail className="w-4 h-4 text-amber-400 shrink-0" />
              <a
                href="mailto:info@groneglobal.com"
                className="font-mono text-slate-300 hover:text-white transition-colors"
              >
                info@groneglobal.com
              </a>
            </div>

            {/* Contact Us button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => onOpenContact('Footer Inquiry — Grone Global Ltd')}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-amber-700 hover:bg-amber-600 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                Contact Us
              </button>
            </div>
          </div>
        </div>

        {/* Underneath: Terms & Conditions button and Privacy Policy button */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            &copy; {new Date().getFullYear()} Grone Global Ltd. Subdivisions: Grone Global Paints &amp; Grone Global
            Ltd General Contracting Subdivision.
          </p>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => onOpenLegal('terms')}
              className="text-slate-300 hover:text-white underline underline-offset-4 transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              Terms &amp; Conditions
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => onOpenLegal('privacy')}
              className="text-slate-300 hover:text-white underline underline-offset-4 transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              Privacy Policy
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
