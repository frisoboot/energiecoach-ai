'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-100 fixed top-0 left-0 right-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center h-16 md:h-20">
          <Link href="/" className="flex items-center group">
            <div className="relative w-32 h-12 md:w-40 md:h-14 transition-transform group-hover:scale-105">
              <Image
                src="/megreen-logo.png"
                alt="Gemeente Maassluis Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>
          
          {/* Ruimte voor eventuele navigatie items in de toekomst */}
          <div className="flex-1" />
          
          {/* LanguageSwitcher zit al in de layout, dus hier niets */}
        </div>
      </div>
    </header>
  );
}
