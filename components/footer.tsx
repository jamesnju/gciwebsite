"use client";
import Image from "next/image";
import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: "YouTube",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
      href: "https://www.youtube.com/@gcicentral",
    },
    {
      name: "Instagram",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
        </svg>
      ),
      href: "https://www.instagram.com/gci_central/",
    },
    {
      name: "Facebook",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
      href: "https://web.facebook.com/GCICentralChurch/",
    },
    {
      name: "X (Twitter)",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      href: "https://x.com/gci_central/",
    },
  ];

  return (
    <footer className="bg-white border-t mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-8 lg:gap-12 mb-8">
          {/* Brand - Made more prominent */}
          <div className="animate-fade-in-up md:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4 group">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center transition-transform group-hover:scale-105"
                style={{ backgroundColor: "#9ec8ea" }}
              >
                <Image
                  src="/logo.png"
                  alt="Gospel Centres International"
                  width={56}
                  height={56}
                  className="object-cover w-full h-full rounded-full"
                  priority
                />
              </div>
              <div>
                <span
                  className="font-bold text-lg block leading-tight"
                  style={{ color: "#845c33" }}
                >
                  Gospel Centres
                </span>
                <span className="text-xs text-gray-500">International</span>
              </div>
            </Link>
            <p className="text-sm text-gray-600 mt-2 leading-relaxed">
              Evangelism | Discipleship | Leadership
            </p>
          </div>

          {/* Quick Links - Organized better */}
          <div
            className="animate-fade-in-up"
            style={{ animationDelay: "0.1s" }}
          >
            <h3
              className="font-bold mb-4 text-sm uppercase tracking-wider"
              style={{ color: "#845c33" }}
            >
              Quick Links
            </h3>
            <ul className="space-y-3 text-sm">
              {[
                { label: "About Us", href: "/about" },
                { label: "Assemblies", href: "/assemblies" },
                { label: "Adopt a Country", href: "/adopt-country" },
                { label: "Contact", href: "/contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-600 hover:opacity-70 transition-all hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info - With better spacing */}
          <div
            className="animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            <h3
              className="font-bold mb-4 text-sm uppercase tracking-wider"
              style={{ color: "#845c33" }}
            >
              Get In Touch
            </h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center gap-3 text-gray-600 group">
                <div
                  className="p-2 rounded-full transition-colors"
                  style={{ backgroundColor: "#9ec8ea20" }}
                >
                  <Phone className="w-4 h-4" style={{ color: "#845c33" }} />
                </div>
                <span>(+254) 722 707-193</span>
              </li>
              <li className="flex items-center gap-3 text-gray-600 group">
                <div
                  className="p-2 rounded-full transition-colors"
                  style={{ backgroundColor: "#9ec8ea20" }}
                >
                  <Mail className="w-4 h-4" style={{ color: "#845c33" }} />
                </div>
                <span className="break-all">
                  utawala@gospelcentresinternational.org
                </span>
              </li>
              <li className="flex items-start gap-3 text-gray-600 group">
                <div
                  className="p-2 rounded-full transition-colors mt-1"
                  style={{ backgroundColor: "#9ec8ea20" }}
                >
                  <MapPin className="w-4 h-4" style={{ color: "#845c33" }} />
                </div>
                <span>Utawala, Nairobi Kenya</span>
              </li>
            </ul>
          </div>

          {/* Follow Us - With actual social icons */}
          <div
            className="animate-fade-in-up"
            style={{ animationDelay: "0.3s" }}
          >
            <h3
              className="font-bold mb-4 text-sm uppercase tracking-wider"
              style={{ color: "#845c33" }}
            >
              Connect With Us
            </h3>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 hover:scale-110 hover:shadow-lg group"
                  style={{ backgroundColor: "#9ec8ea" }}
                  aria-label={`Follow us on ${social.name}`}
                >
                  <span
                    className="text-white group-hover:text-white transition-colors"
                    style={{ color: "#845c33" }}
                  >
                    {social.icon}
                  </span>
                </a>
              ))}
            </div>
            {/* Newsletter Teaser */}
            <p className="text-xs text-gray-500 mt-4 leading-relaxed">
              Follow us on social media for updates, events, and inspiring
              messages.
            </p>
          </div>
        </div>

        {/* Bottom Footer - With decorative element */}
        <div className="border-t pt-8 text-center text-sm text-gray-600">
          <p>
            © {currentYear} Gospel Centres International. All rights reserved. |
            Built with faith and dedication
          </p>
        </div>
      </div>

      {/* Add animation styles if not already in your globals.css */}
      <style jsx>{`
        @keyframes fadeInUp {
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
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </footer>
  );
}

// "use client";7

// import Image from "next/image";
// import Link from "next/link";
// import { Mail, Phone, MapPin } from "lucide-react";

// export function Footer() {
//   const currentYear = new Date().getFullYear();

//   return (
//     <footer className="bg-white border-t mt-16">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
//         {/* Main Footer Content */}
//         <div className="grid md:grid-cols-4 gap-8 mb-8">
//           {/* Brand */}
//           <div className="animate-fade-in-up">
//             <Link href="/" className="flex items-center gap-2 mb-4">
//               <div
//                 className="w-10 h-10 rounded-full flex items-center justify-center"
//                 style={{ backgroundColor: "#9ec8ea" }}
//               >
//                 <span className="font-bold text-white text-lg">
//                   <Image
//                     src="/logo.png"
//                     alt="Church logo"
//                     width={56}
//                     height={56}
//                     className="object-cover w-full h-full"
//                     priority
//                   />
//                 </span>
//               </div>
//               <span className="font-bold text-lg" style={{ color: "#845c33" }}>
//                 Gospel Centres International{" "}
//               </span>
//             </Link>
//             <p className="text-sm text-gray-600">
//               Evangelism | Discipleship | Leadership
//             </p>
//           </div>

//           {/* Quick Links */}
//           <div
//             className="animate-fade-in-up"
//             style={{ animationDelay: "0.1s" }}
//           >
//             <h3 className="font-bold mb-4" style={{ color: "#845c33" }}>
//               Quick Links
//             </h3>
//             <ul className="space-y-2 text-sm">
//               {[
//                 { label: "About Us", href: "/about" },
//                 { label: "Assemblies", href: "/assemblies" },
//                 { label: "Adopt a Country", href: "/adopt-country" },
//                 { label: "Contact", href: "/contact" },
//               ].map((link) => (
//                 <li key={link.href}>
//                   <Link
//                     href={link.href}
//                     className="text-gray-600 hover:opacity-70 transition-colors"
//                   >
//                     {link.label}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Contact Info */}
//           <div
//             className="animate-fade-in-up"
//             style={{ animationDelay: "0.2s" }}
//           >
//             <h3 className="font-bold mb-4" style={{ color: "#845c33" }}>
//               Contact
//             </h3>
//             <ul className="space-y-3 text-sm">
//               <li className="flex items-center gap-2 text-gray-600">
//                 <Phone className="w-4 h-4" />
//                 <span>(+254) 722 707-193</span>
//               </li>
//               <li className="flex items-center gap-2 text-gray-600">
//                 <Mail className="w-4 h-4" />
//                 <span>utawala@gospelcentresinternational.org</span>
//               </li>
//               <li className="flex items-start gap-2 text-gray-600">
//                 <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
//                 <span>Utawala, Nairobi Kenya</span>
//               </li>
//             </ul>
//           </div>

//           {/* Follow Us */}
//           <div
//             className="animate-fade-in-up"
//             style={{ animationDelay: "0.3s" }}
//           >
//             <h3 className="font-bold mb-4" style={{ color: "#845c33" }}>
//               Follow Us
//             </h3>
//             <div className="flex gap-4">
//               {["Facebook", "Twitter", "Instagram", "YouTube"].map((social) => (
//                 <a
//                   key={social}
//                   href="#"
//                   className="inline-flex items-center justify-center w-10 h-10 rounded-full transition-all hover:scale-110"
//                   style={{ backgroundColor: "#9ec8ea", color: "#845c33" }}
//                 >
//                   <span className="text-xs font-bold">{social.charAt(0)}</span>
//                 </a>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Bottom Footer */}
//         <div className="border-t pt-8 text-center text-sm text-gray-600">
//           <p>
//             © {currentYear} Gospel Centres International. All rights reserved. | Built with
//             faith and dedication
//           </p>
//         </div>
//       </div>
//     </footer>
//   );
// }
