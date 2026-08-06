"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import {
  ChevronRight,
  Users,
  Heart,
  Globe,
  Cross,
  BookOpen,
  Church as ChurchIcon,
  User,
  Target,
  Eye,
  Award,
  Sparkles,
} from "lucide-react";

interface TitlePrefix {
  Id: number;
  Title: string;
  Description: string;
  IsActive: boolean;
  CreatedAt: string;
  UpdatedAt: string | null;
}

interface BoardMember {
  GECId: number;
  MemberId: number;
  PositionTitle: string;
  GECPositionId: number;
  TitlePrefixId: number | null;
  TitlePrefix: TitlePrefix | null;
  Bio: string;
  StartDate: string;
  EndDate: string | null;
  IsActive: boolean;
  CreatedAt: string;
  Photo: string | null;
  FullName: string;
  Phone: string;
  Email: string;
  Gender: string | null;
}

interface BoardApiResponse {
  IsSuccess: boolean;
  Code: string;
  Message: string | null;
  Data: BoardMember[];
}

interface ChurchProfile {
  Id: number;
  Title: string;
  Content: string;
  IsActive: boolean;
  DisplayOrder: number;
  CreatedAt: string;
  UpdatedAt: string | null;
}

interface ProfileApiResponse {
  IsSuccess: boolean;
  Code: string;
  Message: string | null;
  Data: {
    Profiles: ChurchProfile[];
  };
}

