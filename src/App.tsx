import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  PaintBucket,
  Building2,
  ShieldCheck,
  Menu,
  X,
  Home,
  Info,
  Briefcase,
  ShoppingBag,
  PhoneCall,
  Calendar,
  MessageCircle,
} from 'lucide-react';
import {
  SubdivisionMode,
  NavView,
  PaintTypeKey,
  BRAND_LOGO_URL,
  IMAGES,
  PAINTS_SECTION_LINKS,
} from './data/groneData';
import { buildWhatsAppUrl } from './config/contactConfig';
import { ContractingHomeView } from './components/HomePortalViews';
import { PaintsHomeView } from './components/PaintsHomeView';
import { AboutView, ServicesView } from './components/AboutAndServicesViews';
import { OrderPaintFlow } from './components/OrderPaintFlow';
import {
  ContactUsModal,
  BookingProcurementModal,
  InstallmentalPaymentModal,
  LegalModal,
  ConfirmationPopupModal,
} from './components/GlobalModals';
import { Footer } from './components/Footer';

export default function App() {
  const [subdivision, setSubdivision] = useState<SubdivisionMode>('paints');
  const [activeView, setActiveView] = useState<NavView>('home');
  const [selectedOrderPaintType, setSelectedOrderPaintType] = useState<PaintTypeKey>('emulsion');
  const [isReloadingHome, setIsReloadingHome] = useState<boolean>(false);
  const [homeKey, setHomeKey] = useState<number>(1);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  const [scrolled, setScrolled] = useState<boolean>(false);
  const isPaintsHome = activeView === 'home' && subdivision === 'paints';

  // The header floats transparently over the Paints hero, then turns solid once the page scrolls.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const drawerRef = useRef<HTMLDivElement | null>(null);
  const hamburgerBtnRef = useRef<HTMLButtonElement | null>(null);

  // Modals state
  const [contactModalOpen, setContactModalOpen] = useState<boolean>(false);
  const [contactInitialSubject, setContactInitialSubject] = useState<string>('');
  const [bookingModalOpen, setBookingModalOpen] = useState<boolean>(false);
  const [bookingInitialCategory, setBookingInitialCategory] = useState<string>('');
  const [installmentModalOpen, setInstallmentModalOpen] = useState<boolean>(false);
  const [legalModalType, setLegalModalType] = useState<'terms' | 'privacy' | null>(null);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState<boolean>(false);
  const [confirmationAutoRedirect, setConfirmationAutoRedirect] = useState<boolean>(false);

  // Once the homepage has fully loaded, fetch every other page's images in the background so switching is instant.
  useEffect(() => {
    const preload = () => Object.values(IMAGES).forEach((src) => { new Image().src = src; });
    if (document.readyState === 'complete') preload();
    else window.addEventListener('load', preload, { once: true });
    return () => window.removeEventListener('load', preload);
  }, []);

  // Automatically close right-hand hamburger menu when clicking anywhere outside it or pressing Escape
  useEffect(() => {
    if (!drawerOpen) return;

    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;
      const clickedInsideDrawer = drawerRef.current?.contains(target);
      const clickedHamburgerBtn = hamburgerBtnRef.current?.contains(target);
      if (!clickedInsideDrawer && !clickedHamburgerBtn) {
        setDrawerOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setDrawerOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [drawerOpen]);

  // Clicking "Home" resets and refreshes the homepage view with a smooth visual reload indicator
  const handleHomeClick = useCallback(() => {
    setDrawerOpen(false);
    setIsReloadingHome(true);
    setActiveView('home');
    setHomeKey((prev) => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.setTimeout(() => {
      setIsReloadingHome(false);
    }, 320);
  }, []);

  const handleNavigate = useCallback(
    (view: NavView) => {
      setDrawerOpen(false);
      if (view === 'home') {
        handleHomeClick();
        return;
      }
      setActiveView(view);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [handleHomeClick]
  );

  const handleOrderPaintWithFinish = useCallback((finish: PaintTypeKey = 'emulsion') => {
    setDrawerOpen(false);
    setSelectedOrderPaintType(finish);
    setActiveView('order');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleOpenContactModal = useCallback((subject = '') => {
    setDrawerOpen(false);
    setContactInitialSubject(subject);
    setContactModalOpen(true);
  }, []);

  const handleOpenBookingModal = useCallback((category = '') => {
    setDrawerOpen(false);
    setBookingInitialCategory(category);
    setBookingModalOpen(true);
  }, []);

  const handleSwitchSubdivision = useCallback((mode: SubdivisionMode) => {
    setDrawerOpen(false);
    setSubdivision(mode);
    setActiveView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const goToPaintsSection = useCallback(
    (id: string) => {
      setDrawerOpen(false);
      const scroll = () => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      if (isPaintsHome) {
        scroll();
        return;
      }
      setSubdivision('paints');
      setActiveView('home');
      window.setTimeout(scroll, 100); // wait for the Paints homepage to render
    },
    [isPaintsHome]
  );

  const handleTriggerConfirmation = useCallback((redirectHome = false) => {
    setConfirmationAutoRedirect(redirectHome);
    setConfirmationModalOpen(true);
  }, []);

  const handleConfirmationComplete = useCallback(() => {
    const shouldRedirect = confirmationAutoRedirect;
    setConfirmationModalOpen(false);
    setConfirmationAutoRedirect(false);
    if (shouldRedirect) {
      setSubdivision('paints');
      setActiveView('home');
      setHomeKey((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [confirmationAutoRedirect]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-slate-900 overflow-x-hidden">
      {/* 3-POINT HEADER: logo · division switcher · menu. Floats over the Paints hero, solid elsewhere. */}
      <header
        className={`${isPaintsHome ? 'fixed' : 'sticky'} top-0 inset-x-0 z-40 transition-colors duration-300 ${
          isPaintsHome && !scrolled
            ? 'bg-gradient-to-b from-[#0F172A]/85 via-[#0F172A]/40 to-transparent'
            : 'bg-[#0F172A]/95 backdrop-blur shadow-lg'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4 px-3 sm:px-6 lg:px-8 py-3">
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              handleHomeClick();
            }}
            className="inline-flex items-center gap-2.5 shrink-0"
          >
            <img
              src={BRAND_LOGO_URL}
              alt="Grone Global Ltd"
              className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg object-contain bg-white p-0.5 shrink-0"
            />
            <span className="hidden lg:inline text-base font-extrabold tracking-tight text-white whitespace-nowrap">
              Grone Global Ltd
            </span>
          </a>

          <div
            role="group"
            aria-label="Choose division"
            className="flex items-center p-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm min-w-0"
          >
            <button
              type="button"
              aria-pressed={subdivision === 'paints'}
              onClick={() => handleSwitchSubdivision('paints')}
              className={`inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                subdivision === 'paints' ? 'bg-[#D97706] text-white' : 'text-slate-200 hover:text-white'
              }`}
            >
              <PaintBucket className="w-3.5 h-3.5 shrink-0" />
              <span className="sm:hidden">Paints</span>
              <span className="hidden sm:inline">Grone Global Paints</span>
            </button>
            <button
              type="button"
              aria-pressed={subdivision === 'contracting'}
              onClick={() => handleSwitchSubdivision('contracting')}
              className={`inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                subdivision === 'contracting' ? 'bg-[#D97706] text-white' : 'text-slate-200 hover:text-white'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 shrink-0" />
              <span className="sm:hidden">Contracting</span>
              <span className="hidden sm:inline">General Contracting &amp; Procurement</span>
            </button>
          </div>

          <button
            ref={hamburgerBtnRef}
            type="button"
            onClick={() => setDrawerOpen((prev) => !prev)}
            aria-label={drawerOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={drawerOpen}
            className="inline-flex items-center justify-center p-2 rounded-lg border border-white/30 text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
          >
            {drawerOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* RIGHT-HAND SIDE TOP-TO-BOTTOM HAMBURGER MENU DRAWER (DESKTOP, TABLET & MOBILE) */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/35 backdrop-blur-[1px] transition-opacity"
          aria-hidden="true"
        />
      )}

      <aside
        ref={drawerRef}
        aria-label="Portal Side Navigation Menu"
        className={`fixed top-0 right-0 z-50 h-full w-72 sm:w-80 bg-white border-l border-stone-200 shadow-2xl flex flex-col transition-transform duration-200 ease-out ${
          drawerOpen ? 'translate-x-0' : 'translate-x-full pointer-events-none'
        }`}
      >
        {/* Drawer Header */}
        <div className="shrink-0 flex items-center justify-between gap-3 px-5 py-4 bg-slate-900 text-white border-b border-slate-800">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-white p-1 flex items-center justify-center shrink-0 shadow-xs">
              <img
                src={BRAND_LOGO_URL}
                alt="Grone Global Ltd Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-amber-400">Navigation Menu</p>
              <p className="text-sm font-extrabold tracking-tight truncate">Grone Global Ltd</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close Menu Drawer"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-amber-700 text-white transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Top-to-Bottom Vertical Links */}
        <div className="flex-1 overflow-y-auto modal-scrollbar p-4 flex flex-col justify-between gap-6">
          <div className="flex flex-col space-y-1.5">
            <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Grone Global Paints
            </p>
            {PAINTS_SECTION_LINKS.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => goToPaintsSection(link.id)}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-semibold text-left text-slate-700 hover:bg-stone-100 hover:text-slate-900 transition-colors cursor-pointer"
              >
                <PaintBucket className="w-4 h-4 shrink-0 text-[#0D9488]" />
                <span>{link.label}</span>
              </button>
            ))}

            <p className="px-3 pt-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Main Pages
            </p>

            <button
              type="button"
              onClick={handleHomeClick}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-semibold text-left transition-colors cursor-pointer ${
                activeView === 'home'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-700 hover:bg-stone-100 hover:text-slate-900'
              }`}
            >
              <Home className="w-4 h-4 shrink-0 text-amber-600" />
              <span>Home</span>
            </button>

            <button
              type="button"
              onClick={() => handleNavigate('about')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-semibold text-left transition-colors cursor-pointer ${
                activeView === 'about'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-700 hover:bg-stone-100 hover:text-slate-900'
              }`}
            >
              <Info className="w-4 h-4 shrink-0 text-amber-600" />
              <span>About</span>
            </button>

            <button
              type="button"
              onClick={() => handleNavigate('services')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-semibold text-left transition-colors cursor-pointer ${
                activeView === 'services'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-700 hover:bg-stone-100 hover:text-slate-900'
              }`}
            >
              <Briefcase className="w-4 h-4 shrink-0 text-amber-600" />
              <span>Services</span>
            </button>

            <button
              type="button"
              onClick={() => handleNavigate('order')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-semibold text-left transition-colors cursor-pointer ${
                activeView === 'order'
                  ? 'bg-amber-700 text-white'
                  : 'text-slate-700 hover:bg-stone-100 hover:text-slate-900'
              }`}
            >
              <ShoppingBag className="w-4 h-4 shrink-0 text-amber-600" />
              <span>Order Now</span>
            </button>

            <button
              type="button"
              onClick={() => handleOpenBookingModal('International & China Procurement')}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-semibold text-left text-slate-700 hover:bg-stone-100 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <Calendar className="w-4 h-4 shrink-0 text-amber-600" />
              <span>Book / Procurement Request</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setDrawerOpen(false);
                setInstallmentModalOpen(true);
              }}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-semibold text-left text-slate-700 hover:bg-stone-100 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 shrink-0 text-amber-600" />
              <span>Installmental Payment Plan</span>
            </button>

            <button
              type="button"
              onClick={() => handleOpenContactModal('Side Menu Contact Us')}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-semibold text-left text-slate-700 hover:bg-stone-100 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <PhoneCall className="w-4 h-4 shrink-0 text-amber-600" />
              <span>Contact Us</span>
            </button>
          </div>

          <div className="pt-4 border-t border-stone-200 flex flex-col space-y-2">
            <p className="px-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Switch Subdivision Portal
            </p>

            <button
              type="button"
              onClick={() => handleSwitchSubdivision('paints')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs font-bold text-left border transition-colors cursor-pointer ${
                subdivision === 'paints'
                  ? 'bg-amber-700 text-white border-amber-700'
                  : 'bg-stone-50 text-slate-800 border-stone-200 hover:bg-stone-100'
              }`}
            >
              <PaintBucket className="w-4 h-4 shrink-0" />
              <span>Grone Global Paints</span>
            </button>

            <button
              type="button"
              onClick={() => handleSwitchSubdivision('contracting')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs font-bold text-left border transition-colors cursor-pointer ${
                subdivision === 'contracting'
                  ? 'bg-amber-700 text-white border-amber-700'
                  : 'bg-stone-50 text-slate-800 border-stone-200 hover:bg-stone-100'
              }`}
            >
              <Building2 className="w-4 h-4 shrink-0" />
              <span>Grone Global Ltd General Contracting Subdivision</span>
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN PORTAL VIEWPORT */}
      <main
        key={homeKey}
        className={`flex-1 transition-opacity duration-200 ${
          isReloadingHome ? 'opacity-60' : 'opacity-100'
        }`}
      >
        {activeView === 'home' && subdivision === 'paints' && (
          <PaintsHomeView onOrderPaint={handleOrderPaintWithFinish} />
        )}

        {activeView === 'home' && subdivision === 'contracting' && (
          <ContractingHomeView
            onOpenContact={handleOpenContactModal}
            onOpenBooking={handleOpenBookingModal}
            onOpenInstallment={() => setInstallmentModalOpen(true)}
            onSwitchToPaints={() => handleSwitchSubdivision('paints')}
            onExploreServices={() => handleNavigate('services')}
          />
        )}

        {activeView === 'about' && (
          <AboutView
            onNavigateOrder={() => handleNavigate('order')}
            onSwitchSubdivision={handleSwitchSubdivision}
            onOpenContact={handleOpenContactModal}
          />
        )}

        {activeView === 'services' && (
          <ServicesView
            onNavigateOrder={() => handleNavigate('order')}
            onOpenContact={handleOpenContactModal}
            onOpenBooking={handleOpenBookingModal}
            onOpenInstallment={() => setInstallmentModalOpen(true)}
          />
        )}

        {activeView === 'order' && (
          <OrderPaintFlow
            initialPaintType={selectedOrderPaintType}
            onOrderComplete={() => handleTriggerConfirmation(true)}
            onOpenInstallmentModal={() => setInstallmentModalOpen(true)}
            onOpenContactModal={handleOpenContactModal}
          />
        )}
      </main>

      {/* GLOBAL CORPORATE FOOTER */}
      <Footer
        onNavigate={handleNavigate}
        onSwitchSubdivision={handleSwitchSubdivision}
        onOpenContact={handleOpenContactModal}
        onOpenLegal={(type) => setLegalModalType(type)}
        onOpenInstallment={() => setInstallmentModalOpen(true)}
        onGoToPaintsSection={goToPaintsSection}
      />

      {/* FLOATING WHATSAPP QUICK-CHAT BUTTON (BOTTOM-RIGHT CORNER) */}
      <a
        href={buildWhatsAppUrl()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Grone Global Ltd on WhatsApp"
        className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 px-4 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl border border-emerald-400/40 transition-transform hover:scale-105 cursor-pointer"
      >
        <MessageCircle className="w-5 h-5 shrink-0" />
        <span className="text-xs font-bold whitespace-nowrap hidden sm:inline">WhatsApp Chat</span>
      </a>

      {/* GLOBAL POPUP MODALS */}
      <ContactUsModal
        isOpen={contactModalOpen}
        initialSubject={contactInitialSubject}
        onClose={() => setContactModalOpen(false)}
        onSuccess={(redirectHome = false) => handleTriggerConfirmation(redirectHome)}
      />

      <BookingProcurementModal
        isOpen={bookingModalOpen}
        initialCategory={bookingInitialCategory}
        onClose={() => setBookingModalOpen(false)}
      />

      <InstallmentalPaymentModal
        isOpen={installmentModalOpen}
        onClose={() => setInstallmentModalOpen(false)}
        onSuccess={() => handleTriggerConfirmation(false)}
      />

      <LegalModal
        type={legalModalType}
        onClose={() => setLegalModalType(null)}
      />

      <ConfirmationPopupModal
        isOpen={confirmationModalOpen}
        autoRedirectHome={confirmationAutoRedirect}
        onComplete={handleConfirmationComplete}
      />
    </div>
  );
}
