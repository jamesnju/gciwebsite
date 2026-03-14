'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, Users, Globe, Heart, Church } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';

// Animated Counter Component
type AnimatedCounterProps = {
  end: number;
  duration?: number;
  suffix?: string;
};

function AnimatedCounter({ end, duration = 2000, suffix = '' }: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const counterRef = useRef<HTMLSpanElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    let animationFrame: number;
    
    const startCount = 0;
    const endCount = end;
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - percentage, 3);
      const currentCount = Math.floor(easeOutQuart * endCount);
      
      setCount(currentCount);
      
      if (percentage < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isVisible, end, duration]);

  return <span ref={counterRef}>{count}{suffix}</span>;
}

// Scroll Animation Hook
function useScrollAnimation() {
  const elementRefs = useRef<(HTMLElement | null)[]>([]);
  
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    
    elementRefs.current.forEach((element, index) => {
      if (element) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              // Add animation class when entering
              element.classList.add('animate-in');
              element.style.opacity = '1';
              element.style.transform = 'translateY(0)';
            } else {
              // Remove animation class when leaving
              element.classList.remove('animate-in');
              element.style.opacity = '0';
              element.style.transform = 'translateY(30px)';
            }
          },
          { threshold: 0.2, rootMargin: '0px' }
        );
        
        observer.observe(element);
        observers.push(observer);
      }
    });
    
    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, []);
  
  return elementRefs;
}

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const animationRefs = useScrollAnimation();

  useEffect(() => {
    setIsLoaded(true);
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Parallax effect for hero section
  const heroTranslateY = scrollY * 0.5;
  const heroOpacity = Math.max(1 - scrollY / 700, 0.3);

  return (
    <div className="w-full overflow-x-hidden">
      {/* Hero Section with Parallax */}
      <section className="relative w-full h-screen md:h-[700px] overflow-hidden">
        <div 
          className="absolute inset-0 transition-transform duration-300 ease-out"
          style={{ 
            transform: `translateY(${heroTranslateY}px)`,
            opacity: heroOpacity
          }}
        >
          <Image
            src="/church-hero.jpg"
            alt="Church Building"
            fill
            className="object-cover brightness-50 scale-105"
            priority
          />
        </div>

        {/* Animated Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50"></div>

        {/* Hero Content with Staggered Animation */}
        <div
          className={`absolute inset-0 flex items-center justify-center px-4 transition-all duration-1000 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="text-center max-w-4xl">
            <div className="animate-float">
              <span 
                className="inline-block px-6 py-3 rounded-full text-sm font-semibold mb-8 animate-fade-in-up shadow-lg"
                style={{ 
                  backgroundColor: '#9ec8ea',
                  color: '#845c33',
                  animationDelay: '0.1s'
                }}
              >
                ✝️ Welcome to GCI Church ✝️
              </span>
            </div>
            
            {/* Smaller, more colorful hero text */}
            <div className="space-y-3 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="flex flex-wrap justify-center gap-3 text-3xl md:text-4xl lg:text-5xl font-bold">
                <span className="text-white bg-gradient-to-r from-[#9ec8ea] to-[#7ba9ce] bg-clip-text text-transparent px-3 py-1 rounded-lg">
                  Evangelism
                </span>
                <span className="text-[#9ec8ea] text-4xl md:text-5xl">•</span>
                <span className="text-white bg-gradient-to-r from-[#845c33] to-[#a87c4a] bg-clip-text text-transparent px-3 py-1 rounded-lg">
                  Discipleship
                </span>
                <span className="text-[#9ec8ea] text-4xl md:text-5xl">•</span>
                <span className="text-white bg-gradient-to-r from-[#9ec8ea] to-[#6b9fc7] bg-clip-text text-transparent px-3 py-1 rounded-lg">
                  Leadership
                </span>
              </div>
            </div>
            
            <p 
              className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto animate-fade-in-up mt-6" 
              style={{ animationDelay: '0.4s' }}
            >
              A community of faith, growth, and transformation
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 px-8 py-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl relative overflow-hidden"
                style={{
                  backgroundColor: '#9ec8ea',
                  color: '#845c33',
                }}
              >
                <span className="relative z-10">Get in Touch</span>
                <ChevronRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 relative z-10" />
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </Link>
              
              <Link
                href="/assemblies"
                className="group inline-flex items-center gap-2 px-8 py-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 relative overflow-hidden"
                style={{
                  borderColor: '#9ec8ea',
                  color: 'white',
                }}
              >
                <span className="relative z-10">Find Assemblies</span>
                <ChevronRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 relative z-10" />
                <div className="absolute inset-0 bg-[#9ec8ea] opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-scroll"></div>
          </div>
        </div>
      </section>

      {/* Stats Section with Animated Counters */}
      <section className="py-16 md:py-20 px-4 relative" style={{ backgroundColor: '#f9f7f4' }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              { icon: <Globe className="w-8 h-8" />, end: 50, label: 'Countries', suffix: '+' },
              { icon: <Church className="w-8 h-8" />, end: 200, label: 'Assemblies', suffix: '+' },
              { icon: <Users className="w-8 h-8" />, end: 10000, label: 'Members', suffix: '+' },
              { icon: <Heart className="w-8 h-8" />, end: 25, label: 'Years', suffix: '' },
            ].map((stat, index) => (
              <div
                key={index}
                ref={(el) => { if (el) animationRefs.current[index] = el; }}
                className="text-center p-6 rounded-xl transition-all duration-700 hover:shadow-xl opacity-0 translate-y-8"
                style={{ 
                  backgroundColor: 'white',
                  transitionDelay: `${index * 100}ms`,
                }}
              >
                <div 
                  className="inline-flex p-4 rounded-full mb-4 transition-all duration-500 hover:scale-110 hover:rotate-6"
                  style={{ backgroundColor: '#9ec8ea20', color: '#9ec8ea' }}
                >
                  {stat.icon}
                </div>
                <div className="text-3xl md:text-4xl font-bold mb-2" style={{ color: '#845c33' }}>
                  <AnimatedCounter end={stat.end} suffix={stat.suffix} />
                </div>
                <div className="text-sm md:text-base text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission/Vision Section with Cards */}
      <section className="py-20 md:py-28 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span 
              className="inline-block px-6 py-3 rounded-full text-sm font-semibold mb-4 shadow-md"
              style={{ backgroundColor: '#9ec8ea20', color: '#9ec8ea' }}
            >
              ✨ Our Foundation ✨
            </span>
            <h2
              className="text-3xl md:text-5xl font-bold mb-4"
              style={{ color: '#845c33' }}
            >
              Mission, Vision & Faith
            </h2>
            <div className="w-24 h-1 mx-auto rounded-full" style={{ backgroundColor: '#9ec8ea' }}></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'VISION',
                description: 'The Great Commission Fulfilled with Excellence.',
                icon: '🌟',
                gradient: 'from-blue-400 to-blue-600',
              },
              {
                title: 'MISSION',
                description: 'An International Church that excels in Evangelizing the World, Discipling Believers and Raising Leaders.',
                icon: '📖',
                gradient: 'from-green-400 to-green-600',
              },
              {
                title: 'STATEMENT OF FAITH',
                description: 'An International Church that excels in Evangelizing the World, Discipling Believers and Raising Leaders',
                icon: '🙏',
                gradient: 'from-purple-400 to-purple-600',
              },
            ].map((item, index) => (
              <div
                key={index}
                ref={(el) => { if (el) animationRefs.current[index + 4] = el; }}
                className="group relative p-8 rounded-2xl transition-all duration-700 hover:scale-105 hover:-translate-y-2 opacity-0 translate-y-8 overflow-hidden"
                style={{
                  backgroundColor: '#f9f7f4',
                  boxShadow: '0 10px 30px -15px rgba(0,0,0,0.2)',
                  transitionDelay: `${index * 150}ms`,
                }}
              >
                {/* Hover Effect Background */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `linear-gradient(135deg, #9ec8ea15 0%, #9ec8ea25 100%)`,
                  }}
                ></div>
                
                {/* Icon with Animation */}
                <div 
                  className="text-5xl mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 relative z-10"
                >
                  {item.icon}
                </div>
                
                {/* Decorative Line */}
                <div 
                  className="w-16 h-1 mb-4 rounded-full transition-all duration-500 group-hover:w-24 relative z-10"
                  style={{ backgroundColor: '#9ec8ea' }}
                ></div>
                
                <h3 
                  className="text-2xl font-bold mb-4 transition-all duration-300 group-hover:text-[#9ec8ea] relative z-10"
                  style={{ color: '#845c33' }}
                >
                  {item.title}
                </h3>
                
                <p className="text-gray-700 leading-relaxed relative z-10">
                  {item.description}
                </p>

                {/* Corner Accent */}
                <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden">
                  <div 
                    className="absolute top-0 right-0 w-20 h-20 bg-[#9ec8ea] transform rotate-45 translate-x-10 -translate-y-10 group-hover:translate-x-6 group-hover:-translate-y-6 transition-transform duration-500"
                    style={{ opacity: 0.1 }}
                  ></div>
                </div>

                {/* Floating Particles */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#9ec8ea] to-transparent opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section with Animation */}
      <section
        className="py-24 md:py-32 px-4 relative overflow-hidden"
        style={{ backgroundColor: '#9ec8ea' }}
      >
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2 animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-white rounded-full animate-ping opacity-20"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div
            ref={(el) => { if (el) animationRefs.current[7] = el; }}
            className="opacity-0 translate-y-8 transition-all duration-700"
          >
            <h2 
              className="text-4xl md:text-6xl font-bold mb-6"
              style={{ color: '#845c33' }}
            >
              Join Our Community
            </h2>
            
            <p 
              className="text-lg md:text-xl mb-10 max-w-2xl mx-auto"
              style={{ color: '#845c33' }}
            >
              Find local assemblies near you and become part of our growing faith community
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/assemblies"
                className="group inline-flex items-center gap-2 px-8 py-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl relative overflow-hidden"
                style={{
                  backgroundColor: '#845c33',
                  color: 'white',
                }}
              >
                <span className="relative z-10">Explore Assemblies</span>
                <ChevronRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 relative z-10" />
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </Link>
              
              <Link
                href="/about"
                className="group inline-flex items-center gap-2 px-8 py-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105 border-2 relative overflow-hidden"
                style={{
                  borderColor: '#845c33',
                  color: '#845c33',
                }}
              >
                <span className="relative z-10">Learn More About Us</span>
                <ChevronRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 relative z-10" />
                <div className="absolute inset-0 bg-[#845c33] opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Add custom animations to your global CSS file */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        @keyframes scroll {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(20px); opacity: 0; }
        }
        
        .animate-scroll {
          animation: scroll 2s ease-in-out infinite;
        }
        
        .delay-1000 {
          animation-delay: 1000ms;
        }
        
        .text-balance {
          text-wrap: balance;
        }
        
        .animate-in {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
        
        .bg-gradient-to-r {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
}


// 'use client';

// import Image from 'next/image';
// import Link from 'next/link';
// import { ChevronRight } from 'lucide-react';
// import { useEffect, useState } from 'react';

// export default function Home() {
//   const [isLoaded, setIsLoaded] = useState(false);

//   useEffect(() => {
//     setIsLoaded(true);
//   }, []);

//   return (
//     <div className="w-full">
//       {/* Hero Section */}
//       <section className="relative w-full h-screen md:h-[600px] overflow-hidden">
//         <Image
//           src="/church-hero.jpg"
//           alt="Church Building"
//           fill
//           className="object-cover brightness-50"
//           priority
//         />

//         {/* Overlay */}
//         <div className="absolute inset-0 bg-black/30"></div>

//         {/* Hero Content */}
//         <div
//           className={`absolute inset-0 flex items-center justify-center px-4 transition-all duration-1000 ${
//             isLoaded ? 'opacity-100' : 'opacity-0'
//           }`}
//         >
//           <div className="text-center animate-fade-in-up">
//             <h1
//               className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight text-balance"
//               style={{
//                 textShadow: '2px 2px 8px rgba(0,0,0,0.5)',
//               }}
//             >
//               Evangelism | Discipleship | Leadership
//             </h1>
//             <p className="text-lg md:text-xl text-white/90 mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
//               Welcome to GCI Church - A community of faith, growth, and transformation
//             </p>
//             <Link
//               href="/contact"
//               className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-semibold transition-all hover:scale-105 animate-fade-in-up"
//               style={{
//                 backgroundColor: '#9ec8ea',
//                 color: '#845c33',
//                 animationDelay: '0.4s',
//               }}
//             >
//               Get in Touch <ChevronRight className="w-5 h-5" />
//             </Link>
//           </div>
//         </div>
//       </section>

//       {/* Features Section */}
//       <section className="py-16 md:py-24 px-4 bg-white">
//         <div className="max-w-6xl mx-auto">
//           <h2
//             className="text-3xl md:text-4xl font-bold text-center mb-16"
//             style={{ color: '#845c33' }}
//           >
//             Our Mission, Vision, Statement of Faith 
//           </h2>

//           <div className="grid md:grid-cols-3 gap-8">
//             {[
//               {
//                 title: 'VISION',
//                 description: 'The Great Commission Fulfilled with Excellence.',
//                 icon: '✝️',
//               },
//               {
//                 title: 'MISSION',
//                 description: 'An International Church that excels in Evangelizing the World, Discipling Believers and Raising Leaders.',
//                 icon: '📖',
//               },
//               {
//                 title: 'Statement of Faith',
//                 description: 'An International Church that excels in Evangelizing the World, Discipling Believers and Raising Leaders',
//                 icon: '🙏',
//               },
//             ].map((item, index) => (
//               <div
//                 key={index}
//                 className="p-8 rounded-lg shadow-lg transition-all hover:shadow-xl hover:scale-105 animate-fade-in-up"
//                 style={{
//                   backgroundColor: '#f9f7f4',
//                   borderTop: '4px solid #9ec8ea',
//                   animationDelay: `${index * 0.2}s`,
//                 }}
//               >
//                 <div className="text-4xl mb-4">{item.icon}</div>
//                 <h3 className="text-xl font-bold mb-3" style={{ color: '#845c33' }}>
//                   {item.title}
//                 </h3>
//                 <p className="text-gray-700">{item.description}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section
//         className="py-16 md:py-24 px-4"
//         style={{ backgroundColor: '#9ec8ea' }}
//       >
//         <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
//           <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: '#845c33' }}>
//             Join Our Community
//           </h2>
//           <p className="text-lg mb-8" style={{ color: '#845c33' }}>
//             Find local assemblies near you and become part of our growing faith community
//           </p>
//           <Link
//             href="/assemblies"
//             className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-semibold transition-all hover:scale-105"
//             style={{
//               backgroundColor: '#845c33',
//               color: 'white',
//             }}
//           >
//             Explore Assemblies <ChevronRight className="w-5 h-5" />
//           </Link>
//         </div>
//       </section>
//     </div>
//   );
// }
