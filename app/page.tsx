'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative w-full h-screen md:h-[600px] overflow-hidden">
        <Image
          src="/church-hero.jpg"
          alt="Church Building"
          fill
          className="object-cover brightness-50"
          priority
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/30"></div>

        {/* Hero Content */}
        <div
          className={`absolute inset-0 flex items-center justify-center px-4 transition-all duration-1000 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="text-center animate-fade-in-up">
            <h1
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight text-balance"
              style={{
                textShadow: '2px 2px 8px rgba(0,0,0,0.5)',
              }}
            >
              Evangelism | Discipleship | Leadership
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Welcome to Grace Church - A community of faith, growth, and transformation
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-semibold transition-all hover:scale-105 animate-fade-in-up"
              style={{
                backgroundColor: '#9ec8ea',
                color: '#845c33',
                animationDelay: '0.4s',
              }}
            >
              Get in Touch <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2
            className="text-3xl md:text-4xl font-bold text-center mb-16"
            style={{ color: '#845c33' }}
          >
            Our Mission
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Evangelism',
                description: 'Spreading the Good News and welcoming all to experience Gods grace and love',
                icon: '✝️',
              },
              {
                title: 'Discipleship',
                description: 'Growing together in faith through teaching, mentoring, and spiritual development',
                icon: '📖',
              },
              {
                title: 'Leadership',
                description: 'Developing leaders who serve with integrity and transform communities',
                icon: '🙏',
              },
            ].map((item, index) => (
              <div
                key={index}
                className="p-8 rounded-lg shadow-lg transition-all hover:shadow-xl hover:scale-105 animate-fade-in-up"
                style={{
                  backgroundColor: '#f9f7f4',
                  borderTop: '4px solid #9ec8ea',
                  animationDelay: `${index * 0.2}s`,
                }}
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold mb-3" style={{ color: '#845c33' }}>
                  {item.title}
                </h3>
                <p className="text-gray-700">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="py-16 md:py-24 px-4"
        style={{ backgroundColor: '#9ec8ea' }}
      >
        <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: '#845c33' }}>
            Join Our Community
          </h2>
          <p className="text-lg mb-8" style={{ color: '#845c33' }}>
            Find local assemblies near you and become part of our growing faith community
          </p>
          <Link
            href="/assemblies"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-semibold transition-all hover:scale-105"
            style={{
              backgroundColor: '#845c33',
              color: 'white',
            }}
          >
            Explore Assemblies <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
