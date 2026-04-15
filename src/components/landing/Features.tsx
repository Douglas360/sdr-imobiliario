'use client';

import React from 'react';
import { MessageSquare, LayoutDashboard, Database, Smartphone } from 'lucide-react';

const features = [
  {
    title: 'Inbox Inteligente',
    description: 'Gestão de conversas com contexto comercial. A IA identifica o interesse do lead e o SDR humano entra para fechar o agendamento.',
    icon: MessageSquare,
    color: 'rgb(var(--primary))'
  },
  {
    title: 'Catálogo e Importação',
    description: 'Seus imóveis organizados em uma vitrine digital integrada ao WhatsApp para envio instantâneo.',
    icon: Database,
    color: 'rgb(var(--secondary))'
  },
  {
    title: 'Dashboard Executivo',
    description: 'Visão geral da operação em tempo real. Acompanhe a performance de cada SDR, o volume de leads e a taxa de agendamento.',
    icon: LayoutDashboard,
    color: 'rgb(var(--primary-container))'
  },
  {
    title: 'Integração WhatsApp',
    description: 'Operação nativa no WhatsApp. Sem troca de números, sem perda de histórico, com auditoria completa.',
    icon: Smartphone,
    color: 'rgb(var(--secondary-container))'
  }
];

const Features = () => {
  return (
    <section id="funcionalidades" className="py-24 px-6 bg-[rgb(var(--surface-container-low))]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20">
          <h2 className="text-sm font-label uppercase tracking-[0.2em] text-[rgb(var(--secondary))] mb-4">Tecnologia SDR</h2>
          <h3 className="text-4xl md:text-5xl font-bold text-white max-w-2xl leading-tight">
            Uma operação completa na palma da sua mão.
          </h3>
          <p className="text-[rgb(var(--on-surface-variant))] mt-6 max-w-xl text-lg">
            Tecnologia proprietária desenhada especificamente para o mercado imobiliário de alto padrão.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5 border border-white/5 rounded-[2.5rem] overflow-hidden">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="group p-10 bg-[rgb(var(--surface-container-low))] hover:bg-[rgb(var(--surface-container-high))] transition-all duration-500"
            >
              <div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500"
                style={{ backgroundColor: `${feature.color}20`, color: feature.color }}
              >
                <feature.icon size={24} />
              </div>
              <h4 className="text-2xl font-bold text-white mb-4">{feature.title}</h4>
              <p className="text-[rgb(var(--on-surface-variant))] leading-relaxed group-hover:text-white transition-colors duration-500">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
