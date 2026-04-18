import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

/**
 * Header supports per-route configuration for logo and hover color.
 * To change the logo/hover color for a page, update the `headerConfig` below
 * with the path as the key and an object { logo, hoverTextClass, hoverBgClass, underlineClass }.
 */
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "Home",path: "/home"},
    { name: "Tutoring", path: "https://my.intellectusacademy.tech/" },
    { name: "Funding", path: "/funding" },
    { name: "Marketplace", path: "/marketplace" },
  ];

  const headerConfig = {
    // default / home
    "/": {
      logo: "profile images/logo.jpg",
      title: "Intellectus",
      hoverTextClass: "hover:text-[#2c3e73]",
      hoverBgClass: "hover:bg-[#2c3e73]/10",
      underlineClass: "bg-[#808080]",
      mobileMenu: {
        panel:
          "border-t border-slate-200/90 bg-gradient-to-b from-white via-slate-50/90 to-slate-100/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]",
        linkIdle: "text-slate-700 hover:bg-slate-100/95",
        linkActive: "text-[#2c3e73] bg-[#2c3e73]/12 font-semibold",
        burgerRing: "hover:bg-slate-100 text-slate-700",
      },
    },
    "/marketplace": {
      logo: "profile images/logo.jpg",
      title: "Intellectus",
      subtitle: "MARKETPLACE",
      color: "bg-[#6b8e23]",
      hoverTextClass: "hover:text-[#6b8e23]",
      hoverBgClass: "hover:bg-[#6b8e23]/10",
      underlineClass: "bg-[#6b8e23]",
      mobileMenu: {
        panel:
          "border-t border-[#6b8e23]/35 bg-gradient-to-b from-[#f4f9ee] via-white to-[#eef6e4] shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]",
        linkIdle: "text-slate-800 hover:bg-[#6b8e23]/14",
        linkActive: "text-[#3d5210] bg-[#6b8e23]/18 font-semibold border-l-[3px] border-[#6b8e23]",
        burgerRing: "hover:bg-[#6b8e23]/12 text-[#4a6218]",
      },
    },
    "/funding": {
      logo: "profile images/logo.jpg",
      title: "Intellectus",
      subtitle: "FUNDING",
      color: "bg-[#ff6b6b]",
      hoverTextClass: "hover:text-[#ff6b6b]",
      hoverBgClass: "hover:bg-[#ff6b6b]/10",
      underlineClass: "bg-[#ff6b6b]",
      mobileMenu: {
        panel:
          "border-t border-rose-200/80 bg-gradient-to-b from-rose-50/95 via-white to-rose-50/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]",
        linkIdle: "text-slate-800 hover:bg-rose-100/70",
        linkActive: "text-rose-800 bg-rose-100/95 font-semibold border-l-[3px] border-rose-500",
        burgerRing: "hover:bg-rose-100/80 text-rose-700",
      },
    },
  };

  // Resolve config by exact match first, then by wildcard/prefix keys.
  // This helper returns the matching key (not the config) so we can log and
  // diagnose which entry was chosen during development.
  const getMatchingKey = (configMap, pathname) => {
    if (configMap[pathname]) return pathname;

    const keys = Object.keys(configMap).filter((k) => k !== "/");
    let bestMatch = null;
    let bestLen = -1;

    for (const key of keys) {
      if (key.endsWith("*")) {
        const prefix = key.slice(0, -1);
        if (pathname.startsWith(prefix) && prefix.length > bestLen) {
          bestMatch = key;
          bestLen = prefix.length;
        }
      } else {
        if (pathname === key || pathname.startsWith(key + "/")) {
          if (key.length > bestLen) {
            bestMatch = key;
            bestLen = key.length;
          }
        }
      }
    }

    if (bestMatch) return bestMatch;

    if (configMap["/"]) return "/";

    const firstKey = Object.keys(configMap)[0];
    return firstKey || null;
  };

  // Compute an effective path that respects HashRouter-style URLs (/#/route)
  let effectivePath = location.pathname || "/";
  try {
    const hash = window?.location?.hash || "";
    if ((effectivePath === "/" || effectivePath === "") && hash.startsWith("#/")) {
      effectivePath = hash.slice(1); // '#/funding' -> '/funding'
    }
  } catch (e) {
    // ignore if window isn't available
  }

  // If react-router's location is root but the browser pathname is non-root
  // (e.g. the app is served as a BrowserRouter route or you opened /marketplace
  // directly), prefer window.location.pathname as a fallback so headerConfig
  // can match direct URLs.
  try {
    const browserPath = window?.location?.pathname || "";
    if ((effectivePath === "/" || effectivePath === "") && browserPath && browserPath !== "/") {
      effectivePath = browserPath;
    }
  } catch (e) {
    // ignore
  }

  // Normalization helper: ensure leading slash, strip trailing slash (except root), strip query/search
  const normalize = (p) => {
    if (!p) return "/";
    let s = String(p);
    // if a hash-like value ('#/funding') comes through, remove leading '#'
    if (s.startsWith("#")) s = s.slice(1);
    // remove search/query params and fragment
    const qIdx = s.indexOf("?");
    if (qIdx !== -1) s = s.slice(0, qIdx);
    const hashIdx = s.indexOf("#");
    if (hashIdx !== -1) s = s.slice(0, hashIdx);
    if (!s.startsWith("/")) s = "/" + s;
    if (s.length > 1 && s.endsWith("/")) s = s.slice(0, -1);
    return s;
  };

  const normalizedEffectivePath = normalize(effectivePath);

  const matchedKey = getMatchingKey(headerConfig, normalizedEffectivePath);
  const config = matchedKey ? headerConfig[matchedKey] : headerConfig["/"];

  const mobileMenu =
    config.mobileMenu || headerConfig["/"].mobileMenu;

  // Subtitle color/class handling: support either a Tailwind class via
  // config.subtitleClass or a raw color (hex) via config.color. Also allow
  // values like 'bg-[#6b8e23]' or 'text-[#6b8e23]' by extracting the hex.
  const subtitleClass = config.subtitleClass || "";
  let subtitleColor;
  if (config.color) {
    const c = String(config.color).trim();
    if (c.startsWith("#")) {
      subtitleColor = c;
    } else {
      // Try to extract a hex inside brackets or anywhere in the string
      const m = c.match(/#([0-9a-fA-F]{3,8})/);
      if (m) subtitleColor = `#${m[1]}`;
    }
  }

  // Dev-only logging to help debug route -> config mapping
  if (process.env.NODE_ENV !== "production") {
    try {
      // eslint-disable-next-line no-console
      console.debug(
        "Header: effectivePath=",
        effectivePath,
        "normalized=",
        normalizedEffectivePath,
        "matchedKey=",
        matchedKey,
        "config=",
        config
      );
    } catch (e) {
      // ignore logging errors
    }
  }

  const isActive = (path) => {
    if (!path) return false;
    // external links won't match
    if (path.startsWith("http")) return false;
    return effectivePath === path || effectivePath.startsWith(path + "/");
  };

  return (
    

    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16 gap-2 min-w-0">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 group min-w-0 flex-1">
            <img
              src={config.logo}
              alt={`${config.title || "Intellectus"} logo`}
              className="h-9 w-9 sm:h-12 sm:w-auto shrink-0 rounded-full object-cover"
            />
            <div className="flex flex-col leading-tight min-w-0">
              <span className="text-base sm:text-[20px] chunkfive-font text-gray-600 flex items-center gap-1 sm:gap-2 truncate">
                <span className="truncate">{config.title || "Intellectus"}<span className="text-[5px] chunkfive-font text-gray-500 shrink-0">©</span></span>
                
                {/* {process.env.NODE_ENV !== "production" && (
                  <span className="ml-2 px-2 py-1 text-xs text-[#1ac8db] bg-[#e6f7fa] rounded-md border border-[#d0f0f4]">
                    {matchedKey || effectivePath}
                  </span>
                )} */}
              </span>
             
              <span
                className={`text-[8px] sm:text-[9px] font-normal truncate ${subtitleClass}`}
                style={subtitleColor ? { color: subtitleColor } : undefined}
              >
                {config.subtitle || ""}
              </span>
            </div>
          </Link>
          

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              link.path && link.path.startsWith("http") ? (
                <a
                  key={link.name + link.path}
                  href={link.path}
                  className={`text-sm font-medium transition-colors relative ${isActive(link.path) ? `text-gray-900 ${config.hoverTextClass}` : `text-gray-700 ${config.hoverTextClass}`}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.name}
                </a>
              ) : (
                <Link
                  key={link.name + link.path}
                  to={link.path}
                  className={`text-sm font-medium transition-colors relative ${isActive(link.path) ? `text-gray-900 ${config.hoverTextClass}` : `text-gray-700 ${config.hoverTextClass}`}`}
                >
                  {link.name}
                  {isActive(link.path) && (
                    <span className={`absolute -bottom-[21px] left-0 right-0 h-0.5 ${config.underlineClass}`} />
                  )}
                </Link>
              )
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${mobileMenu.burgerRing}`}
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" aria-hidden />
            ) : (
              <Menu className="h-6 w-6" aria-hidden />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu — colours follow the active route (see headerConfig.mobileMenu) */}
      {isMenuOpen && (
        <div
          className={`md:hidden max-h-[min(70vh,calc(100dvh-3.5rem))] overflow-y-auto overscroll-contain backdrop-blur-sm ${mobileMenu.panel}`}
        >
          <nav className="space-y-1 px-3 py-3 sm:px-4 sm:py-4">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              const itemClass = `block rounded-xl px-4 py-3 text-[15px] transition-colors ${
                active ? mobileMenu.linkActive : mobileMenu.linkIdle
              }`;
              return link.path && link.path.startsWith("http") ? (
                <a
                  key={link.name + link.path}
                  href={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={itemClass}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.name}
                </a>
              ) : (
                <Link
                  key={link.name + link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={itemClass}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;

