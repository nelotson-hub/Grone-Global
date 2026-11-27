import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Droplets,
  Factory,
  MapPin,
  MessageCircle,
  Minus,
  PaintRoller,
  Phone,
  Plus,
  Trash2,
  Truck,
} from 'lucide-react';
import {
  BucketSizeKey,
  IMAGES,
  PAINT_CATALOG_TABS,
  PAINT_FINISHES,
  PAINT_ORDER_KEYS,
  PaintTypeKey,
  formatNaira,
} from '../data/groneData';
import { WALL_AREA_PER_ROOM_M2, estimatePaint } from '../data/paintEstimator';
import {
  COMPANY_ADDRESS,
  COMPANY_PHONE_DISPLAY,
  COMPANY_PHONE_TEL,
  WHATSAPP_NUMBER,
  buildWhatsAppUrl,
} from '../config/contactConfig';

const HERO_VIDEO_URL = '/assets/media/grone-paints-hero.mp4';
const WHATSAPP_READY = /^\d{8,15}$/.test(WHATSAPP_NUMBER);

const BUYER_TYPES = [
  'Real Estate Developer / Bulk Contractor',
  'Supply + Painting Crew',
  'Homeowner Retail Order',
] as const;

const VOLUME_OPTIONS = ['Under 100 L', '100 – 1,000 L', '1,000 – 5,000 L', '5,000 L and above'];

const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno', 'Cross River', 'Delta',
  'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT Abuja', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina',
  'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers',
  'Sokoto', 'Taraba', 'Yobe', 'Zamfara',
];

interface QuoteItem {
  key: PaintTypeKey;
  size: BucketSizeKey;
  qty: number;
}

interface PaintsHomeViewProps {
  onOrderPaint: (paintType?: PaintTypeKey) => void;
}

const scrollToId = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

