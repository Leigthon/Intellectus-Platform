import React from "react";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { useLocation } from "react-router-dom";
import { contactInfo } from "@/mockData";

const Footer = () => {
  const location = useLocation();

  const resolvePath = () => {
    const path = location?.pathname || "/";
    if (path !== "/" && path !== "") return path;
    try {
      const hash = window?.location?.hash || "";
      if (hash.startsWith("#/")) return hash.slice(1);
    } catch {
      // ignore
    }
    return "/";
  };

  const currentPath = resolvePath();
  if (currentPath.startsWith("/tutors")) return null;

  const themeByPath = {
    "/": {
      bg: "bg-slate-700",
      border: "border-slate-500",
      text: "text-slate-200",
      accent: "text-slate-100",
      hover: "hover:text-white",
    },
    "/home": {
      bg: "bg-slate-700",
      border: "border-slate-500",
      text: "text-slate-200",
      accent: "text-slate-100",
      hover: "hover:text-white",
    },
    "/funding": {
      bg: "bg-rose-700",
      border: "border-rose-500",
      text: "text-rose-100",
      accent: "text-white",
      hover: "hover:text-rose-200",
    },
    "/marketplace": {
      bg: "bg-emerald-700",
      border: "border-emerald-500",
      text: "text-emerald-100",
      accent: "text-white",
      hover: "hover:text-emerald-200",
    },
    "/marketplace/basket": {
      bg: "bg-emerald-700",
      border: "border-emerald-500",
      text: "text-emerald-100",
      accent: "text-white",
      hover: "hover:text-emerald-200",
    },
    "/marketplace/wishlist": {
      bg: "bg-emerald-700",
      border: "border-emerald-500",
      text: "text-emerald-100",
      accent: "text-white",
      hover: "hover:text-emerald-200",
    },
  };

  const theme = themeByPath[currentPath] || {
    bg: "bg-[#2c3e73]",
    border: "border-slate-500",
    text: "text-slate-200",
    accent: "text-white",
    hover: "hover:text-[#1ac8db]",
  };

  const locations = [
    "Cape Town CBD",
    "Northern Suburbs",
    "Southern Suburbs",
    "Online (South Africa-wide)",
  ];

  const hours = String(contactInfo.hours || "")
    .split(",")
    .map((h) => h.trim())
    .filter(Boolean);

  return (
    <footer className={`${theme.bg} text-white`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div>
            <div className="mb-4">
              <img
                src="profile images/logo.jpg"
                alt="Intellectus Academy"
                className="h-11 w-auto rounded-full object-cover"
              />
            </div>
            <p className={`${theme.text} text-sm`}>
              Intellectus supports students through tutoring, funding, and affordable
              textbooks.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              {contactInfo.phone.map((phone, index) => (
                <li key={index} className={`flex items-center gap-2 text-sm ${theme.text}`}>
                  <Phone className={`w-4 h-4 ${theme.accent}`} />
                  <a href={`tel:${phone.replace(/\s/g, "")}`} className={`${theme.hover} transition-colors`}>
                    {phone}
                  </a>
                </li>
              ))}
              <li className={`flex items-center gap-2 text-sm ${theme.text}`}>
                <Mail className={`w-4 h-4 ${theme.accent}`} />
                <a href={`mailto:${contactInfo.email}`} className={`${theme.hover} transition-colors`}>
                  {contactInfo.email}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Locations & Hours</h3>
            <ul className="space-y-2">
              {locations.map((loc) => (
                <li key={loc} className={`flex items-start gap-2 text-sm ${theme.text}`}>
                  <MapPin className={`w-4 h-4 ${theme.accent} mt-0.5`} />
                  <span>{loc}</span>
                </li>
              ))}
              <li className={`pt-2 flex items-start gap-2 text-sm ${theme.text}`}>
                <Clock className={`w-4 h-4 ${theme.accent} mt-0.5`} />
                <div>
                  {hours.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className={`border-t ${theme.border} mt-8 pt-8 text-center text-sm ${theme.text}`}>
          <p>&copy; {new Date().getFullYear()} Intellectus Academy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

