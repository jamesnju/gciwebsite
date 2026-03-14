'use client';

import { useEffect, useState } from 'react';

interface BoardMember {
  id: number;
  name: string;
  position: string;
  bio: string;
  image: string;
}

export default function AboutPage() {
  const [boardMembers, setBoardMembers] = useState<BoardMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/board-members')
      .then((res) => res.json())
      .then((data) => {
        setBoardMembers(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="w-full">
      {/* Header Section */}
      <section
        className="py-16 px-4 text-center animate-fade-in-down"
        style={{ backgroundColor: '#845c33' }}
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
          About Grace Church
        </h1>
        <p className="text-lg text-white/90 max-w-2xl mx-auto">
          Founded on the principles of Evangelism, Discipleship, and Leadership,
          we are committed to spiritual growth and community transformation.
        </p>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-16 md:py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Mission */}
            <div className="animate-fade-in-up">
              <h2
                className="text-3xl font-bold mb-6"
                style={{ color: '#845c33' }}
              >
                Our Mission
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                To proclaim the Gospel of Jesus Christ and make disciples who
                become leaders in their communities, transforming lives through
                the power of Gods word and the Holy Spirit.
              </p>
              <p className="text-gray-700 leading-relaxed">
                We believe in reaching the lost, building up the faithful, and
                equipping leaders who will continue this work for generations to
                come.
              </p>
            </div>

            {/* Vision */}
            <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <h2
                className="text-3xl font-bold mb-6"
                style={{ color: '#845c33' }}
              >
                Our Vision
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                To see a vibrant network of churches united in faith, purpose,
                and missional focus, impacting every nation with the message of
                Christs redemption.
              </p>
              <p className="text-gray-700 leading-relaxed">
                We envision leaders emerging from our communities who will
                establish new churches and expand Gods kingdom across the globe.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Board Members Section */}
      <section className="py-16 md:py-24 px-4" style={{ backgroundColor: '#f9f7f4' }}>
        <div className="max-w-6xl mx-auto">
          <h2
            className="text-3xl md:text-4xl font-bold text-center mb-16 animate-fade-in-down"
            style={{ color: '#845c33' }}
          >
            Board Members
          </h2>

          {loading ? (
            <div className="text-center py-16">
              <p className="text-xl" style={{ color: '#845c33' }}>
                Loading board members...
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {boardMembers.map((member, index) => (
                <div
                  key={member.id}
                  className="rounded-lg shadow-lg overflow-hidden transition-all hover:shadow-2xl hover:scale-105 animate-fade-in-up bg-white"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                  }}
                >
                  {/* Member Header */}
                  <div
                    className="p-8 text-center"
                    style={{ backgroundColor: '#9ec8ea' }}
                  >
                    <div className="text-7xl mb-4">{member.image}</div>
                  </div>

                  {/* Member Info */}
                  <div className="p-6 text-center">
                    <h3
                      className="text-xl font-bold mb-2"
                      style={{ color: '#845c33' }}
                    >
                      {member.name}
                    </h3>
                    <p
                      className="font-semibold mb-4"
                      style={{ color: '#9ec8ea' }}
                    >
                      {member.position}
                    </p>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {member.bio}
                    </p>
                  </div>

                  {/* Action */}
                  <div className="px-6 pb-6">
                    <button
                      className="w-full py-2 rounded-lg font-semibold transition-all hover:opacity-90 text-white"
                      style={{ backgroundColor: '#845c33' }}
                    >
                      Connect
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2
            className="text-3xl md:text-4xl font-bold text-center mb-16 animate-fade-in-down"
            style={{ color: '#845c33' }}
          >
            Our Core Values
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Faith',
                description: 'We trust in Gods word and providence in all things',
              },
              {
                title: 'Community',
                description:
                  'We believe in the power of believers united in purpose',
              },
              {
                title: 'Transformation',
                description:
                  'We are committed to spiritual and social transformation',
              },
            ].map((value, index) => (
              <div
                key={index}
                className="p-8 rounded-lg text-center animate-fade-in-up"
                style={{
                  backgroundColor: '#9ec8ea',
                  animationDelay: `${index * 0.2}s`,
                }}
              >
                <h3
                  className="text-2xl font-bold mb-3"
                  style={{ color: '#845c33' }}
                >
                  {value.title}
                </h3>
                <p style={{ color: '#845c33' }}>{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
