"use client";

import { useEffect, useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ChevronRight,
  Heart,
  Gift,
  UserPlus,
  Home,
  Image as ImageIcon,
  Users,
  User,
} from "lucide-react";
import { getAllAssemblies, Assembly, AssemblyLeader } from "../api/assemblies/assemblyService";
import Image from "next/image";

// Extended assembly type with computed properties
interface ExtendedAssembly extends Assembly {
  lat: number;
  lng: number;
  serviceTime: string;
  displayName: string;
  displayLocation: string;
  phoneNumber: string;
  emailAddress: string;
  imageEmoji: string;
  address: string;
  imageUrl: string | null;
  assemblyLeaders?: AssemblyLeaderWithMember[];
}

interface AssemblyLeaderWithMember {
  AssemblyLeaderId: number;
  MemberId: number;
  AssemblyId: number;
  TitlePrefixId: number | null;
  TitlePrefix: string | null;
  Bio: string | null;
  StartDate: string;
  EndDate: string | null;
  IsActive: boolean;
  CreatedAt: string;
  Member: {
    Id: number;
    FirstName: string;
    OtherNames: string;
    Phone: string;
    Email: string;
    Gender: string;
    ResidentialAddress: string;
    ProfileImage: string | null;
    ProfilePictureUrl: string | null;
  };
}

interface ApiLeadersResponse {
  IsSuccess: boolean;
  Code: string;
  Message: string | null;
  Data: AssemblyLeaderWithMember[];
}

// Function to get coordinates based on assembly name/location
const getCoordinates = (name: string, location: string): { lat: number; lng: number } => {
  const locationMap: { [key: string]: { lat: number; lng: number } } = {
    'Nairobi-Embakasi': { lat: -1.2921, lng: 36.8219 },
    'Nairobi': { lat: -1.2921, lng: 36.8219 },
    'Bungoma': { lat: 0.5695, lng: 34.5584 },
    'Kisumu': { lat: -0.1022, lng: 34.7617 },
    'Homabay': { lat: -0.5167, lng: 34.4500 },
    'Kakamega': { lat: 0.2827, lng: 34.7515 },
    'Tharaka Nithi': { lat: -0.3667, lng: 37.7167 },
    "Murang'a": { lat: -0.7167, lng: 37.1333 },
    'Kericho': { lat: -0.3667, lng: 35.2833 },
    'Kitale': { lat: 1.0167, lng: 35.0000 },
    'Kajiado': { lat: -1.3667, lng: 36.9667 },
    'Kitui': { lat: -1.3667, lng: 38.0167 },
    'Machakos': { lat: -1.5167, lng: 37.2667 },
    'Kwale': { lat: -4.1667, lng: 39.4500 },
    'Marsabit': { lat: 2.3333, lng: 37.9833 },
    'Meru': { lat: 0.0500, lng: 37.6500 },
    'Baringo': { lat: 0.0167, lng: 35.9667 },
    'Nakuru': { lat: -0.2833, lng: 36.0667 },
    'Siaya': { lat: 0.0627, lng: 34.2866 },
    'Vihiga': { lat: 0.0833, lng: 34.7167 },
    'Uasin Gishu': { lat: 0.5143, lng: 35.2698 },
  };

  if (locationMap[location]) {
    return locationMap[location];
  }

  for (const [key, value] of Object.entries(locationMap)) {
    if (location.includes(key) || key.includes(location)) {
      return value;
    }
  }

  return { lat: -1.2921, lng: 36.8219 };
};

// Function to get emoji based on assembly name
const getAssemblyEmoji = (name: string): string => {
  const nameLower = name.toLowerCase();
  if (nameLower.includes('central')) return '🏛️';
  if (nameLower.includes('utawala')) return '⛪';
  if (nameLower.includes('kitengela')) return '✝️';
  if (nameLower.includes('kakamega')) return '🌿';
  if (nameLower.includes('kisumu')) return '🌊';
  if (nameLower.includes('meru')) return '⛰️';
  if (nameLower.includes('mombasa')) return '🌴';
  return '🙏';
};

// Function to get service time
const getServiceTime = (name: string): string => {
  const nameLower = name.toLowerCase();
  if (nameLower.includes('utawala') || nameLower.includes('huruma')) {
    return 'Sunday 10:00 AM & 6:00 PM';
  }
  if (nameLower.includes('kitengela')) {
    return 'Sunday 8:30 AM & 10:30 AM';
  }
  if (nameLower.includes('siaya') || nameLower.includes('homabay')) {
    return 'Sunday 9:30 AM & 11:30 AM';
  }
  return 'Sunday 9:00 AM & 12:00 PM';
};

