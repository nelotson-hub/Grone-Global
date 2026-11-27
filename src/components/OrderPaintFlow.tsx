import React, { useState, useRef } from 'react';
import {
  PaintBucket,
  Copy,
  Check,
  ArrowRight,
  ArrowLeft,
  Upload,
  Link2,
  Trash2,
  Plus,
  Minus,
  Calendar,
  MapPin,
  ShieldCheck,
  CreditCard,
  FileCheck2,
} from 'lucide-react';
import {
  PAINT_FINISHES,
  PAINT_ORDER_KEYS,
  CURATED_SWATCHES,
  SCREEDING_GRADES,
  DELIVERY_ZONES,
  PaintTypeKey,
  BucketSizeKey,
  OrderCartItem,
  formatNaira,
  BRAND_LOGO_URL,
} from '../data/groneData';

interface OrderPaintFlowProps {
  initialPaintType?: PaintTypeKey;
  onOrderComplete: () => void;
  onOpenInstallmentModal: () => void;
  onOpenContactModal: (subject?: string) => void;
}

export const OrderPaintFlow: React.FC<OrderPaintFlowProps> = ({
  initialPaintType = 'emulsion',
  onOrderComplete,
  onOpenInstallmentModal,
  onOpenContactModal,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];

  // Step state: 1 | 2 | 3
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1 form states (preserved across Back navigation)
  const [paintType, setPaintType] = useState<PaintTypeKey>(initialPaintType);
  const [colorSpec, setColorSpec] = useState<string>(
    initialPaintType === 'screeding'
      ? 'Ultra-White Interior Acrylic Screeding Putty (GP-INT)'
      : 'Warm Alabaster (GR-101)'
  );
  const [selectedHex, setSelectedHex] = useState<string>(
    initialPaintType === 'screeding' ? '#F9F9F7' : '#F3EFE6'
  );
  const [bucketSize, setBucketSize] = useState<BucketSizeKey>('20L');
  const [quantity, setQuantity] = useState<number>(4);
  const [additionalItems, setAdditionalItems] = useState<OrderCartItem[]>([]);
  const [deliveryZoneId, setDeliveryZoneId] = useState<string>(DELIVERY_ZONES[0].id);
  const [deliveryAddress, setDeliveryAddress] = useState<string>('');
  const [neededDate, setNeededDate] = useState<string>(todayStr);
  const [step1Error, setStep1Error] = useState<string>('');

  // Step 2 states
  const [copiedAccount, setCopiedAccount] = useState<boolean>(false);

  // Step 3 states
  const [customerName, setCustomerName] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [receiptFilePreview, setReceiptFilePreview] = useState<string>('');
  const [receiptFileName, setReceiptFileName] = useState<string>('');
  const [receiptLink, setReceiptLink] = useState<string>('');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [step3Error, setStep3Error] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const currentPaintSpec = PAINT_FINISHES[paintType];
  const currentUnitPrice = currentPaintSpec.prices[bucketSize];
  const currentItemSubtotal = currentUnitPrice * quantity;

  const additionalSubtotal = additionalItems.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );

  const totalPaintCost = currentItemSubtotal + additionalSubtotal;
  const selectedZone =
    DELIVERY_ZONES.find((z) => z.id === deliveryZoneId) || DELIVERY_ZONES[0];
  const deliveryFee = selectedZone.fee;
  const grandTotal = totalPaintCost + deliveryFee;

  const handleSelectPaintType = (key: PaintTypeKey) => {
    setPaintType(key);
    if (key === 'screeding') {
      setColorSpec('Ultra-White Interior Acrylic Screeding Putty (GP-INT)');
      setSelectedHex('#F9F9F7');
    } else if (paintType === 'screeding') {
      setColorSpec('Warm Alabaster (GR-101)');
      setSelectedHex('#F3EFE6');
    }
  };

  const handleSelectSwatch = (code: string, name: string, hex: string) => {
    setColorSpec(`${name} (${code})`);
    setSelectedHex(hex);
  };

  const handleAddLineItem = () => {
    if (!colorSpec.trim()) {
      setStep1Error('Please specify a Color & Shade before adding to your multi-item list.');
      return;
    }
    const newItem: OrderCartItem = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      paintType,
      paintTypeName: currentPaintSpec.name,
      colorSpec: colorSpec.trim(),
      colorHex: selectedHex,
      bucketSize,
      quantity,
      unitPrice: currentUnitPrice,
    };
    setAdditionalItems((prev) => [...prev, newItem]);
    setQuantity(2);
    setStep1Error('');
  };

  const handleRemoveLineItem = (id: string) => {
    setAdditionalItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleProceedToStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!colorSpec.trim()) {
      setStep1Error('Please enter your required Color & Shade specification.');
      return;
    }
    if (!deliveryAddress.trim()) {
      setStep1Error('Please provide your full Delivery Location / Street Address.');
      return;
    }
    if (!neededDate) {
      setStep1Error('Please select when you need the paint delivered.');
      return;
    }
    setStep1Error('');
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopyAccountNumber = () => {
    navigator.clipboard?.writeText('0123456789').catch(() => {});
    setCopiedAccount(true);
    window.setTimeout(() => setCopiedAccount(false), 2500);
  };

  const handleFileSelection = (file: File | undefined) => {
    if (!file) return;
    setReceiptFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (typeof ev.target?.result === 'string') {
        setReceiptFilePreview(ev.target.result);
      }
    };
    reader.readAsDataURL(file);
    setStep3Error('');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelection(file);
    }
  };

  const handleSubmitStep3 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerEmail.trim() || !customerPhone.trim()) {
      setStep3Error('Please complete your Full Name, Email Address, and Phone Number.');
      return;
    }
    if (!receiptFilePreview && !receiptLink.trim()) {
      setStep3Error(
        'Please upload your payment receipt image (PNG/JPG) or paste a receipt link to verify your bank transfer.'
      );
      return;
    }
    setStep3Error('');
    onOrderComplete();
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header & Step Progress Indicator */}
      <div className="mb-8 border-b border-stone-200 pb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <img
              src={BRAND_LOGO_URL}
              alt="Grone Global Ltd Logo"
              className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl object-contain bg-white border border-stone-200 p-1 shrink-0 shadow-xs"
            />
            <div>
              <p className="text-xs font-semibold text-amber-700">
                Grone Global Ltd · Grone Global Paints Direct Factory Order
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-0.5">
                Order Now — Paint or Screeding &amp; Putty
              </h1>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenInstallmentModal}
            className="px-4 py-2 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            Need Bulk Installmental Payment? (50/30/20 Plan)
          </button>
        </div>

        {/* 3-Step State Machine Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
          <button
            type="button"
            onClick={() => setStep(1)}
            className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-colors cursor-pointer ${
              step === 1
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-700 border-stone-200 hover:bg-stone-50'
            }`}
          >
            <span
              className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-mono font-bold shrink-0 ${
                step === 1 ? 'bg-amber-600 text-white' : 'bg-stone-100 text-slate-700'
              }`}
            >
              01
            </span>
            <div>
              <p className="text-xs font-bold">Step 1: Configure Order</p>
              <p className={`text-xs ${step === 1 ? 'text-stone-300' : 'text-slate-500'}`}>
                Paint Type, Shade, Bucket &amp; Delivery
              </p>
            </div>
          </button>

          <button
            type="button"
            disabled={step < 2}
            onClick={() => step >= 2 && setStep(2)}
            className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-colors ${
              step === 2
                ? 'bg-slate-900 text-white border-slate-900'
                : step > 2
                ? 'bg-white text-slate-700 border-stone-200 hover:bg-stone-50 cursor-pointer'
                : 'bg-stone-100 text-slate-400 border-stone-200 cursor-not-allowed'
            }`}
          >
            <span
              className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-mono font-bold shrink-0 ${
                step === 2 ? 'bg-amber-600 text-white' : 'bg-stone-200 text-slate-700'
              }`}
            >
              02
            </span>
            <div>
              <p className="text-xs font-bold">Step 2: Bank Transfer Checkout</p>
              <p className={`text-xs ${step === 2 ? 'text-stone-300' : 'text-slate-500'}`}>
                Direct Corporate Transfer Details
              </p>
            </div>
          </button>

          <button
            type="button"
            disabled={step < 3}
            onClick={() => step === 3 && setStep(3)}
            className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-colors ${
              step === 3
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-stone-100 text-slate-400 border-stone-200 cursor-not-allowed'
            }`}
          >
            <span
              className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-mono font-bold shrink-0 ${
                step === 3 ? 'bg-amber-600 text-white' : 'bg-stone-200 text-slate-700'
              }`}
            >
              03
            </span>
            <div>
              <p className="text-xs font-bold">Step 3: Receipt Verification</p>
              <p className={`text-xs ${step === 3 ? 'text-stone-300' : 'text-slate-500'}`}>
                Upload PNG Receipt &amp; Dispatch
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* STEP 1: CONFIGURE PAINT ORDER */}
      {step === 1 && (
        <form onSubmit={handleProceedToStep2} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-8">
            {step1Error && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-sm font-medium text-red-700">
                {step1Error}
              </div>
            )}

            {/* 1. Choose Order Category: Order Paint vs Order Screeding & Putty */}
            <div className="bg-white border border-stone-200 rounded-xl p-5 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    01. Choose What You Want to Order
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Select <strong>Order Paint</strong> (Emulsion, Acrylic, Silk, Oil) or{' '}
                    <strong>Order Screeding &amp; Putty</strong> in 4-Litre or 20-Litre plastic buckets.
                  </p>
                </div>

                {/* Primary 2-Way Toggle: Order Paint vs Order Putty */}
                <div className="inline-flex items-center p-1 bg-stone-100 border border-stone-200 rounded-xl self-start shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      if (paintType === 'screeding') {
                        handleSelectPaintType('emulsion');
                      }
                    }}
                    className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                      paintType !== 'screeding'
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'text-slate-700 hover:text-slate-900'
                    }`}
                  >
                    Order Paint
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectPaintType('screeding')}
                    className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                      paintType === 'screeding'
                        ? 'bg-amber-700 text-white shadow-xs'
                        : 'text-slate-700 hover:text-slate-900'
                    }`}
                  >
                    Order Screeding &amp; Putty
                  </button>
                </div>
              </div>

              {paintType === 'screeding' ? (
                <div className="p-4 sm:p-5 rounded-xl border border-slate-900 bg-slate-900 text-white shadow-md">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-[11px] font-mono text-amber-400 font-semibold">
                        SELECTED CATEGORY · WALL PREPARATION &amp; SKIMMING
                      </p>
                      <span className="text-base font-bold">{PAINT_FINISHES.screeding.name}</span>
                    </div>
                    <PaintBucket className="w-5 h-5 shrink-0 text-amber-400" />
                  </div>
                  <p className="text-xs text-stone-300 mt-2 leading-relaxed">
                    {PAINT_FINISHES.screeding.shortNote}
                  </p>
                  <div className="mt-4 pt-3 border-t border-slate-800 text-xs font-mono grid grid-cols-2 gap-3 text-amber-300">
                    <div className="flex flex-col sm:flex-row sm:justify-between tabular-nums">
                      <span>4L Plastic Bucket:</span>
                      <span className="font-bold">{formatNaira(PAINT_FINISHES.screeding.prices['4L'])}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between tabular-nums">
                      <span>20L Plastic Bucket:</span>
                      <span className="font-bold">{formatNaira(PAINT_FINISHES.screeding.prices['20L'])}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {PAINT_ORDER_KEYS.filter((k) => k !== 'screeding').map((key) => {
                    const spec = PAINT_FINISHES[key];
                    const isSelected = paintType === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => handleSelectPaintType(key)}
                        className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                            : 'bg-stone-50/70 text-slate-900 border-stone-200 hover:border-stone-400'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-sm font-bold">{spec.name}</span>
                            <PaintBucket
                              className={`w-4 h-4 shrink-0 ${
                                isSelected ? 'text-amber-400' : 'text-amber-700'
                              }`}
                            />
                          </div>
                          <p
                            className={`text-xs mt-1 leading-relaxed ${
                              isSelected ? 'text-stone-300' : 'text-slate-600'
                            }`}
                          >
                            {spec.shortNote}
                          </p>
                        </div>

                        <div
                          className={`mt-3.5 pt-3 border-t text-xs font-mono grid grid-cols-2 gap-3 ${
                            isSelected ? 'border-slate-800 text-amber-300' : 'border-stone-200 text-slate-700'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:justify-between tabular-nums">
                            <span>4L Plastic:</span>
                            <span className="font-bold">{formatNaira(spec.prices['4L'])}</span>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:justify-between tabular-nums">
                            <span>20L Plastic:</span>
                            <span className="font-bold">{formatNaira(spec.prices['20L'])}</span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-stone-200 text-xs text-slate-600 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span>
                  <strong className="text-slate-900">Finish:</strong> {currentPaintSpec.sheenLevel}
                </span>
                <span aria-hidden="true">·</span>
                <span>
                  <strong className="text-slate-900">Coverage:</strong> {currentPaintSpec.coveragePerLitre}
                </span>
                <span aria-hidden="true">·</span>
                <span>
                  <strong className="text-slate-900">Dry Time:</strong> {currentPaintSpec.dryingTime}
                </span>
              </div>
            </div>

            {/* 2. Color & Shade / Screeding Grade Specification */}
            <div className="bg-white border border-stone-200 rounded-xl p-5 sm:p-6">
              <h2 className="text-base font-bold text-slate-900 mb-1">
                {paintType === 'screeding'
                  ? '02. Screeding & Putty Grade / Finish Specification'
                  : '02. Color & Shade Specification'}
              </h2>
              <p className="text-xs text-slate-500 mb-4">
                {paintType === 'screeding'
                  ? 'Select your preferred Grone Global Screeding & Putty grade below or type any custom wall preparation specification.'
                  : 'Type your exact Color & Shade name/code below or click any Grone Global Paints architectural swatch helper.'}
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-5">
                <div
                  className="w-12 h-11 rounded-lg border border-stone-300 shrink-0 shadow-inner"
                  style={{ backgroundColor: selectedHex }}
                  title={`Selected Specification Preview: ${colorSpec}`}
                />
                <div className="flex-1">
                  <label htmlFor="color-shade-input" className="sr-only">
                    Exact Color, Shade, or Screeding Putty Grade
                  </label>
                  <input
                    id="color-shade-input"
                    type="text"
                    required
                    value={colorSpec}
                    onChange={(e) => setColorSpec(e.target.value)}
                    placeholder={
                      paintType === 'screeding'
                        ? 'Enter screeding putty grade (e.g. Ultra-White Interior Acrylic Putty GP-INT)'
                        : 'Enter exact Color & Shade (e.g. Warm Alabaster GR-101, Brilliant White, or custom RAL code)'
                    }
                    className="w-full px-4 py-2.5 text-sm bg-stone-50 border border-stone-300 rounded-lg text-slate-900 focus:outline-none focus:border-amber-700"
                  />
                </div>
              </div>

              {paintType === 'screeding' ? (
                <>
                  <p className="text-xs font-semibold text-slate-700 mb-2.5">
                    Select Grone Global Screeding &amp; Putty Grade (Click to Apply):
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {SCREEDING_GRADES.map((grade) => {
                      const active = colorSpec.includes(grade.code);
                      return (
                        <button
                          key={grade.code}
                          type="button"
                          onClick={() => handleSelectSwatch(grade.code, grade.name, grade.hex)}
                          className={`flex items-start gap-2.5 p-3 rounded-lg border text-left transition-all cursor-pointer ${
                            active
                              ? 'border-slate-900 bg-stone-100 ring-1 ring-slate-900'
                              : 'border-stone-200 bg-white hover:border-stone-400'
                          }`}
                        >
                          <span
                            className="w-6 h-6 rounded border border-stone-300 shrink-0 mt-0.5"
                            style={{ backgroundColor: grade.hex }}
                          />
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-slate-900">{grade.name}</p>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              {grade.code} · {grade.usage}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </>
              ) : (
                <>
                  <p className="text-xs font-semibold text-slate-700 mb-2.5">
                    Interactive Architectural Color Swatch Helpers (Click to Apply):
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                    {CURATED_SWATCHES.map((swatch) => {
                      const active = colorSpec.includes(swatch.code) || colorSpec === swatch.name;
                      return (
                        <button
                          key={swatch.code}
                          type="button"
                          onClick={() => handleSelectSwatch(swatch.code, swatch.name, swatch.hex)}
                          className={`flex items-center gap-2.5 p-2 rounded-lg border text-left transition-all cursor-pointer ${
                            active
                              ? 'border-slate-900 bg-stone-100 ring-1 ring-slate-900'
                              : 'border-stone-200 bg-white hover:border-stone-400'
                          }`}
                        >
                          <span
                            className="w-6 h-6 rounded border border-stone-300 shrink-0"
                            style={{ backgroundColor: swatch.hex }}
                          />
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-slate-900 truncate">{swatch.name}</p>
                            <p className="text-[11px] font-mono text-slate-500">{swatch.code}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* 3. Size of Bucket & 4. Quantity */}
            <div className="bg-white border border-stone-200 rounded-xl p-5 sm:p-6">
              <h2 className="text-base font-bold text-slate-900 mb-1">
                03. Size of Plastic Bucket &amp; 04. Quantity
              </h2>
              <p className="text-xs text-slate-500 mb-4">
                Select between 4 Litres (Plastic Bucket) and 20 Litres (Plastic Drum) and set the quantity needed.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {(['4L', '20L'] as BucketSizeKey[]).map((sizeKey) => {
                  const active = bucketSize === sizeKey;
                  const price = currentPaintSpec.prices[sizeKey];
                  const coverageArea =
                    paintType === 'screeding'
                      ? sizeKey === '4L'
                        ? 'Covers ~4–5 m² (2 skim coats)'
                        : 'Covers ~18–22 m² (2 skim coats)'
                      : sizeKey === '4L'
                      ? 'Covers ~48–55 m²'
                      : 'Covers ~240–280 m²';
                  return (
                    <button
                      key={sizeKey}
                      type="button"
                      onClick={() => setBucketSize(sizeKey)}
                      className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-2 ${
                        active
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-stone-50 text-slate-900 border-stone-200 hover:border-stone-400'
                      }`}
                    >
                      <div>
                        <p className="text-sm sm:text-base font-bold">
                          {sizeKey === '4L' ? '4 Litres Plastic Bucket' : '20 Litres Plastic Bucket'}
                        </p>
                        <p className={`text-xs mt-0.5 ${active ? 'text-stone-300' : 'text-slate-500'}`}>
                          {coverageArea} · {currentPaintSpec.name}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p
                          className={`text-sm sm:text-base font-mono font-bold tabular-nums ${
                            active ? 'text-amber-400' : 'text-slate-900'
                          }`}
                        >
                          {formatNaira(price)}
                        </p>
                        <p className={`text-[11px] ${active ? 'text-stone-400' : 'text-slate-500'}`}>
                          per bucket
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-stone-200">
                <div>
                  <label htmlFor="bucket-qty-input" className="block text-xs font-bold text-slate-800">
                    04. Number of Buckets (Quantity)
                  </label>
                  <p className="text-xs text-slate-500">
                    Adjust quantity or add multiple paint types/colors to your order below.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="inline-flex items-center border border-stone-300 rounded-lg bg-white overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      aria-label="Decrease quantity"
                      className="p-2.5 text-slate-700 hover:bg-stone-100 transition-colors cursor-pointer"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      id="bucket-qty-input"
                      type="number"
                      min={1}
                      max={5000}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
                      className="w-16 text-center text-sm font-mono font-bold tabular-nums text-slate-900 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      aria-label="Increase quantity"
                      className="p-2.5 text-slate-700 hover:bg-stone-100 transition-colors cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddLineItem}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold text-slate-900 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Another Paint / Putty Item
                  </button>
                </div>
              </div>

              {additionalItems.length > 0 && (
                <div className="mt-5 pt-4 border-t border-stone-200 space-y-2">
                  <p className="text-xs font-bold text-slate-800">
                    Additional Paint Items in This Order:
                  </p>
                  {additionalItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-3 p-3 rounded-lg bg-stone-50 border border-stone-200 text-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className="w-4 h-4 rounded border border-stone-300 shrink-0"
                          style={{ backgroundColor: item.colorHex }}
                        />
                        <span className="font-semibold text-slate-900 truncate">
                          {item.paintTypeName} ({item.bucketSize})
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="text-slate-600 truncate">{item.colorSpec}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono font-semibold text-slate-800">
                          Qty: {item.quantity}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="font-mono font-bold tabular-nums text-slate-900">
                          {formatNaira(item.unitPrice * item.quantity)}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveLineItem(item.id)}
                          aria-label="Remove item"
                          className="text-red-600 hover:text-red-800 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 5. Delivery Location & 6. When do you need it? */}
            <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-5">
              <div>
                <h2 className="text-base font-bold text-slate-900 mb-1">
                  05. Delivery Location &amp; 06. Delivery Schedule
                </h2>
                <p className="text-xs text-slate-500">
                  Select your logistics zone and provide your complete site or residence delivery address.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="delivery-zone-select" className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Delivery Logistics Zone *
                  </label>
                  <select
                    id="delivery-zone-select"
                    value={deliveryZoneId}
                    onChange={(e) => setDeliveryZoneId(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-300 rounded-lg text-slate-900 focus:outline-none focus:border-amber-700"
                  >
                    {DELIVERY_ZONES.map((zone) => (
                      <option key={zone.id} value={zone.id}>
                        {zone.name} — {formatNaira(zone.fee)} ({zone.eta})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="needed-date-input" className="block text-xs font-semibold text-slate-700 mb-1.5">
                    06. When do you need it? *
                  </label>
                  <div className="relative">
                    <input
                      id="needed-date-input"
                      type="date"
                      required
                      min={todayStr}
                      value={neededDate}
                      onChange={(e) => setNeededDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm font-mono bg-stone-50 border border-stone-300 rounded-lg text-slate-900 focus:outline-none focus:border-amber-700"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="delivery-address-textarea" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  05. Full Delivery Address / Site Landmark *
                </label>
                <textarea
                  id="delivery-address-textarea"
                  rows={3}
                  required
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Enter plot/house number, street name, estate/landmark, city, and state for Grone Global Paints dispatch..."
                  className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-300 rounded-lg text-slate-900 focus:outline-none focus:border-amber-700"
                />
              </div>
            </div>
          </div>

          {/* Sticky Live Order Summary & Proceed to Checkout */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 bg-white border border-stone-200 rounded-xl p-6 shadow-xs">
            <div className="border-b border-stone-200 pb-4 mb-4">
              <p className="text-xs font-semibold text-amber-700">Grone Global Paints</p>
              <h3 className="text-lg font-bold text-slate-900">Live Order Summary</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-stone-50 border border-stone-200 space-y-1.5">
                <div className="flex items-center justify-between font-semibold text-slate-900">
                  <span>
                    {currentPaintSpec.name} ({bucketSize})
                  </span>
                  <span className="font-mono tabular-nums">{formatNaira(currentItemSubtotal)}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <span
                    className="w-3.5 h-3.5 rounded border border-stone-300 shrink-0"
                    style={{ backgroundColor: selectedHex }}
                  />
                  <span className="truncate">{colorSpec || 'Shade not specified'}</span>
                </div>
                <p className="text-slate-500 font-mono tabular-nums">
                  {quantity} bucket(s) × {formatNaira(currentUnitPrice)}
                </p>
              </div>

              {additionalItems.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-lg bg-stone-50 border border-stone-200 space-y-1"
                >
                  <div className="flex items-center justify-between font-semibold text-slate-900">
                    <span>
                      {item.paintTypeName} ({item.bucketSize}) × {item.quantity}
                    </span>
                    <span className="font-mono tabular-nums">
                      {formatNaira(item.unitPrice * item.quantity)}
                    </span>
                  </div>
                  <p className="text-slate-500 truncate">{item.colorSpec}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-4 border-t border-stone-200 space-y-2.5 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Paint Subtotal</span>
                <span className="font-mono font-semibold text-slate-900 tabular-nums">
                  {formatNaira(totalPaintCost)}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery Fee ({selectedZone.name.split('(')[0].trim()})</span>
                <span className="font-mono font-semibold text-slate-900 tabular-nums">
                  {formatNaira(deliveryFee)}
                </span>
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>Requested Delivery Date</span>
                <span className="font-mono">{neededDate || todayStr}</span>
              </div>
              <div className="pt-3 border-t border-stone-200 flex justify-between items-baseline">
                <span className="font-bold text-slate-900">Total Price to Pay</span>
                <span className="text-xl font-mono font-bold text-amber-700 tabular-nums">
                  {formatNaira(grandTotal)}
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="mt-6 w-full py-3.5 px-5 inline-flex items-center justify-center gap-2 text-sm font-bold text-white bg-amber-700 hover:bg-amber-800 rounded-xl transition-colors cursor-pointer whitespace-nowrap"
            >
              Proceed to Checkout
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="mt-4 pt-4 border-t border-stone-200 text-center">
              <button
                type="button"
                onClick={() => onOpenContactModal('Custom Bulk Paint Order Inquiry')}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 underline cursor-pointer"
              >
                Need 100+ buckets or custom developer pricing? Contact Us
              </button>
            </div>
          </div>
        </form>
      )}

      {/* STEP 2: CHECKOUT & CORPORATE BANK TRANSFER PAGE */}
      {step === 2 && (
        <div className="max-w-3xl mx-auto bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs">
          <div className="px-6 py-5 bg-slate-900 text-white border-b border-slate-800 flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-lg bg-white p-1 flex items-center justify-center shrink-0">
              <img
                src={BRAND_LOGO_URL}
                alt="Grone Global Ltd Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <p className="text-xs text-amber-400 font-medium">
                Step 2 of 3 · Direct Corporate Bank Transfer Checkout
              </p>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight mt-0.5">
                Complete Payment via Corporate Bank Transfer
              </h2>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Itemized Order Breakdown */}
            <div className="bg-stone-50 border border-stone-200 rounded-xl p-5 space-y-3">
              <h3 className="text-xs font-bold text-slate-800">
                Itemized Order Summary (Grone Global Paints)
              </h3>

              <div className="space-y-2 text-sm divide-y divide-stone-200">
                <div className="pt-2 flex justify-between items-start gap-4">
                  <div>
                    <p className="font-semibold text-slate-900">
                      {currentPaintSpec.name} — {bucketSize === '4L' ? '4 Litres' : '20 Litres'} × {quantity}
                    </p>
                    <p className="text-xs text-slate-600">Shade: {colorSpec}</p>
                  </div>
                  <span className="font-mono font-bold text-slate-900 tabular-nums">
                    {formatNaira(currentItemSubtotal)}
                  </span>
                </div>

                {additionalItems.map((item) => (
                  <div key={item.id} className="pt-2 flex justify-between items-start gap-4">
                    <div>
                      <p className="font-semibold text-slate-900">
                        {item.paintTypeName} — {item.bucketSize === '4L' ? '4 Litres' : '20 Litres'} × {item.quantity}
                      </p>
                      <p className="text-xs text-slate-600">Shade: {item.colorSpec}</p>
                    </div>
                    <span className="font-mono font-bold text-slate-900 tabular-nums">
                      {formatNaira(item.unitPrice * item.quantity)}
                    </span>
                  </div>
                ))}

                <div className="pt-2 flex justify-between text-xs text-slate-600">
                  <span>Paint Cost Subtotal</span>
                  <span className="font-mono font-semibold text-slate-900 tabular-nums">
                    {formatNaira(totalPaintCost)}
                  </span>
                </div>

                <div className="pt-2 flex justify-between text-xs text-slate-600">
                  <span>
                    Calculated Delivery Fee ({selectedZone.name})
                  </span>
                  <span className="font-mono font-semibold text-slate-900 tabular-nums">
                    {formatNaira(deliveryFee)}
                  </span>
                </div>

                <div className="pt-2 flex justify-between text-xs text-slate-600">
                  <span>Delivery Address &amp; Target Date</span>
                  <span className="text-right max-w-xs text-slate-800">
                    {deliveryAddress} · <strong className="font-mono">{neededDate}</strong>
                  </span>
                </div>

                <div className="pt-3 flex justify-between items-baseline">
                  <span className="text-base font-bold text-slate-900">Total Price to Pay</span>
                  <span className="text-2xl font-mono font-extrabold text-amber-700 tabular-nums">
                    {formatNaira(grandTotal)}
                  </span>
                </div>
              </div>
            </div>

            {/* Corporate Bank Transfer Details Card */}
            <div className="bg-slate-900 text-white rounded-xl p-6 border border-slate-800">
              <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <CreditCard className="w-5 h-5 text-amber-400" />
                  <div>
                    <h3 className="text-sm font-bold">Corporate Bank Transfer Details</h3>
                    <p className="text-xs text-slate-400">
                      Transfer the exact total of {formatNaira(grandTotal)} to the official corporate account below
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-5">
                <div className="bg-slate-800/80 p-4 rounded-lg border border-slate-700">
                  <p className="text-xs text-slate-400">Account Name</p>
                  <p className="text-base font-bold text-white mt-1">Grone Global Ltd</p>
                </div>

                <div className="bg-slate-800/80 p-4 rounded-lg border border-slate-700">
                  <p className="text-xs text-slate-400">Account Number</p>
                  <div className="flex items-center justify-between gap-2 mt-1">
                    <span className="text-lg font-mono font-bold text-amber-400 tracking-wider tabular-nums">
                      0123456789
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyAccountNumber}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-white rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0"
                    >
                      {copiedAccount ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="bg-slate-800/80 p-4 rounded-lg border border-slate-700">
                  <p className="text-xs text-slate-400">Bank Name</p>
                  <p className="text-base font-bold text-white mt-1">
                    First Bank / Access Bank
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-300 mt-4 leading-relaxed">
                After completing your bank transfer of <strong className="text-amber-400 font-mono">{formatNaira(grandTotal)}</strong>,
                click <strong>&ldquo;I Have Paid&rdquo;</strong> below to upload your transfer receipt for immediate
                factory dispatch.
              </p>
            </div>

            {/* Action Buttons Underneath */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-2 px-5 py-3 text-xs font-bold text-slate-800 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-xl transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep(3);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <ShieldCheck className="w-4 h-4" />
                I Have Paid
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: PAYMENT VERIFICATION & RECEIPT UPLOAD PAGE */}
      {step === 3 && (
        <div className="max-w-2xl mx-auto bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs">
          <div className="px-6 py-5 bg-slate-900 text-white border-b border-slate-800 flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-lg bg-white p-1 flex items-center justify-center shrink-0">
              <img
                src={BRAND_LOGO_URL}
                alt="Grone Global Ltd Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <p className="text-xs text-amber-400 font-medium">
                Step 3 of 3 · Payment Verification &amp; Receipt Upload
              </p>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight mt-0.5">
                Submit Your Transfer Receipt ({formatNaira(grandTotal)})
              </h2>
            </div>
          </div>

          <form onSubmit={handleSubmitStep3} className="p-6 sm:p-8 space-y-5">
            {step3Error && (
              <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-xs font-medium text-red-700">
                {step3Error}
              </div>
            )}

            <div>
              <label htmlFor="verify-fullname" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Customer Full Name *
              </label>
              <input
                id="verify-fullname"
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter your full name or company name"
                className="w-full px-4 py-2.5 text-sm bg-stone-50 border border-stone-300 rounded-lg text-slate-900 focus:outline-none focus:border-amber-700"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="verify-email" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email Address *
                </label>
                <input
                  id="verify-email"
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="you@domain.com"
                  className="w-full px-4 py-2.5 text-sm bg-stone-50 border border-stone-300 rounded-lg text-slate-900 focus:outline-none focus:border-amber-700"
                />
              </div>

              <div>
                <label htmlFor="verify-phone" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Phone Number *
                </label>
                <input
                  id="verify-phone"
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="+234 803 000 0000"
                  className="w-full px-4 py-2.5 text-sm bg-stone-50 border border-stone-300 rounded-lg text-slate-900 focus:outline-none focus:border-amber-700"
                />
              </div>
            </div>

            {/* Payment Receipt Upload (PNG format) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Payment Receipt Upload (PNG / Image Format) *
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setReceiptLink('https://groneglobal.com/receipts/sample-transfer-receipt.png');
                    setReceiptFileName('sample-transfer-receipt.png');
                    setStep3Error('');
                  }}
                  className="text-xs font-medium text-amber-700 hover:text-amber-800 underline cursor-pointer"
                >
                  Use Sample Receipt Link
                </button>
              </div>

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer ${
                  isDragging
                    ? 'border-amber-600 bg-amber-50/50'
                    : 'border-stone-300 bg-stone-50 hover:border-stone-400'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={(e) => handleFileSelection(e.target.files?.[0])}
                  className="hidden"
                />

                {receiptFilePreview ? (
                  <div className="space-y-3">
                    <img
                      src={receiptFilePreview}
                      alt="Uploaded bank transfer receipt preview"
                      className="max-h-44 mx-auto rounded-lg border border-stone-200 object-contain"
                    />
                    <p className="text-xs font-mono font-semibold text-emerald-700">
                      {receiptFileName} attached · Click to replace
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-full bg-white border border-stone-200 flex items-center justify-center mx-auto text-amber-700">
                      <Upload className="w-5 h-5" />
                    </div>
                    <p className="text-sm font-semibold text-slate-800">
                      Drag &amp; drop your PNG transfer receipt here, or click to browse
                    </p>
                    <p className="text-xs text-slate-500">
                      Supports PNG, JPG, or bank mobile app receipt screenshots (Max 10MB)
                    </p>
                    {receiptFileName && (
                      <p className="text-xs font-mono font-semibold text-emerald-700">
                        Selected: {receiptFileName}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Optional Text Field for PNG Receipt Link */}
            <div>
              <label htmlFor="receipt-link-input" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Or Paste PNG Receipt URL / Cloud Link (Optional if file uploaded above)
              </label>
              <div className="relative">
                <input
                  id="receipt-link-input"
                  type="url"
                  value={receiptLink}
                  onChange={(e) => setReceiptLink(e.target.value)}
                  placeholder="https://example.com/my-bank-transfer-receipt.png"
                  className="w-full px-4 py-2.5 text-sm bg-stone-50 border border-stone-300 rounded-lg text-slate-900 focus:outline-none focus:border-amber-700"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-stone-200">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-slate-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Transfer Details
              </button>

              <button
                type="submit"
                className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-bold text-white bg-amber-700 hover:bg-amber-800 rounded-xl transition-colors cursor-pointer"
              >
                <FileCheck2 className="w-4 h-4" />
                Send
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
};
