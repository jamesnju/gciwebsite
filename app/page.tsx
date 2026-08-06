'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, Users, Globe, Heart, Church, Sparkles, Cross, Book, Smartphone, Download, Store } from 'lucide-react';
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
              element.classList.add('animate-in');
              element.style.opacity = '1';
              element.style.transform = 'translateY(0)';
            } else {
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

// Theme Data Interface
interface ThemeData {
  ThemeId: number;
  Theme: string;
  Verse: string;
  Description: string;
  Year: number;
  IsActive: boolean;
  CreatedAt: string;
  Assembly: string | null;
  UpdatedAt: string;
  YearThemeImage: string | null;
}

interface ThemeResponse {
  IsSuccess: boolean;
  Code: string;
  Message: string;
  Data: ThemeData;
}

// Gallery Image Interface
interface GalleryImage {
  FileName: string;
  ImageBytes: string;
  SizeBytes: number;
  CreatedAt: string;
}

interface GalleryResponse {
  IsSuccess: boolean;
  Code: string;
  Message: string;
  Data: GalleryImage[];
}

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [themeData, setThemeData] = useState<ThemeData | null>(null);
  const [themeLoading, setThemeLoading] = useState(true);
  const [themeError, setThemeError] = useState<string | null>(null);
  const [heroImage, setHeroImage] = useState<string>('/church-hero.jpg');
  const [imageLoading, setImageLoading] = useState(true);
  const animationRefs = useScrollAnimation();

  useEffect(() => {
    setIsLoaded(true);
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch theme data
  useEffect(() => {
    const fetchTheme = async () => {
      try {
        setThemeLoading(true);
        const response = await fetch('https://api.gospelcentresinternational.com/api/Events/GetCurrentYearTheme');
        if (!response.ok) {
          throw new Error('Failed to fetch theme');
        }
        const data: ThemeResponse = await response.json();
        if (data.IsSuccess && data.Data) {
          setThemeData(data.Data);
        } else {
          throw new Error(data.Message || 'Failed to load theme');
        }
      } catch (error) {
        console.error('Error fetching theme:', error);
        setThemeError('Failed to load theme');
      } finally {
        setThemeLoading(false);
      }
    };

    fetchTheme();
  }, []);

  // Fetch hero image from gallery
  useEffect(() => {
    const fetchHeroImage = async () => {
      try {
        const response = await fetch('https://api.gospelcentresinternational.com/api/Gallery/GetGalleryImages');
        if (!response.ok) {
          throw new Error('Failed to fetch gallery images');
        }
        const data: GalleryResponse = await response.json();
        
        if (data.IsSuccess && data.Data && data.Data.length > 0) {
          // Get the first image from the gallery
          const imageData = data.Data[0];
          if (imageData.ImageBytes) {
            // Check if it's base64 (starts with /9j/)
            if (imageData.ImageBytes.startsWith('/9j/')) {
              setHeroImage(`data:image/jpeg;base64,${imageData.ImageBytes}`);
            } else {
              setHeroImage(imageData.ImageBytes);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching hero image:', error);
        // Keep fallback image
      } finally {
        setImageLoading(false);
      }
    };

    fetchHeroImage();
  }, []);

  // Parallax effect for hero section
  const heroTranslateY = scrollY * 0.5;
  const heroOpacity = Math.max(1 - scrollY / 700, 0.3);

  return (
    <div className="w-full overflow-x-hidden">
      {/* Hero Section with Parallax */}
      <section className="relative w-full min-h-screen md:h-[700px] overflow-hidden">
        <div 
          className="absolute inset-0 transition-transform duration-300 ease-out"
          style={{ 
            transform: `translateY(${heroTranslateY}px)`,
            opacity: heroOpacity
          }}
        >
          {imageLoading ? (
            <div className="absolute inset-0 bg-gray-800 animate-pulse"></div>
          ) : (
            <Image
              src={heroImage}
              alt="Church Building"
              fill
              className="object-cover brightness-50 scale-105"
              priority
              unoptimized={heroImage.startsWith('data:')}
            />
          )}
        </div>

        {/* Animated Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50"></div>

        {/* Animated Background Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-32 h-32 bg-[#9ec8ea]/20 rounded-full blur-3xl animate-float-slow"></div>
          <div className="absolute bottom-20 right-20 w-48 h-48 bg-[#9ec8ea]/10 rounded-full blur-3xl animate-float-slower"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse-glow"></div>
        </div>

        {/* Hero Content with Staggered Animation */}
        <div
          className={`absolute inset-0 flex items-center justify-center px-4 transition-all duration-1000 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="text-center max-w-5xl">
            {/* Welcome Badge with Glow */}
            <div className="animate-float mb-6">
              <span 
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105"
                style={{ 
                  backgroundColor: 'rgba(158, 200, 234, 0.15)',
                  color: '#9ec8ea',
                  border: '1px solid rgba(158, 200, 234, 0.3)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <Sparkles className="w-4 h-4 animate-pulse" />
                Welcome to GCI Church
                <Sparkles className="w-4 h-4 animate-pulse" />
              </span>
            </div>

            {/* Theme Display with Animation */}
            {themeLoading ? (
              <div className="animate-pulse">
                <div className="h-12 w-64 mx-auto bg-white/10 rounded-lg mb-4"></div>
                <div className="h-8 w-48 mx-auto bg-white/10 rounded-lg"></div>
              </div>
            ) : themeError ? (
              <div className="text-white/70 text-lg">
                <span className="inline-block px-4 py-2 bg-red-500/20 rounded-lg">
                  {themeError}
                </span>
              </div>
            ) : themeData ? (
              <div className="space-y-4 mb-8">
                {/* Theme Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#9ec8ea]/20 to-[#845c33]/20 backdrop-blur-sm border border-white/10">
                  <Book className="w-4 h-4 text-[#9ec8ea]" />
                  <span className="text-white/70 text-sm font-medium">Year Theme {themeData.Year}</span>
                </div>

                {/* Main Theme with Animated Gradient */}
                <div className="relative">
                  <h1 
                    className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight animate-gradient-text"
                    style={{
                      background: 'linear-gradient(135deg, #9ec8ea 0%, #845c33 30%, #9ec8ea 60%, #845c33 100%)',
                      backgroundSize: '300% 300%',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    {themeData.Theme}
                  </h1>
                </div>

                {/* Verse with Animated Border */}
                <div className="relative inline-block">
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#9ec8ea]/30 to-[#845c33]/30 blur-xl animate-pulse-glow"></div>
                  <p 
                    className="relative text-lg md:text-xl text-white/90 font-medium px-6 py-3 rounded-lg backdrop-blur-sm border border-white/10"
                    style={{
                      background: 'rgba(0,0,0,0.2)',
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    <span className="text-[#9ec8ea]">📖</span> {themeData.Verse}
                  </p>
                </div>

                {/* Description with Fade In */}
                <div className="max-w-2xl mx-auto">
                  <p 
                    className="text-white/80 text-sm md:text-base leading-relaxed px-4 py-3 rounded-lg backdrop-blur-sm border border-white/5"
                    style={{
                      background: 'rgba(0,0,0,0.15)',
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    {themeData.Description}
                  </p>
                </div>
              </div>
            ) : null}

            {/* Original Hero Elements - Replaced with Theme */}
            <div className="flex flex-wrap justify-center gap-3 text-sm md:text-base text-white/80 mb-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm">
                <Cross className="w-4 h-4 text-[#9ec8ea]" />
                Evangelism
              </span>
              <span className="text-[#9ec8ea] text-xl">•</span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm">
                <Book className="w-4 h-4 text-[#9ec8ea]" />
                Discipleship
              </span>
              <span className="text-[#9ec8ea] text-xl">•</span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm">
                <Users className="w-4 h-4 text-[#9ec8ea]" />
                Leadership
              </span>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
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
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-scroll"></div>
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

          {/* Google Play Store Download Section */}
      <section className="py-20 md:py-28 px-4 bg-[#f9f7f4] relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: 'radial-gradient(circle at 20px 20px, #845c33 2px, transparent 0)',
            backgroundSize: '40px 40px',
          }}></div>
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          <div
            ref={(el) => { if (el) animationRefs.current[7] = el; }}
            className="opacity-0 translate-y-8 transition-all duration-700"
          >
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#9ec8ea]/10 border border-[#9ec8ea]/20 mb-6">
                  <Smartphone className="w-4 h-4" style={{ color: '#845c33' }} />
                  <span className="text-sm font-medium" style={{ color: '#845c33' }}>Mobile App</span>
                </div>
                
                <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#845c33' }}>
                  Get the GCI Church App
                </h2>
                
                <p className="text-gray-700 text-lg mb-8 leading-relaxed">
                  Stay connected with our community, access sermons, events, and more - all from your mobile device. Download the GCI Connect app today!
                </p>

                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <a
                    href="https://play.google.com/store/apps/details?id=com.gciconnect.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-4 px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                    style={{
                      backgroundColor: '#845c33',
                      color: 'white',
                    }}
                  >
                    <Store className="w-8 h-8" />
                    <div className="text-left">
                      <div className="text-xs font-normal opacity-70">GET IT ON</div>
                      <div className="text-xl font-bold tracking-tight">Google Play</div>
                    </div>
                  </a>
                  
                  <a
                    href="https://play.google.com/store/apps/details?id=com.gciconnect.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl border-2"
                    style={{
                      borderColor: '#845c33',
                      color: '#845c33',
                    }}
                  >
                    <Download className="w-5 h-5" />
                    <span>Download Now</span>
                  </a>
                </div>

                <div className="flex items-center gap-4 mt-6 justify-center md:justify-start">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gradient-to-br from-[#9ec8ea] to-[#845c33] flex items-center justify-center text-white text-xs font-bold">
                        {String.fromCharCode(65 + i)}
                      </div>
                    ))}
                  </div>
                  <span className="text-gray-600 text-sm">Join 5,000+ members on the app</span>
                </div>
              </div>

              {/* Right Content - App Preview */}
              <div className="flex justify-center items-center">
                <div className="relative">
                  {/* Phone Mockup */}
                  <div className="w-[280px] h-[560px] bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-[#9ec8ea] relative">
                    {/* App Preview Content */}
                    <div className="absolute inset-0 bg-[#9ec8ea] p-4">
                      {/* App Header */}
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                          <Church className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="text-white font-bold text-sm">GCI Connect</div>
                          <div className="text-white/60 text-xs">v2.0.1</div>
                        </div>
                      </div>
                      
                      {/* App Content Preview */}
                      <div className="space-y-3">
                        <div className="bg-white rounded-xl p-3 shadow-sm">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#9ec8ea]/20 flex items-center justify-center text-[#845c33] text-xs font-bold">S</div>
                            <div>
                              <div className="text-[#845c33] text-xs font-medium">Sunday Service</div>
                              <div className="text-gray-600 text-xs">Today at 10:00 AM</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-white rounded-xl p-3 shadow-sm">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#9ec8ea]/20 flex items-center justify-center text-[#845c33] text-xs font-bold">B</div>
                            <div>
                              <div className="text-[#845c33] text-xs font-medium">Bible Study</div>
                              <div className="text-gray-600 text-xs">Wednesday 7:00 PM</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-white rounded-xl p-3 shadow-sm">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#9ec8ea]/20 flex items-center justify-center text-[#845c33] text-xs font-bold">Y</div>
                            <div>
                              <div className="text-[#845c33] text-xs font-medium">Youth Connect</div>
                              <div className="text-gray-600 text-xs">Friday 6:30 PM</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Bottom Navigation */}
                      <div className="absolute bottom-4 left-4 right-4 flex justify-around bg-white/10 rounded-full py-2 px-4 backdrop-blur-sm">
                        <span className="text-white font-semibold text-xs">Home</span>
                        <span className="text-white/60 text-xs">Events</span>
                        <span className="text-white/60 text-xs">Sermons</span>
                        <span className="text-white/60 text-xs">More</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Floating Badge */}
                  <div className="absolute -top-4 -right-4 bg-[#845c33] text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg animate-float">
                    NEW
                  </div>
                </div>
              </div>
            </div>
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
            ref={(el) => { if (el) animationRefs.current[8] = el; }}
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

        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-20px) scale(1.1); }
        }

        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }

        @keyframes float-slower {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(15px) scale(0.9); }
        }

        .animate-float-slower {
          animation: float-slower 8s ease-in-out infinite;
        }

        @keyframes pulse-glow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.2); }
        }

        .animate-pulse-glow {
          animation: pulse-glow 4s ease-in-out infinite;
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

        @keyframes gradient-text {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .animate-gradient-text {
          background-size: 300% 300%;
          animation: gradient-text 4s ease-in-out infinite;
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-fade-in-up:nth-child(1) { animation-delay: 0.1s; }
        .animate-fade-in-up:nth-child(2) { animation-delay: 0.2s; }
        .animate-fade-in-up:nth-child(3) { animation-delay: 0.3s; }
      `}</style>
    </div>
  );
}

// 'use client';

// import Image from 'next/image';
// import Link from 'next/link';
// import { ChevronRight, Users, Globe, Heart, Church, Sparkles,  Cross, Book } from 'lucide-react';
// import { useEffect, useState, useRef } from 'react';

// // Animated Counter Component
// type AnimatedCounterProps = {
//   end: number;
//   duration?: number;
//   suffix?: string;
// };

// function AnimatedCounter({ end, duration = 2000, suffix = '' }: AnimatedCounterProps) {
//   const [count, setCount] = useState(0);
//   const counterRef = useRef<HTMLSpanElement>(null);
//   const [isVisible, setIsVisible] = useState(false);

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting) {
//           setIsVisible(true);
//         }
//       },
//       { threshold: 0.5 }
//     );

//     if (counterRef.current) {
//       observer.observe(counterRef.current);
//     }

//     return () => observer.disconnect();
//   }, []);

//   useEffect(() => {
//     if (!isVisible) return;

//     let startTime: number;
//     let animationFrame: number;
    
//     const startCount = 0;
//     const endCount = end;
    
//     const animate = (timestamp: number) => {
//       if (!startTime) startTime = timestamp;
//       const progress = timestamp - startTime;
//       const percentage = Math.min(progress / duration, 1);
      
//       // Easing function for smooth animation
//       const easeOutQuart = 1 - Math.pow(1 - percentage, 3);
//       const currentCount = Math.floor(easeOutQuart * endCount);
      
//       setCount(currentCount);
      
//       if (percentage < 1) {
//         animationFrame = requestAnimationFrame(animate);
//       }
//     };
    
//     animationFrame = requestAnimationFrame(animate);
    
//     return () => {
//       if (animationFrame) {
//         cancelAnimationFrame(animationFrame);
//       }
//     };
//   }, [isVisible, end, duration]);

//   return <span ref={counterRef}>{count}{suffix}</span>;
// }

// // Scroll Animation Hook
// function useScrollAnimation() {
//   const elementRefs = useRef<(HTMLElement | null)[]>([]);
  
//   useEffect(() => {
//     const observers: IntersectionObserver[] = [];
    
//     elementRefs.current.forEach((element, index) => {
//       if (element) {
//         const observer = new IntersectionObserver(
//           ([entry]) => {
//             if (entry.isIntersecting) {
//               // Add animation class when entering
//               element.classList.add('animate-in');
//               element.style.opacity = '1';
//               element.style.transform = 'translateY(0)';
//             } else {
//               // Remove animation class when leaving
//               element.classList.remove('animate-in');
//               element.style.opacity = '0';
//               element.style.transform = 'translateY(30px)';
//             }
//           },
//           { threshold: 0.2, rootMargin: '0px' }
//         );
        
//         observer.observe(element);
//         observers.push(observer);
//       }
//     });
    
//     return () => {
//       observers.forEach(observer => observer.disconnect());
//     };
//   }, []);
  
//   return elementRefs;
// }

// // Theme Data Interface
// interface ThemeData {
//   ThemeId: number;
//   Theme: string;
//   Verse: string;
//   Description: string;
//   Year: number;
//   IsActive: boolean;
//   CreatedAt: string;
//   Assembly: string | null;
//   UpdatedAt: string;
//   YearThemeImage: string | null;
// }

// interface ThemeResponse {
//   IsSuccess: boolean;
//   Code: string;
//   Message: string;
//   Data: ThemeData;
// }

// export default function Home() {
//   const [isLoaded, setIsLoaded] = useState(false);
//   const [scrollY, setScrollY] = useState(0);
//   const [themeData, setThemeData] = useState<ThemeData | null>(null);
//   const [themeLoading, setThemeLoading] = useState(true);
//   const [themeError, setThemeError] = useState<string | null>(null);
//   const animationRefs = useScrollAnimation();

//   useEffect(() => {
//     setIsLoaded(true);
    
//     const handleScroll = () => {
//       setScrollY(window.scrollY);
//     };
    
//     window.addEventListener('scroll', handleScroll, { passive: true });
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   // Fetch theme data
//   useEffect(() => {
//     const fetchTheme = async () => {
//       try {
//         setThemeLoading(true);
//         const response = await fetch('https://api.gospelcentresinternational.com/api/Events/GetCurrentYearTheme');
//         if (!response.ok) {
//           throw new Error('Failed to fetch theme');
//         }
//         const data: ThemeResponse = await response.json();
//         if (data.IsSuccess && data.Data) {
//           setThemeData(data.Data);
//         } else {
//           throw new Error(data.Message || 'Failed to load theme');
//         }
//       } catch (error) {
//         console.error('Error fetching theme:', error);
//         setThemeError('Failed to load theme');
//       } finally {
//         setThemeLoading(false);
//       }
//     };

//     fetchTheme();
//   }, []);

//   // Parallax effect for hero section
//   const heroTranslateY = scrollY * 0.5;
//   const heroOpacity = Math.max(1 - scrollY / 700, 0.3);

//   return (
//     <div className="w-full overflow-x-hidden">
//       {/* Hero Section with Parallax */}
//       <section className="relative w-full min-h-screen md:h-[700px] overflow-hidden">
//         <div 
//           className="absolute inset-0 transition-transform duration-300 ease-out"
//           style={{ 
//             transform: `translateY(${heroTranslateY}px)`,
//             opacity: heroOpacity
//           }}
//         >
//           <Image
//             src="/church-hero.jpg"
//             alt="Church Building"
//             fill
//             className="object-cover brightness-50 scale-105"
//             priority
//           />
//         </div>

//         {/* Animated Overlay */}
//         <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50"></div>

//         {/* Animated Background Particles */}
//         <div className="absolute inset-0 overflow-hidden pointer-events-none">
//           <div className="absolute top-10 left-10 w-32 h-32 bg-[#9ec8ea]/20 rounded-full blur-3xl animate-float-slow"></div>
//           <div className="absolute bottom-20 right-20 w-48 h-48 bg-[#9ec8ea]/10 rounded-full blur-3xl animate-float-slower"></div>
//           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse-glow"></div>
//         </div>

//         {/* Hero Content with Staggered Animation */}
//         <div
//           className={`absolute inset-0 flex items-center justify-center px-4 transition-all duration-1000 ${
//             isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
//           }`}
//         >
//           <div className="text-center max-w-5xl">
//             {/* Welcome Badge with Glow */}
//             <div className="animate-float mb-6">
//               <span 
//                 className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105"
//                 style={{ 
//                   backgroundColor: 'rgba(158, 200, 234, 0.15)',
//                   color: '#9ec8ea',
//                   border: '1px solid rgba(158, 200, 234, 0.3)',
//                   backdropFilter: 'blur(10px)',
//                 }}
//               >
//                 <Sparkles className="w-4 h-4 animate-pulse" />
//                 Welcome to GCI Church
//                 <Sparkles className="w-4 h-4 animate-pulse" />
//               </span>
//             </div>

//             {/* Theme Display with Animation */}
//             {themeLoading ? (
//               <div className="animate-pulse">
//                 <div className="h-12 w-64 mx-auto bg-white/10 rounded-lg mb-4"></div>
//                 <div className="h-8 w-48 mx-auto bg-white/10 rounded-lg"></div>
//               </div>
//             ) : themeError ? (
//               <div className="text-white/70 text-lg">
//                 <span className="inline-block px-4 py-2 bg-red-500/20 rounded-lg">
//                   {themeError}
//                 </span>
//               </div>
//             ) : themeData ? (
//               <div className="space-y-4 mb-8">
//                 {/* Theme Badge */}
//                 <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#9ec8ea]/20 to-[#845c33]/20 backdrop-blur-sm border border-white/10">
//                   <Book className="w-4 h-4 text-[#9ec8ea]" />
//                   <span className="text-white/70 text-sm font-medium">Year Theme {themeData.Year}</span>
//                 </div>

//                 {/* Main Theme with Animated Gradient */}
//                 <div className="relative">
//                   <h1 
//                     className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight animate-gradient-text"
//                     style={{
//                       background: 'linear-gradient(135deg, #9ec8ea 0%, #845c33 30%, #9ec8ea 60%, #845c33 100%)',
//                       backgroundSize: '300% 300%',
//                       WebkitBackgroundClip: 'text',
//                       WebkitTextFillColor: 'transparent',
//                       backgroundClip: 'text',
//                     }}
//                   >
//                     {themeData.Theme}
//                   </h1>
//                 </div>

//                 {/* Verse with Animated Border */}
//                 <div className="relative inline-block">
//                   <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#9ec8ea]/30 to-[#845c33]/30 blur-xl animate-pulse-glow"></div>
//                   <p 
//                     className="relative text-lg md:text-xl text-white/90 font-medium px-6 py-3 rounded-lg backdrop-blur-sm border border-white/10"
//                     style={{
//                       background: 'rgba(0,0,0,0.2)',
//                       backdropFilter: 'blur(10px)',
//                     }}
//                   >
//                     <span className="text-[#9ec8ea]">📖</span> {themeData.Verse}
//                   </p>
//                 </div>

//                 {/* Description with Fade In */}
//                 <div className="max-w-2xl mx-auto">
//                   <p 
//                     className="text-white/80 text-sm md:text-base leading-relaxed px-4 py-3 rounded-lg backdrop-blur-sm border border-white/5"
//                     style={{
//                       background: 'rgba(0,0,0,0.15)',
//                       backdropFilter: 'blur(10px)',
//                     }}
//                   >
//                     {themeData.Description}
//                   </p>
//                 </div>
//               </div>
//             ) : null}

//             {/* Original Hero Elements - Replaced with Theme */}
//             <div className="flex flex-wrap justify-center gap-3 text-sm md:text-base text-white/80 mb-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
//               <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm">
//                 <Cross className="w-4 h-4 text-[#9ec8ea]" />
//                 Evangelism
//               </span>
//               <span className="text-[#9ec8ea] text-xl">•</span>
//               <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm">
//                 <Book className="w-4 h-4 text-[#9ec8ea]" />
//                 Discipleship
//               </span>
//               <span className="text-[#9ec8ea] text-xl">•</span>
//               <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm">
//                 <Users className="w-4 h-4 text-[#9ec8ea]" />
//                 Leadership
//               </span>
//             </div>

//             {/* CTA Buttons */}
//             <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
//               <Link
//                 href="/contact"
//                 className="group inline-flex items-center gap-2 px-8 py-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl relative overflow-hidden"
//                 style={{
//                   backgroundColor: '#9ec8ea',
//                   color: '#845c33',
//                 }}
//               >
//                 <span className="relative z-10">Get in Touch</span>
//                 <ChevronRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 relative z-10" />
//                 <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
//               </Link>
              
//               <Link
//                 href="/assemblies"
//                 className="group inline-flex items-center gap-2 px-8 py-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 relative overflow-hidden"
//                 style={{
//                   borderColor: '#9ec8ea',
//                   color: 'white',
//                 }}
//               >
//                 <span className="relative z-10">Find Assemblies</span>
//                 <ChevronRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 relative z-10" />
//                 <div className="absolute inset-0 bg-[#9ec8ea] opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
//               </Link>
//             </div>
//           </div>
//         </div>

//         {/* Scroll Indicator */}
//         <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
//           <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
//             <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-scroll"></div>
//           </div>
//         </div>
//       </section>

//       {/* Stats Section with Animated Counters */}
//       <section className="py-16 md:py-20 px-4 relative" style={{ backgroundColor: '#f9f7f4' }}>
//         <div className="max-w-6xl mx-auto">
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
//             {[
//               { icon: <Globe className="w-8 h-8" />, end: 50, label: 'Countries', suffix: '+' },
//               { icon: <Church className="w-8 h-8" />, end: 200, label: 'Assemblies', suffix: '+' },
//               { icon: <Users className="w-8 h-8" />, end: 10000, label: 'Members', suffix: '+' },
//               { icon: <Heart className="w-8 h-8" />, end: 25, label: 'Years', suffix: '' },
//             ].map((stat, index) => (
//               <div
//                 key={index}
//                 ref={(el) => { if (el) animationRefs.current[index] = el; }}
//                 className="text-center p-6 rounded-xl transition-all duration-700 hover:shadow-xl opacity-0 translate-y-8"
//                 style={{ 
//                   backgroundColor: 'white',
//                   transitionDelay: `${index * 100}ms`,
//                 }}
//               >
//                 <div 
//                   className="inline-flex p-4 rounded-full mb-4 transition-all duration-500 hover:scale-110 hover:rotate-6"
//                   style={{ backgroundColor: '#9ec8ea20', color: '#9ec8ea' }}
//                 >
//                   {stat.icon}
//                 </div>
//                 <div className="text-3xl md:text-4xl font-bold mb-2" style={{ color: '#845c33' }}>
//                   <AnimatedCounter end={stat.end} suffix={stat.suffix} />
//                 </div>
//                 <div className="text-sm md:text-base text-gray-600">{stat.label}</div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Mission/Vision Section with Cards */}
//       <section className="py-20 md:py-28 px-4 bg-white">
//         <div className="max-w-6xl mx-auto">
//           <div className="text-center mb-16">
//             <span 
//               className="inline-block px-6 py-3 rounded-full text-sm font-semibold mb-4 shadow-md"
//               style={{ backgroundColor: '#9ec8ea20', color: '#9ec8ea' }}
//             >
//               ✨ Our Foundation ✨
//             </span>
//             <h2
//               className="text-3xl md:text-5xl font-bold mb-4"
//               style={{ color: '#845c33' }}
//             >
//               Mission, Vision & Faith
//             </h2>
//             <div className="w-24 h-1 mx-auto rounded-full" style={{ backgroundColor: '#9ec8ea' }}></div>
//           </div>

//           <div className="grid md:grid-cols-3 gap-8">
//             {[
//               {
//                 title: 'VISION',
//                 description: 'The Great Commission Fulfilled with Excellence.',
//                 icon: '🌟',
//                 gradient: 'from-blue-400 to-blue-600',
//               },
//               {
//                 title: 'MISSION',
//                 description: 'An International Church that excels in Evangelizing the World, Discipling Believers and Raising Leaders.',
//                 icon: '📖',
//                 gradient: 'from-green-400 to-green-600',
//               },
//               {
//                 title: 'STATEMENT OF FAITH',
//                 description: 'An International Church that excels in Evangelizing the World, Discipling Believers and Raising Leaders',
//                 icon: '🙏',
//                 gradient: 'from-purple-400 to-purple-600',
//               },
//             ].map((item, index) => (
//               <div
//                 key={index}
//                 ref={(el) => { if (el) animationRefs.current[index + 4] = el; }}
//                 className="group relative p-8 rounded-2xl transition-all duration-700 hover:scale-105 hover:-translate-y-2 opacity-0 translate-y-8 overflow-hidden"
//                 style={{
//                   backgroundColor: '#f9f7f4',
//                   boxShadow: '0 10px 30px -15px rgba(0,0,0,0.2)',
//                   transitionDelay: `${index * 150}ms`,
//                 }}
//               >
//                 {/* Hover Effect Background */}
//                 <div 
//                   className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
//                   style={{
//                     background: `linear-gradient(135deg, #9ec8ea15 0%, #9ec8ea25 100%)`,
//                   }}
//                 ></div>
                
//                 {/* Icon with Animation */}
//                 <div 
//                   className="text-5xl mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 relative z-10"
//                 >
//                   {item.icon}
//                 </div>
                
//                 {/* Decorative Line */}
//                 <div 
//                   className="w-16 h-1 mb-4 rounded-full transition-all duration-500 group-hover:w-24 relative z-10"
//                   style={{ backgroundColor: '#9ec8ea' }}
//                 ></div>
                
//                 <h3 
//                   className="text-2xl font-bold mb-4 transition-all duration-300 group-hover:text-[#9ec8ea] relative z-10"
//                   style={{ color: '#845c33' }}
//                 >
//                   {item.title}
//                 </h3>
                
//                 <p className="text-gray-700 leading-relaxed relative z-10">
//                   {item.description}
//                 </p>

//                 {/* Corner Accent */}
//                 <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden">
//                   <div 
//                     className="absolute top-0 right-0 w-20 h-20 bg-[#9ec8ea] transform rotate-45 translate-x-10 -translate-y-10 group-hover:translate-x-6 group-hover:-translate-y-6 transition-transform duration-500"
//                     style={{ opacity: 0.1 }}
//                   ></div>
//                 </div>

//                 {/* Floating Particles */}
//                 <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#9ec8ea] to-transparent opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* CTA Section with Animation */}
//       <section
//         className="py-24 md:py-32 px-4 relative overflow-hidden"
//         style={{ backgroundColor: '#9ec8ea' }}
//       >
//         {/* Animated Background Pattern */}
//         <div className="absolute inset-0 opacity-10">
//           <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
//           <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2 animate-pulse delay-1000"></div>
//           <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-white rounded-full animate-ping opacity-20"></div>
//         </div>

//         <div className="max-w-4xl mx-auto text-center relative z-10">
//           <div
//             ref={(el) => { if (el) animationRefs.current[7] = el; }}
//             className="opacity-0 translate-y-8 transition-all duration-700"
//           >
//             <h2 
//               className="text-4xl md:text-6xl font-bold mb-6"
//               style={{ color: '#845c33' }}
//             >
//               Join Our Community
//             </h2>
            
//             <p 
//               className="text-lg md:text-xl mb-10 max-w-2xl mx-auto"
//               style={{ color: '#845c33' }}
//             >
//               Find local assemblies near you and become part of our growing faith community
//             </p>
            
//             <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
//               <Link
//                 href="/assemblies"
//                 className="group inline-flex items-center gap-2 px-8 py-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl relative overflow-hidden"
//                 style={{
//                   backgroundColor: '#845c33',
//                   color: 'white',
//                 }}
//               >
//                 <span className="relative z-10">Explore Assemblies</span>
//                 <ChevronRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 relative z-10" />
//                 <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
//               </Link>
              
//               <Link
//                 href="/about"
//                 className="group inline-flex items-center gap-2 px-8 py-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105 border-2 relative overflow-hidden"
//                 style={{
//                   borderColor: '#845c33',
//                   color: '#845c33',
//                 }}
//               >
//                 <span className="relative z-10">Learn More About Us</span>
//                 <ChevronRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 relative z-10" />
//                 <div className="absolute inset-0 bg-[#845c33] opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
//               </Link>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Add custom animations to your global CSS file */}
//       <style jsx global>{`
//         @keyframes float {
//           0%, 100% { transform: translateY(0px); }
//           50% { transform: translateY(-10px); }
//         }
        
//         .animate-float {
//           animation: float 3s ease-in-out infinite;
//         }

//         @keyframes float-slow {
//           0%, 100% { transform: translateY(0px) scale(1); }
//           50% { transform: translateY(-20px) scale(1.1); }
//         }

//         .animate-float-slow {
//           animation: float-slow 6s ease-in-out infinite;
//         }

//         @keyframes float-slower {
//           0%, 100% { transform: translateY(0px) scale(1); }
//           50% { transform: translateY(15px) scale(0.9); }
//         }

//         .animate-float-slower {
//           animation: float-slower 8s ease-in-out infinite;
//         }

//         @keyframes pulse-glow {
//           0%, 100% { opacity: 0.3; transform: scale(1); }
//           50% { opacity: 0.6; transform: scale(1.2); }
//         }

//         .animate-pulse-glow {
//           animation: pulse-glow 4s ease-in-out infinite;
//         }
        
//         @keyframes scroll {
//           0% { transform: translateY(0); opacity: 1; }
//           100% { transform: translateY(20px); opacity: 0; }
//         }
        
//         .animate-scroll {
//           animation: scroll 2s ease-in-out infinite;
//         }
        
//         .delay-1000 {
//           animation-delay: 1000ms;
//         }
        
//         .text-balance {
//           text-wrap: balance;
//         }
        
//         .animate-in {
//           opacity: 1 !important;
//           transform: translateY(0) !important;
//         }
        
//         .bg-gradient-to-r {
//           background-size: 200% 200%;
//           animation: gradient 3s ease infinite;
//         }
        
//         @keyframes gradient {
//           0% { background-position: 0% 50%; }
//           50% { background-position: 100% 50%; }
//           100% { background-position: 0% 50%; }
//         }

//         @keyframes gradient-text {
//           0% { background-position: 0% 50%; }
//           50% { background-position: 100% 50%; }
//           100% { background-position: 0% 50%; }
//         }

//         .animate-gradient-text {
//           background-size: 300% 300%;
//           animation: gradient-text 4s ease-in-out infinite;
//         }

//         @keyframes fade-in-up {
//           from {
//             opacity: 0;
//             transform: translateY(20px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }

//         .animate-fade-in-up {
//           animation: fade-in-up 0.8s ease-out forwards;
//           opacity: 0;
//         }

//         .animate-fade-in-up:nth-child(1) { animation-delay: 0.1s; }
//         .animate-fade-in-up:nth-child(2) { animation-delay: 0.2s; }
//         .animate-fade-in-up:nth-child(3) { animation-delay: 0.3s; }
//       `}</style>
//     </div>
//   );
// }
