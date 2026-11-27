import React, { useState } from 'react';
import {
  ArrowRight,
  PaintBucket,
  Building2,
  ShieldCheck,
  PhoneCall,
  CheckCircle2,
  Globe,
  Ship,
  PackageCheck,
  Truck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  CONTRACTING_SERVICES,
  PROCUREMENT_CATEGORIES,
  PROCUREMENT_WORKFLOW_STEPS,
  IMAGES,
} from '../data/groneData';
import { ResilientImage } from './ResilientImage';


interface ContractingHomeViewProps {
  onOpenContact: (subject?: string) => void;
  onOpenBooking: (category?: string) => void;
  onOpenInstallment: () => void;
  onSwitchToPaints: () => void;
  onExploreServices: () => void;
}

export const ContractingHomeView: React.FC<ContractingHomeViewProps> = ({
  onOpenContact,
  onOpenBooking,
  onOpenInstallment,
  onSwitchToPaints,
  onExploreServices,
}) => {
  const [expandedCapabilities, setExpandedCapabilities] = useState<Record<string, boolean>>({});
  const [expandedProcurement, setExpandedProcurement] = useState<Record<string, boolean>>({});

  const toggleCapability = (index: string) => {
    setExpandedCapabilities((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const toggleProcurement = (id: string) => {
    setExpandedProcurement((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-8 sm:space-y-12 pb-8 sm:pb-12">
      {/* 1. DEDICATED GENERAL CONTRACTING & GLOBAL PROCUREMENT HERO */}
      <section className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start">
          <div className="lg:col-span-7 bg-slate-900 text-white border border-slate-800 rounded-xl p-4 sm:p-7 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] sm:text-xs text-slate-300 mb-2">
                <span className="font-bold text-amber-400">Grone Global Ltd</span>
                <span aria-hidden="true">·</span>
                <span className="font-semibold text-white">General Contracting Subdivision</span>
                <span aria-hidden="true">·</span>
                <span className="text-amber-300 font-medium">Global Procurement Hub</span>
              </div>

              <h1
                className="font-extrabold tracking-tight text-white leading-[1.15]"
                style={{ fontSize: 'clamp(1.45rem, 3vw, 2.75rem)' }}
              >
                Local Procurement / Building Construction &amp; Civil Works — Led by Global Procurement.
              </h1>

              <p className="text-xs sm:text-base text-slate-300 mt-2.5 sm:mt-3 leading-relaxed max-w-2xl">
                <strong className="text-white">Grone Global Ltd General Contracting Subdivision</strong> specializes in{' '}
                <strong className="text-amber-300">International Procurement from China &amp; Overseas</strong>—led by{' '}
                <strong className="text-white">
                  Chinese Electric Vehicles (Changan, GAC, BYD), Electric Bikes &amp; Scooters
                </strong>
                , industrial &amp; solar equipment, and everyday gadgets inspected on the ground, shipped in containers,
                cleared in Nigeria, and delivered to your doorstep—alongside Nigerian Building Materials, construction,
                and civil works.
              </p>

              <div className="mt-4 sm:mt-6 grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 sm:gap-2.5">
                <button
                  type="button"
                  onClick={() =>
                    onOpenBooking(
                      'International & China Procurement — Chinese Electric Vehicles, E-Bikes & Scooters (Changan, GAC, BYD)'
                    )
                  }
                  className="col-span-2 sm:col-span-1 inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors cursor-pointer"
                >
                  <Globe className="w-4 h-4 shrink-0" />
                  <span>Request Global Procurement Quote</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </button>

                <button
                  type="button"
                  onClick={onOpenInstallment}
                  className="inline-flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors cursor-pointer whitespace-nowrap"
                >
                  <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0" />
                  <span className="truncate">50/30/20 Plan</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    onOpenContact('Contact Us — Grone Global Ltd General Inquiry')
                  }
                  className="inline-flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2.5 text-xs font-bold text-slate-200 bg-slate-950 hover:bg-slate-800 border border-slate-700 rounded-xl transition-colors cursor-pointer whitespace-nowrap"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  Contact Us
                </button>
              </div>
            </div>

            <div className="mt-4 sm:mt-6 pt-3.5 sm:pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="text-[11px] sm:text-xs text-slate-300">
                Need factory-direct Emulsion, Acrylic, Silk, Oil paints, or Screeding Putty?
              </div>
              <button
                type="button"
                onClick={onSwitchToPaints}
                className="inline-flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-bold text-slate-900 bg-white hover:bg-stone-100 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <PaintBucket className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                Switch to Grone Global Paints
              </button>
            </div>
          </div>

          {/* Full-Bleed 16:9 Global Procurement Shipping Dock & GRONE GLOBAL Container Showcase */}
          <div className="lg:col-span-5 rounded-xl overflow-hidden border border-slate-800 bg-slate-900 flex flex-col">
            <div className="relative w-full aspect-[16/9] bg-slate-950 overflow-hidden">
              <ResilientImage
                src={IMAGES.globalShippingDock}
                alt="International maritime shipping dock featuring a GRONE GLOBAL cargo container ready for global procurement freight to Nigeria"
                className="w-full h-full object-cover object-center"
                fallbackCategory="contracting"
              />
            </div>
            <div className="p-3.5 sm:p-5 bg-slate-900 border-t border-slate-800">
              <p className="text-[10px] sm:text-[11px] font-mono text-amber-400">
                Global Procurement · Maritime Dock &amp; Container Logistics
              </p>
              <h2 className="text-sm sm:text-base font-bold text-white mt-0.5">
                GRONE GLOBAL International Shipping, Clearing &amp; Doorstep Delivery
              </h2>
              <p className="text-[11px] sm:text-xs text-stone-300 mt-1 leading-relaxed">
                Direct container and air freight from China and overseas ports—physically inspected by our on-ground
                agents, cleared through Nigerian customs, and delivered to your doorstep.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. GLOBAL & LOCAL PROCUREMENT & DELIVERY HUB (Compact Side-by-Side 2-Col Mobile / 4-Col Desktop) */}
      <section className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        <div className="bg-white border border-stone-200 rounded-xl p-4 sm:p-7 space-y-5 sm:space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3.5 border-b border-stone-200 pb-4 sm:pb-5">
            <div className="max-w-3xl">
              <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-amber-700">
                <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span>General Contracting Subdivision · International &amp; Local Procurement</span>
              </div>
              <h2 className="text-lg sm:text-2xl font-bold tracking-tight text-slate-900 mt-1">
                Global Procurement (Chinese EVs, E-Bikes, Scooters &amp; Machinery) &amp; Nigerian Building Supply
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                Sourcing{' '}
                <strong className="text-slate-900">
                  Chinese Electric Vehicles (Changan, GAC, BYD), Electric Bikes &amp; Scooters
                </strong>
                , industrial/solar machinery, and gadgets—alongside stocked{' '}
                <strong className="text-slate-900">Nigerian Building Materials</strong> warehouse supply under Civil
                Works.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() =>
                  onOpenBooking(
                    'International & China Procurement — Chinese Electric Vehicles, E-Bikes & Scooters (Changan, GAC, BYD)'
                  )
                }
                className="inline-flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 text-[11px] sm:text-xs font-bold text-white bg-amber-700 hover:bg-amber-800 rounded-lg transition-colors cursor-pointer"
              >
                <Ship className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">China Procurement</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  onOpenBooking('General Contracting — Civil Works & Nigerian Building Materials Supply')
                }
                className="inline-flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 text-[11px] sm:text-xs font-bold text-slate-900 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-lg transition-colors cursor-pointer"
              >
                <Truck className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                <span className="truncate">Building Materials</span>
              </button>
            </div>
          </div>

          {/* 4 Procured Categories Grid — Side-by-Side 2-Col Mobile / 4-Col Desktop with See More Expander */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-5 items-start">
            {PROCUREMENT_CATEGORIES.map((cat) => {
              const isExpanded = !!expandedProcurement[cat.id];
              return (
                <div
                  key={cat.id}
                  className={`bg-stone-50 border border-stone-200 rounded-xl overflow-hidden flex flex-col justify-between transition-all ${
                    isExpanded ? 'col-span-2 lg:col-span-1 ring-1 ring-amber-600/40 shadow-md' : ''
                  }`}
                >
                  <div>
                    <div className="relative w-full aspect-[4/3] bg-stone-200 border-b border-stone-200 overflow-hidden">
                      <ResilientImage
                        src={cat.image}
                        alt={cat.imageAlt}
                        className="w-full h-full object-cover object-center"
                        fallbackCategory="contracting"
                      />
                    </div>
                    <div className="p-3 sm:p-4">
                      <div className="flex items-center justify-between gap-1 text-[10px] sm:text-[11px] font-mono">
                        <span className="font-bold text-amber-700">{cat.index}.</span>
                        <span className="text-slate-500 font-semibold truncate">{cat.origin}</span>
                      </div>
                      <h3 className="text-xs sm:text-base font-bold text-slate-900 mt-1 leading-snug">
                        {cat.title}
                      </h3>
                      <p
                        className={`text-[11px] sm:text-xs text-slate-600 mt-1 leading-relaxed ${
                          isExpanded ? '' : 'line-clamp-2'
                        }`}
                      >
                        {cat.summary}
                      </p>

                      {isExpanded && (
                        <ul className="mt-2.5 pt-2.5 border-t border-stone-200 space-y-1.5 text-[11px] sm:text-xs text-slate-700">
                          {cat.items.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>

                  <div className="px-3 sm:px-4 py-2.5 bg-white border-t border-stone-200 flex flex-wrap items-center justify-between gap-1.5">
                    <button
                      type="button"
                      onClick={() => toggleProcurement(cat.id)}
                      aria-expanded={isExpanded}
                      className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold text-amber-700 hover:text-amber-800 cursor-pointer"
                    >
                      <span>{isExpanded ? 'Show Less' : 'See More'}</span>
                      {isExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => onOpenBooking(cat.title)}
                      className="text-[11px] sm:text-xs font-bold text-slate-900 hover:text-amber-700 transition-colors cursor-pointer"
                    >
                      Quote →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 4-Step Verified On-Ground Inspection & Doorstep Delivery Workflow (Compact 2x2 on Mobile) */}
          <div className="bg-slate-900 text-white rounded-xl p-4 sm:p-6 border border-slate-800">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3.5">
              <div className="flex items-center gap-2">
                <PackageCheck className="w-4 h-4 text-amber-400 shrink-0" />
                <h3 className="text-xs sm:text-sm font-bold text-white">
                  How Our On-Ground China &amp; Nationwide Delivery Agents Work
                </h3>
              </div>
              <span className="text-[10px] sm:text-xs font-mono text-amber-400">
                Inspect · Ship · Clear · Deliver
              </span>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
              {PROCUREMENT_WORKFLOW_STEPS.map((wf) => (
                <div key={wf.step} className="bg-slate-950/70 border border-slate-800 rounded-lg p-2.5 sm:p-3.5">
                  <p className="text-[10px] sm:text-xs font-mono font-bold text-amber-400">STEP {wf.step}</p>
                  <p className="text-xs sm:text-sm font-bold text-white mt-0.5 leading-snug">{wf.title}</p>
                  <p className="text-[11px] sm:text-xs text-slate-300 mt-1 leading-snug sm:leading-relaxed">
                    {wf.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. CONTRACTING SERVICES GRID (Compact Side-by-Side 01–06 Cards with Expandable Learn More Overview) */}
      <section className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 space-y-4 sm:space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-2.5">
          <div>
            <p className="text-[11px] sm:text-xs font-semibold text-amber-700">
              Grone Global Ltd General Contracting Subdivision · Capabilities
            </p>
            <h2 className="text-lg sm:text-2xl font-bold tracking-tight text-slate-900 mt-0.5">
              Engineering, Construction, Global Procurement &amp; Project Delivery
            </h2>
          </div>
          <button
            type="button"
            onClick={onExploreServices}
            className="text-xs font-bold text-amber-700 hover:text-amber-800 inline-flex items-center gap-1 cursor-pointer"
          >
            View All Services
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Compact Side-by-Side 2-Column Mobile / 3-Column Desktop Grid for Items 01 to 06 */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4 lg:gap-5 items-start">
          {CONTRACTING_SERVICES.map((srv) => {
            const isExpanded = !!expandedCapabilities[srv.index];
            return (
              <div
                key={srv.index}
                className={`bg-white border rounded-xl p-3 sm:p-5 flex flex-col justify-between transition-all ${
                  isExpanded
                    ? 'col-span-2 lg:col-span-1 border-amber-600/60 shadow-md ring-1 ring-amber-600/25'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1.5 mb-1.5">
                    <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-[10px] sm:text-xs font-mono font-bold text-amber-800">
                      {srv.index}
                    </span>
                    <span className="text-[10px] sm:text-[11px] text-slate-500 font-medium truncate">
                      {srv.scope}
                    </span>
                  </div>

                  <h3 className="text-xs sm:text-base font-bold text-slate-900 leading-snug">
                    {srv.title}
                  </h3>

                  {/* Compact 2-line preview when collapsed; full overview when expanded */}
                  <p
                    className={`text-[11px] sm:text-xs text-slate-600 mt-1.5 leading-relaxed ${
                      isExpanded ? '' : 'line-clamp-2'
                    }`}
                  >
                    {srv.summary}
                  </p>

                  {/* Full Overview Dropdown Revealed on "Learn More" Click */}
                  {isExpanded && (
                    <div className="mt-3.5 pt-3.5 border-t border-stone-200 space-y-3">
                      <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Key Deliverables &amp; Scope
                      </p>
                      <ul className="space-y-2 text-xs text-slate-700">
                        {srv.deliverables.map((item, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="pt-2.5 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2">
                        <span className="text-[11px] font-mono text-slate-600">{srv.metric}</span>
                        <button
                          type="button"
                          onClick={() => onOpenBooking(srv.title)}
                          className="px-3.5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
                        >
                          Book / Request Quote
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Compact Card Footer with Learn More / Show Less Toggle */}
                <div className="mt-3 pt-2.5 border-t border-stone-200 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => toggleCapability(srv.index)}
                    aria-expanded={isExpanded}
                    className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold text-amber-700 hover:text-amber-800 cursor-pointer"
                  >
                    <span>{isExpanded ? 'Show Less' : 'Learn More'}</span>
                    {isExpanded ? (
                      <ChevronUp className="w-3.5 h-3.5 shrink-0" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 shrink-0" />
                    )}
                  </button>

                  {!isExpanded && (
                    <button
                      type="button"
                      onClick={() => onOpenBooking(srv.title)}
                      className="text-[11px] sm:text-xs font-semibold text-slate-700 hover:text-slate-900 cursor-pointer whitespace-nowrap"
                    >
                      Quote →
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

