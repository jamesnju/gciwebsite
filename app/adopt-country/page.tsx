'use client';

import Link from 'next/link';
import { Globe, Users, Heart, Zap } from 'lucide-react';

export default function AdoptACountryPage() {
  const countries = [
    { name: 'Kenya', flag: '🇰🇪', region: 'East Africa' },
    { name: 'India', flag: '🇮🇳', region: 'South Asia' },
    { name: 'Brazil', flag: '🇧🇷', region: 'South America' },
    { name: 'Nigeria', flag: '🇳🇬', region: 'West Africa' },
    { name: 'Philippines', flag: '🇵🇭', region: 'Southeast Asia' },
    { name: 'Guatemala', flag: '🇬🇹', region: 'Central America' },
  ];

  return (
    <div className="w-full">
      {/* Header */}
      <section
        className="py-16 px-4 text-center animate-fade-in-down"
        style={{ backgroundColor: '#845c33' }}
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
          Adopt a Country
        </h1>
        <p className="text-lg text-white/90 max-w-2xl mx-auto">
          Join our global mission efforts and become a prayer and support partner
          for communities around the world.
        </p>
      </section>

      {/* Impact Section */}
      <section className="py-16 md:py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2
            className="text-3xl md:text-4xl font-bold text-center mb-16 animate-fade-in-down"
            style={{ color: '#845c33' }}
          >
            Why Adopt a Country?
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Heart className="w-8 h-8" />,
                title: 'Make a Difference',
                description: 'Support missionaries and local churches in their mission work',
              },
              {
                icon: <Globe className="w-8 h-8" />,
                title: 'Global Impact',
                description: 'Participate in reaching unreached communities worldwide',
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: 'Build Relationships',
                description: 'Connect with believers across cultures and continents',
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: 'Empower Leaders',
                description: 'Help develop leaders who will transform their nations',
              },
            ].map((item, index) => (
              <div
                key={index}
                className="p-8 rounded-lg text-center shadow-lg animate-fade-in-up hover:scale-105 transition-all"
                style={{
                  backgroundColor: '#f9f7f4',
                  borderTop: '4px solid #9ec8ea',
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                <div
                  className="flex justify-center mb-4 p-3 rounded-full inline-block mx-auto"
                  style={{ backgroundColor: '#9ec8ea', color: '#845c33' }}
                >
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-3" style={{ color: '#845c33' }}>
                  {item.title}
                </h3>
                <p className="text-gray-700 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Countries */}
      <section
        className="py-16 md:py-24 px-4"
        style={{ backgroundColor: '#f9f7f4' }}
      >
        <div className="max-w-6xl mx-auto">
          <h2
            className="text-3xl md:text-4xl font-bold text-center mb-16 animate-fade-in-down"
            style={{ color: '#845c33' }}
          >
            Our Partner Countries
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {countries.map((country, index) => (
              <div
                key={index}
                className="p-8 rounded-lg shadow-lg text-center bg-white animate-fade-in-up hover:shadow-2xl hover:scale-105 transition-all"
                style={{
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                <div className="text-7xl mb-4">{country.flag}</div>
                <h3 className="text-2xl font-bold mb-2" style={{ color: '#845c33' }}>
                  {country.name}
                </h3>
                <p className="text-gray-600 mb-6">{country.region}</p>
                <button
                  className="w-full py-3 rounded-lg font-semibold text-white transition-all hover:opacity-90"
                  style={{ backgroundColor: '#845c33' }}
                >
                  Adopt & Support
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-16 md:py-24 px-4 text-center animate-fade-in-up"
        style={{ backgroundColor: '#9ec8ea' }}
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: '#845c33' }}>
          Ready to Make an Impact?
        </h2>
        <p className="text-lg mb-8 max-w-2xl mx-auto" style={{ color: '#845c33' }}>
          Connect with our missions team to learn how you can adopt a country and
          partner with us in spreading the Gospel worldwide.
        </p>
        <Link
          href="/contact"
          className="inline-block px-8 py-4 rounded-lg font-semibold text-white transition-all hover:scale-105"
          style={{ backgroundColor: '#845c33' }}
        >
          Get Involved Today
        </Link>
      </section>
    </div>
  );
}