// Function to fetch assembly leaders
const fetchAssemblyLeaders = async (assemblyId: number): Promise<AssemblyLeaderWithMember[]> => {
  try {
    const response = await fetch(`https://api.gospelcentresinternational.com/api/Assembly/GetAssemblyLeaders/${assemblyId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch assembly leaders');
    }
    const data: ApiLeadersResponse = await response.json();
    if (data.IsSuccess && data.Data) {
      return data.Data;
    }
    return [];
  } catch (error) {
    console.error('Error fetching assembly leaders:', error);
    return [];
  }
};

export default function AssembliesPage() {
  const [assemblies, setAssemblies] = useState<ExtendedAssembly[]>([]);
  const [displayedAssemblies, setDisplayedAssemblies] = useState<ExtendedAssembly[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [selectedAssembly, setSelectedAssembly] = useState<ExtendedAssembly | null>(null);
  const [showVisitPage, setShowVisitPage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [leadersLoading, setLeadersLoading] = useState(false);

  // Transform API data to extended assembly
  const transformAssembly = (assembly: Assembly): ExtendedAssembly => {
    const coords = getCoordinates(assembly.Name, assembly.Location);
    
    let imageUrl: string | null = null;
    if (assembly.ProfileImage) {
      if (assembly.ProfileImage.startsWith('http://') || assembly.ProfileImage.startsWith('https://')) {
        imageUrl = assembly.ProfileImage;
      } else {
        imageUrl = `https://api.gospelcentresinternational.com${assembly.ProfileImage}`;
      }
    }
    
    return {
      ...assembly,
      lat: coords.lat,
      lng: coords.lng,
      serviceTime: getServiceTime(assembly.Name),
      displayName: assembly.Name,
      displayLocation: assembly.Location,
      phoneNumber: assembly.ContactPhone,
      emailAddress: assembly.ContactEmail,
      imageEmoji: getAssemblyEmoji(assembly.Name),
      address: `${assembly.Location}, Kenya`,
      imageUrl: imageUrl,
      assemblyLeaders: []
    };
  };

  useEffect(() => {
    const fetchAssemblies = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await getAllAssemblies();
        
        if (data && data.length > 0) {
          const transformedData = data.map(transformAssembly);
          setAssemblies(transformedData);
          setDisplayedAssemblies(transformedData.slice(0, 6));
        } else {
          setError('No assemblies found');
        }
      } catch (error) {
        console.error('Error fetching assemblies:', error);
        setError('Failed to load assemblies. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAssemblies();
  }, []);

  const loadMore = () => {
    const nextPage = page + 1;
    const end = nextPage * 6;
    const newAssemblies = assemblies.slice(0, end);
    setDisplayedAssemblies(newAssemblies);
    setPage(nextPage);
  };

  const handleVisitClick = async (assembly: ExtendedAssembly) => {
    setSelectedAssembly(assembly);
    setShowVisitPage(true);
    setLeadersLoading(true);
    
    // Fetch leaders for this assembly
    const leaders = await fetchAssemblyLeaders(assembly.Id);
    
    // Update the selected assembly with leaders
    setSelectedAssembly(prev => {
      if (prev) {
        return {
          ...prev,
          assemblyLeaders: leaders
        };
      }
      return prev;
    });
    
    setLeadersLoading(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToAssemblies = () => {
    setShowVisitPage(false);
    setSelectedAssembly(null);
  };

  // Helper function to get full name
  const getFullName = (member: { FirstName: string; OtherNames: string }): string => {
    return `${member.FirstName} ${member.OtherNames}`.trim();
  };

  // Helper function to get profile image URL
  const getProfileImageUrl = (member: { ProfileImage: string | null; ProfilePictureUrl: string | null }): string | null => {
    if (member.ProfilePictureUrl) return member.ProfilePictureUrl;
    if (member.ProfileImage) {
      if (member.ProfileImage.startsWith('http://') || member.ProfileImage.startsWith('https://')) {
        return member.ProfileImage;
      }
      return `https://api.gospelcentresinternational.com${member.ProfileImage}`;
    }
    return null;
  };

  // Visit Page Component
  if (showVisitPage && selectedAssembly) {
    return (
      <div className="w-full animate-fade-in">
        {/* Hero Section with Map */}
        <section
          className="py-16 px-4 text-center relative overflow-hidden"
          style={{ backgroundColor: "#9ec8ea" }}
        >
          <div className="max-w-6xl mx-auto animate-scale-in">
            {/* Assembly Image or Emoji */}
            <div className="flex justify-center mb-6">
              {selectedAssembly.imageUrl ? (
                <div className="relative w-32 h-32 rounded-full overflow-hidden shadow-xl border-4 border-white">
                  <Image
                    src={selectedAssembly.imageUrl}
                    alt={selectedAssembly.displayName}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        const emojiDiv = document.createElement('div');
                        emojiDiv.className = 'w-full h-full flex items-center justify-center text-6xl';
                        emojiDiv.textContent = selectedAssembly.imageEmoji;
                        parent.appendChild(emojiDiv);
                      }
                    }}
                  />
                </div>
              ) : (
                <div className="w-32 h-32 rounded-full bg-white shadow-xl border-4 border-white flex items-center justify-center text-6xl">
                  {selectedAssembly.imageEmoji}
                </div>
              )}
            </div>

            <h1
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{ color: "#845c33" }}
            >
              {selectedAssembly.displayName}
            </h1>
            <p className="text-lg mb-8" style={{ color: "#845c33" }}>
              {selectedAssembly.displayLocation}
            </p>

            {/* Map Container */}
            <div className="rounded-lg overflow-hidden shadow-xl mb-8 animate-slide-up">
              <iframe
                width="100%"
                height="400"
                frameBorder="0"
                scrolling="no"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${selectedAssembly.lng - 0.01}%2C${selectedAssembly.lat - 0.01}%2C${selectedAssembly.lng + 0.01}%2C${selectedAssembly.lat + 0.01}&layer=mapnik&marker=${selectedAssembly.lat}%2C${selectedAssembly.lng}`}
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                className="w-full"
              ></iframe>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              {[
                { icon: Heart, label: "Let's Connect", color: "#845c33" },
                { icon: Gift, label: "Give", color: "#845c33" },
                {
                  icon: UserPlus,
                  label: "Register New Member",
                  color: "#845c33",
                },
                { icon: Home, label: "Church at Home", color: "#845c33" },
              ].map((action, index) => (
                <button
                  key={index}
                  className="flex flex-col items-center gap-2 p-4 rounded-lg transition-all hover:scale-105 hover:shadow-lg animate-fade-in-up"
                  style={{
                    backgroundColor: "white",
                    color: action.color,
                    animationDelay: `${index * 0.1}s`,
                  }}
                >
                  <action.icon className="w-8 h-8" />
                  <span className="text-sm font-semibold">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Additional Info Section */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-8">
                {/* Assembly Leaders Section */}
                <div
                  className="p-6 rounded-lg shadow-lg animate-slide-in"
                  style={{ backgroundColor: "#f9f7f4" }}
                >
                  <h2
                    className="text-2xl font-bold mb-6 flex items-center gap-2"
                    style={{ color: "#845c33" }}
                  >
                    <Users className="w-6 h-6" />
                    Assembly Leaders
                  </h2>
                  
                  {leadersLoading ? (
                    <div className="text-center py-8">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-t-transparent"
                        style={{
                          borderColor: "#9ec8ea",
                          borderTopColor: "transparent",
                        }}
                      ></div>
                      <p className="mt-2 text-gray-600">Loading leaders...</p>
                    </div>
                  ) : selectedAssembly.assemblyLeaders && selectedAssembly.assemblyLeaders.length > 0 ? (
                    <div className="space-y-4">
                      {selectedAssembly.assemblyLeaders.map((leader) => {
                        const fullName = getFullName(leader.Member);
                        const profileImage = getProfileImageUrl(leader.Member);
                        const residentialAddress = leader.Member.ResidentialAddress || 'Address not specified';
                        
                        return (
                          <div
                            key={leader.AssemblyLeaderId}
                            className="flex items-start gap-4 p-4 rounded-lg transition-all hover:shadow-md"
                            style={{ backgroundColor: "white" }}
                          >
                            {/* Profile Image or Initial */}
                            <div className="flex-shrink-0">
                              {profileImage ? (
                                <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#9ec8ea]">
                                  <Image
                                    src={profileImage}
                                    alt={fullName}
                                    fill
                                    className="object-cover"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.style.display = 'none';
                                      const parent = target.parentElement;
                                      if (parent) {
                                        const initialDiv = document.createElement('div');
                                        initialDiv.className = 'w-full h-full flex items-center justify-center text-2xl font-bold';
                                        initialDiv.style.backgroundColor = '#9ec8ea';
                                        initialDiv.style.color = '#845c33';
                                        initialDiv.textContent = fullName.charAt(0).toUpperCase();
                                        parent.appendChild(initialDiv);
                                      }
                                    }}
                                  />
                                </div>
                              ) : (
                                <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold border-2 border-[#9ec8ea]"
                                  style={{ backgroundColor: "#9ec8ea20", color: "#845c33" }}
                                >
                                  {fullName.charAt(0).toUpperCase()}
                                </div>
                              )}
                            </div>
                            
                            {/* Leader Details */}
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg" style={{ color: "#845c33" }}>
                                {fullName}
                              </h3>
                              
                              {/* Bio - if available */}
                              {leader.Bio && (
                                <p className="text-sm text-gray-600 mt-1">
                                  {leader.Bio}
                                </p>
                              )}
                              
                              {/* Contact Information */}
                              <div className="mt-2 space-y-1">
                                {leader.Member.Phone && (
                                  <div className="flex items-center gap-2 text-sm">
                                    <Phone className="w-4 h-4" style={{ color: "#845c33" }} />
                                    <a href={`tel:${leader.Member.Phone}`} className="text-gray-700 hover:opacity-70">
                                      {leader.Member.Phone}
                                    </a>
                                  </div>
                                )}
                                
                                {leader.Member.Email && (
                                  <div className="flex items-center gap-2 text-sm">
                                    <Mail className="w-4 h-4" style={{ color: "#845c33" }} />
                                    <a href={`mailto:${leader.Member.Email}`} className="text-gray-700 hover:opacity-70">
                                      {leader.Member.Email}
                                    </a>
                                  </div>
                                )}
                                
                                <div className="flex items-center gap-2 text-sm">
                                  <MapPin className="w-4 h-4" style={{ color: "#845c33" }} />
                                  <span className="text-gray-700">{residentialAddress}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <User className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                      <p className="text-gray-600">No leaders found for this assembly</p>
                    </div>
                  )}
                </div>

                {/* Contact Information */}
                <div
                  className="p-6 rounded-lg shadow-lg animate-slide-in"
                  style={{ backgroundColor: "#f9f7f4", animationDelay: "0.2s" }}
                >
                  <h2
                    className="text-2xl font-bold mb-6"
                    style={{ color: "#845c33" }}
                  >
                    Contact Information
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5" style={{ color: "#845c33" }} />
                      <a
                        href={`tel:${selectedAssembly.phoneNumber}`}
                        className="text-gray-700 hover:opacity-70"
                      >
                        {selectedAssembly.phoneNumber}
                      </a>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5" style={{ color: "#845c33" }} />
                      <a
                        href={`mailto:${selectedAssembly.emailAddress}`}
                        className="text-gray-700 hover:opacity-70"
                      >
                        {selectedAssembly.emailAddress}
                      </a>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5" style={{ color: "#845c33" }} />
                      <span className="text-gray-700">
                        {selectedAssembly.address}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5" style={{ color: "#845c33" }} />
                      <span className="text-gray-700">
                        {selectedAssembly.serviceTime}
                      </span>
                    </div>
                  </div>

                  {/* Get Directions Button */}
                  <a
                    href={`https://www.openstreetmap.org/directions?from=&to=${selectedAssembly.lat}%2C${selectedAssembly.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full mt-6 py-3 rounded-lg font-semibold text-center transition-all hover:opacity-90 hover:scale-105"
                    style={{
                      backgroundColor: "#845c33",
                      color: "white",
                    }}
                  >
                    Get Directions
                  </a>
                </div>
              </div>

              {/* Right Column - Upcoming Services */}
              <div
                className="p-6 rounded-lg shadow-lg animate-slide-in"
                style={{ backgroundColor: "#f9f7f4", animationDelay: "0.4s" }}
              >
                <h2
                  className="text-2xl font-bold mb-6"
                  style={{ color: "#845c33" }}
                >
                  Upcoming Services
                </h2>
                <div className="space-y-4">
                  <div
                    className="p-4 rounded-lg"
                    style={{ backgroundColor: "#9ec8ea20" }}
                  >
                    <p className="font-semibold" style={{ color: "#845c33" }}>
                      Sunday Worship
                    </p>
                    <p className="text-gray-600">
                      {selectedAssembly.serviceTime}
                    </p>
                  </div>
                  <div
                    className="p-4 rounded-lg"
                    style={{ backgroundColor: "#9ec8ea20" }}
                  >
                    <p className="font-semibold" style={{ color: "#845c33" }}>
                      Wednesday Bible Study
                    </p>
                    <p className="text-gray-600">7:00 PM - 8:30 PM</p>
                  </div>
                  <div
                    className="p-4 rounded-lg"
                    style={{ backgroundColor: "#9ec8ea20" }}
                  >
                    <p className="font-semibold" style={{ color: "#845c33" }}>
                      Youth Group
                    </p>
                    <p className="text-gray-600">Fridays at 6:30 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Back Button */}
        <div className="text-center pb-8">
          <button
            onClick={handleBackToAssemblies}
            className="px-8 py-3 rounded-lg font-semibold transition-all hover:scale-105 hover:shadow-lg"
            style={{
              backgroundColor: "#845c33",
              color: "white",
            }}
          >
            ← Back to All Assemblies
          </button>
        </div>
      </div>
    );
  }

  // Main Assemblies Page
  return (
    <div className="w-full">
      {/* Header Section */}
      <section
        className="py-16 px-4 text-center animate-fade-in-down"
        style={{ backgroundColor: "#9ec8ea" }}
      >
        <h1
          className="text-4xl md:text-5xl font-bold mb-4 animate-scale-in"
          style={{ color: "#845c33" }}
        >
          Our Assemblies
        </h1>
        <p className="text-lg animate-fade-in" style={{ color: "#845c33" }}>
          Find and connect with one of our local church communities
        </p>
      </section>

      {/* Assemblies Grid */}
      <section className="py-16 md:py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="text-center py-16">
              <div className="animate-pulse">
                <p className="text-xl" style={{ color: "#845c33" }}>
                  Loading assemblies...
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <div className="bg-red-50 p-6 rounded-lg max-w-md mx-auto">
                <p className="text-red-600">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-6 py-2 rounded-lg font-semibold transition-all hover:opacity-90"
                  style={{
                    backgroundColor: "#845c33",
                    color: "white",
                  }}
                >
                  Retry
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
                {displayedAssemblies.map((assembly, index) => (
                  <div
                    key={assembly.Id}
                    className="rounded-lg shadow-lg overflow-hidden transition-all hover:shadow-2xl hover:scale-105 animate-fade-in-up"
                    style={{
                      backgroundColor: "#f9f7f4",
                      animationDelay: `${index * 0.1}s`,
                    }}
                  >
                    {/* Card Header with Icon and Circular Index */}
                    <div
                      className="p-6 text-center relative"
                      style={{ backgroundColor: "#9ec8ea" }}
                    >
                      <div
                        className="absolute -top-3 -right-3 w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold shadow-lg"
                        style={{
                          backgroundColor: "#845c33",
                          color: "white",
                          border: "3px solid #9ec8ea",
                        }}
                      >
                        {index + 1}
                      </div>

                      {/* Display ProfileImage if available, otherwise show emoji */}
                      <div className="flex justify-center mb-4">
                        {assembly.imageUrl ? (
                          <div className="relative w-24 h-24 rounded-full overflow-hidden shadow-lg border-4 border-white">
                            <Image
                              src={assembly.imageUrl}
                              alt={assembly.displayName}
                              fill
                              className="object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const parent = target.parentElement;
                                if (parent) {
                                  const emojiDiv = document.createElement('div');
                                  emojiDiv.className = 'w-full h-full flex items-center justify-center text-5xl';
                                  emojiDiv.textContent = assembly.imageEmoji;
                                  parent.appendChild(emojiDiv);
                                }
                              }}
                            />
                          </div>
                        ) : (
                          <div className="w-24 h-24 rounded-full bg-white shadow-lg border-4 border-white flex items-center justify-center text-5xl">
                            {assembly.imageEmoji}
                          </div>
                        )}
                      </div>

                      <h2
                        className="text-2xl font-bold"
                        style={{ color: "#845c33" }}
                      >
                        {assembly.displayName}
                      </h2>
                    </div>

                    {/* Card Body */}
                    <div className="p-6">
                      {/* Location */}
                      <div className="flex items-start gap-3 mb-4">
                        <MapPin
                          className="w-5 h-5 flex-shrink-0 mt-1"
                          style={{ color: "#845c33" }}
                        />
                        <div>
                          <p
                            className="font-semibold"
                            style={{ color: "#845c33" }}
                          >
                            Location
                          </p>
                          <p className="text-gray-700 text-sm">
                            {assembly.displayLocation}
                          </p>
                        </div>
                      </div>

                      {/* Service Time */}
                      <div className="flex items-start gap-3 mb-4">
                        <Clock
                          className="w-5 h-5 flex-shrink-0 mt-1"
                          style={{ color: "#845c33" }}
                        />
                        <div>
                          <p
                            className="font-semibold"
                            style={{ color: "#845c33" }}
                          >
                            Service Times
                          </p>
                          <p className="text-gray-700 text-sm">
                            {assembly.serviceTime}
                          </p>
                        </div>
                      </div>

                      {/* Contact */}
                      <div className="space-y-2 border-t pt-4">
                        <div className="flex items-center gap-3">
                          <Phone
                            className="w-5 h-5"
                            style={{ color: "#845c33" }}
                          />
                          <a
                            href={`tel:${assembly.phoneNumber}`}
                            className="text-sm transition-colors hover:opacity-70"
                            style={{ color: "#845c33" }}
                          >
                            {assembly.phoneNumber}
                          </a>
                        </div>
                        <div className="flex items-center gap-3">
                          <Mail
                            className="w-5 h-5"
                            style={{ color: "#845c33" }}
                          />
                          <a
                            href={`mailto:${assembly.emailAddress}`}
                            className="text-sm transition-colors hover:opacity-70"
                            style={{ color: "#845c33" }}
                          >
                            {assembly.emailAddress}
                          </a>
                        </div>
                      </div>

                      {/* Action Button */}
                      <button
                        onClick={() => handleVisitClick(assembly)}
                        className="w-full mt-6 py-3 rounded-lg font-semibold transition-all hover:opacity-90 hover:scale-105"
                        style={{
                          backgroundColor: "#845c33",
                          color: "white",
                        }}
                      >
                        Visit Us
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Load More Button */}
              {displayedAssemblies.length < assemblies.length && (
                <div className="text-center mt-12 animate-fade-in">
                  <button
                    onClick={loadMore}
                    className="px-8 py-3 rounded-lg font-semibold transition-all hover:scale-105 hover:shadow-lg animate-pulse-slow"
                    style={{
                      backgroundColor: "#9ec8ea",
                      color: "#845c33",
                    }}
                  >
                    Load More Assemblies ({displayedAssemblies.length} of {assemblies.length})
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes pulseSlow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }

        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }

        .animate-fade-in-down {
          animation: fadeInDown 0.8s ease-out forwards;
        }

        .animate-fade-in-up {
          opacity: 0;
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .animate-scale-in {
          animation: scaleIn 0.5s ease-out forwards;
        }

        .animate-slide-in {
          opacity: 0;
          animation: slideIn 0.6s ease-out forwards;
        }

        .animate-slide-up {
          opacity: 0;
          animation: slideUp 0.7s ease-out forwards;
        }

        .animate-pulse-slow {
          animation: pulseSlow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

// "use client";

// import { useEffect, useState } from "react";
// import {
//   Phone,
//   Mail,
//   MapPin,
//   Clock,
//   ChevronRight,
//   Heart,
//   Gift,
//   UserPlus,
//   Home,
//   Image as ImageIcon,
// } from "lucide-react";
// import { getAllAssemblies, Assembly, AssemblyLeader } from "../api/assemblies/assemblyService";
// import Image from "next/image";

// // Extended assembly type with computed properties
// interface ExtendedAssembly extends Assembly {
//   lat: number;
//   lng: number;
//   serviceTime: string;
//   displayName: string;
//   displayLocation: string;
//   phoneNumber: string;
//   emailAddress: string;
//   imageEmoji: string;
//   address: string;
//   imageUrl: string | null;
// }

// // Function to get coordinates based on assembly name/location
// const getCoordinates = (name: string, location: string): { lat: number; lng: number } => {
//   // You can expand this mapping based on actual locations
//   const locationMap: { [key: string]: { lat: number; lng: number } } = {
//     'Nairobi-Embakasi': { lat: -1.2921, lng: 36.8219 },
//     'Nairobi': { lat: -1.2921, lng: 36.8219 },
//     'Bungoma': { lat: 0.5695, lng: 34.5584 },
//     'Kisumu': { lat: -0.1022, lng: 34.7617 },
//     'Homabay': { lat: -0.5167, lng: 34.4500 },
//     'Kakamega': { lat: 0.2827, lng: 34.7515 },
//     'Tharaka Nithi': { lat: -0.3667, lng: 37.7167 },
//     "Murang'a": { lat: -0.7167, lng: 37.1333 },
//     'Kericho': { lat: -0.3667, lng: 35.2833 },
//     'Kitale': { lat: 1.0167, lng: 35.0000 },
//     'Kajiado': { lat: -1.3667, lng: 36.9667 },
//     'Kitui': { lat: -1.3667, lng: 38.0167 },
//     'Machakos': { lat: -1.5167, lng: 37.2667 },
//     'Kwale': { lat: -4.1667, lng: 39.4500 },
//     'Marsabit': { lat: 2.3333, lng: 37.9833 },
//     'Meru': { lat: 0.0500, lng: 37.6500 },
//     'Baringo': { lat: 0.0167, lng: 35.9667 },
//     'Nakuru': { lat: -0.2833, lng: 36.0667 },
//     'Siaya': { lat: 0.0627, lng: 34.2866 },
//     'Vihiga': { lat: 0.0833, lng: 34.7167 },
//     'Uasin Gishu': { lat: 0.5143, lng: 35.2698 },
//   };

//   // Try to find by exact location first
//   if (locationMap[location]) {
//     return locationMap[location];
//   }

//   // Try to find by partial match
//   for (const [key, value] of Object.entries(locationMap)) {
//     if (location.includes(key) || key.includes(location)) {
//       return value;
//     }
//   }

//   // Default to Nairobi
//   return { lat: -1.2921, lng: 36.8219 };
// };

// // Function to get emoji based on assembly name (fallback)
// const getAssemblyEmoji = (name: string): string => {
//   const nameLower = name.toLowerCase();
//   if (nameLower.includes('central')) return '🏛️';
//   if (nameLower.includes('utawala')) return '⛪';
//   if (nameLower.includes('kitengela')) return '✝️';
//   if (nameLower.includes('kakamega')) return '🌿';
//   if (nameLower.includes('kisumu')) return '🌊';
//   if (nameLower.includes('meru')) return '⛰️';
//   if (nameLower.includes('mombasa')) return '🌴';
//   return '🙏';
// };

// // Function to get service time (you can expand this based on actual data)
// const getServiceTime = (name: string): string => {
//   const nameLower = name.toLowerCase();
//   if (nameLower.includes('utawala') || nameLower.includes('huruma')) {
//     return 'Sunday 10:00 AM & 6:00 PM';
//   }
//   if (nameLower.includes('kitengela')) {
//     return 'Sunday 8:30 AM & 10:30 AM';
//   }
//   if (nameLower.includes('siaya') || nameLower.includes('homabay')) {
//     return 'Sunday 9:30 AM & 11:30 AM';
//   }
//   return 'Sunday 9:00 AM & 12:00 PM';
// };

// export default function AssembliesPage() {
//   const [assemblies, setAssemblies] = useState<ExtendedAssembly[]>([]);
//   const [displayedAssemblies, setDisplayedAssemblies] = useState<ExtendedAssembly[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [page, setPage] = useState(1);
//   const [selectedAssembly, setSelectedAssembly] = useState<ExtendedAssembly | null>(null);
//   const [showVisitPage, setShowVisitPage] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // Transform API data to extended assembly
//   const transformAssembly = (assembly: Assembly): ExtendedAssembly => {
//     const coords = getCoordinates(assembly.Name, assembly.Location);
    
//     // Check if ProfileImage exists and construct URL
//     let imageUrl: string | null = null;
//     if (assembly.ProfileImage) {
//       // If ProfileImage is a full URL, use it directly
//       if (assembly.ProfileImage.startsWith('http://') || assembly.ProfileImage.startsWith('https://')) {
//         imageUrl = assembly.ProfileImage;
//       } else {
//         // If it's a relative path, construct the full URL
//         imageUrl = `https://api.gospelcentresinternational.com${assembly.ProfileImage}`;
//       }
//     }
    
//     return {
//       ...assembly,
//       lat: coords.lat,
//       lng: coords.lng,
//       serviceTime: getServiceTime(assembly.Name),
//       displayName: assembly.Name,
//       displayLocation: assembly.Location,
//       phoneNumber: assembly.ContactPhone,
//       emailAddress: assembly.ContactEmail,
//       imageEmoji: getAssemblyEmoji(assembly.Name),
//       address: `${assembly.Location}, Kenya`,
//       imageUrl: imageUrl
//     };
//   };

//   useEffect(() => {
//     const fetchAssemblies = async () => {
//       try {
//         setLoading(true);
//         setError(null);
        
//         const data = await getAllAssemblies();
        
//         if (data && data.length > 0) {
//           const transformedData = data.map(transformAssembly);
//           setAssemblies(transformedData);
//           setDisplayedAssemblies(transformedData.slice(0, 6));
//         } else {
//           setError('No assemblies found');
//         }
//       } catch (error) {
//         console.error('Error fetching assemblies:', error);
//         setError('Failed to load assemblies. Please try again later.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAssemblies();
//   }, []);

//   const loadMore = () => {
//     const nextPage = page + 1;
//     const end = nextPage * 6;
//     const newAssemblies = assemblies.slice(0, end);
//     setDisplayedAssemblies(newAssemblies);
//     setPage(nextPage);
//   };

//   const handleVisitClick = (assembly: ExtendedAssembly) => {
//     setSelectedAssembly(assembly);
//     setShowVisitPage(true);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   const handleBackToAssemblies = () => {
//     setShowVisitPage(false);
//     setSelectedAssembly(null);
//   };

//   // Visit Page Component
//   if (showVisitPage && selectedAssembly) {
//     return (
//       <div className="w-full animate-fade-in">
//         {/* Back Button */}
//         {/* <button
//           onClick={handleBackToAssemblies}
//           className="fixed top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 rounded-lg transition-all hover:scale-105 animate-slide-in"
//           style={{
//             backgroundColor: "#9ec8ea",
//             color: "#845c33",
//           }}
//         >
//           <ChevronRight className="w-5 h-5 rotate-180" />
//           Back to Assemblies
//         </button> */}

//         {/* Hero Section with Map */}
//         <section
//           className="py-16 px-4 text-center relative overflow-hidden"
//           style={{ backgroundColor: "#9ec8ea" }}
//         >
//           <div className="max-w-6xl mx-auto animate-scale-in">
//             {/* Assembly Image or Emoji */}
//             <div className="flex justify-center mb-6">
//               {selectedAssembly.imageUrl ? (
//                 <div className="relative w-32 h-32 rounded-full overflow-hidden shadow-xl border-4 border-white">
//                   <Image
//                     src={selectedAssembly.imageUrl}
//                     alt={selectedAssembly.displayName}
//                     fill
//                     className="object-cover"
//                     onError={(e) => {
//                       // If image fails to load, show emoji instead
//                       const target = e.target as HTMLImageElement;
//                       target.style.display = 'none';
//                       const parent = target.parentElement;
//                       if (parent) {
//                         const emojiDiv = document.createElement('div');
//                         emojiDiv.className = 'w-full h-full flex items-center justify-center text-6xl';
//                         emojiDiv.textContent = selectedAssembly.imageEmoji;
//                         parent.appendChild(emojiDiv);
//                       }
//                     }}
//                   />
//                 </div>
//               ) : (
//                 <div className="w-32 h-32 rounded-full bg-white shadow-xl border-4 border-white flex items-center justify-center text-6xl">
//                   {selectedAssembly.imageEmoji}
//                 </div>
//               )}
//             </div>

//             <h1
//               className="text-4xl md:text-5xl font-bold mb-4"
//               style={{ color: "#845c33" }}
//             >
//               {selectedAssembly.displayName}
//             </h1>
//             <p className="text-lg mb-8" style={{ color: "#845c33" }}>
//               {selectedAssembly.displayLocation}
//             </p>

//             {/* Map Container */}
//             <div className="rounded-lg overflow-hidden shadow-xl mb-8 animate-slide-up">
//               <iframe
//                 width="100%"
//                 height="400"
//                 frameBorder="0"
//                 scrolling="no"
//                 src={`https://www.openstreetmap.org/export/embed.html?bbox=${selectedAssembly.lng - 0.01}%2C${selectedAssembly.lat - 0.01}%2C${selectedAssembly.lng + 0.01}%2C${selectedAssembly.lat + 0.01}&layer=mapnik&marker=${selectedAssembly.lat}%2C${selectedAssembly.lng}`}
//                 style={{ border: 0 }}
//                 allowFullScreen
//                 loading="lazy"
//                 className="w-full"
//               ></iframe>
//             </div>

//             {/* Quick Actions */}
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
//               {[
//                 { icon: Heart, label: "Let's Connect", color: "#845c33" },
//                 { icon: Gift, label: "Give", color: "#845c33" },
//                 {
//                   icon: UserPlus,
//                   label: "Register New Member",
//                   color: "#845c33",
//                 },
//                 { icon: Home, label: "Church at Home", color: "#845c33" },
//               ].map((action, index) => (
//                 <button
//                   key={index}
//                   className="flex flex-col items-center gap-2 p-4 rounded-lg transition-all hover:scale-105 hover:shadow-lg animate-fade-in-up"
//                   style={{
//                     backgroundColor: "white",
//                     color: action.color,
//                     animationDelay: `${index * 0.1}s`,
//                   }}
//                 >
//                   <action.icon className="w-8 h-8" />
//                   <span className="text-sm font-semibold">{action.label}</span>
//                 </button>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* Additional Info Section */}
//         <section className="py-16 px-4 bg-white">
//           <div className="max-w-6xl mx-auto">
//             <div className="grid md:grid-cols-2 gap-8">
//               {/* Contact Information */}
//               <div
//                 className="p-6 rounded-lg shadow-lg animate-slide-in"
//                 style={{ backgroundColor: "#f9f7f4" }}
//               >
//                 <h2
//                   className="text-2xl font-bold mb-6"
//                   style={{ color: "#845c33" }}
//                 >
//                   Contact Information
//                 </h2>
//                 <div className="space-y-4">
//                   <div className="flex items-center gap-3">
//                     <Phone className="w-5 h-5" style={{ color: "#845c33" }} />
//                     <a
//                       href={`tel:${selectedAssembly.phoneNumber}`}
//                       className="text-gray-700 hover:opacity-70"
//                     >
//                       {selectedAssembly.phoneNumber}
//                     </a>
//                   </div>
//                   <div className="flex items-center gap-3">
//                     <Mail className="w-5 h-5" style={{ color: "#845c33" }} />
//                     <a
//                       href={`mailto:${selectedAssembly.emailAddress}`}
//                       className="text-gray-700 hover:opacity-70"
//                     >
//                       {selectedAssembly.emailAddress}
//                     </a>
//                   </div>
//                   <div className="flex items-center gap-3">
//                     <MapPin className="w-5 h-5" style={{ color: "#845c33" }} />
//                     <span className="text-gray-700">
//                       {selectedAssembly.address}
//                     </span>
//                   </div>
//                   <div className="flex items-center gap-3">
//                     <Clock className="w-5 h-5" style={{ color: "#845c33" }} />
//                     <span className="text-gray-700">
//                       {selectedAssembly.serviceTime}
//                     </span>
//                   </div>
//                 </div>

//                 {/* Get Directions Button */}
//                 <a
//                   href={`https://www.openstreetmap.org/directions?from=&to=${selectedAssembly.lat}%2C${selectedAssembly.lng}`}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="block w-full mt-6 py-3 rounded-lg font-semibold text-center transition-all hover:opacity-90 hover:scale-105"
//                   style={{
//                     backgroundColor: "#845c33",
//                     color: "white",
//                   }}
//                 >
//                   Get Directions
//                 </a>
//               </div>

//               {/* Service Times & Events */}
//               <div
//                 className="p-6 rounded-lg shadow-lg animate-slide-in"
//                 style={{ backgroundColor: "#f9f7f4", animationDelay: "0.2s" }}
//               >
//                 <h2
//                   className="text-2xl font-bold mb-6"
//                   style={{ color: "#845c33" }}
//                 >
//                   Upcoming Services
//                 </h2>
//                 <div className="space-y-4">
//                   <div
//                     className="p-4 rounded-lg"
//                     style={{ backgroundColor: "#9ec8ea20" }}
//                   >
//                     <p className="font-semibold" style={{ color: "#845c33" }}>
//                       Sunday Worship
//                     </p>
//                     <p className="text-gray-600">
//                       {selectedAssembly.serviceTime}
//                     </p>
//                   </div>
//                   <div
//                     className="p-4 rounded-lg"
//                     style={{ backgroundColor: "#9ec8ea20" }}
//                   >
//                     <p className="font-semibold" style={{ color: "#845c33" }}>
//                       Wednesday Bible Study
//                     </p>
//                     <p className="text-gray-600">7:00 PM - 8:30 PM</p>
//                   </div>
//                   <div
//                     className="p-4 rounded-lg"
//                     style={{ backgroundColor: "#9ec8ea20" }}
//                   >
//                     <p className="font-semibold" style={{ color: "#845c33" }}>
//                       Youth Group
//                     </p>
//                     <p className="text-gray-600">Fridays at 6:30 PM</p>
//                   </div>
//                 </div>

//                 {/* Assembly Leader info if available */}
//                 {selectedAssembly.AssemblyLeader && (
//                   <div className="mt-6 pt-4 border-t">
//                     <h3 className="font-semibold" style={{ color: "#845c33" }}>
//                       Assembly Leader
//                     </h3>
//                     <p className="text-gray-700">
//                       {selectedAssembly.AssemblyLeader.FirstName} {selectedAssembly.AssemblyLeader.OtherNames}
//                     </p>
//                     <p className="text-gray-600 text-sm">
//                       {selectedAssembly.AssemblyLeader.Phone}
//                     </p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </section>
//       </div>
//     );
//   }

//   // Main Assemblies Page
//   return (
//     <div className="w-full">
//       {/* Header Section */}
//       <section
//         className="py-16 px-4 text-center animate-fade-in-down"
//         style={{ backgroundColor: "#9ec8ea" }}
//       >
//         <h1
//           className="text-4xl md:text-5xl font-bold mb-4 animate-scale-in"
//           style={{ color: "#845c33" }}
//         >
//           Our Assemblies
//         </h1>
//         <p className="text-lg animate-fade-in" style={{ color: "#845c33" }}>
//           Find and connect with one of our local church communities
//         </p>
//       </section>

//       {/* Assemblies Grid */}
//       <section className="py-16 md:py-24 px-4 bg-white">
//         <div className="max-w-6xl mx-auto">
//           {loading ? (
//             <div className="text-center py-16">
//               <div className="animate-pulse">
//                 <p className="text-xl" style={{ color: "#845c33" }}>
//                   Loading assemblies...
//                 </p>
//               </div>
//             </div>
//           ) : error ? (
//             <div className="text-center py-16">
//               <div className="bg-red-50 p-6 rounded-lg max-w-md mx-auto">
//                 <p className="text-red-600">{error}</p>
//                 <button
//                   onClick={() => window.location.reload()}
//                   className="mt-4 px-6 py-2 rounded-lg font-semibold transition-all hover:opacity-90"
//                   style={{
//                     backgroundColor: "#845c33",
//                     color: "white",
//                   }}
//                 >
//                   Retry
//                 </button>
//               </div>
//             </div>
//           ) : (
//             <>
//               <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
//                 {displayedAssemblies.map((assembly, index) => (
//                   <div
//                     key={assembly.Id}
//                     className="rounded-lg shadow-lg overflow-hidden transition-all hover:shadow-2xl hover:scale-105 animate-fade-in-up"
//                     style={{
//                       backgroundColor: "#f9f7f4",
//                       animationDelay: `${index * 0.1}s`,
//                     }}
//                   >
//                     {/* Card Header with Icon and Circular Index */}
//                     <div
//                       className="p-6 text-center relative"
//                       style={{ backgroundColor: "#9ec8ea" }}
//                     >
//                       <div
//                         className="absolute -top-3 -right-3 w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold shadow-lg"
//                         style={{
//                           backgroundColor: "#845c33",
//                           color: "white",
//                           border: "3px solid #9ec8ea",
//                         }}
//                       >
//                         {index + 1}
//                       </div>

//                       {/* Display ProfileImage if available, otherwise show emoji */}
//                       <div className="flex justify-center mb-4">
//                         {assembly.imageUrl ? (
//                           <div className="relative w-24 h-24 rounded-full overflow-hidden shadow-lg border-4 border-white">
//                             <Image
//                               src={assembly.imageUrl}
//                               alt={assembly.displayName}
//                               fill
//                               className="object-cover"
//                               onError={(e) => {
//                                 // If image fails to load, show emoji instead
//                                 const target = e.target as HTMLImageElement;
//                                 target.style.display = 'none';
//                                 const parent = target.parentElement;
//                                 if (parent) {
//                                   const emojiDiv = document.createElement('div');
//                                   emojiDiv.className = 'w-full h-full flex items-center justify-center text-5xl';
//                                   emojiDiv.textContent = assembly.imageEmoji;
//                                   parent.appendChild(emojiDiv);
//                                 }
//                               }}
//                             />
//                           </div>
//                         ) : (
//                           <div className="w-24 h-24 rounded-full bg-white shadow-lg border-4 border-white flex items-center justify-center text-5xl">
//                             {assembly.imageEmoji}
//                           </div>
//                         )}
//                       </div>

//                       <h2
//                         className="text-2xl font-bold"
//                         style={{ color: "#845c33" }}
//                       >
//                         {assembly.displayName}
//                       </h2>
//                     </div>

//                     {/* Card Body */}
//                     <div className="p-6">
//                       {/* Location */}
//                       <div className="flex items-start gap-3 mb-4">
//                         <MapPin
//                           className="w-5 h-5 flex-shrink-0 mt-1"
//                           style={{ color: "#845c33" }}
//                         />
//                         <div>
//                           <p
//                             className="font-semibold"
//                             style={{ color: "#845c33" }}
//                           >
//                             Location
//                           </p>
//                           <p className="text-gray-700 text-sm">
//                             {assembly.displayLocation}
//                           </p>
//                         </div>
//                       </div>

//                       {/* Service Time */}
//                       <div className="flex items-start gap-3 mb-4">
//                         <Clock
//                           className="w-5 h-5 flex-shrink-0 mt-1"
//                           style={{ color: "#845c33" }}
//                         />
//                         <div>
//                           <p
//                             className="font-semibold"
//                             style={{ color: "#845c33" }}
//                           >
//                             Service Times
//                           </p>
//                           <p className="text-gray-700 text-sm">
//                             {assembly.serviceTime}
//                           </p>
//                         </div>
//                       </div>

//                       {/* Contact */}
//                       <div className="space-y-2 border-t pt-4">
//                         <div className="flex items-center gap-3">
//                           <Phone
//                             className="w-5 h-5"
//                             style={{ color: "#845c33" }}
//                           />
//                           <a
//                             href={`tel:${assembly.phoneNumber}`}
//                             className="text-sm transition-colors hover:opacity-70"
//                             style={{ color: "#845c33" }}
//                           >
//                             {assembly.phoneNumber}
//                           </a>
//                         </div>
//                         <div className="flex items-center gap-3">
//                           <Mail
//                             className="w-5 h-5"
//                             style={{ color: "#845c33" }}
//                           />
//                           <a
//                             href={`mailto:${assembly.emailAddress}`}
//                             className="text-sm transition-colors hover:opacity-70"
//                             style={{ color: "#845c33" }}
//                           >
//                             {assembly.emailAddress}
//                           </a>
//                         </div>
//                       </div>

//                       {/* Action Button */}
//                       <button
//                         onClick={() => handleVisitClick(assembly)}
//                         className="w-full mt-6 py-3 rounded-lg font-semibold transition-all hover:opacity-90 hover:scale-105"
//                         style={{
//                           backgroundColor: "#845c33",
//                           color: "white",
//                         }}
//                       >
//                         Visit Us
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* Load More Button */}
//               {displayedAssemblies.length < assemblies.length && (
//                 <div className="text-center mt-12 animate-fade-in">
//                   <button
//                     onClick={loadMore}
//                     className="px-8 py-3 rounded-lg font-semibold transition-all hover:scale-105 hover:shadow-lg animate-pulse-slow"
//                     style={{
//                       backgroundColor: "#9ec8ea",
//                       color: "#845c33",
//                     }}
//                   >
//                     Load More Assemblies ({displayedAssemblies.length} of {assemblies.length})
//                   </button>
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       </section>

//       <style jsx>{`
//         @keyframes fadeIn {
//           from {
//             opacity: 0;
//           }
//           to {
//             opacity: 1;
//           }
//         }

//         @keyframes fadeInDown {
//           from {
//             opacity: 0;
//             transform: translateY(-20px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }

//         @keyframes fadeInUp {
//           from {
//             opacity: 0;
//             transform: translateY(20px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }

//         @keyframes scaleIn {
//           from {
//             opacity: 0;
//             transform: scale(0.9);
//           }
//           to {
//             opacity: 1;
//             transform: scale(1);
//           }
//         }

//         @keyframes slideIn {
//           from {
//             opacity: 0;
//             transform: translateX(-20px);
//           }
//           to {
//             opacity: 1;
//             transform: translateX(0);
//           }
//         }

//         @keyframes slideUp {
//           from {
//             opacity: 0;
//             transform: translateY(40px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }

//         @keyframes pulseSlow {
//           0%,
//           100% {
//             opacity: 1;
//           }
//           50% {
//             opacity: 0.8;
//           }
//         }

//         .animate-fade-in {
//           animation: fadeIn 0.6s ease-out forwards;
//         }

//         .animate-fade-in-down {
//           animation: fadeInDown 0.8s ease-out forwards;
//         }

//         .animate-fade-in-up {
//           opacity: 0;
//           animation: fadeInUp 0.6s ease-out forwards;
//         }

//         .animate-scale-in {
//           animation: scaleIn 0.5s ease-out forwards;
//         }

//         .animate-slide-in {
//           opacity: 0;
//           animation: slideIn 0.6s ease-out forwards;
//         }

//         .animate-slide-up {
//           opacity: 0;
//           animation: slideUp 0.7s ease-out forwards;
//         }

//         .animate-pulse-slow {
//           animation: pulseSlow 2s ease-in-out infinite;
//         }
//       `}</style>
//     </div>
//   );
// }
