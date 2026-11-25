import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  PaintBucket,
  Building2,
  ShieldCheck,
  RefreshCw,
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
} from './data/groneData';
import { buildWhatsAppUrl } from './config/contactConfig';
import { PaintsHomeView, ContractingHomeView } from './components/HomePortalViews';
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
      {/* TOP BAR WITH DESKTOP, TABLET & MOBILE HAMBURGER BUTTON */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xs border-b border-stone-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 lg:gap-8 px-4 sm:px-6 lg:px-8 py-3 sm:py-3.5">
          {/* Zone 1: Brand logo & wordmark */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              handleHomeClick();
            }}
            className="inline-flex items-center gap-2.5 sm:gap-3 shrink-0 group"
          >
            <img
              src={BRAND_LOGO_URL}
              alt="Grone Global Ltd Logo"
              className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg object-contain bg-white border border-stone-200/80 p-0.5 shrink-0"
            />
            <span className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900 whitespace-nowrap group-hover:text-amber-800 transition-colors">
              Grone Global Ltd
            </span>
          </a>

          {/* Zone 2: Clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-5 lg:gap-7 text-sm font-medium text-slate-600">
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                handleHomeClick();
              }}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 underline-offset-8 ${
                activeView === 'home' ? 'text-slate-900 font-bold underline decoration-amber-700 decoration-2' : ''
              }`}
            >
              Home
            </a>
            <a
              href="#about"
              onClick={(e) => {
                e.preventDefault();
                handleNavigate('about');
              }}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 underline-offset-8 ${
                activeView === 'about' ? 'text-slate-900 font-bold underline decoration-amber-700 decoration-2' : ''
              }`}
            >
              About
            </a>
            <a
              href="#services"
              onClick={(e) => {
                e.preventDefault();
                handleNavigate('services');
              }}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 underline-offset-8 ${
                activeView === 'services' ? 'text-slate-900 font-bold underline decoration-amber-700 decoration-2' : ''
              }`}
            >
              Services
            </a>
            <a
              href="#order-paint"
              onClick={(e) => {
                e.preventDefault();
                handleNavigate('order');
              }}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 underline-offset-8 ${
                activeView === 'order' ? 'text-amber-700 font-bold underline decoration-amber-700 decoration-2' : ''
              }`}
            >
              Order Now
            </a>
          </nav>

          {/* Zone 3: Contact Us + Desktop/Tablet/Mobile Hamburger Button */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              type="button"
              onClick={() => handleOpenContactModal('Navbar Contact Us Inquiry')}
              className="px-3.5 sm:px-4 py-2 text-xs font-bold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              Contact Us
            </button>

            <button
              ref={hamburgerBtnRef}
              type="button"
              onClick={() => setDrawerOpen((prev) => !prev)}
              aria-label={drawerOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={drawerOpen}
              className={`inline-flex items-center justify-center p-2 rounded-lg border transition-colors cursor-pointer shrink-0 ${
                drawerOpen
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-stone-100 text-slate-800 border-stone-300 hover:bg-stone-200'
              }`}
            >
              {drawerOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
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

      {/* 2-IN-1 CORPORATE SUBDIVISION PORTAL SWITCHER & INSTALLMENTAL PAYMENT BAR */}
      <div className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-2 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 min-w-0">
            <span className="text-xs text-slate-400 hidden xl:inline shrink-0">
              Active Subdivision Portal:
            </span>
            <div className="grid grid-cols-2 sm:flex sm:flex-row items-stretch sm:items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-lg w-full sm:w-auto">
              <button
                type="button"
                onClick={() => handleSwitchSubdivision('paints')}
                className={`inline-flex items-center justify-center sm:justify-start gap-1.5 px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-bold rounded-md transition-colors cursor-pointer sm:whitespace-nowrap ${
                  subdivision === 'paints'
                    ? 'bg-amber-600 text-white'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <PaintBucket className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Grone Global Paints</span>
              </button>

              <button
                type="button"
                onClick={() => handleSwitchSubdivision('contracting')}
                className={`inline-flex items-center justify-center sm:justify-start gap-1.5 px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-bold rounded-md transition-colors cursor-pointer sm:whitespace-nowrap ${
                  subdivision === 'contracting'
                    ? 'bg-amber-600 text-white'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Building2 className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate sm:hidden">General Contracting</span>
                <span className="hidden sm:inline">Grone Global Ltd General Contracting Subdivision</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
            {isReloadingHome && (
              <span className="inline-flex items-center gap-1.5 text-xs font-mono text-amber-400">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Refreshing...
              </span>
            )}
            <button
              type="button"
              onClick={() => setInstallmentModalOpen(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-[11px] sm:text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Installmental Payment
            </button>
          </div>
        </div>
      </div>

      {/* MAIN PORTAL VIEWPORT */}
      <main
        key={homeKey}
        className={`flex-1 transition-opacity duration-200 ${
          isReloadingHome ? 'opacity-60' : 'opacity-100'
        }`}
      >
        {activeView === 'home' && subdivision === 'paints' && (
          <PaintsHomeView
            onOrderPaint={handleOrderPaintWithFinish}
            onOpenInstallment={() => setInstallmentModalOpen(true)}
            onExploreServices={() => handleNavigate('services')}
            onSwitchToContracting={() => handleSwitchSubdivision('contracting')}
            onOpenContact={handleOpenContactModal}
          />
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
