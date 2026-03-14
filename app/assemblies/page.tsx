'use client';

import { useEffect, useState } from 'react';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

interface Assembly {
  id: number;
  name: string;
  location: string;
  address: string;
  service_time: string;
  phone: string;
  email: string;
  image: string;
}

export default function AssembliesPage() {
  const [assemblies, setAssemblies] = useState<Assembly[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/assemblies')
      .then((res) => res.json())
      .then((data) => {
        setAssemblies(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="w-full">
      {/* Header Section */}
      <section
        className="py-16 px-4 text-center animate-fade-in-down"
        style={{ backgroundColor: '#9ec8ea' }}
      >
        <h1
          className="text-4xl md:text-5xl font-bold mb-4"
          style={{ color: '#845c33' }}
        >
          Our Assemblies
        </h1>
        <p className="text-lg" style={{ color: '#845c33' }}>
          Find and connect with one of our local church communities
        </p>
      </section>

      {/* Assemblies Grid */}
      <section className="py-16 md:py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="text-center py-16">
              <p className="text-xl" style={{ color: '#845c33' }}>
                Loading assemblies...
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
              {assemblies.map((assembly, index) => (
                <div
                  key={assembly.id}
                  className="rounded-lg shadow-lg overflow-hidden transition-all hover:shadow-2xl hover:scale-105 animate-fade-in-up"
                  style={{
                    backgroundColor: '#f9f7f4',
                    animationDelay: `${index * 0.1}s`,
                  }}
                >
                  {/* Card Header with Icon */}
                  <div
                    className="p-6 text-center"
                    style={{ backgroundColor: '#9ec8ea' }}
                  >
                    <div className="text-6xl mb-4">{assembly.image}</div>
                    <h2
                      className="text-2xl font-bold"
                      style={{ color: '#845c33' }}
                    >
                      {assembly.name}
                    </h2>
                  </div>

                  {/* Card Body */}
                  <div className="p-6">
                    {/* Location */}
                    <div className="flex items-start gap-3 mb-4">
                      <MapPin
                        className="w-5 h-5 flex-shrink-0 mt-1"
                        style={{ color: '#845c33' }}
                      />
                      <div>
                        <p
                          className="font-semibold"
                          style={{ color: '#845c33' }}
                        >
                          Location
                        </p>
                        <p className="text-gray-700 text-sm">{assembly.location}</p>
                        <p className="text-gray-600 text-xs">
                          {assembly.address}
                        </p>
                      </div>
                    </div>

                    {/* Service Time */}
                    <div className="flex items-start gap-3 mb-4">
                      <Clock
                        className="w-5 h-5 flex-shrink-0 mt-1"
                        style={{ color: '#845c33' }}
                      />
                      <div>
                        <p
                          className="font-semibold"
                          style={{ color: '#845c33' }}
                        >
                          Service Times
                        </p>
                        <p className="text-gray-700 text-sm">
                          {assembly.service_time}
                        </p>
                      </div>
                    </div>

                    {/* Contact */}
                    <div className="space-y-2 border-t pt-4">
                      <div className="flex items-center gap-3">
                        <Phone
                          className="w-5 h-5"
                          style={{ color: '#845c33' }}
                        />
                        <a
                          href={`tel:${assembly.phone}`}
                          className="text-sm transition-colors hover:opacity-70"
                          style={{ color: '#845c33' }}
                        >
                          {assembly.phone}
                        </a>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail
                          className="w-5 h-5"
                          style={{ color: '#845c33' }}
                        />
                        <a
                          href={`mailto:${assembly.email}`}
                          className="text-sm transition-colors hover:opacity-70"
                          style={{ color: '#845c33' }}
                        >
                          {assembly.email}
                        </a>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      className="w-full mt-6 py-3 rounded-lg font-semibold transition-all hover:opacity-90"
                      style={{
                        backgroundColor: '#845c33',
                        color: 'white',
                      }}
                    >
                      Visit Us
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
