'use client';

import { Check, Calendar, User, MapPin } from 'lucide-react';
import { useState } from 'react';

export default function AmHerePage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    assembly: '',
    date: '',
    isFirstTime: false,
  });
  const [submitted, setSubmitted] = useState(false);

  const assemblies = [
    'Downtown Grace Center - NY',
    'Westside Community Church - LA',
    'Northgate Fellowship - Chicago',
    'Riverside Ministry - Miami',
    'Mountain View Chapel - Denver',
    'Harmony Valley Church - Austin',
    'Pacific Coast Assembly - SF',
    'Liberty Hill Congregation - Boston',
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: (e.target as HTMLInputElement).checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setFormData({
        name: '',
        email: '',
        phone: '',
        assembly: '',
        date: '',
        isFirstTime: false,
      });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="w-full">
      {/* Header */}
      <section
        className="py-16 px-4 text-center animate-fade-in-down"
        style={{ backgroundColor: '#9ec8ea' }}
      >
        <h1
          className="text-4xl md:text-5xl font-bold mb-4"
          style={{ color: '#845c33' }}
        >
          Im Here!
        </h1>
        <p className="text-lg" style={{ color: '#845c33' }}>
          Let us know you are planning to visit one of our assemblies. We would love
          to welcome you!
        </p>
      </section>

      {/* Content */}
      <section className="py-16 md:py-24 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Info */}
            <div className="animate-fade-in-left">
              <h2
                className="text-2xl font-bold mb-8"
                style={{ color: '#845c33' }}
              >
                Why Register?
              </h2>

              <div className="space-y-6">
                {[
                  {
                    icon: <Check className="w-6 h-6" />,
                    title: 'Special Welcome',
                    description:
                      'Our team will give you a special welcome and help you feel at home',
                  },
                  {
                    icon: <Calendar className="w-6 h-6" />,
                    title: 'Prepare Ahead',
                    description:
                      'Know what to expect and be greeted by our hospitality team',
                  },
                  {
                    icon: <User className="w-6 h-6" />,
                    title: 'Connect',
                    description:
                      'Meet our pastors and get connected to small groups and activities',
                  },
                  {
                    icon: <MapPin className="w-6 h-6" />,
                    title: 'Find Your Place',
                    description:
                      'Discover your spiritual home and community at Grace Church',
                  },
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div
                      className="p-3 rounded-lg text-white flex-shrink-0"
                      style={{ backgroundColor: '#845c33' }}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <h3
                        className="font-semibold mb-1"
                        style={{ color: '#845c33' }}
                      >
                        {item.title}
                      </h3>
                      <p className="text-gray-700 text-sm">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Form */}
            <div className="animate-fade-in-right">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block font-semibold mb-2"
                    style={{ color: '#845c33' }}
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none"
                    style={{ borderColor: '#9ec8ea' }}
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block font-semibold mb-2"
                    style={{ color: '#845c33' }}
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none"
                    style={{ borderColor: '#9ec8ea' }}
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block font-semibold mb-2"
                    style={{ color: '#845c33' }}
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none"
                    style={{ borderColor: '#9ec8ea' }}
                  />
                </div>

                <div>
                  <label
                    htmlFor="assembly"
                    className="block font-semibold mb-2"
                    style={{ color: '#845c33' }}
                  >
                    Which Assembly?
                  </label>
                  <select
                    id="assembly"
                    name="assembly"
                    value={formData.assembly}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none"
                    style={{ borderColor: '#9ec8ea' }}
                  >
                    <option value="">Select an assembly</option>
                    {assemblies.map((assembly) => (
                      <option key={assembly} value={assembly}>
                        {assembly}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="date"
                    className="block font-semibold mb-2"
                    style={{ color: '#845c33' }}
                  >
                    Visit Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none"
                    style={{ borderColor: '#9ec8ea' }}
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isFirstTime"
                    name="isFirstTime"
                    checked={formData.isFirstTime}
                    onChange={handleChange}
                    className="w-5 h-5 rounded"
                  />
                  <label htmlFor="isFirstTime" style={{ color: '#845c33' }}>
                    This is my first time visiting
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-lg font-semibold text-white transition-all hover:opacity-90"
                  style={{ backgroundColor: '#845c33' }}
                >
                  Register My Visit
                </button>

                {submitted && (
                  <div
                    className="p-4 rounded-lg text-center font-semibold animate-fade-in-up"
                    style={{ backgroundColor: '#9ec8ea', color: '#845c33' }}
                  >
                    Thank you for registering! We look forward to seeing you!
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
