'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 glass border-b border-white/5">
      <div className="flex items-center gap-2">
        <Image 
          src="/logo.png" 
          alt="SDR Imobiliário" 
          width={40} 
          height={40} 
          className="rounded-lg"
        />
        <span className="text-xl font-bold tracking-tight text-white">
          SDR <span className="text-[rgb(var(--primary))]">Imobiliário</span>
        </span>
      </div>

      <div className="hidden md:flex items-center gap-8">
        <Link href="#funcionalidades" className="text-sm font-medium text-[rgb(var(--on-surface-variant))] hover:text-white transition-colors">
          Funcionalidades
        </Link>
        <Link href="#precos" className="text-sm font-medium text-[rgb(var(--on-surface-variant))] hover:text-white transition-colors">
          Preços
        </Link>
        <Link href="#depoimentos" className="text-sm font-medium text-[rgb(var(--on-surface-variant))] hover:text-white transition-colors">
          Depoimentos
        </Link>
        <Link href="#faq" className="text-sm font-medium text-[rgb(var(--on-surface-variant))] hover:text-white transition-colors">
          FAQ
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <Link href="/login" className="text-sm font-label uppercase tracking-wider text-[rgb(var(--on-surface-variant))] hover:text-white transition-colors">
          Entrar
        </Link>
        <Link href="https://wa.me/yourlink" target="_blank" className="btn-neon !px-4 !py-2 !text-xs">
          Falar com Expert
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
