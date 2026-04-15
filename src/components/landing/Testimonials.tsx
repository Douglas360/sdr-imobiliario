'use client';

import React from 'react';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    quote: "Implementamos o SDR Imobiliário e em menos de 15 dias nossa taxa de agendamento de visitas dobrou. O atendimento 24h foi o divisor de águas para os leads que chegam à noite.",
    author: "Ricardo Alencar",
    role: "Diretor Comercial, Lopes",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=100&h=100"
  },
  {
    quote: "O sistema de inbox inteligente limpa o ruído. Meus corretores agora só recebem leads que realmente querem visitar o imóvel. Produtividade máxima.",
    author: "Mariana Costa",
    role: "CEO, Costa Imóveis",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100&h=100"
  },
  {
    quote: "Não é apenas tecnologia, é o processo humano por trás. O dashboard nos deu uma clareza que nunca tivemos sobre o ROI do nosso marketing no WhatsApp.",
    author: "André Martins",
    role: "Sócio, Prime Realty",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100&h=100"
  }
];

const Testimonials = () => {
  return (
    <section id="depoimentos" className="py-24 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-sm font-label uppercase tracking-[0.2em] text-[rgb(var(--primary))] mb-4">Depoimentos</h2>
          <h3 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            O que dizem os líderes do mercado
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="relative p-10 rounded-[2.5rem] bg-[rgb(var(--surface-container-low))] border border-white/5 flex flex-col h-full hover:border-[rgb(var(--primary))]/30 transition-all duration-500"
            >
              <div className="text-[rgb(var(--primary))] mb-6">
                <Quote size={40} fill="currentColor" fillOpacity={0.1} />
              </div>
              <p className="text-lg text-[rgb(var(--on-surface-variant))] mb-8 flex-grow leading-relaxed italic">
                "{testimonial.quote}"
              </p>
              <div className="flex items-center gap-4">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.author} 
                  className="w-12 h-12 rounded-full object-cover border border-white/10"
                />
                <div>
                  <h4 className="font-bold text-white text-sm">{testimonial.author}</h4>
                  <p className="text-[rgb(var(--on-surface-variant))] text-xs font-label uppercase tracking-wider mt-1">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
