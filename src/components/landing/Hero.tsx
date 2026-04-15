'use client';

import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 px-6 overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[rgb(var(--primary-container))] opacity-20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[rgb(var(--secondary-container))] opacity-10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="badge border border-[rgb(var(--outline-variant))] bg-[rgb(var(--surface-container-low))] text-[rgb(var(--primary))] mb-8 px-4 py-1.5 flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[rgb(var(--secondary-container))] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[rgb(var(--secondary-container))]"></span>
          </span>
          <span className="font-label uppercase tracking-widest text-[10px]">Confiado por grandes imobiliárias</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight max-w-4xl">
          Transforme o atendimento da sua imobiliária com <span className="text-transparent bg-clip-text bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--secondary))]">IA e SDR 24/7</span>
        </h1>

        <p className="text-lg md:text-xl text-[rgb(var(--on-surface-variant))] mb-12 max-w-2xl leading-relaxed">
          Fila organizada, histórico claro e ação imediata sobre cada lead vindo do WhatsApp. Escalabilidade sem perder a pessoalidade.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-20">
          <button className="btn-neon flex items-center gap-2 px-8 py-4">
            Aumentar Conversão Agora
            <ArrowRight size={20} />
          </button>
          <button className="btn-ghost px-8 py-4">
            Ver Demonstração
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
          <div className="p-8 rounded-3xl bg-[rgb(var(--surface-container-low))] border border-white/5 flex flex-col items-center">
            <span className="text-4xl font-bold text-white mb-2 font-display">+50%</span>
            <span className="text-sm text-[rgb(var(--on-surface-variant))] text-center">Aumento na taxa de conversão de leads frios.</span>
          </div>
          <div className="p-8 rounded-3xl bg-[rgb(var(--surface-container-low))] border border-white/5 flex flex-col items-center">
            <span className="text-4xl font-bold text-white mb-2 font-display">24h</span>
            <span className="text-sm text-[rgb(var(--on-surface-variant))] text-center">Atendimento ininterrupto, sem leads perdidos.</span>
          </div>
          <div className="p-8 rounded-3xl bg-[rgb(var(--surface-container-low))] border border-white/5 flex flex-col items-center">
            <span className="text-4xl font-bold text-white mb-2 font-display">12s</span>
            <span className="text-sm text-[rgb(var(--on-surface-variant))] text-center">Tempo médio de primeira resposta no WhatsApp.</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
