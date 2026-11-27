import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  AlertCircle,
  Calculator,
  Send,
  ShieldCheck,
  FileText,
  Scale,
  Loader2,
  MessageCircle,
  Calendar,
  ExternalLink,
  Briefcase,
} from 'lucide-react';
import { formatNaira, BRAND_LOGO_URL } from '../data/groneData';
import {
  WEB3FORMS_ENDPOINT,
  WEB3FORMS_ACCESS_KEY,
  buildWhatsAppUrl,
} from '../config/contactConfig';

interface ContactModalProps {
  isOpen: boolean;
  initialSubject?: string;
  onClose: () => void;
  onSuccess?: (redirectHome?: boolean) => void;
}

export const ContactUsModal: React.FC<ContactModalProps> = ({
  isOpen,
  initialSubject = '',
  onClose,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [subdivisionInterest, setSubdivisionInterest] = useState(
    'Grone Global Ltd — General Inquiry / Dual Subdivision Corporate Inquiry'
  );
  const [message, setMessage] = useState('');
  const [botcheck, setBotcheck] = useState(false);

  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    phone?: string;
    email?: string;
    address?: string;
    message?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  // Always start on Grone Global Ltd General / Dual Subdivision Corporate Inquiry for Contact Us clicks,
  // NEVER pre-fill the message box, and reset inline status cleanly on open.
  useEffect(() => {
    if (!isOpen) return;
    setMessage('');
    setFieldErrors({});
    setSubmitStatus('idle');
    setStatusMessage('');
    setIsSubmitting(false);
    setBotcheck(false);

    const subj = initialSubject.toLowerCase();
    const isGenericContact =
      !subj ||
      subj.includes('contact us') ||
      subj.includes('homepage inquiry') ||
      subj.includes('services page inquiry') ||
      subj.includes('footer inquiry') ||
      subj.includes('corporate inquiry') ||
      subj.includes('general inquiry');

    if (isGenericContact) {
      setSubdivisionInterest(
        'Grone Global Ltd — General Inquiry / Dual Subdivision Corporate Inquiry'
      );
    } else if (
      subj.includes('china') ||
      subj.includes('global procurement') ||
      subj.includes('international procurement') ||
      subj.includes('electric vehicles') ||
      subj.includes('changan') ||
      subj.includes('industrial & solar') ||
      subj.includes('accessories & gadgets')
    ) {
      setSubdivisionInterest(
        'Grone Global Ltd General Contracting Subdivision — International & China Procurement'
      );
    } else if (
      subj.includes('building materials') ||
      subj.includes('contracting') ||
      subj.includes('construction') ||
      subj.includes('civil') ||
      subj.includes('site inspection')
    ) {
      setSubdivisionInterest(
        'Grone Global Ltd General Contracting Subdivision — General Contracting, Civil Works & Nigerian Building Materials'
      );
    } else if (subj.includes('screeding') || subj.includes('putty')) {
      setSubdivisionInterest('Grone Global Paints — Screeding & Putty Production');
    } else if (subj.includes('paint')) {
      setSubdivisionInterest('Grone Global Paints — Paint Supply, Contract Painting & Tutorials');
    } else {
      setSubdivisionInterest(
        'Grone Global Ltd — General Inquiry / Dual Subdivision Corporate Inquiry'
      );
    }
  }, [isOpen, initialSubject]);

  // Allow Escape key to exit modal cleanly
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSubmitting) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen) return null;

  // Strict field input handlers
  const handleNameChange = (val: string) => {
    const cleaned = val.replace(/[^A-Za-z\s]/g, '');
    setName(cleaned);
    if (val !== cleaned) {
      setFieldErrors((prev) => ({ ...prev, name: 'Name must contain letters only (A–Z).' }));
    } else {
      setFieldErrors((prev) => ({ ...prev, name: undefined }));
    }
  };

  const handlePhoneChange = (val: string) => {
    const cleaned = val.replace(/[^0-9]/g, '');
    setPhone(cleaned);
    if (val !== cleaned) {
      setFieldErrors((prev) => ({ ...prev, phone: 'Phone number must contain numbers only (0–9).' }));
    } else {
      setFieldErrors((prev) => ({ ...prev, phone: undefined }));
    }
  };

  const handleEmailChange = (val: string) => {
    const cleaned = val.replace(/\s/g, '');
    setEmail(cleaned);
    setFieldErrors((prev) => ({ ...prev, email: undefined }));
  };

  const handleAddressChange = (val: string) => {
    const cleaned = val.replace(/[^A-Za-z0-9\s,.\-\/#]/g, '');
    setAddress(cleaned);
    if (val !== cleaned) {
      setFieldErrors((prev) => ({
        ...prev,
        address: 'Home/site address can only contain street letters, numbers, commas, hyphens, or slashes.',
      }));
    } else {
      setFieldErrors((prev) => ({ ...prev, address: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Silent honeypot protection against spam bots
    if (botcheck) {
      return;
    }

    const errors: {
      name?: string;
      phone?: string;
      email?: string;
      address?: string;
      message?: string;
    } = {};

    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();
    const trimmedEmail = email.trim();
    const trimmedAddress = address.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName || !/^[A-Za-z]+(?:\s+[A-Za-z]+)*$/.test(trimmedName)) {
      errors.name = 'Please enter a valid name using letters only (A–Z).';
    }

    if (!trimmedPhone || !/^[0-9]{7,15}$/.test(trimmedPhone)) {
      errors.phone = 'Please enter a valid phone number containing numbers only (7–15 digits).';
    }

    if (!trimmedEmail || !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(trimmedEmail)) {
      errors.email = 'Please enter a valid email address (e.g. name@domain.com).';
    }

    const looksLikeUrl = /(https?:\/\/|www\.|\.com|\.net|\.org)/i.test(trimmedAddress);
    const hasAddressLetters = /[A-Za-z]{2,}/.test(trimmedAddress);
    if (
      !trimmedAddress ||
      trimmedAddress.length < 6 ||
      !hasAddressLetters ||
      looksLikeUrl ||
      !/^[A-Za-z0-9\s,.\-\/#]+$/.test(trimmedAddress)
    ) {
      errors.address = 'Please enter a valid home or site address (e.g. 14 Admiralty Way, Lekki, Lagos).';
    }

    if (!trimmedMessage) {
      errors.message = 'Please write a message describing what you need.';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setStatusMessage('');

    try {
      const response = await fetch(WEB3FORMS_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: 'New Contact Inquiry - Grone Global Ltd',
          from_name: trimmedName,
          name: trimmedName,
          email: trimmedEmail,
          phone: trimmedPhone,
          address: trimmedAddress,
          target_division: subdivisionInterest,
          message: trimmedMessage,
          botcheck: botcheck,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmitStatus('success');
        setStatusMessage(
          'Thank you! Your inquiry has been sent directly to Grone Global Ltd. We will contact you shortly.'
        );
        setName('');
        setEmail('');
        setPhone('');
        setAddress('');
        setMessage('');
      } else {
        setSubmitStatus('error');
        setStatusMessage(
          result.message ||
            'Unable to send your inquiry right now. Please verify your Web3Forms access key or try again.'
        );
      }
    } catch {
      setSubmitStatus('error');
      setStatusMessage(
        'Network error while sending your message. Please check your internet connection and try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-xs p-3 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) {
          onClose();
        }
      }}
    >
      <div className="relative w-full max-w-xl max-h-[88vh] flex flex-col bg-white border border-stone-200 rounded-xl shadow-2xl overflow-hidden">
        {/* Pinned Header with Dedicated Always-Visible X Exit Button */}
        <div className="shrink-0 flex items-center justify-between gap-4 px-5 sm:px-6 py-4 bg-slate-900 text-white border-b border-slate-800">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-white p-1 flex items-center justify-center shrink-0">
              <img
                src={BRAND_LOGO_URL}
                alt="Grone Global Ltd Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-amber-400 font-medium">Grone Global Ltd</p>
              <h2 id="contact-modal-title" className="text-base sm:text-lg font-bold tracking-tight truncate">
                Contact Us &amp; General Inquiry
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Exit Contact Us Popup"
            title="Close (X)"
            className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-slate-800 hover:bg-amber-700 disabled:opacity-50 text-white border border-slate-700 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dedicated Scrollable Form Container with Visible Scrollbar Slider */}
        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex-1 max-h-[72vh] overflow-y-scroll modal-scrollbar p-5 sm:p-6 space-y-4"
        >
          {/* Hidden Honeypot Spam Protection Field */}
          <input
            type="checkbox"
            name="botcheck"
            checked={botcheck}
            onChange={(e) => setBotcheck(e.target.checked)}
            className="hidden"
            style={{ display: 'none' }}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
          />

          <p className="text-sm text-slate-600 leading-relaxed">
            Direct your message to <strong className="text-slate-900">Grone Global Ltd</strong>,{' '}
            <strong className="text-slate-900">Grone Global Paints</strong>, or{' '}
            <strong className="text-slate-900">Grone Global Ltd General Contracting Subdivision</strong>. Our desk
            responds within 2 business hours.
          </p>

          {/* Inline Success / Error Confirmation Messages */}
          {submitStatus === 'success' && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-xs font-bold text-emerald-900">Message Sent Successfully</p>
                <p className="text-xs text-emerald-800 leading-relaxed">{statusMessage}</p>
              </div>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-700 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-xs font-bold text-red-900">Could Not Send Message</p>
                <p className="text-xs text-red-800 leading-relaxed">{statusMessage}</p>
              </div>
            </div>
          )}

          <div>
            <label htmlFor="contact-subdivision" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Target Division
            </label>
            <select
              id="contact-subdivision"
              value={subdivisionInterest}
              disabled={isSubmitting}
              onChange={(e) => setSubdivisionInterest(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-300 rounded-lg text-slate-900 focus:outline-none focus:border-amber-700 disabled:opacity-60"
            >
              <option value="Grone Global Ltd — General Inquiry / Dual Subdivision Corporate Inquiry">
                Grone Global Ltd — General Inquiry / Dual Subdivision Corporate Inquiry
              </option>
              <option value="Grone Global Paints — Paint Supply, Contract Painting & Tutorials">
                Grone Global Paints — Paint Supply, Contract Painting &amp; Tutorials
              </option>
              <option value="Grone Global Paints — Screeding & Putty Production">
                Grone Global Paints — Screeding &amp; Putty Production
              </option>
              <option value="Grone Global Ltd General Contracting Subdivision — General Contracting, Civil Works & Nigerian Building Materials">
                Grone Global Ltd General Contracting Subdivision — General Contracting, Civil Works &amp; Nigerian Building Materials
              </option>
              <option value="Grone Global Ltd General Contracting Subdivision — International & China Procurement">
                Grone Global Ltd General Contracting Subdivision — International &amp; China Procurement (Chinese EVs, Machinery &amp; Gadgets)
              </option>
            </select>
          </div>

          {/* Stacks cleanly to 1 full-width column on mobile (< 768px) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="contact-name" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Name * <span className="font-normal text-slate-400">(Letters only)</span>
              </label>
              <input
                id="contact-name"
                type="text"
                required
                disabled={isSubmitting}
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Tunde Adeyemi"
                className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none disabled:opacity-60 ${
                  fieldErrors.name ? 'border-red-500 focus:border-red-600' : 'border-stone-300 focus:border-amber-700'
                }`}
              />
              {fieldErrors.name && (
                <p className="text-[11px] font-medium text-red-600 mt-1">{fieldErrors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="contact-phone" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Phone Number * <span className="font-normal text-slate-400">(Numbers only)</span>
              </label>
              <input
                id="contact-phone"
                type="tel"
                inputMode="numeric"
                required
                disabled={isSubmitting}
                value={phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                placeholder="e.g. 08030004766"
                className={`w-full px-3.5 py-2.5 text-sm font-mono bg-white border rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none disabled:opacity-60 ${
                  fieldErrors.phone ? 'border-red-500 focus:border-red-600' : 'border-stone-300 focus:border-amber-700'
                }`}
              />
              {fieldErrors.phone && (
                <p className="text-[11px] font-medium text-red-600 mt-1">{fieldErrors.phone}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="contact-email" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email Address *
              </label>
              <input
                id="contact-email"
                type="email"
                required
                disabled={isSubmitting}
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                placeholder="e.g. client@company.com"
                className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none disabled:opacity-60 ${
                  fieldErrors.email ? 'border-red-500 focus:border-red-600' : 'border-stone-300 focus:border-amber-700'
                }`}
              />
              {fieldErrors.email && (
                <p className="text-[11px] font-medium text-red-600 mt-1">{fieldErrors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="contact-address" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Home / Site Address *
              </label>
              <input
                id="contact-address"
                type="text"
                required
                disabled={isSubmitting}
                value={address}
                onChange={(e) => handleAddressChange(e.target.value)}
                placeholder="e.g. 14 Admiralty Way, Lekki, Lagos"
                className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none disabled:opacity-60 ${
                  fieldErrors.address ? 'border-red-500 focus:border-red-600' : 'border-stone-300 focus:border-amber-700'
                }`}
              />
              {fieldErrors.address && (
                <p className="text-[11px] font-medium text-red-600 mt-1">{fieldErrors.address}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="contact-message" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Write a message on what you want *
            </label>
            <textarea
              id="contact-message"
              rows={4}
              required
              disabled={isSubmitting}
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                setFieldErrors((prev) => ({ ...prev, message: undefined }));
              }}
              placeholder="Write a message on what you want..."
              className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none disabled:opacity-60 ${
                fieldErrors.message ? 'border-red-500 focus:border-red-600' : 'border-stone-300 focus:border-amber-700'
              }`}
            />
            {fieldErrors.message && (
              <p className="text-[11px] font-medium text-red-600 mt-1">{fieldErrors.message}</p>
            )}
          </div>

          <div className="pt-3 flex flex-wrap items-center justify-end gap-3 border-t border-stone-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 text-xs font-semibold text-slate-700 bg-stone-100 hover:bg-stone-200 disabled:opacity-50 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              {submitStatus === 'success' ? 'Close' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-amber-700 hover:bg-amber-800 disabled:opacity-65 disabled:cursor-not-allowed rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send Inquiry
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface BookingProcurementModalProps {
  isOpen: boolean;
  initialCategory?: string;
  onClose: () => void;
}

const BOOKING_CATEGORIES = [
  'International & China Procurement — Chinese Electric Vehicles, E-Bikes & Scooters (Changan, GAC, BYD)',
  'International & China Procurement — Industrial & Solar Equipment (Pure Water, Fabric, Solar)',
  'International & China Procurement — Day-to-Day Accessories & Gadgets',
  'General Contracting — Civil Works & Nigerian Building Materials Supply',
  'General Contracting — Building Construction, Renovations & Site Inspection',
  'Grone Global Paints — Bulk Paint Supply, Screeding Putty & Contract Painting',
  'Grone Global Paints — Paint & Putty Production Tutorials',
];

export const BookingProcurementModal: React.FC<BookingProcurementModalProps> = ({
  isOpen,
  initialCategory = '',
  onClose,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];

  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState(BOOKING_CATEGORIES[0]);
  const [quantityDetails, setQuantityDetails] = useState('');
  const [preferredDate, setPreferredDate] = useState(todayStr);
  const [botcheck, setBotcheck] = useState(false);

  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    phone?: string;
    email?: string;
    quantityDetails?: string;
    preferredDate?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [lastWhatsappUrl, setLastWhatsappUrl] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setQuantityDetails('');
    setFieldErrors({});
    setSubmitStatus('idle');
    setStatusMessage('');
    setLastWhatsappUrl('');
    setIsSubmitting(false);
    setBotcheck(false);

    const cat = initialCategory.toLowerCase();
    if (cat.includes('industrial') || cat.includes('solar') || cat.includes('machinery')) {
      setCategory(BOOKING_CATEGORIES[1]);
    } else if (cat.includes('accessories') || cat.includes('gadgets')) {
      setCategory(BOOKING_CATEGORIES[2]);
    } else if (cat.includes('building materials') || cat.includes('local') || cat.includes('civil')) {
      setCategory(BOOKING_CATEGORIES[3]);
    } else if (
      cat.includes('construction') ||
      cat.includes('renovation') ||
      cat.includes('site inspection') ||
      cat.includes('facility') ||
      cat.includes('road')
    ) {
      setCategory(BOOKING_CATEGORIES[4]);
    } else if (cat.includes('tutorial')) {
      setCategory(BOOKING_CATEGORIES[6]);
    } else if (cat.includes('paint') || cat.includes('screeding') || cat.includes('putty')) {
      setCategory(BOOKING_CATEGORIES[5]);
    } else {
      setCategory(BOOKING_CATEGORIES[0]);
    }
  }, [isOpen, initialCategory]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSubmitting) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen) return null;

  const handleNameChange = (val: string) => {
    const cleaned = val.replace(/[^A-Za-z\s]/g, '');
    setName(cleaned);
    if (val !== cleaned) {
      setFieldErrors((prev) => ({ ...prev, name: 'Name must contain letters only (A–Z).' }));
    } else {
      setFieldErrors((prev) => ({ ...prev, name: undefined }));
    }
  };

  const handlePhoneChange = (val: string) => {
    const cleaned = val.replace(/[^0-9]/g, '');
    setPhone(cleaned);
    if (val !== cleaned) {
      setFieldErrors((prev) => ({ ...prev, phone: 'Phone number must contain numbers only (0–9).' }));
    } else {
      setFieldErrors((prev) => ({ ...prev, phone: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (botcheck) {
      return;
    }

    const errors: {
      name?: string;
      phone?: string;
      email?: string;
      quantityDetails?: string;
      preferredDate?: string;
    } = {};

    const trimmedName = name.trim();
    const trimmedCompany = company.trim();
    const trimmedPhone = phone.trim();
    const trimmedEmail = email.trim();
    const trimmedDetails = quantityDetails.trim();

    if (!trimmedName || !/^[A-Za-z]+(?:\s+[A-Za-z]+)*$/.test(trimmedName)) {
      errors.name = 'Please enter a valid full name using letters only (A–Z).';
    }
    if (!trimmedPhone || !/^[0-9]{7,15}$/.test(trimmedPhone)) {
      errors.phone = 'Please enter a valid phone number containing numbers only (7–15 digits).';
    }
    if (!trimmedEmail || !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(trimmedEmail)) {
      errors.email = 'Please enter a valid email address (e.g. name@company.com).';
    }
    if (!trimmedDetails) {
      errors.quantityDetails =
        'Please specify item quantity, vehicle/machine model, or site material details.';
    }
    if (!preferredDate) {
      errors.preferredDate = 'Please choose your preferred delivery or inspection date.';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setStatusMessage('');

    try {
      const response = await fetch(WEB3FORMS_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: 'New Booking / Procurement Request - Grone Global Ltd',
          from_name: trimmedName,
          name: trimmedName,
          company: trimmedCompany || 'Individual / Personal Request',
          phone: trimmedPhone,
          email: trimmedEmail,
          service_product_category: category,
          quantity_and_details: trimmedDetails,
          preferred_date: preferredDate,
          botcheck: botcheck,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        const whatsappText = [
          'Hello Grone Global Ltd, I just submitted a Booking / Procurement Request:',
          '',
          `Name: ${trimmedName}`,
          `Company: ${trimmedCompany || 'Individual / Personal'}`,
          `Phone: ${trimmedPhone}`,
          `Email: ${trimmedEmail}`,
          `Service / Product Category: ${category}`,
          `Quantity / Details: ${trimmedDetails}`,
          `Preferred Date: ${preferredDate}`,
        ].join('\n');

        const whatsappUrl = buildWhatsAppUrl(whatsappText);
        setLastWhatsappUrl(whatsappUrl);
        setSubmitStatus('success');
        setStatusMessage(
          'Your booking & procurement request has been emailed to Grone Global Ltd. WhatsApp has been opened in a new tab so you can chat directly with our procurement desk.'
        );

        // Automatically open WhatsApp in a new tab with the pre-formatted details
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

        setName('');
        setCompany('');
        setPhone('');
        setEmail('');
        setQuantityDetails('');
      } else {
        setSubmitStatus('error');
        setStatusMessage(
          result.message ||
            'Unable to submit your booking/procurement request right now. Please verify your Web3Forms access key or try again.'
        );
      }
    } catch {
      setSubmitStatus('error');
      setStatusMessage(
        'Network error while submitting your request. Please check your internet connection and try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-xs p-3 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-procurement-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) {
          onClose();
        }
      }}
    >
      <div className="relative w-full max-w-2xl max-h-[88vh] flex flex-col bg-white border border-stone-200 rounded-xl shadow-2xl overflow-hidden">
        {/* Pinned Header with X Exit Button */}
        <div className="shrink-0 flex items-center justify-between gap-4 px-5 sm:px-6 py-4 bg-slate-900 text-white border-b border-slate-800">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-white p-1 flex items-center justify-center shrink-0">
              <img
                src={BRAND_LOGO_URL}
                alt="Grone Global Ltd Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-amber-400 font-medium truncate">
                Grone Global Ltd · Email + Instant WhatsApp Handoff
              </p>
              <h2 id="booking-procurement-modal-title" className="text-base sm:text-lg font-bold tracking-tight truncate">
                Booking &amp; Procurement Request Form
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Exit Booking and Procurement Popup"
            title="Close (X)"
            className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-slate-800 hover:bg-amber-700 disabled:opacity-50 text-white border border-slate-700 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex-1 max-h-[74vh] overflow-y-scroll modal-scrollbar p-5 sm:p-6 space-y-4"
        >
          {/* Hidden Honeypot Spam Protection Field */}
          <input
            type="checkbox"
            name="botcheck"
            checked={botcheck}
            onChange={(e) => setBotcheck(e.target.checked)}
            className="hidden"
            style={{ display: 'none' }}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
          />

          <p className="text-sm text-slate-600 leading-relaxed">
            Book a site inspection, request <strong className="text-slate-900">China / Overseas Procurement</strong>{' '}
            (Changan, GAC &amp; Chinese EVs, machinery, gadgets), or schedule{' '}
            <strong className="text-slate-900">Nigerian Building Materials</strong> supply. Submitting records your
            request via email and opens WhatsApp for instant agent chat.
          </p>

          {/* Inline Success Banner with Fallback WhatsApp Button */}
          {submitStatus === 'success' && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-xs font-bold text-emerald-900">
                    Request Logged &amp; WhatsApp Ready
                  </p>
                  <p className="text-xs text-emerald-800 leading-relaxed">{statusMessage}</p>
                </div>
              </div>
              {lastWhatsappUrl && (
                <a
                  href={lastWhatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  Open Pre-Filled WhatsApp Message
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          )}

          {/* Inline Error Banner */}
          {submitStatus === 'error' && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-700 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-xs font-bold text-red-900">Submission Error</p>
                <p className="text-xs text-red-800 leading-relaxed">{statusMessage}</p>
              </div>
            </div>
          )}

          {/* Row 1: Name & Company (Single column on < 768px) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="booking-name" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Full Name * <span className="font-normal text-slate-400">(Letters only)</span>
              </label>
              <input
                id="booking-name"
                type="text"
                required
                disabled={isSubmitting}
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Chinedu Okafor"
                className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none disabled:opacity-60 ${
                  fieldErrors.name ? 'border-red-500 focus:border-red-600' : 'border-stone-300 focus:border-amber-700'
                }`}
              />
              {fieldErrors.name && (
                <p className="text-[11px] font-medium text-red-600 mt-1">{fieldErrors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="booking-company" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Company / Organization <span className="font-normal text-slate-400">(Optional)</span>
              </label>
              <input
                id="booking-company"
                type="text"
                disabled={isSubmitting}
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Horizon Estates Ltd or Individual"
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-stone-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-700 disabled:opacity-60"
              />
            </div>
          </div>

          {/* Row 2: Phone & Email (Single column on < 768px) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="booking-phone" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Phone / WhatsApp Number * <span className="font-normal text-slate-400">(Numbers only)</span>
              </label>
              <input
                id="booking-phone"
                type="tel"
                inputMode="numeric"
                required
                disabled={isSubmitting}
                value={phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                placeholder="e.g. 08030004766"
                className={`w-full px-3.5 py-2.5 text-sm font-mono bg-white border rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none disabled:opacity-60 ${
                  fieldErrors.phone ? 'border-red-500 focus:border-red-600' : 'border-stone-300 focus:border-amber-700'
                }`}
              />
              {fieldErrors.phone && (
                <p className="text-[11px] font-medium text-red-600 mt-1">{fieldErrors.phone}</p>
              )}
            </div>

            <div>
              <label htmlFor="booking-email" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email Address *
              </label>
              <input
                id="booking-email"
                type="email"
                required
                disabled={isSubmitting}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value.replace(/\s/g, ''));
                  setFieldErrors((prev) => ({ ...prev, email: undefined }));
                }}
                placeholder="e.g. client@company.com"
                className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none disabled:opacity-60 ${
                  fieldErrors.email ? 'border-red-500 focus:border-red-600' : 'border-stone-300 focus:border-amber-700'
                }`}
              />
              {fieldErrors.email && (
                <p className="text-[11px] font-medium text-red-600 mt-1">{fieldErrors.email}</p>
              )}
            </div>
          </div>

          {/* Row 3: Service/Product Category & Preferred Date (Single column on < 768px) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="booking-category" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Service / Product Category *
              </label>
              <select
                id="booking-category"
                value={category}
                disabled={isSubmitting}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-300 rounded-lg text-slate-900 focus:outline-none focus:border-amber-700 disabled:opacity-60"
              >
                {BOOKING_CATEGORIES.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="booking-date" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Preferred Date *
              </label>
              <div className="relative">
                <input
                  id="booking-date"
                  type="date"
                  required
                  min={todayStr}
                  disabled={isSubmitting}
                  value={preferredDate}
                  onChange={(e) => {
                    setPreferredDate(e.target.value);
                    setFieldErrors((prev) => ({ ...prev, preferredDate: undefined }));
                  }}
                  className={`w-full px-3.5 py-2.5 text-sm font-mono bg-white border rounded-lg text-slate-900 focus:outline-none disabled:opacity-60 ${
                    fieldErrors.preferredDate
                      ? 'border-red-500 focus:border-red-600'
                      : 'border-stone-300 focus:border-amber-700'
                  }`}
                />
              </div>
              {fieldErrors.preferredDate && (
                <p className="text-[11px] font-medium text-red-600 mt-1">{fieldErrors.preferredDate}</p>
              )}
            </div>
          </div>

          {/* Row 4: Quantity / Details */}
          <div>
            <label htmlFor="booking-details" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Quantity &amp; Request Details *
            </label>
            <textarea
              id="booking-details"
              rows={4}
              required
              disabled={isSubmitting}
              value={quantityDetails}
              onChange={(e) => {
                setQuantityDetails(e.target.value);
                setFieldErrors((prev) => ({ ...prev, quantityDetails: undefined }));
              }}
              placeholder="Specify vehicle model (e.g. Changan / GAC EV), machinery specs, quantities, delivery state/city in Nigeria, or links..."
              className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none disabled:opacity-60 ${
                fieldErrors.quantityDetails
                  ? 'border-red-500 focus:border-red-600'
                  : 'border-stone-300 focus:border-amber-700'
              }`}
            />
            {fieldErrors.quantityDetails && (
              <p className="text-[11px] font-medium text-red-600 mt-1">{fieldErrors.quantityDetails}</p>
            )}
          </div>

          <div className="pt-3 flex flex-wrap items-center justify-between gap-3 border-t border-stone-200">
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <Briefcase className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <span>Saves email record &amp; opens WhatsApp chat automatically</span>
            </div>

            <div className="flex items-center gap-2.5 ml-auto">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2.5 text-xs font-semibold text-slate-700 bg-stone-100 hover:bg-stone-200 disabled:opacity-50 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                {submitStatus === 'success' ? 'Close' : 'Cancel'}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 disabled:opacity-65 disabled:cursor-not-allowed rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Calendar className="w-4 h-4" />
                    Submit &amp; Continue to WhatsApp
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

interface InstallmentalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const InstallmentalPaymentModal: React.FC<InstallmentalModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [amountInput, setAmountInput] = useState<string>('850000');
  const [applicantName, setApplicantName] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [projectType, setProjectType] = useState(
    'Grone Global Paints — Bulk Estate Paint Supply & Application'
  );
  const [botcheck, setBotcheck] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setError('');
    setSubmitStatus('idle');
    setStatusMessage('');
    setIsSubmitting(false);
    setBotcheck(false);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSubmitting) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen) return null;

  // Clean string-to-number handling: clearing resets breakdown to ₦0, typing 6 starts at "6" (never "06")
  const handleAmountChange = (rawVal: string) => {
    const digitsOnly = rawVal.replace(/[^0-9]/g, '');
    if (digitsOnly === '') {
      setAmountInput('');
      return;
    }
    const stripped = digitsOnly.replace(/^0+(?=\d)/, '');
    setAmountInput(stripped === '0' ? '' : stripped);
  };

  const estimatedTotal = Number(amountInput) || 0;
  const deposit50 = Math.round(estimatedTotal * 0.5);
  const midway30 = Math.round(estimatedTotal * 0.3);
  const completion20 = Math.round(estimatedTotal * 0.2);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (botcheck) return;

    if (!applicantName.trim() || !applicantPhone.trim() || !applicantEmail.trim() || estimatedTotal < 50000) {
      setError('Please enter your contact details and a valid target amount (minimum ₦50,000).');
      return;
    }

    setError('');
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setStatusMessage('');

    try {
      const response = await fetch(WEB3FORMS_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: 'New Installmental Payment Application - Grone Global Ltd',
          from_name: applicantName.trim(),
          name: applicantName.trim(),
          phone: applicantPhone.trim(),
          email: applicantEmail.trim(),
          project_category: projectType,
          estimated_total_ngn: formatNaira(estimatedTotal),
          tranche_50_deposit: formatNaira(deposit50),
          tranche_30_midway: formatNaira(midway30),
          tranche_20_final: formatNaira(completion20),
          botcheck: botcheck,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmitStatus('success');
        setStatusMessage(
          'Your 50/30/20 Installmental Payment Application has been submitted to Grone Global Ltd. Our finance desk will contact you shortly.'
        );
        setApplicantName('');
        setApplicantPhone('');
        setApplicantEmail('');
      } else {
        setSubmitStatus('error');
        setStatusMessage(
          result.message ||
            'Unable to submit your application right now. Please verify your Web3Forms access key or try again.'
        );
      }
    } catch {
      setSubmitStatus('error');
      setStatusMessage(
        'Network error while submitting your application. Please check your connection and try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-xs p-3 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="installment-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) {
          onClose();
        }
      }}
    >
      <div className="relative w-full max-w-3xl max-h-[88vh] flex flex-col bg-white border border-stone-200 rounded-xl shadow-2xl overflow-hidden">
        <div className="shrink-0 flex items-center justify-between gap-4 px-5 sm:px-6 py-4 bg-slate-900 text-white border-b border-slate-800">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-white p-1 flex items-center justify-center shrink-0">
              <img
                src={BRAND_LOGO_URL}
                alt="Grone Global Ltd Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-amber-400 font-medium truncate">
                Grone Global Ltd · Flexible Corporate &amp; Retail Financing
              </p>
              <h2 id="installment-modal-title" className="text-base sm:text-lg font-bold tracking-tight truncate">
                Installmental Payment Plan (50% · 30% · 20% Structure)
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close Installmental Payment Modal"
            title="Close (X)"
            className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-slate-800 hover:bg-amber-700 disabled:opacity-50 text-white border border-slate-700 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 p-5 sm:p-6 space-y-6 max-h-[76vh] overflow-y-scroll modal-scrollbar">
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-2">
              How Grone Global Ltd Installmental Payment Works
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              To support homeowners, estate developers, and commercial contractors,{' '}
              <strong className="text-slate-900">Grone Global Ltd</strong> offers a transparent 3-tranche
              milestone payment schedule for both{' '}
              <strong className="text-slate-900">Grone Global Paints</strong> bulk orders and{' '}
              <strong className="text-slate-900">Grone Global Ltd General Contracting Subdivision</strong> procurement
              and civil/building projects:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-white border border-stone-200 rounded-lg">
                <p className="text-xs font-mono text-amber-700 font-semibold">01. TRANCHE ONE (50%)</p>
                <p className="text-base font-bold text-slate-900 mt-1">50% Initial Deposit</p>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Locks in raw material pricing, initiates custom paint formulation, procurement, or site mobilization.
                </p>
              </div>
              <div className="p-4 bg-white border border-stone-200 rounded-lg">
                <p className="text-xs font-mono text-amber-700 font-semibold">02. TRANCHE TWO (30%)</p>
                <p className="text-base font-bold text-slate-900 mt-1">30% Mid-Way Milestone</p>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Payable upon batch quality verification, pre-shipment inspection, or 50% project milestone.
                </p>
              </div>
              <div className="p-4 bg-white border border-stone-200 rounded-lg">
                <p className="text-xs font-mono text-amber-700 font-semibold">03. TRANCHE THREE (20%)</p>
                <p className="text-base font-bold text-slate-900 mt-1">20% Prior to Delivery</p>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Final balance settled prior to final batch dispatch, doorstep delivery, or turnkey handover.
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Installment Calculator */}
          <div className="border border-stone-200 rounded-xl p-5 bg-white">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-amber-700" />
                <h3 className="text-sm font-bold text-slate-900">
                  Interactive Installment Breakdown Calculator
                </h3>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {[250000, 850000, 2500000, 10000000].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setAmountInput(String(preset))}
                    className={`px-2.5 py-1 text-xs font-mono rounded border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                      estimatedTotal === preset
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-stone-50 text-slate-700 border-stone-300 hover:bg-stone-100'
                    }`}
                  >
                    {formatNaira(preset)}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <label htmlFor="installment-amount-input" className="block text-xs font-semibold text-slate-700">
                  Enter Estimated Paint Order or Contracting Project Amount (NGN ₦)
                </label>
                {amountInput !== '' && (
                  <button
                    type="button"
                    onClick={() => setAmountInput('')}
                    className="text-[11px] font-semibold text-slate-500 hover:text-amber-700 transition-colors cursor-pointer"
                  >
                    Clear to 0
                  </button>
                )}
              </div>
              <input
                id="installment-amount-input"
                type="text"
                inputMode="numeric"
                value={amountInput}
                onChange={(e) => handleAmountChange(e.target.value)}
                placeholder="0"
                className="w-full px-4 py-2.5 text-base font-mono font-bold tabular-nums bg-stone-50 border border-stone-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-700"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-stone-900 text-white p-4 rounded-lg">
              <div>
                <p className="text-xs text-stone-400">50% Initial Deposit</p>
                <p className="text-lg font-mono font-bold text-amber-400 tabular-nums mt-0.5">
                  {formatNaira(deposit50)}
                </p>
                <p className="text-xs text-stone-400 mt-0.5">Due at commencement</p>
              </div>
              <div>
                <p className="text-xs text-stone-400">30% Mid-Way Payment</p>
                <p className="text-lg font-mono font-bold text-white tabular-nums mt-0.5">
                  {formatNaira(midway30)}
                </p>
                <p className="text-xs text-stone-400 mt-0.5">Due at 50% milestone</p>
              </div>
              <div>
                <p className="text-xs text-stone-400">20% Final Balance</p>
                <p className="text-lg font-mono font-bold text-emerald-400 tabular-nums mt-0.5">
                  {formatNaira(completion20)}
                </p>
                <p className="text-xs text-stone-400 mt-0.5">Prior to dispatch/completion</p>
              </div>
            </div>
          </div>

          {/* Quick Application Form (Mobile-stacked < 768px) */}
          <form onSubmit={handleApply} className="space-y-4 border-t border-stone-200 pt-5">
            <input
              type="checkbox"
              name="botcheck"
              checked={botcheck}
              onChange={(e) => setBotcheck(e.target.checked)}
              className="hidden"
              style={{ display: 'none' }}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />

            <h3 className="text-sm font-bold text-slate-900">
              Quick Installmental Payment Application
            </h3>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs font-medium text-red-700">
                {error}
              </div>
            )}

            {submitStatus === 'success' && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-xs font-bold text-emerald-900">Application Submitted</p>
                  <p className="text-xs text-emerald-800 leading-relaxed">{statusMessage}</p>
                </div>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-700 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-xs font-bold text-red-900">Submission Error</p>
                  <p className="text-xs text-red-800 leading-relaxed">{statusMessage}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  disabled={isSubmitting}
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  placeholder="Your Full Name or Company"
                  className="w-full px-3.5 py-2 text-sm bg-white border border-stone-300 rounded-lg text-slate-900 focus:outline-none focus:border-amber-700 disabled:opacity-60"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  inputMode="numeric"
                  required
                  disabled={isSubmitting}
                  value={applicantPhone}
                  onChange={(e) => setApplicantPhone(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="08030000000"
                  className="w-full px-3.5 py-2 text-sm font-mono bg-white border border-stone-300 rounded-lg text-slate-900 focus:outline-none focus:border-amber-700 disabled:opacity-60"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  disabled={isSubmitting}
                  value={applicantEmail}
                  onChange={(e) => setApplicantEmail(e.target.value)}
                  placeholder="client@domain.com"
                  className="w-full px-3.5 py-2 text-sm bg-white border border-stone-300 rounded-lg text-slate-900 focus:outline-none focus:border-amber-700 disabled:opacity-60"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Order or Project Category *
                </label>
                <select
                  value={projectType}
                  disabled={isSubmitting}
                  onChange={(e) => setProjectType(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-white border border-stone-300 rounded-lg text-slate-900 focus:outline-none focus:border-amber-700 disabled:opacity-60"
                >
                  <option value="Grone Global Paints — Bulk Estate Paint Supply & Application">
                    Grone Global Paints — Bulk Paint Supply / Contract Painting
                  </option>
                  <option value="Grone Global Paints — Screeding & Putty Production Supply">
                    Grone Global Paints — Screeding &amp; Putty Production Supply
                  </option>
                  <option value="Grone Global Paints — Paint & Putty Production Tutorials">
                    Grone Global Paints — Paint, Screeding &amp; Putty Production Tutorials
                  </option>
                  <option value="Grone Global Ltd General Contracting Subdivision — General Contracting, Civil Works & Nigerian Building Materials">
                    Grone Global Ltd General Contracting Subdivision — General Contracting, Civil Works &amp; Nigerian Building Materials
                  </option>
                  <option value="Grone Global Ltd General Contracting Subdivision — Structural Renovation">
                    Grone Global Ltd General Contracting Subdivision — Structural Renovation
                  </option>
                  <option value="Grone Global Ltd General Contracting Subdivision — International & China Procurement">
                    Grone Global Ltd General Contracting Subdivision — International &amp; China Procurement (Chinese EVs, Machinery &amp; Delivery)
                  </option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Target Amount (NGN ₦) *
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  required
                  disabled={isSubmitting}
                  value={amountInput}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  placeholder="0"
                  className="w-full px-3.5 py-2 text-sm font-mono tabular-nums bg-white border border-stone-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-700 disabled:opacity-60"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2.5 text-xs font-semibold text-slate-700 bg-stone-100 hover:bg-stone-200 disabled:opacity-50 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                Close
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-amber-700 hover:bg-amber-800 disabled:opacity-65 disabled:cursor-not-allowed rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    Apply for Installmental Payment
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

interface LegalModalProps {
  type: 'terms' | 'privacy' | null;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  const isTerms = type === 'terms';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-xs p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-2xl bg-white border border-stone-200 rounded-xl shadow-2xl overflow-hidden my-8">
        <div className="flex items-center justify-between gap-3 px-6 py-5 bg-slate-900 text-white">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-white p-1 flex items-center justify-center shrink-0">
              <img
                src={BRAND_LOGO_URL}
                alt="Grone Global Ltd Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-stone-400 flex items-center gap-1.5">
                {isTerms ? (
                  <Scale className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                ) : (
                  <FileText className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                )}
                <span>Grone Global Ltd · Corporate Governance</span>
              </p>
              <h2 className="text-base font-bold truncate">
                {isTerms ? 'Terms & Conditions of Supply and Contracting' : 'Corporate Privacy & Data Protection Policy'}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-sm text-slate-600 leading-relaxed max-h-[70vh] overflow-y-scroll modal-scrollbar">
          {isTerms ? (
            <>
              <div>
                <h3 className="font-bold text-slate-900">1. Corporate Structure &amp; Scope</h3>
                <p className="mt-1">
                  These Terms &amp; Conditions govern all transactions with <strong>Grone Global Ltd</strong>,
                  operating through its two official subdivisions: <strong>Grone Global Paints</strong> (paint
                  manufacturing, screeding &amp; putty production, contract painting, and formulation tutorials) and{' '}
                  <strong>Grone Global Ltd General Contracting Subdivision</strong> (turnkey building construction,
                  structural renovations, civil engineering works, global/China procurement &amp; delivery, and local
                  Nigerian building materials supply).
                </p>
              </div>
              <div>
                <h3 className="font-bold text-slate-900">2. Paint Orders, Custom Shades &amp; Bank Transfer Settlement</h3>
                <p className="mt-1">
                  All direct paint orders placed via the <strong>Grone Global Paints</strong> portal are settled
                  exclusively via corporate bank transfer to the designated <strong>Grone Global Ltd</strong> bank
                  account and verified via receipt upload. Custom-tinted shades (Emulsion, Acrylic, Silk, or Oil Paint in
                  4L or 20L plastic buckets) enter production immediately upon payment verification.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-slate-900">3. Installmental Payment Agreements</h3>
                <p className="mt-1">
                  Approved installmental payment plans follow the standard 50% initial deposit, 30% mid-way milestone,
                  and 20% pre-delivery/completion schedule. Final dispatch or project sign-off occurs upon settlement
                  of the 20% completion tranche.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-slate-900">4. Quality Warranty &amp; Site Inspection</h3>
                <p className="mt-1">
                  Grone Global Paints products carry a certified batch quality guarantee when applied over properly
                  prepared and primed substrates. Structural and civil works executed by Grone Global Ltd General
                  Contracting Subdivision include a formal structural defect liability period as specified in each
                  signed Bill of Quantities (BOQ).
                </p>
              </div>
            </>
          ) : (
            <>
              <div>
                <h3 className="font-bold text-slate-900">1. Data Collection &amp; Purpose (NDPR Compliance)</h3>
                <p className="mt-1">
                  <strong>Grone Global Ltd</strong> collects customer names, delivery addresses, phone numbers,
                  email addresses, and bank transfer receipt uploads strictly for order fulfillment, dispatch routing,
                  and contracting project administration across <strong>Grone Global Paints</strong> and{' '}
                  <strong>Grone Global Ltd General Contracting Subdivision</strong>.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-slate-900">2. Payment Verification Security</h3>
                <p className="mt-1">
                  We do not collect or store credit card numbers or online banking passwords on this portal. All
                  payments are processed directly through your bank via transfer to <strong>Grone Global Ltd</strong>{' '}
                  and verified by our accounts team using your uploaded receipt image or link.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-slate-900">3. Confidentiality of Project Blueprints &amp; Formulations</h3>
                <p className="mt-1">
                  Architectural drawings submitted to <strong>Grone Global Ltd General Contracting Subdivision</strong>{' '}
                  and custom white-label color codes developed by <strong>Grone Global Paints</strong> are held under
                  strict corporate non-disclosure.
                </p>
              </div>
            </>
          )}
        </div>

        <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            Acknowledge &amp; Close
          </button>
        </div>
      </div>
    </div>
  );
};

interface ConfirmationModalProps {
  isOpen: boolean;
  autoRedirectHome: boolean;
  onComplete: () => void;
}

export const ConfirmationPopupModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  autoRedirectHome,
  onComplete,
}) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!isOpen) {
      setProgress(100);
      return;
    }

    if (!autoRedirectHome) return;

    const durationMs = 3500;
    const intervalMs = 50;
    const step = (intervalMs / durationMs) * 100;

    const interval = window.setInterval(() => {
      setProgress((prev) => Math.max(0, prev - step));
    }, intervalMs);

    const timer = window.setTimeout(() => {
      onComplete();
    }, durationMs);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(timer);
    };
  }, [isOpen, autoRedirectHome, onComplete]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="confirmation-popup-heading"
    >
      <div className="w-full max-w-md bg-white border border-stone-200 rounded-xl shadow-2xl p-8 text-center">
        <img
          src={BRAND_LOGO_URL}
          alt="Grone Global Ltd Official Logo"
          className="h-14 w-auto object-contain mx-auto mb-3"
        />
        <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
          <CheckCircle2 className="w-7 h-7" />
        </div>

        <p className="text-xs font-semibold text-amber-700">Grone Global Ltd</p>
        <h3 id="confirmation-popup-heading" className="text-xl font-bold text-slate-900 mt-1">
          Thank you, we will contact you shortly
        </h3>
        <p className="text-sm text-slate-600 mt-2 leading-relaxed">
          Your submission has been logged by our customer operations desk. A dedicated representative from{' '}
          <strong className="text-slate-900">Grone Global Ltd</strong> will reach out to you via phone and email.
        </p>

        {autoRedirectHome ? (
          <div className="mt-6 space-y-2">
            <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-700 transition-all duration-75"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs font-mono text-slate-500">
              Returning to Grone Global Ltd Homepage automatically...
            </p>
            <button
              type="button"
              onClick={onComplete}
              className="mt-2 px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              Return to Homepage Now
            </button>
          </div>
        ) : (
          <div className="mt-6">
            <button
              type="button"
              onClick={onComplete}
              className="w-full py-2.5 px-5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
