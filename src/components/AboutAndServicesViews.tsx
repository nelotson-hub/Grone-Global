import React, { useState } from 'react';
import {
  ArrowRight,
  Building2,
  PaintBucket,
  Award,
  Factory,
  Compass,
  PhoneCall,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  PAINTS_SERVICES,
  CONTRACTING_SERVICES,
  IMAGES,
  BRAND_LOGO_URL,
  SubdivisionMode,
} from '../data/groneData';
import { ResilientImage } from './ResilientImage';

interface AboutViewProps {
  onNavigateOrder: () => void;
  onSwitchSubdivision: (mode: SubdivisionMode) => void;
  onOpenContact: (subject?: string) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({
  onNavigateOrder,
  onSwitchSubdivision,
  onOpenContact,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-7 sm:py-12 space-y-8 sm:space-y-14">
      {/* Corporate Profile Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start">
        <div className="lg:col-span-7 flex flex-col justify-between bg-white border border-stone-200 rounded-xl p-4 sm:p-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <img
                src={BRAND_LOGO_URL}
                alt="Grone Global Ltd Official Logo"
                className="h-11 w-11 sm:h-12 sm:w-12 rounded-xl object-contain bg-white border border-stone-200 p-1 shrink-0 shadow-xs"
              />
              <div>
                <p className="text-[11px] sm:text-xs font-semibold text-amber-700">
                  Corporate Profile · Grone Global Ltd
                </p>
                <p className="text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase text-slate-500">
                  Building A Greater Tomorrow
                </p>
              </div>
            </div>
            <h1 className="text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 mt-2">
              One Integrated Nigerian Powerhouse for Chemical Coatings &amp; Civil Engineering
            </h1>
            <p className="text-xs sm:text-base text-slate-600 mt-2.5 sm:mt-3 leading-relaxed">
              <strong className="text-slate-900">Grone Global Ltd</strong> is an integrated industrial manufacturing
              and construction corporation structured around two specialized operating subdivisions:{' '}
              <strong className="text-slate-900">Grone Global Paints</strong> and{' '}
              <strong className="text-slate-900">Grone Global Ltd General Contracting Subdivision</strong>.
            </p>
            <p className="text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed">
              By uniting proprietary polymer-chemistry paint and screeding putty manufacturing with full-scale civil and
              building contracting, Grone Global Ltd eliminates supply-chain markups, guarantees batch-tested
              architectural coatings, and delivers structurally superior residential, commercial, and public
              infrastructure projects from foundation to final coat.
            </p>
          </div>

          <div className="mt-5 pt-4 border-t border-stone-200 flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={onNavigateOrder}
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 text-xs font-bold text-white bg-amber-700 hover:bg-amber-800 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              Order Now
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onSwitchSubdivision('contracting')}
              className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2.5 text-xs font-bold text-slate-900 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-lg transition-colors cursor-pointer"
            >
              Explore General Contracting Subdivision
            </button>
          </div>
        </div>

        <div className="lg:col-span-5 rounded-xl overflow-hidden border border-stone-200 bg-slate-900 flex flex-col">
          <div className="relative w-full aspect-[4/3] bg-slate-950 overflow-hidden">
            <ResilientImage
              src={IMAGES.paintLabFormulation}
              alt="Grone Global Ltd African chemical formulation laboratory and quality control team"
              className="w-full h-full object-cover object-center"
              fallbackCategory="paints"
            />
          </div>
          <div className="px-4 sm:px-5 py-3 bg-slate-900 border-t border-slate-800">
            <p className="text-[10px] sm:text-[11px] font-mono text-amber-400">
              Grone Global Paints · Laboratory &amp; Quality Assurance
            </p>
            <p className="text-[11px] sm:text-xs text-stone-300 mt-0.5">
              Batch-tested Emulsion, Matte, Silk, Oil coatings &amp; Acrylic Screeding Putty formulation.
            </p>
          </div>
        </div>
      </div>

      {/* Quantitative Capacity & Quality Assurance Strip — Side-by-Side 2x2 on Mobile */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6">
        <div className="bg-white border border-stone-200 rounded-xl p-3.5 sm:p-6">
          <p className="text-[11px] sm:text-xs text-slate-500">Weekly Paint Output</p>
          <p className="text-lg sm:text-2xl font-mono font-extrabold text-slate-900 tabular-nums mt-0.5">
            45,000+ L
          </p>
          <p className="text-[11px] sm:text-xs text-slate-600 mt-1.5 leading-snug">
            Emulsion, Matte, Silk, Alkyd Oil &amp; Acrylic Screeding Putty.
          </p>
        </div>

        <div className="bg-white border border-stone-200 rounded-xl p-3.5 sm:p-6">
          <p className="text-[11px] sm:text-xs text-slate-500">Scrub Resistance</p>
          <p className="text-lg sm:text-2xl font-mono font-extrabold text-slate-900 tabular-nums mt-0.5">
            10,000+ Cycles
          </p>
          <p className="text-[11px] sm:text-xs text-slate-600 mt-1.5 leading-snug">
            Tested Silk finishes for tropical humidity &amp; washability.
          </p>
        </div>

        <div className="bg-white border border-stone-200 rounded-xl p-3.5 sm:p-6">
          <p className="text-[11px] sm:text-xs text-slate-500">Turnkey Builds</p>
          <p className="text-lg sm:text-2xl font-mono font-extrabold text-slate-900 tabular-nums mt-0.5">
            220+ Projects
          </p>
          <p className="text-[11px] sm:text-xs text-slate-600 mt-1.5 leading-snug">
            98.4% on-schedule handover across Lagos, Abuja &amp; PH.
          </p>
        </div>

        <div className="bg-white border border-stone-200 rounded-xl p-3.5 sm:p-6">
          <p className="text-[11px] sm:text-xs text-slate-500">Trained Graduates</p>
          <p className="text-lg sm:text-2xl font-mono font-extrabold text-slate-900 tabular-nums mt-0.5">
            420+ Chemists
          </p>
          <p className="text-[11px] sm:text-xs text-slate-600 mt-1.5 leading-snug">
            Hands-on paint &amp; putty formulation masterclasses.
          </p>
        </div>
      </div>

      {/* Dual Subdivision Synergy Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
        <div className="bg-white border border-stone-200 rounded-xl p-5 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                <PaintBucket className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] sm:text-xs text-slate-500">Subdivision 1 · Manufacturing &amp; Coatings</p>
                <h2 className="text-base sm:text-xl font-bold text-slate-900">Grone Global Paints</h2>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
              <strong>Grone Global Paints</strong> formulates and manufactures architectural, commercial, and protective
              coatings engineered specifically for West African tropical sunshine, torrential rainfall, and coastal
              humidity.
            </p>
            <ul className="space-y-1.5 text-xs text-slate-700">
              <li>01. Direct retail and bulk supply of Emulsion, Matte, Silk, and Oil paints in 4L and 20L plastic buckets.</li>
              <li>02. Industrial Screeding &amp; Putty production for ultra-smooth interior and exterior wall preparation.</li>
              <li>03. White-label contract paint production, contract painting execution, and paint &amp; putty production tutorials.</li>
            </ul>
          </div>
          <div className="mt-5 pt-3.5 border-t border-stone-200">
            <button
              type="button"
              onClick={onNavigateOrder}
              className="text-xs font-bold text-amber-700 hover:text-amber-800 inline-flex items-center gap-1.5 cursor-pointer"
            >
              Configure an Order with Grone Global Paints
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="bg-white border border-stone-200 rounded-xl p-5 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-slate-900 text-amber-400 flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] sm:text-xs text-slate-500">Subdivision 2 · Civil Works &amp; Procurement</p>
                <h2 className="text-base sm:text-xl font-bold text-slate-900">
                  Grone Global Ltd General Contracting Subdivision
                </h2>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
              <strong>Grone Global Ltd General Contracting Subdivision</strong> leads with international procurement from
              China and overseas—spotlighting Chinese Electric Vehicles (Changan, GAC &amp; SUVs), industrial machinery,
              and gadgets—alongside Local Procurement, Civil Works, Nigerian building materials supply, and turnkey
              building construction.
            </p>
            <ul className="space-y-1.5 text-xs text-slate-700">
              <li>
                01. International &amp; China procurement (Chinese EVs like Changan &amp; GAC, pure water/fabric/solar
                machinery, everyday gadgets) with on-ground inspection, customs clearing, and doorstep delivery.
              </li>
              <li>
                02. General Contracting Civil Works &amp; Nigerian building materials supply delivered nationwide based
                on your site location.
              </li>
              <li>03. Turnkey residential duplexes, commercial complexes, gated estates, and structural remodeling.</li>
              <li>04. Civil engineering earthworks, reinforced concrete drainage, and estate road paving.</li>
            </ul>
          </div>
          <div className="mt-5 pt-3.5 border-t border-stone-200">
            <button
              type="button"
              onClick={() => onSwitchSubdivision('contracting')}
              className="text-xs font-bold text-slate-900 hover:text-amber-700 inline-flex items-center gap-1.5 cursor-pointer"
            >
              Switch to General Contracting Subdivision Portal
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mission, Vision & Quality Assurance */}
      <div className="bg-slate-900 text-white rounded-xl p-5 sm:p-8 border border-slate-800">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold mb-1.5">
              <Compass className="w-4 h-4" />
              <span>Corporate Mission</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold">Precision Formulation &amp; Structural Integrity</h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed">
              To deliver durable, high-opacity architectural coatings through <strong>Grone Global Paints</strong> and
              uncompromising civil and building construction through{' '}
              <strong>Grone Global Ltd General Contracting Subdivision</strong> at transparent factory-direct pricing.
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold mb-1.5">
              <Factory className="w-4 h-4" />
              <span>Corporate Vision</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold">West Africa&rsquo;s Benchmark 2-in-1 Built-Environment Partner</h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed">
              To be the premier single-source partner for homeowners, estate developers, and institutions seeking
              integrated building construction and chemical coating excellence under{' '}
              <strong>Grone Global Ltd</strong>.
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold mb-1.5">
              <Award className="w-4 h-4" />
              <span>Quality Assurance Protocol</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold">Every Batch &amp; Site Audited</h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed">
              Every 20L and 4L bucket undergoes Stormer viscometer, Hegman fineness-of-grind, and opacity ratio testing
              prior to seal—backed by COREN-certified structural engineers on all contracting sites.
            </p>
          </div>
        </div>

        <div className="mt-6 pt-5 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-slate-300">
            Have a question for our executive management, paint laboratory, or civil engineering desk?
          </p>
          <button
            type="button"
            onClick={() => onOpenContact('Corporate Inquiry — Grone Global Ltd')}
            className="px-5 py-2.5 text-xs font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            Contact Us
          </button>
        </div>
      </div>
    </div>
  );
};

interface ServicesViewProps {
  onNavigateOrder: () => void;
  onOpenContact: (subject?: string) => void;
  onOpenBooking: (category?: string) => void;
  onOpenInstallment: () => void;
}

export const ServicesView: React.FC<ServicesViewProps> = ({
  onNavigateOrder,
  onOpenContact,
  onOpenBooking,
  onOpenInstallment,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'paints' | 'contracting'>('all');
  const [expandedPaints, setExpandedPaints] = useState<Record<string, boolean>>({});
  const [expandedContracting, setExpandedContracting] = useState<Record<string, boolean>>({});

  const togglePaintCard = (index: string) => {
    setExpandedPaints((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const toggleContractingCard = (index: string) => {
    setExpandedContracting((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-7 sm:py-12 space-y-8 sm:space-y-14">
      {/* Header & Interactive Division Filter */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <p className="text-[11px] sm:text-xs font-semibold text-amber-700">
            Grone Global Ltd · Integrated Service Portfolio
          </p>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mt-1">
            Specialized Services Across Both Subdivisions
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1.5 max-w-2xl">
            Explore our core capabilities under <strong className="text-slate-900">Grone Global Paints</strong> and{' '}
            <strong className="text-slate-900">Grone Global Ltd General Contracting Subdivision</strong>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1 p-1 bg-stone-200/80 rounded-xl self-start max-w-full">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 text-[11px] sm:text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Services (2-in-1)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('paints')}
            className={`px-3 py-1.5 text-[11px] sm:text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'paints'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Grone Global Paints
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('contracting')}
            className={`px-3 py-1.5 text-[11px] sm:text-xs font-semibold rounded-lg transition-colors cursor-pointer text-left sm:whitespace-nowrap ${
              activeTab === 'contracting'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            General Contracting Subdivision
          </button>
        </div>
      </div>

      {/* SECTION A: GRONE GLOBAL PAINTS SERVICES (Compact Side-by-Side 2-Col Mobile with Learn More Expander) */}
      {(activeTab === 'all' || activeTab === 'paints') && (
        <div className="space-y-4 sm:space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[11px] sm:text-xs font-semibold text-amber-700">Subdivision 1 Offerings</p>
              <h2 className="text-lg sm:text-2xl font-bold text-slate-900">
                Grone Global Paints — Core Offerings
              </h2>
            </div>
            <button
              type="button"
              onClick={onNavigateOrder}
              className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 text-xs font-bold text-white bg-amber-700 hover:bg-amber-800 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              Order Now
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-2 gap-2.5 sm:gap-5 items-start">
            {PAINTS_SERVICES.map((srv) => {
              const isExpanded = !!expandedPaints[srv.index];
              return (
                <div
                  key={srv.index}
                  className={`bg-white border rounded-xl overflow-hidden flex flex-col justify-between transition-all ${
                    isExpanded
                      ? 'col-span-2 lg:col-span-1 border-amber-600/60 shadow-md'
                      : 'border-stone-200'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row flex-1">
                    {/* Full-bleed image container */}
                    <div className="relative w-full aspect-[4/3] sm:aspect-auto sm:w-48 md:w-56 lg:w-52 xl:w-60 sm:min-h-[200px] sm:self-stretch shrink-0 bg-stone-100 border-b sm:border-b-0 sm:border-r border-stone-200 overflow-hidden">
                      <ResilientImage
                        src={srv.image}
                        alt={`${srv.title} — Grone Global Paints`}
                        className="w-full h-full sm:absolute sm:inset-0 object-cover object-center"
                        fallbackCategory="paints"
                      />
                    </div>
                    <div className="p-3 sm:p-5 flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-slate-500 mb-1">
                        <span className="font-mono font-bold text-amber-700">{srv.index}.</span>
                        <span className="truncate">{srv.category}</span>
                      </div>
                      <h3 className="text-xs sm:text-lg font-bold text-slate-900 leading-snug">
                        {srv.title}
                      </h3>
                      <p
                        className={`text-[11px] sm:text-sm text-slate-600 mt-1 sm:mt-1.5 leading-relaxed ${
                          isExpanded ? '' : 'line-clamp-2 sm:line-clamp-3'
                        }`}
                      >
                        {srv.summary}
                      </p>

                      {isExpanded && (
                        <div className="mt-3 space-y-2 border-t border-stone-200 pt-3">
                          <ul className="space-y-1.5 text-xs text-slate-700">
                            {srv.highlights.map((item, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                          <p className="text-[11px] font-mono text-slate-500 pt-1">{srv.metrics}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="px-3 sm:px-5 py-2.5 bg-stone-50 border-t border-stone-200 flex flex-wrap items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => togglePaintCard(srv.index)}
                      aria-expanded={isExpanded}
                      className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold text-amber-700 hover:text-amber-800 cursor-pointer"
                    >
                      <span>{isExpanded ? 'Show Less' : 'Learn More'}</span>
                      {isExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => onOpenContact(`Grone Global Paints — ${srv.title}`)}
                      className="px-2.5 sm:px-3.5 py-1.5 text-[11px] sm:text-xs font-bold text-slate-900 bg-white hover:bg-stone-100 border border-stone-300 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
                    >
                      Inquire
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION B: GRONE GLOBAL LTD GENERAL CONTRACTING SUBDIVISION SERVICES (Compact Side-by-Side 01–06 with Learn More) */}
      {(activeTab === 'all' || activeTab === 'contracting') && (
        <div className="space-y-4 sm:space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[11px] sm:text-xs font-semibold text-slate-600">
                Subdivision 2 Offerings · Capabilities 01–06
              </p>
              <h2 className="text-lg sm:text-2xl font-bold text-slate-900">
                Grone Global Ltd General Contracting Subdivision — Core Offerings
              </h2>
            </div>
            <button
              type="button"
              onClick={onOpenInstallment}
              className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 text-xs font-bold text-slate-900 bg-stone-200 hover:bg-stone-300 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              50/30/20 Project Installment Plan
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-5 items-start">
            {CONTRACTING_SERVICES.map((srv) => {
              const isExpanded = !!expandedContracting[srv.index];
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
                    <p
                      className={`text-[11px] sm:text-xs text-slate-600 mt-1.5 leading-relaxed ${
                        isExpanded ? '' : 'line-clamp-2'
                      }`}
                    >
                      {srv.summary}
                    </p>

                    {isExpanded && (
                      <div className="mt-3.5 pt-3.5 border-t border-stone-200 space-y-3">
                        <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500">
                          Key Deliverables &amp; Scope
                        </p>
                        <ul className="space-y-2 text-xs text-slate-700">
                          {srv.deliverables.map((del, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                              <span>{del}</span>
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

                  <div className="mt-3 pt-2.5 border-t border-stone-200 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => toggleContractingCard(srv.index)}
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
        </div>
      )}

      {/* PROMINENT CONTACT US BUTTON DIRECTLY UNDERNEATH SERVICES LIST */}
      <div className="bg-slate-900 text-white rounded-xl p-5 sm:p-8 border border-slate-800 text-center space-y-3 sm:space-y-4">
        <p className="text-[11px] sm:text-xs font-semibold text-amber-400">
          Direct Consultation · Grone Global Ltd
        </p>
        <h3 className="text-lg sm:text-2xl font-bold tracking-tight">
          Ready to Discuss Paint Production, Screeding &amp; Putty, Civil Works, or China &amp; Local Procurement?
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto">
          Click below to message our project engineers and chemical formulation specialists at{' '}
          <strong className="text-white">Grone Global Paints</strong> and{' '}
          <strong className="text-white">Grone Global Ltd General Contracting Subdivision</strong>.
        </p>
        <div className="pt-1 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => onOpenContact('Services Page Inquiry — Grone Global Ltd')}
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 text-xs sm:text-sm font-bold text-white bg-amber-700 hover:bg-amber-600 rounded-xl transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <PhoneCall className="w-4 h-4" />
            Contact Us
          </button>
          <button
            type="button"
            onClick={onNavigateOrder}
            className="inline-flex items-center gap-2 px-5 sm:px-6 py-3 text-xs sm:text-sm font-bold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            Order Now
          </button>
        </div>
      </div>
    </div>
  );
};

