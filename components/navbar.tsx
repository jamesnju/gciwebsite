"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Assemblies", href: "/assemblies" },
    { label: "Adopt a Country", href: "/adopt-country" },
    { label: "Contact Us", href: "/contact" },
    { label: "Am Here", href: "/am-here" },
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed w-full top-0 z-50 bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo on the right side */}
          <div className="flex-1 flex justify-end md:order-2">
            <Link
              href="/"
              className="flex items-center gap-3 animate-fade-in-down whitespace-nowrap"
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0"
                style={{ backgroundColor: "#9ec8ea" }}
              >
                <Image
                  src="/logo.png"
                  alt="Church logo"
                  width={56}
                  height={56}
                  className="object-cover w-full h-full"
                  priority
                />
              </div>
              <span
                className="hidden sm:inline font-bold text-xl"
                style={{ color: "#845c33" }}
              >
                GCI
              </span>
            </Link>
          </div>

          {/* Desktop Navigation in the middle */}
          <div className="hidden md:flex flex-1 justify-center items-center gap-6 xl:gap-8 mx-4 xl:mx-8">
            {navItems.map((item, index) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm xl:text-base font-medium transition-all duration-200 animate-fade-in-down whitespace-nowrap relative group ${
                    active ? "font-semibold" : "hover:opacity-70"
                  }`}
                  style={{
                    color: active ? "#9ec8ea" : "#845c33",
                    animationDelay: `${index * 0.1}s`,
                  }}
                >
                  {item.label}
                  {/* Active indicator underline */}
                  <span 
                    className={`absolute -bottom-1 left-0 h-0.5 bg-[#9ec8ea] transition-all duration-300 ${
                      active ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              );
            })}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden order-1">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md transition-colors hover:opacity-70"
              style={{ color: "#845c33" }}
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div
          className="md:hidden animate-fade-in-down"
          style={{ backgroundColor: "#f5f5f5" }}
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    active 
                      ? "bg-[#9ec8ea] text-white" 
                      : "hover:bg-[#9ec8ea] hover:text-white"
                  }`}
                  style={{ color: active ? "white" : "#845c33" }}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}