export const PaintsHomeView: React.FC<PaintsHomeViewProps> = ({ onOrderPaint }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Catalog
  const [activeTab, setActiveTab] = useState(0);

  // Estimator
  const [measureBy, setMeasureBy] = useState<'area' | 'rooms'>('area');
  const [measureValue, setMeasureValue] = useState('');
  const [estFinish, setEstFinish] = useState<PaintTypeKey>('emulsion');
  const [coats, setCoats] = useState(2);

  // Quote form
  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>([]);
  const [buyerType, setBuyerType] = useState<(typeof BUYER_TYPES)[number]>(BUYER_TYPES[0]);
  const [volume, setVolume] = useState(VOLUME_OPTIONS[0]);
  const [deliveryState, setDeliveryState] = useState('Lagos');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState('');

  // Respect visitors who ask their device for reduced motion.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) videoRef.current?.pause();
  }, []);

  const measure = Math.max(0, Number(measureValue) || 0);
  const areaM2 = measureBy === 'rooms' ? measure * WALL_AREA_PER_ROOM_M2 : measure;
  const estimate = estimatePaint(areaM2, estFinish, coats);
  const estimateCost =
    estimate.buckets20 * PAINT_FINISHES[estFinish].prices['20L'] + estimate.buckets4 * PAINT_FINISHES[estFinish].prices['4L'];

  const addToQuote = (key: PaintTypeKey, size: BucketSizeKey, qty: number) => {
    if (qty <= 0) return;
    setQuoteItems((prev) => {
      const existing = prev.find((i) => i.key === key && i.size === size);
      if (existing) return prev.map((i) => (i === existing ? { ...i, qty: i.qty + qty } : i));
      return [...prev, { key, size, qty }];
    });
  };

  const updateItem = (index: number, patch: Partial<QuoteItem>) =>
    setQuoteItems((prev) => prev.map((item, i) => (i === index ? { ...item, ...patch } : item)));

  const removeItem = (index: number) => setQuoteItems((prev) => prev.filter((_, i) => i !== index));

  const useEstimateInQuote = () => {
    addToQuote(estFinish, '20L', estimate.buckets20);
    addToQuote(estFinish, '4L', estimate.buckets4);
    scrollToId('request-quote');
  };

  const submitQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || phone.replace(/\D/g, '').length < 7) {
      setFormError('Please enter your name and a valid phone number so we can reach you.');
      return;
    }
    if (!WHATSAPP_READY) {
      setFormError(`Online quote sending is not set up yet. Please call us on ${COMPANY_PHONE_DISPLAY}.`);
      return;
    }
    setFormError('');
    const itemLines = quoteItems.length
      ? quoteItems.map((i) => `• ${i.qty} × ${i.size} ${PAINT_FINISHES[i.key].name}`).join('\n')
      : '• (No items selected yet — please advise)';
    const message = [
      'Hello Grone Global Paints, I would like a quote.',
      '',
      `Buyer type: ${buyerType}`,
      `Name: ${name.trim()}`,
      `Phone: ${phone.trim()}`,
      `Delivery state: ${deliveryState}`,
      `Expected volume: ${volume}`,
      '',
      'Items:',
      itemLines,
      notes.trim() ? `\nNotes: ${notes.trim()}` : '',
    ].join('\n');
    window.open(buildWhatsAppUrl(message), '_blank', 'noopener,noreferrer');
  };

  const inputClass =
    'w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:border-[#0D9488]';

  return (
    <div className="bg-[#F8FAFC] text-slate-900">
      {/* HERO: factory-to-wall video */}
      <section id="paints-top" className="relative min-h-[88svh] flex items-end overflow-hidden bg-[#0F172A]">
        <video
          ref={videoRef}
          src={HERO_VIDEO_URL}
          poster={IMAGES.heroPaintShowcase}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ background: 'linear-gradient(90deg, rgba(15,23,42,0.72) 0%, rgba(15,23,42,0.30) 100%)' }}
        />
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0F172A]/85 to-transparent" />

        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12 sm:pb-16">
          <p className="text-[11px] sm:text-xs font-bold tracking-[0.18em] text-[#5EEAD4] uppercase">
            Factory-Direct Paint Manufacturing • Supply • Application
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.05]">
            Industrial-Grade Paints. Manufactured &amp; Applied.
          </h1>
          <p className="mt-5 max-w-2xl text-base sm:text-lg text-slate-200 leading-relaxed">
            From our production floor to your project site—nationwide bulk supply, custom batch tinting, and vetted
            painting crews for developers, contractors, and homeowners.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => scrollToId('request-quote')}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-[#D97706] hover:bg-[#B45309] text-white text-sm font-bold shadow-lg transition-colors cursor-pointer"
            >
              Request a Quote <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onOrderPaint('emulsion')}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/40 text-white text-sm font-bold backdrop-blur-sm transition-colors cursor-pointer"
            >
              Order Now
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 2: Bucket lineup */}
      <section id="bucket-sizes" className="scroll-mt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div className="relative rounded-2xl overflow-hidden bg-[#0F172A] shadow-xl aspect-[4/3]">
            <img
              src={IMAGES.paintProductLineup}
              alt="Grone Global Paints Emulsion, Acrylic, Screeding Paste, Oil Paint and Silk buckets in front of the production line"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover object-[center_75%]"
            />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-[#0F172A]/60 via-transparent to-transparent" />
            <div className="absolute top-4 left-4 right-4 flex flex-wrap gap-2">
              <span className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-white text-[#0F172A] text-[10px] sm:text-xs font-bold shadow">
                4L Retail Bucket
              </span>
              <span className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-[#0D9488] text-white text-[10px] sm:text-xs font-bold shadow">
                20L Standard Contractor Bucket
              </span>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold tracking-[0.16em] uppercase text-[#0D9488]">Made in our own factory</p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0F172A]">
              One factory. Every bucket, the same colour.
            </h2>
            <p className="mt-4 text-slate-600 leading-relaxed">
              Grone Global Paints manufactures every bucket in-house, so the shade you approve on the first wall is the
              shade on the last—across hundreds of buckets for a full estate.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-slate-700">
              {[
                'Consistent colour batching for real estate and multi-unit projects',
                'Formulated for Nigerian heat, humidity and heavy rain',
                'Convenient 4L and 20L buckets for homeowners and contractors',
              ].map((point) => (
                <li key={point} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-[#0D9488] shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
            <a
              href={buildWhatsAppUrl('Hello Grone Global Paints, please send me the Size & Spec Guide.')}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex items-center gap-1.5 text-sm font-bold text-[#0284C7] hover:text-[#0369A1]"
            >
              Download Size &amp; Spec Guide <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* SECTION 3: What we do */}
      <section id="paint-services" className="scroll-mt-20 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <p className="text-xs font-bold tracking-[0.16em] uppercase text-[#0D9488]">What we do</p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0F172A]">
            Production, supply and application under one roof
          </h2>
          <div className="mt-10 grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Factory,
                title: 'Factory Paint Production & Custom Tinting',
                body: 'High-opacity interior emulsions, silk finishes, weather-resistant exteriors, and exact colour matching.',
              },
              {
                icon: Truck,
                title: 'Nationwide Bulk Supply',
                body: 'Factory-direct volume pricing and scheduled site delivery for developers, contractors and distributors across Nigeria.',
              },
              {
                icon: PaintRoller,
                title: 'Professional Painting & Surface Prep',
                body: 'Vetted crews handling screeding, priming, and full interior and exterior painting for estates, offices and homes.',
              },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-6">
                <div className="w-11 h-11 rounded-xl bg-[#0F172A] text-[#5EEAD4] flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="mt-5 text-lg font-bold text-[#0F172A]">{title}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: Finishes catalog */}
      <section id="paint-finishes" className="scroll-mt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <p className="text-xs font-bold tracking-[0.16em] uppercase text-[#0D9488]">Paint finishes</p>
        <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0F172A]">Technical catalog</h2>

        <div role="tablist" aria-label="Paint categories" className="mt-8 flex flex-wrap gap-2">
          {PAINT_CATALOG_TABS.map((tab, i) => (
            <button
              key={tab.label}
              type="button"
              role="tab"
              aria-selected={activeTab === i}
              onClick={() => setActiveTab(i)}
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors cursor-pointer ${
                activeTab === i
                  ? 'bg-[#0F172A] text-white border-[#0F172A]'
                  : 'bg-white text-slate-700 border-slate-300 hover:border-[#0F172A]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-8 grid sm:grid-cols-2 gap-6">
          {PAINT_CATALOG_TABS[activeTab].keys.map((key) => {
            const spec = PAINT_FINISHES[key];
            return (
              <article key={key} className="rounded-2xl border border-slate-200 bg-white p-6 flex flex-col">
                <h3 className="text-xl font-bold text-[#0F172A]">{spec.name}</h3>
                <p className="mt-1 text-sm text-slate-500">{spec.subtitle}</p>
                <dl className="mt-5 grid grid-cols-1 gap-3 text-sm">
                  <div className="flex items-start gap-2.5">
                    <Droplets className="w-4 h-4 text-[#0284C7] shrink-0 mt-0.5" />
                    <div>
                      <dt className="font-semibold text-slate-800">Coverage</dt>
                      <dd className="text-slate-600">{spec.coveragePerLitre}</dd>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Clock className="w-4 h-4 text-[#0284C7] shrink-0 mt-0.5" />
                    <div>
                      <dt className="font-semibold text-slate-800">Drying time</dt>
                      <dd className="text-slate-600">{spec.dryingTime}</dd>
                    </div>
                  </div>
                </dl>
                <div className="mt-5 flex flex-wrap gap-2">
                  {(['4L', '20L'] as BucketSizeKey[]).map((size) => (
                    <span key={size} className="px-3 py-1.5 rounded-lg bg-[#F8FAFC] border border-slate-200 text-xs font-semibold">
                      {size} · {formatNaira(spec.prices[size])}
                    </span>
                  ))}
                </div>
                <div className="mt-auto pt-5 border-t border-slate-100 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      addToQuote(key, '20L', 1);
                      scrollToId('request-quote');
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0D9488] hover:bg-[#0F766E] text-white text-sm font-bold transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Add to Quote
                  </button>
                  <button
                    type="button"
                    onClick={() => onOrderPaint(key)}
                    className="px-4 py-2 rounded-lg border border-slate-300 hover:border-[#0F172A] text-sm font-semibold text-slate-800 transition-colors cursor-pointer"
                  >
                    Buy online
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* SECTION 5: Coverage estimator */}
      <section id="coverage-estimator" className="scroll-mt-20 bg-[#0F172A] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 grid lg:grid-cols-2 gap-10">
          <div>
            <p className="text-xs font-bold tracking-[0.16em] uppercase text-[#5EEAD4]">Coverage estimator</p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight">How much paint do you need?</h2>
            <p className="mt-4 text-slate-300 leading-relaxed">
              A quick, conservative estimate. Our team confirms exact quantities after a site check.
            </p>
          </div>

          <div className="rounded-2xl bg-white text-slate-900 p-6 space-y-5">
            <div>
              <div className="flex gap-2 mb-2" role="radiogroup" aria-label="Measure by">
                {(['area', 'rooms'] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    role="radio"
                    aria-checked={measureBy === mode}
                    onClick={() => setMeasureBy(mode)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border cursor-pointer ${
                      measureBy === mode ? 'bg-[#0F172A] text-white border-[#0F172A]' : 'border-slate-300 text-slate-700'
                    }`}
                  >
                    {mode === 'area' ? 'Total wall area (m²)' : 'Number of rooms'}
                  </button>
                ))}
              </div>
              <label htmlFor="est-measure" className="sr-only">
                {measureBy === 'area' ? 'Total wall area in square metres' : 'Number of rooms'}
              </label>
              <input
                id="est-measure"
                type="number"
                min={0}
                inputMode="decimal"
                value={measureValue}
                onChange={(e) => setMeasureValue(e.target.value)}
                placeholder={measureBy === 'area' ? 'e.g. 120' : 'e.g. 3'}
                className={inputClass}
              />
              {measureBy === 'rooms' && (
                <p className="mt-1.5 text-xs text-slate-500">Each room counted as about {WALL_AREA_PER_ROOM_M2} m² of wall.</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="est-finish" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Finish type
                </label>
                <select id="est-finish" value={estFinish} onChange={(e) => setEstFinish(e.target.value as PaintTypeKey)} className={inputClass}>
                  {PAINT_ORDER_KEYS.map((key) => (
                    <option key={key} value={key}>
                      {PAINT_FINISHES[key].name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="est-coats" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Coats
                </label>
                <select id="est-coats" value={coats} onChange={(e) => setCoats(Number(e.target.value))} className={inputClass}>
                  {[1, 2, 3].map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? 'coat' : 'coats'}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="rounded-xl bg-[#F8FAFC] border border-slate-200 p-4" aria-live="polite">
              {estimate.litres > 0 ? (
                <>
                  <p className="text-sm text-slate-600">
                    Estimated: <strong className="text-[#0F172A] text-lg">{estimate.litres} L</strong>
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[#0F172A]">
                    {[estimate.buckets20 && `${estimate.buckets20} × 20L`, estimate.buckets4 && `${estimate.buckets4} × 4L`]
                      .filter(Boolean)
                      .join(' + ')}{' '}
                    buckets · approx. {formatNaira(estimateCost)}
                  </p>
                </>
              ) : (
                <p className="text-sm text-slate-500">Enter your wall area or number of rooms to see an estimate.</p>
              )}
            </div>

            <button
              type="button"
              disabled={estimate.litres === 0}
              onClick={useEstimateInQuote}
              className="w-full px-5 py-3 rounded-lg bg-[#D97706] hover:bg-[#B45309] disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-sm font-bold transition-colors cursor-pointer"
            >
              Use This Quantity in Quote Form
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 7: Request a quote */}
      <section id="request-quote" className="scroll-mt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 rounded-2xl bg-[#0F172A] text-white p-7 flex flex-col gap-6">
            <div>
              <p className="text-xs font-bold tracking-[0.16em] uppercase text-[#5EEAD4]">Request a quote</p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight">Talk to the factory directly</h2>
            </div>
            <div className="flex items-start gap-3 text-sm text-slate-300">
              <MapPin className="w-5 h-5 text-[#5EEAD4] shrink-0" />
              <span>{COMPANY_ADDRESS}</span>
            </div>
            <a href={`tel:${COMPANY_PHONE_TEL}`} className="flex items-center gap-3 text-sm font-semibold hover:text-[#5EEAD4]">
              <Phone className="w-5 h-5 text-[#5EEAD4] shrink-0" />
              {COMPANY_PHONE_DISPLAY}
            </a>
            {WHATSAPP_READY && (
              <a
                href={buildWhatsAppUrl('Hello Grone Global Paints, I would like to place a quick order.')}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold transition-colors"
              >
                <MessageCircle className="w-5 h-5" /> WhatsApp Quick Order
              </a>
            )}
          </div>

          <form onSubmit={submitQuote} noValidate className="lg:col-span-3 rounded-2xl bg-white border border-slate-200 p-6 sm:p-7 space-y-6">
            <fieldset>
              <legend className="text-sm font-bold text-[#0F172A] mb-3">I am a…</legend>
              <div className="grid sm:grid-cols-3 gap-2">
                {BUYER_TYPES.map((type) => (
                  <label
                    key={type}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-xs font-semibold cursor-pointer ${
                      buyerType === type ? 'border-[#0D9488] bg-[#0D9488]/10 text-[#0F172A]' : 'border-slate-300 text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="buyer-type"
                      value={type}
                      checked={buyerType === type}
                      onChange={() => setBuyerType(type)}
                      className="accent-[#0D9488]"
                    />
                    {type}
                  </label>
                ))}
              </div>
              {buyerType === 'Homeowner Retail Order' && (
                <p className="mt-2 text-xs text-slate-600">
                  Prefer to pay online?{' '}
                  <button type="button" onClick={() => onOrderPaint('emulsion')} className="font-bold text-[#0284C7] underline cursor-pointer">
                    Use the Order page
                  </button>
                  .
                </p>
              )}
            </fieldset>

            <div>
              <p className="text-sm font-bold text-[#0F172A] mb-3">Items</p>
              {quoteItems.length === 0 ? (
                <p className="text-sm text-slate-500 rounded-lg border border-dashed border-slate-300 p-4">
                  Add products from the catalog or estimator above, or describe what you need in the notes.
                </p>
              ) : (
                <ul className="space-y-2">
                  {quoteItems.map((item, i) => (
                    <li key={`${item.key}-${i}`}className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-200 p-2.5">
                      <span className="flex-1 min-w-[8rem] text-sm font-semibold">{PAINT_FINISHES[item.key].name}</span>
                      <label className="sr-only" htmlFor={`size-${i}`}>Bucket size</label>
                      <select
                        id={`size-${i}`}
                        value={item.size}
                        onChange={(e) => updateItem(i, { size: e.target.value as BucketSizeKey })}
                        className="rounded-md border border-slate-300 px-2 py-1.5 text-sm"
                      >
                        <option value="4L">4L</option>
                        <option value="20L">20L</option>
                      </select>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          onClick={() => updateItem(i, { qty: Math.max(1, item.qty - 1) })}
                          className="p-1.5 rounded-md border border-slate-300 cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm font-bold" aria-live="polite">{item.qty}</span>
                        <button
                          type="button"
                          aria-label="Increase quantity"
                          onClick={() => updateItem(i, { qty: item.qty + 1 })}
                          className="p-1.5 rounded-md border border-slate-300 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <button
                        type="button"
                        aria-label={`Remove ${PAINT_FINISHES[item.key].name}`}
                        onClick={() => removeItem(i)}
                        className="p-1.5 rounded-md text-slate-500 hover:text-red-600 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="q-volume" className="block text-xs font-semibold text-slate-700 mb-1.5">Expected volume</label>
                <select id="q-volume" value={volume} onChange={(e) => setVolume(e.target.value)} className={inputClass}>
                  {VOLUME_OPTIONS.map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="q-state" className="block text-xs font-semibold text-slate-700 mb-1.5">Delivery state</label>
                <select id="q-state" value={deliveryState} onChange={(e) => setDeliveryState(e.target.value)} className={inputClass}>
                  {NIGERIAN_STATES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="q-name" className="block text-xs font-semibold text-slate-700 mb-1.5">Your name</label>
                <input id="q-name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" className={inputClass} />
              </div>
              <div>
                <label htmlFor="q-phone" className="block text-xs font-semibold text-slate-700 mb-1.5">Phone number</label>
                <input
                  id="q-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  autoComplete="tel"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label htmlFor="q-notes" className="block text-xs font-semibold text-slate-700 mb-1.5">Notes (optional)</label>
              <textarea
                id="q-notes"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Colours, site address, timeline, painting crew needed…"
                className={inputClass}
              />
            </div>

            {formError && (
              <p role="alert" className="text-sm font-semibold text-red-600">
                {formError}
              </p>
            )}

            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-[#D97706] hover:bg-[#B45309] text-white text-sm font-bold transition-colors cursor-pointer"
            >
              Send Quote Request on WhatsApp <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};
