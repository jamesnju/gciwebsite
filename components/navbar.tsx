'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Assemblies', href: '/assemblies' },
    { label: 'Adopt a Country', href: '/adopt-country' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'Am Here', href: '/am-here' },
  ];

  return (
    <nav className="fixed w-full top-0 z-50 bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo on the right side */}
          <div className="flex-1 flex justify-end md:order-2">
            <Link
              href="/"
              className="flex items-center gap-2 animate-fade-in-down"
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#9ec8ea' }}>
                <span className="font-bold text-white text-lg">C</span>
              </div>
              <span className="hidden sm:inline font-bold text-lg" style={{ color: '#845c33' }}>
                Grace Church
              </span>
            </Link>
          </div>

          {/* Desktop Navigation in the middle */}
          <div className="hidden md:flex flex-1 justify-center gap-8 mx-8">
            {navItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium transition-colors hover:opacity-70 animate-fade-in-down"
                style={{
                  color: '#845c33',
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden order-1">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md transition-colors hover:opacity-70"
              style={{ color: '#845c33' }}
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden animate-fade-in-down" style={{ backgroundColor: '#f5f5f5' }}>
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-3 py-2 rounded-md text-base font-medium transition-colors hover:opacity-70"
                style={{ color: '#845c33' }}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
