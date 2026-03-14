'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="animate-fade-in-up">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: '#9ec8ea' }}
              >
                <span className="font-bold text-white text-lg">C</span>
              </div>
              <span className="font-bold text-lg" style={{ color: '#845c33' }}>
                Grace Church
              </span>
            </Link>
            <p className="text-sm text-gray-600">
              Evangelism | Discipleship | Leadership
            </p>
          </div>

          {/* Quick Links */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <h3 className="font-bold mb-4" style={{ color: '#845c33' }}>
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              {[
                { label: 'About Us', href: '/about' },
                { label: 'Assemblies', href: '/assemblies' },
                { label: 'Adopt a Country', href: '/adopt-country' },
                { label: 'Contact', href: '/contact' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-600 hover:opacity-70 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <h3 className="font-bold mb-4" style={{ color: '#845c33' }}>
              Contact
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-gray-600">
                <Phone className="w-4 h-4" />
                <span>(555) 123-4567</span>
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <Mail className="w-4 h-4" />
                <span>info@gracechurch.com</span>
              </li>
              <li className="flex items-start gap-2 text-gray-600">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                <span>123 Main Street, New York, NY 10001</span>
              </li>
            </ul>
          </div>

          {/* Follow Us */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <h3 className="font-bold mb-4" style={{ color: '#845c33' }}>
              Follow Us
            </h3>
            <div className="flex gap-4">
              {['Facebook', 'Twitter', 'Instagram', 'YouTube'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="inline-flex items-center justify-center w-10 h-10 rounded-full transition-all hover:scale-110"
                  style={{ backgroundColor: '#9ec8ea', color: '#845c33' }}
                >
                  <span className="text-xs font-bold">{social.charAt(0)}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t pt-8 text-center text-sm text-gray-600">
          <p>
            © {currentYear} Grace Church. All rights reserved. | Built with faith and dedication
          </p>
        </div>
      </div>
    </footer>
  );
}
