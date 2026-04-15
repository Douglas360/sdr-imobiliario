'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Send, ShieldCheck } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[rgb(var(--surface-container-low))] pt-24 pb-12 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <Image 
                src="/logo.png" 
                alt="SDR Imobiliário" 
                width={32} 
                height={32} 
                className="rounded-lg"
              />
              <span className="text-xl font-bold tracking-tight text-white font-display">
                SDR <span className="text-[rgb(var(--primary))]">Imobiliário</span>
              </span>
            </div>
            <p className="text-[rgb(var(--on-surface-variant))] max-w-sm leading-relaxed mb-8">
              A revolução do atendimento imobiliário através da tecnologia e inteligência artificial. Atendimento instantâneo, 24 horas por dia.
            </p>
            <div className="flex items-center gap-4 text-xs font-label uppercase tracking-widest text-[rgb(var(--secondary))] bg-[rgb(var(--background))] w-fit px-4 py-2 rounded-full border border-[rgb(var(--secondary))]/20">
              <ShieldCheck size={14} />
              Implementação em até 48 horas
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 font-display">Plataforma</h4>
            <ul className="space-y-4">
              <li><Link href="#funcionalidades" className="text-[rgb(var(--on-surface-variant))] hover:text-white transition-colors">Funcionalidades</Link></li>
              <li><Link href="#precos" className="text-[rgb(var(--on-surface-variant))] hover:text-white transition-colors">Preços</Link></li>
              <li><Link href="/login" className="text-[rgb(var(--on-surface-variant))] hover:text-white transition-colors">Entrar no Sistema</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 font-display">Legal</h4>
            <ul className="space-y-4">
              <li><Link href="#" className="text-[rgb(var(--on-surface-variant))] hover:text-white transition-colors">Termos de Uso</Link></li>
              <li><Link href="#" className="text-[rgb(var(--on-surface-variant))] hover:text-white transition-colors">Privacidade</Link></li>
              <li><Link href="#" className="text-[rgb(var(--on-surface-variant))] hover:text-white transition-colors">Suporte</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-sm text-[rgb(var(--on-surface-variant))] font-label">
            © {new Date().getFullYear()} SDR Imobiliário. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-[rgb(var(--on-surface-variant))] hover:text-white transition-colors">
              <Instagram size={20} />
            </Link>
            <Link href="#" className="text-[rgb(var(--on-surface-variant))] hover:text-white transition-colors">
              <Send size={20} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