export default function AboutPage() {
  const [boardMembers, setBoardMembers] = useState<BoardMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  const [profiles, setProfiles] = useState<ChurchProfile[]>([]);
  const [profilesLoading, setProfilesLoading] = useState(true);
  
  // Use refs for animation
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Setup intersection observer for scroll animations
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
            (entry.target as HTMLElement).style.opacity = "1";
            (entry.target as HTMLElement).style.transform = "translateY(0)";
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px" }
    );

    sectionRefs.current.forEach((element) => {
      if (element) {
        observerRef.current?.observe(element);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [boardMembers, profiles]);

  useEffect(() => {
    setIsLoaded(true);

    const fetchBoardMembers = async () => {
      try {
        const response = await fetch("https://api.gospelcentresinternational.com/GetGECMembers");
        if (!response.ok) {
          throw new Error("Failed to fetch board members");
        }
        const data: BoardApiResponse = await response.json();
        
        if (data.IsSuccess && data.Data) {
          setBoardMembers(data.Data);
        } else {
          throw new Error(data.Message || "Failed to load board members");
        }
      } catch (err) {
        console.error("Error fetching board members:", err);
        setError("Failed to load board members");
      } finally {
        setLoading(false);
      }
    };

    const fetchProfiles = async () => {
      try {
        setProfilesLoading(true);
        const response = await fetch("https://api.gospelcentresinternational.com/GetChurchProfiles");
        if (!response.ok) {
          throw new Error("Failed to fetch church profiles");
        }
        const data: ProfileApiResponse = await response.json();
        
        if (data.IsSuccess && data.Data && data.Data.Profiles) {
          setProfiles(data.Data.Profiles);
        } else {
          throw new Error(data.Message || "Failed to load church profiles");
        }
      } catch (err) {
        console.error("Error fetching church profiles:", err);
      } finally {
        setProfilesLoading(false);
      }
    };

    fetchBoardMembers();
    fetchProfiles();
  }, []);

  const handleImageError = (memberId: number) => {
    setImageErrors(prev => ({ ...prev, [memberId]: true }));
  };

  const setSectionRef = useCallback((index: number) => (el: HTMLElement | null) => {
    if (el) {
      sectionRefs.current[index] = el;
      if (observerRef.current) {
        observerRef.current.observe(el);
      }
    }
  }, []);

  const getDisplayName = (member: BoardMember) => {
    if (member.TitlePrefix) {
      return `${member.TitlePrefix.Title} ${member.FullName}`;
    }
    return member.FullName;
  };

  const getPositionTitle = (member: BoardMember) => {
    return member.PositionTitle || "Board Member";
  };

  const getPhotoUrl = (member: BoardMember) => {
    if (!member.Photo) return null;
    if (member.Photo.startsWith('/9j/')) {
      return `data:image/jpeg;base64,${member.Photo}`;
    }
    return member.Photo;
  };

  const renderMemberAvatar = (member: BoardMember) => {
    const photoUrl = getPhotoUrl(member);
    
    if (!photoUrl || imageErrors[member.GECId]) {
      const initial = member.FullName.charAt(0).toUpperCase();
      return (
        <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-white shadow-xl transform group-hover:scale-105 transition-transform duration-500 bg-gradient-to-br from-[#845c33] to-[#9ec8ea] flex items-center justify-center">
          <span className="text-4xl font-bold text-white">{initial}</span>
        </div>
      );
    }

    return (
      <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-white shadow-xl transform group-hover:scale-105 transition-transform duration-500">
        <img
          src={photoUrl}
          alt={member.FullName}
          className="w-full h-full object-cover"
          onError={() => handleImageError(member.GECId)}
        />
      </div>
    );
  };

  const getProfileContent = (title: string): string => {
    const profile = profiles.find(p => p.Title.toLowerCase() === title.toLowerCase());
    return profile ? profile.Content : '';
  };

  const parseCoreValues = (content: string) => {
    if (!content) return [];
    
    const lines = content.split('\n').filter(line => line.trim());
    const values: { title: string; description: string }[] = [];
    
    let currentTitle = '';
    let currentDescription = '';
    
    for (const line of lines) {
      const match = line.match(/^\d+\.\s*(.+?)(?::\s*|$)/);
      if (match) {
        if (currentTitle) {
          values.push({ title: currentTitle, description: currentDescription.trim() || '' });
        }
        currentTitle = match[1].trim();
        currentDescription = '';
      } else if (currentTitle && line.trim()) {
        if (currentDescription) {
          currentDescription += ' ' + line.trim();
        } else {
          currentDescription = line.trim();
        }
      }
    }
    
    if (currentTitle) {
      values.push({ title: currentTitle, description: currentDescription.trim() || '' });
    }
    
    return values;
  };

  const visionContent = getProfileContent('Our Vision');
  const missionContent = getProfileContent('Our Mission');
  const introContent = getProfileContent('INTRO');
  const coreValuesContent = getProfileContent('CORE VALUES');
  const coreValues = parseCoreValues(coreValuesContent);

  // Fallback core values if API doesn't return them
  const fallbackCoreValues = [
    { title: "The Word", description: "We believe that the Bible is our all-sufficient rule of faith and practice." },
    { title: "Excellence", description: "We endeavor to be outstandingly good or proficient in all that we do, in service to God and others." },
    { title: "Holiness", description: "We adhere to moral principles of soundness of living and total devotion to God." },
    { title: "Unity", description: "We recognize serving together in a spirit of unity, accountability, and cooperation." },
    { title: "Family", description: "We are committed to God's ordained unit of marriage and family and faithfulness to it." },
    { title: "Diversity", description: "We respect differences and draw strength from diversity, understanding God's original divine purpose for creation." },
    { title: "Honour", description: "We uphold submission to spiritual authority and governing bodies and honour them in our service to God and others." }
  ];

  const displayCoreValues = coreValues.length > 0 ? coreValues : fallbackCoreValues;

  return (
    <div className="w-full overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative w-full h-[500px] md:h-[600px] overflow-hidden">
        <div className="absolute inset-0 transition-transform duration-300 ease-out scale-105">
          <div className="absolute inset-0 bg-gradient-to-b from-[#845c33]/80 to-[#845c33]/90"></div>
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-20 left-10 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#9ec8ea] rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>
        </div>

        <div
          className={`absolute inset-0 flex items-center justify-center px-4 transition-all duration-1000 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="text-center max-w-4xl">
            <span
              className="inline-block px-6 py-3 rounded-full text-sm font-semibold mb-8 shadow-lg animate-float"
              style={{ backgroundColor: "#9ec8ea", color: "#845c33" }}
            >
              ✝️ Since 1998 ✝️
            </span>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              About{" "}
              <span className="relative">
                <span className="relative z-10" style={{ color: "#9ec8ea" }}>
                  Gospel Centres
                </span>
              </span>
              <br />
              <span className="text-white">International</span>
            </h1>

            <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              {introContent || "A 21st Century evangelical and missional oriented ministry dedicated to advancing and enhancing God's Kingdom in every nation of the world."}
            </p>

            <div className="flex flex-wrap gap-4 justify-center mt-10">
              <div className="flex items-center gap-2 text-white/80">
                <ChurchIcon className="w-5 h-5" style={{ color: "#9ec8ea" }} />
                <span>47 Counties</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <Users className="w-5 h-5" style={{ color: "#9ec8ea" }} />
                <span>Global Network</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <Heart className="w-5 h-5" style={{ color: "#9ec8ea" }} />
                <span>Since 1998</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Statement Section */}
      <section className="py-20 md:py-28 px-4 relative overflow-hidden bg-white">
        <div className="absolute top-0 right-0 w-96 h-96 opacity-5">
          <Cross className="w-full h-full" style={{ color: "#845c33" }} />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div ref={setSectionRef(0)} className="opacity-0 translate-y-8 transition-all duration-700">
            <span
              className="inline-block px-4 py-2 rounded-full text-sm font-semibold mb-6"
              style={{ backgroundColor: "#9ec8ea20", color: "#9ec8ea" }}
            >
              Our Calling
            </span>

            <h2
              className="text-3xl md:text-4xl font-bold mb-8 leading-relaxed"
              style={{ color: "#845c33" }}
            >
              "Go therefore and make disciples of all nations,
              <br />
              baptizing them in the name of the Father and of the Son and of the
              Holy Spirit"
            </h2>

            <p className="text-gray-600 text-lg mb-4">— Matthew 28:19-20</p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 relative" style={{ backgroundColor: "#f9f7f4" }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              { icon: <ChurchIcon className="w-8 h-8" />, number: "47", label: "Counties by 2030" },
              { icon: <Globe className="w-8 h-8" />, number: "1", label: "Countries" },
              { icon: <Users className="w-8 h-8" />, number: "200+", label: "Assemblies" },
              { icon: <Heart className="w-8 h-8" />, number: "25+", label: "Years of Service" },
            ].map((stat, index) => (
              <div
                key={index}
                ref={setSectionRef(index + 1)}
                className="text-center p-6 rounded-xl transition-all duration-500 hover:shadow-xl opacity-0 translate-y-8 group"
                style={{ backgroundColor: "white", transitionDelay: `${index * 100}ms` }}
              >
                <div
                  className="inline-flex p-4 rounded-full mb-4 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6"
                  style={{ backgroundColor: "#9ec8ea20", color: "#9ec8ea" }}
                >
                  {stat.icon}
                </div>
                <div className="text-3xl md:text-4xl font-bold mb-2" style={{ color: "#845c33" }}>
                  {stat.number}
                </div>
                <div className="text-sm md:text-base text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 md:py-28 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
            <div ref={setSectionRef(5)} className="opacity-0 translate-y-8 transition-all duration-700 group">
              <div className="relative">
                <div className="absolute -top-6 -left-6 w-20 h-20 opacity-10">
                  <Target className="w-full h-full" style={{ color: "#845c33" }} />
                </div>
                <div className="relative z-10">
                  <span
                    className="inline-block px-4 py-2 rounded-full text-sm font-semibold mb-6"
                    style={{ backgroundColor: "#9ec8ea20", color: "#9ec8ea" }}
                  >
                    Our Purpose
                  </span>
                  <h2 className="text-3xl md:text-4xl font-bold mb-6 relative" style={{ color: "#845c33" }}>
                    Our Mission
                    <div className="w-20 h-1 mt-2 rounded-full" style={{ backgroundColor: "#9ec8ea" }}></div>
                  </h2>
                  {profilesLoading ? (
                    <div className="animate-pulse space-y-4">
                      <div className="h-20 bg-gray-200 rounded-lg"></div>
                    </div>
                  ) : (
                    <p className="text-gray-700 leading-relaxed text-lg">
                      {missionContent || "To proclaim the Gospel of Jesus Christ and make disciples who become leaders in their communities, transforming lives through the power of God's word and the Holy Spirit."}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div ref={setSectionRef(6)} className="opacity-0 translate-y-8 transition-all duration-700 group" style={{ transitionDelay: "200ms" }}>
              <div className="relative">
                <div className="absolute -top-6 -right-6 w-20 h-20 opacity-10">
                  <Eye className="w-full h-full" style={{ color: "#845c33" }} />
                </div>
                <div className="relative z-10">
                  <span
                    className="inline-block px-4 py-2 rounded-full text-sm font-semibold mb-6"
                    style={{ backgroundColor: "#9ec8ea20", color: "#9ec8ea" }}
                  >
                    Our Future
                  </span>
                  <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: "#845c33" }}>
                    Our Vision
                    <div className="w-20 h-1 mt-2 rounded-full" style={{ backgroundColor: "#9ec8ea" }}></div>
                  </h2>
                  {profilesLoading ? (
                    <div className="animate-pulse space-y-4">
                      <div className="h-20 bg-gray-200 rounded-lg"></div>
                    </div>
                  ) : (
                    <p className="text-gray-700 leading-relaxed text-lg">
                      {visionContent || "To see a vibrant network of churches united in faith, purpose, and missional focus, impacting every nation with the message of Christ's redemption."}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="py-20 md:py-28 px-4 relative overflow-hidden" style={{ backgroundColor: "#f9f7f4" }}>
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-64 h-64 rounded-full" style={{ backgroundColor: "#9ec8ea" }}></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full" style={{ backgroundColor: "#845c33" }}></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <span
              className="inline-block px-6 py-3 rounded-full text-sm font-semibold mb-4 shadow-md"
              style={{ backgroundColor: "#9ec8ea20", color: "#9ec8ea" }}
            >
              👥 Our Leadership 👥
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: "#845c33" }}>
              General Executive Council
            </h2>
            <div className="w-24 h-1 mx-auto rounded-full" style={{ backgroundColor: "#9ec8ea" }}></div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mt-6">
              Gospel Centres International is governed through a structured
              leadership, led by the General Overseer together with an executive
              board of elders.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div
                className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-t-transparent"
                style={{ borderColor: "#9ec8ea", borderTopColor: "transparent" }}
              ></div>
              <p className="text-xl mt-4" style={{ color: "#845c33" }}>Loading board members...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-xl text-red-600">{error}</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {boardMembers.map((member, index) => (
                <div
                  key={member.GECId}
                  ref={setSectionRef(index + 7)}
                  className="rounded-2xl shadow-lg overflow-hidden transition-all duration-700 hover:shadow-2xl hover:-translate-y-2 opacity-0 translate-y-8 group bg-white"
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  <div className="p-8 text-center relative overflow-hidden" style={{ backgroundColor: "#9ec8ea" }}>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative z-10">{renderMemberAvatar(member)}</div>
                    <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10 group-hover:translate-y-0 group-hover:translate-x-0 transition-transform duration-700"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-16 -translate-x-16 group-hover:translate-y-0 group-hover:translate-x-0 transition-transform duration-700"></div>
                  </div>

                  <div className="p-6 text-center">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-[#9ec8ea] transition-colors duration-300" style={{ color: "#845c33" }}>
                      {getDisplayName(member)}
                    </h3>
                    <p
                      className="font-semibold mb-4 inline-block px-4 py-1 rounded-full text-sm"
                      style={{ backgroundColor: "#9ec8ea20", color: "#9ec8ea" }}
                    >
                      {getPositionTitle(member)}
                    </p>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {member.Bio || "Serving the Lord faithfully."}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Core Values Section - Updated for Alignment */}
      <section className="py-20 md:py-28 px-4 bg-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute top-0 left-0 w-full h-full"
            style={{
              backgroundImage: "radial-gradient(circle at 2px 2px, #845c33 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          ></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <span
              className="inline-block px-6 py-3 rounded-full text-sm font-semibold mb-4 shadow-md"
              style={{ backgroundColor: "#9ec8ea20", color: "#9ec8ea" }}
            >
              💫 Our Foundation 💫
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: "#845c33" }}>
              Core Values
            </h2>
            <div className="w-24 h-1 mx-auto rounded-full" style={{ backgroundColor: "#9ec8ea" }}></div>
          </div>

          {profilesLoading ? (
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-2xl"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {displayCoreValues.map((value, index) => (
                <div
                  key={index}
                  ref={setSectionRef(index + 13)}
                  className="flex flex-col p-8 rounded-2xl text-center transition-all duration-700 hover:scale-105 hover:-translate-y-2 opacity-0 translate-y-8 group h-full"
                  style={{
                    backgroundColor: "#9ec8ea",
                    transitionDelay: `${index * 100}ms`,
                    minHeight: "220px",
                  }}
                >
                  <div
                    className="text-5xl mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 flex-shrink-0"
                    style={{ color: "#845c33" }}
                  >
                    <Award className="w-12 h-12 mx-auto" />
                  </div>
                  <h3
                    className="text-2xl font-bold mb-3 group-hover:scale-105 transition-transform duration-300 flex-shrink-0"
                    style={{ color: "#845c33" }}
                  >
                    {value.title}
                  </h3>
                  <div className="flex-1 flex items-center">
                    {value.description && (
                      <p className="text-gray-700">{value.description}</p>
                    )}
                  </div>
                  <div
                    className="w-0 h-1 mx-auto mt-4 rounded-full group-hover:w-16 transition-all duration-500 flex-shrink-0"
                    style={{ backgroundColor: "#845c33" }}
                  ></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-24 px-4 relative overflow-hidden" style={{ backgroundColor: "#845c33" }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2 animate-pulse delay-1000"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div ref={setSectionRef(16)} className="opacity-0 translate-y-8 transition-all duration-700">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Join Us in Our Mission
            </h2>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
              Be part of a growing community dedicated to fulfilling the Great Commission
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 px-8 py-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl relative overflow-hidden"
                style={{ backgroundColor: "#9ec8ea", color: "#845c33" }}
              >
                <span className="relative z-10">Contact Us Today</span>
                <ChevronRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 relative z-10" />
                <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-20 transition-opacity duration-300"></div>
              </Link>
              <Link
                href="/assemblies"
                className="group inline-flex items-center gap-2 px-8 py-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105 border-2 border-white relative overflow-hidden"
                style={{ color: "white" }}
              >
                <span className="relative z-10">Find an Assembly</span>
                <ChevronRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 relative z-10" />
                <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-20 transition-opacity duration-300"></div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-in {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }

        .delay-1000 {
          animation-delay: 1000ms;
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.8; }
        }

        .animate-pulse {
          animation: pulse 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

// "use client";

// import { useEffect, useState, useRef, useCallback } from "react";
// import Link from "next/link";
// import {
//   ChevronRight,
//   Users,
//   Heart,
//   Globe,
//   Cross,
//   BookOpen,
//   Church as ChurchIcon,
//   User,
// } from "lucide-react";

// interface TitlePrefix {
//   Id: number;
//   Title: string;
//   Description: string;
//   IsActive: boolean;
//   CreatedAt: string;
//   UpdatedAt: string | null;
// }

// interface BoardMember {
//   GECId: number;
//   MemberId: number;
//   PositionTitle: string;
//   GECPositionId: number;
//   TitlePrefixId: number | null;
//   TitlePrefix: TitlePrefix | null;
//   Bio: string;
//   StartDate: string;
//   EndDate: string | null;
//   IsActive: boolean;
//   CreatedAt: string;
//   Photo: string | null;
//   FullName: string;
//   Phone: string;
//   Email: string;
//   Gender: string | null;
// }

// interface ApiResponse {
//   IsSuccess: boolean;
//   Code: string;
//   Message: string | null;
//   Data: BoardMember[];
// }

// export default function AboutPage() {
//   const [boardMembers, setBoardMembers] = useState<BoardMember[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [isLoaded, setIsLoaded] = useState(false);
//   const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  
//   // Use refs for animation
//   const sectionRefs = useRef<(HTMLElement | null)[]>([]);
//   const observerRef = useRef<IntersectionObserver | null>(null);

//   // Setup intersection observer for scroll animations
//   useEffect(() => {
//     observerRef.current = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           if (entry.isIntersecting) {
//             entry.target.classList.add("animate-in");
//             // Also set inline styles as backup
//             (entry.target as HTMLElement).style.opacity = "1";
//             (entry.target as HTMLElement).style.transform = "translateY(0)";
//           }
//         });
//       },
//       { threshold: 0.2, rootMargin: "0px" }
//     );

//     // Observe all elements with refs
//     sectionRefs.current.forEach((element) => {
//       if (element) {
//         observerRef.current?.observe(element);
//       }
//     });

//     return () => {
//       if (observerRef.current) {
//         observerRef.current.disconnect();
//       }
//     };
//   }, [boardMembers]); // Re-run when boardMembers change

//   useEffect(() => {
//     setIsLoaded(true);

//     const fetchBoardMembers = async () => {
//       try {
//         const response = await fetch("https://api.gospelcentresinternational.com/GetGECMembers");
//         if (!response.ok) {
//           throw new Error("Failed to fetch board members");
//         }
//         const data: ApiResponse = await response.json();
//         console.log("Board members data:", data);
        
//         if (data.IsSuccess && data.Data) {
//           setBoardMembers(data.Data);
//         } else {
//           throw new Error(data.Message || "Failed to load board members");
//         }
//       } catch (err) {
//         console.error("Error fetching board members:", err);
//         setError("Failed to load board members");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBoardMembers();
//   }, []);

//   const handleImageError = (memberId: number) => {
//     console.log(`Image failed to load for member ${memberId}`);
//     setImageErrors(prev => ({ ...prev, [memberId]: true }));
//   };

//   // Function to set refs
//   const setSectionRef = useCallback((index: number) => (el: HTMLElement | null) => {
//     if (el) {
//       sectionRefs.current[index] = el;
//       // Initial opacity is set via className, but we ensure it's visible if already in view
//       if (observerRef.current) {
//         observerRef.current.observe(el);
//       }
//     }
//   }, []);

//   // Get display name with title prefix
//   const getDisplayName = (member: BoardMember) => {
//     if (member.TitlePrefix) {
//       return `${member.TitlePrefix.Title} ${member.FullName}`;
//     }
//     return member.FullName;
//   };

//   // Get position title with fallback
//   const getPositionTitle = (member: BoardMember) => {
//     return member.PositionTitle || "Board Member";
//   };

//   // Get photo URL
//   const getPhotoUrl = (member: BoardMember) => {
//     if (!member.Photo) return null;
//     // Check if it's a base64 image (starts with /9j/)
//     if (member.Photo.startsWith('/9j/')) {
//       return `data:image/jpeg;base64,${member.Photo}`;
//     }
//     // If it's a regular URL or path
//     return member.Photo;
//   };

//   // Function to render member avatar
//   const renderMemberAvatar = (member: BoardMember) => {
//     const photoUrl = getPhotoUrl(member);
    
//     // If no photo or we have an image error
//     if (!photoUrl || imageErrors[member.GECId]) {
//       // Use first letter of name as avatar
//       const initial = member.FullName.charAt(0).toUpperCase();
//       return (
//         <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-white shadow-xl transform group-hover:scale-105 transition-transform duration-500 bg-gradient-to-br from-[#845c33] to-[#9ec8ea] flex items-center justify-center">
//           <span className="text-4xl font-bold text-white">{initial}</span>
//         </div>
//       );
//     }

//     // Try to load the image with regular img tag
//     return (
//       <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-white shadow-xl transform group-hover:scale-105 transition-transform duration-500">
//         <img
//           src={photoUrl}
//           alt={member.FullName}
//           className="w-full h-full object-cover"
//           onError={() => handleImageError(member.GECId)}
//         />
//       </div>
//     );
//   };

//   return (
//     <div className="w-full overflow-x-hidden">
//       {/* Hero Section with Parallax */}
//       <section className="relative w-full h-[500px] md:h-[600px] overflow-hidden">
//         <div
//           className="absolute inset-0 transition-transform duration-300 ease-out"
//           style={{
//             transform: `scale(1.1)`,
//           }}
//         >
//           <div className="absolute inset-0 bg-gradient-to-b from-[#845c33]/80 to-[#845c33]/90"></div>
//           <div className="absolute inset-0 opacity-20">
//             <div className="absolute top-20 left-10 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse"></div>
//             <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#9ec8ea] rounded-full blur-3xl animate-pulse delay-1000"></div>
//           </div>
//         </div>

//         {/* Hero Content */}
//         <div
//           className={`absolute inset-0 flex items-center justify-center px-4 transition-all duration-1000 ${
//             isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
//           }`}
//         >
//           <div className="text-center max-w-4xl">
//             <span
//               className="inline-block px-6 py-3 rounded-full text-sm font-semibold mb-8 shadow-lg animate-float"
//               style={{
//                 backgroundColor: "#9ec8ea",
//                 color: "#845c33",
//               }}
//             >
//               ✝️ Since 1998 ✝️
//             </span>

//             <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
//               About{" "}
//               <span className="relative">
//                 <span className="relative z-10" style={{ color: "#9ec8ea" }}>
//                   Gospel Centres
//                 </span>
//               </span>
//               <br />
//               <span className="text-white">International</span>
//             </h1>

//             <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
//               A 21st Century evangelical and missional oriented ministry
//               dedicated to advancing and enhancing God's Kingdom in every nation
//               of the world.
//             </p>

//             <div className="flex flex-wrap gap-4 justify-center mt-10">
//               <div className="flex items-center gap-2 text-white/80">
//                 <ChurchIcon className="w-5 h-5" style={{ color: "#9ec8ea" }} />
//                 <span>47 Counties</span>
//               </div>
//               <div className="flex items-center gap-2 text-white/80">
//                 <Users className="w-5 h-5" style={{ color: "#9ec8ea" }} />
//                 <span>Global Network</span>
//               </div>
//               <div className="flex items-center gap-2 text-white/80">
//                 <Heart className="w-5 h-5" style={{ color: "#9ec8ea" }} />
//                 <span>Since 1998</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Mission Statement Section */}
//       <section className="py-20 md:py-28 px-4 relative overflow-hidden bg-white">
//         <div className="absolute top-0 right-0 w-96 h-96 opacity-5">
//           <Cross className="w-full h-full" style={{ color: "#845c33" }} />
//         </div>

//         <div className="max-w-4xl mx-auto text-center relative z-10">
//           <div
//             ref={setSectionRef(0)}
//             className="opacity-0 translate-y-8 transition-all duration-700"
//           >
//             <span
//               className="inline-block px-4 py-2 rounded-full text-sm font-semibold mb-6"
//               style={{ backgroundColor: "#9ec8ea20", color: "#9ec8ea" }}
//             >
//               Our Calling
//             </span>

//             <h2
//               className="text-3xl md:text-4xl font-bold mb-8 leading-relaxed"
//               style={{ color: "#845c33" }}
//             >
//               "Go therefore and make disciples of all nations,
//               <br />
//               baptizing them in the name of the Father and of the Son and of the
//               Holy Spirit"
//             </h2>

//             <p className="text-gray-600 text-lg mb-4">— Matthew 28:19-20</p>
//           </div>
//         </div>
//       </section>

//       {/* Stats Section */}
//       <section
//         className="py-16 px-4 relative"
//         style={{ backgroundColor: "#f9f7f4" }}
//       >
//         <div className="max-w-6xl mx-auto">
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
//             {[
//               {
//                 icon: <ChurchIcon className="w-8 h-8" />,
//                 number: "47",
//                 label: "Counties by 2030",
//               },
//               {
//                 icon: <Globe className="w-8 h-8" />,
//                 number: "1",
//                 label: "Countries",
//               },
//               {
//                 icon: <Users className="w-8 h-8" />,
//                 number: "200+",
//                 label: "Assemblies",
//               },
//               {
//                 icon: <Heart className="w-8 h-8" />,
//                 number: "25+",
//                 label: "Years of Service",
//               },
//             ].map((stat, index) => (
//               <div
//                 key={index}
//                 ref={setSectionRef(index + 1)}
//                 className="text-center p-6 rounded-xl transition-all duration-500 hover:shadow-xl opacity-0 translate-y-8 group"
//                 style={{
//                   backgroundColor: "white",
//                   transitionDelay: `${index * 100}ms`,
//                 }}
//               >
//                 <div
//                   className="inline-flex p-4 rounded-full mb-4 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6"
//                   style={{ backgroundColor: "#9ec8ea20", color: "#9ec8ea" }}
//                 >
//                   {stat.icon}
//                 </div>
//                 <div
//                   className="text-3xl md:text-4xl font-bold mb-2"
//                   style={{ color: "#845c33" }}
//                 >
//                   {stat.number}
//                 </div>
//                 <div className="text-sm md:text-base text-gray-600">
//                   {stat.label}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Mission & Vision Section */}
//       <section className="py-20 md:py-28 px-4 bg-white">
//         <div className="max-w-6xl mx-auto">
//           <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
//             {/* Mission */}
//             <div
//               ref={setSectionRef(5)}
//               className="opacity-0 translate-y-8 transition-all duration-700 group"
//             >
//               <div className="relative">
//                 <div className="absolute -top-6 -left-6 w-20 h-20 opacity-10">
//                   <Cross
//                     className="w-full h-full"
//                     style={{ color: "#845c33" }}
//                   />
//                 </div>
//                 <div className="relative z-10">
//                   <span
//                     className="inline-block px-4 py-2 rounded-full text-sm font-semibold mb-6"
//                     style={{ backgroundColor: "#9ec8ea20", color: "#9ec8ea" }}
//                   >
//                     Our Purpose
//                   </span>
//                   <h2
//                     className="text-3xl md:text-4xl font-bold mb-6 relative"
//                     style={{ color: "#845c33" }}
//                   >
//                     Our Mission
//                     <div
//                       className="w-20 h-1 mt-2 rounded-full"
//                       style={{ backgroundColor: "#9ec8ea" }}
//                     ></div>
//                   </h2>
//                   <p className="text-gray-700 leading-relaxed mb-4 text-lg">
//                     To proclaim the Gospel of Jesus Christ and make disciples
//                     who become leaders in their communities, transforming lives
//                     through the power of God's word and the Holy Spirit.
//                   </p>
//                   <p className="text-gray-700 leading-relaxed text-lg">
//                     We believe in reaching the lost, building up the faithful,
//                     and equipping leaders who will continue this work for
//                     generations to come.
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Vision */}
//             <div
//               ref={setSectionRef(6)}
//               className="opacity-0 translate-y-8 transition-all duration-700 group"
//               style={{ transitionDelay: "200ms" }}
//             >
//               <div className="relative">
//                 <div className="absolute -top-6 -right-6 w-20 h-20 opacity-10">
//                   <BookOpen
//                     className="w-full h-full"
//                     style={{ color: "#845c33" }}
//                   />
//                 </div>
//                 <div className="relative z-10">
//                   <span
//                     className="inline-block px-4 py-2 rounded-full text-sm font-semibold mb-6"
//                     style={{ backgroundColor: "#9ec8ea20", color: "#9ec8ea" }}
//                   >
//                     Our Future
//                   </span>
//                   <h2
//                     className="text-3xl md:text-4xl font-bold mb-6"
//                     style={{ color: "#845c33" }}
//                   >
//                     Our Vision
//                     <div
//                       className="w-20 h-1 mt-2 rounded-full"
//                       style={{ backgroundColor: "#9ec8ea" }}
//                     ></div>
//                   </h2>
//                   <p className="text-gray-700 leading-relaxed mb-4 text-lg">
//                     To see a vibrant network of churches united in faith,
//                     purpose, and missional focus, impacting every nation with
//                     the message of Christ's redemption.
//                   </p>
//                   <p className="text-gray-700 leading-relaxed text-lg">
//                     We envision leaders emerging from our communities who will
//                     establish new churches and expand God's kingdom across the
//                     globe.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Leadership Section */}
//       <section
//         className="py-20 md:py-28 px-4 relative overflow-hidden"
//         style={{ backgroundColor: "#f9f7f4" }}
//       >
//         {/* Background Pattern */}
//         <div className="absolute inset-0 opacity-5">
//           <div
//             className="absolute top-20 left-20 w-64 h-64 rounded-full"
//             style={{ backgroundColor: "#9ec8ea" }}
//           ></div>
//           <div
//             className="absolute bottom-20 right-20 w-96 h-96 rounded-full"
//             style={{ backgroundColor: "#845c33" }}
//           ></div>
//         </div>

//         <div className="max-w-6xl mx-auto relative z-10">
//           <div className="text-center mb-16">
//             <span
//               className="inline-block px-6 py-3 rounded-full text-sm font-semibold mb-4 shadow-md"
//               style={{ backgroundColor: "#9ec8ea20", color: "#9ec8ea" }}
//             >
//               👥 Our Leadership 👥
//             </span>
//             <h2
//               className="text-4xl md:text-5xl font-bold mb-4"
//               style={{ color: "#845c33" }}
//             >
//               General Executive Council
//             </h2>
//             <div
//               className="w-24 h-1 mx-auto rounded-full"
//               style={{ backgroundColor: "#9ec8ea" }}
//             ></div>
//             <p className="text-lg text-gray-600 max-w-3xl mx-auto mt-6">
//               Gospel Centres International is governed through a structured
//               leadership, led by the General Overseer together with an executive
//               board of elders.
//             </p>
//           </div>

//           {loading ? (
//             <div className="text-center py-16">
//               <div
//                 className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-t-transparent"
//                 style={{
//                   borderColor: "#9ec8ea",
//                   borderTopColor: "transparent",
//                 }}
//               ></div>
//               <p className="text-xl mt-4" style={{ color: "#845c33" }}>
//                 Loading board members...
//               </p>
//             </div>
//           ) : error ? (
//             <div className="text-center py-16">
//               <p className="text-xl text-red-600">{error}</p>
//             </div>
//           ) : (
//             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
//               {boardMembers.map((member, index) => (
//                 <div
//                   key={member.GECId}
//                   ref={setSectionRef(index + 7)}
//                   className="rounded-2xl shadow-lg overflow-hidden transition-all duration-700 hover:shadow-2xl hover:-translate-y-2 opacity-0 translate-y-8 group bg-white"
//                   style={{
//                     transitionDelay: `${index * 50}ms`,
//                   }}
//                 >
//                   {/* Member Header with Gradient */}
//                   <div
//                     className="p-8 text-center relative overflow-hidden"
//                     style={{ backgroundColor: "#9ec8ea" }}
//                   >
//                     <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
//                     <div className="relative z-10">
//                       {renderMemberAvatar(member)}
//                     </div>

//                     {/* Decorative Elements */}
//                     <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10 group-hover:translate-y-0 group-hover:translate-x-0 transition-transform duration-700"></div>
//                     <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-16 -translate-x-16 group-hover:translate-y-0 group-hover:translate-x-0 transition-transform duration-700"></div>
//                   </div>

//                   {/* Member Info */}
//                   <div className="p-6 text-center">
//                     <h3
//                       className="text-xl font-bold mb-2 group-hover:text-[#9ec8ea] transition-colors duration-300"
//                       style={{ color: "#845c33" }}
//                     >
//                       {getDisplayName(member)}
//                     </h3>
//                     <p
//                       className="font-semibold mb-4 inline-block px-4 py-1 rounded-full text-sm"
//                       style={{ backgroundColor: "#9ec8ea20", color: "#9ec8ea" }}
//                     >
//                       {getPositionTitle(member)}
//                     </p>
//                     <p className="text-gray-700 text-sm leading-relaxed">
//                       {member.Bio || "Serving the Lord faithfully."}
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </section>

//       {/* Core Values Section */}
//       <section className="py-20 md:py-28 px-4 bg-white relative overflow-hidden">
//         <div className="absolute inset-0 opacity-5">
//           <div
//             className="absolute top-0 left-0 w-full h-full"
//             style={{
//               backgroundImage:
//                 "radial-gradient(circle at 2px 2px, #845c33 1px, transparent 0)",
//               backgroundSize: "40px 40px",
//             }}
//           ></div>
//         </div>

//         <div className="max-w-6xl mx-auto relative z-10">
//           <div className="text-center mb-16">
//             <span
//               className="inline-block px-6 py-3 rounded-full text-sm font-semibold mb-4 shadow-md"
//               style={{ backgroundColor: "#9ec8ea20", color: "#9ec8ea" }}
//             >
//               💫 Our Foundation 💫
//             </span>
//             <h2
//               className="text-4xl md:text-5xl font-bold mb-4"
//               style={{ color: "#845c33" }}
//             >
//               Core Values
//             </h2>
//             <div
//               className="w-24 h-1 mx-auto rounded-full"
//               style={{ backgroundColor: "#9ec8ea" }}
//             ></div>
//           </div>

//           <div className="grid md:grid-cols-3 gap-8">
//             {[
//               {
//                 icon: <Cross className="w-12 h-12" />,
//                 title: "Faith",
//                 description:
//                   "We trust in God's word and providence in all things",
//               },
//               {
//                 icon: <Users className="w-12 h-12" />,
//                 title: "Community",
//                 description:
//                   "We believe in the power of believers united in purpose",
//               },
//               {
//                 icon: <Heart className="w-12 h-12" />,
//                 title: "Transformation",
//                 description:
//                   "We are committed to spiritual and social transformation",
//               },
//             ].map((value, index) => (
//               <div
//                 key={index}
//                 ref={setSectionRef(index + 13)}
//                 className="p-8 rounded-2xl text-center transition-all duration-700 hover:scale-105 hover:-translate-y-2 opacity-0 translate-y-8 group"
//                 style={{
//                   backgroundColor: "#9ec8ea",
//                   transitionDelay: `${index * 150}ms`,
//                 }}
//               >
//                 <div
//                   className="text-5xl mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500"
//                   style={{ color: "#845c33" }}
//                 >
//                   {value.icon}
//                 </div>
//                 <h3
//                   className="text-2xl font-bold mb-3 group-hover:scale-105 transition-transform duration-300"
//                   style={{ color: "#845c33" }}
//                 >
//                   {value.title}
//                 </h3>
//                 <p className="text-gray-700">{value.description}</p>

//                 {/* Decorative Line */}
//                 <div
//                   className="w-0 h-1 mx-auto mt-4 rounded-full group-hover:w-16 transition-all duration-500"
//                   style={{ backgroundColor: "#845c33" }}
//                 ></div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section
//         className="py-20 md:py-24 px-4 relative overflow-hidden"
//         style={{ backgroundColor: "#845c33" }}
//       >
//         {/* Animated Background */}
//         <div className="absolute inset-0 opacity-10">
//           <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
//           <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2 animate-pulse delay-1000"></div>
//         </div>

//         <div className="max-w-4xl mx-auto text-center relative z-10">
//           <div
//             ref={setSectionRef(16)}
//             className="opacity-0 translate-y-8 transition-all duration-700"
//           >
//             <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
//               Join Us in Our Mission
//             </h2>
//             <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
//               Be part of a growing community dedicated to fulfilling the Great
//               Commission
//             </p>
//             <div className="flex flex-col sm:flex-row gap-4 justify-center">
//               <Link
//                 href="/contact"
//                 className="group inline-flex items-center gap-2 px-8 py-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl relative overflow-hidden"
//                 style={{
//                   backgroundColor: "#9ec8ea",
//                   color: "#845c33",
//                 }}
//               >
//                 <span className="relative z-10">Contact Us Today</span>
//                 <ChevronRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 relative z-10" />
//                 <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-20 transition-opacity duration-300"></div>
//               </Link>
//               <Link
//                 href="/assemblies"
//                 className="group inline-flex items-center gap-2 px-8 py-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105 border-2 border-white relative overflow-hidden"
//                 style={{
//                   color: "white",
//                 }}
//               >
//                 <span className="relative z-10">Find an Assembly</span>
//                 <ChevronRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 relative z-10" />
//                 <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-20 transition-opacity duration-300"></div>
//               </Link>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Custom Animations */}
//       <style jsx global>{`
//         @keyframes float {
//           0%,
//           100% {
//             transform: translateY(0px);
//           }
//           50% {
//             transform: translateY(-10px);
//           }
//         }

//         .animate-float {
//           animation: float 3s ease-in-out infinite;
//         }

//         .animate-in {
//           opacity: 1 !important;
//           transform: translateY(0) !important;
//         }

//         .delay-1000 {
//           animation-delay: 1000ms;
//         }

//         @keyframes pulse {
//           0%,
//           100% {
//             opacity: 0.5;
//           }
//           50% {
//             opacity: 0.8;
//           }
//         }

//         .animate-pulse {
//           animation: pulse 3s ease-in-out infinite;
//         }
//       `}</style>
//     </div>
//   );
// }



