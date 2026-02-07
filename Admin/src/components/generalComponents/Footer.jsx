import React from "react";
import { FiGithub, FiLinkedin, FiTwitter } from "react-icons/fi";
import FooterBG from "../../assets/B-g.jpg";

const socialLinks = [
  { Icon: FiGithub, href: "https://github.com/", label: "GitHub" },
  { Icon: FiLinkedin, href: "https://linkedin.com/", label: "LinkedIn" },
  { Icon: FiTwitter, href: "https://twitter.com/", label: "Twitter" },
];

const Footer = () => {
  return (
    <footer className="relative text-gray-300 overflow-hidden border-t border-white/10">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${FooterBG})` }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/70" />

      {/* Subtle Blue Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.12),transparent_65%)]" />

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold text-gray-100 tracking-tight">
            SnapFix
          </h2>
          <p className="mt-2 text-sm text-gray-400 max-w-md leading-relaxed">
            Report. Resolve. Evolve.
            <br />
            A platform that helps citizens report issues and drive real change.
          </p>
        </div>

        {/* Social */}
        <div className="flex flex-col md:items-end">
          <h3 className="text-xs font-semibold mb-3 text-gray-300 uppercase tracking-wider">
            Connect With Us
          </h3>
          <div className="flex items-center gap-3">
            {socialLinks.map(({ Icon, href, label }, idx) => (
              <a
                key={idx}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="p-2 rounded-full bg-white/5 border border-white/10
                           hover:border-blue-400 hover:bg-blue-500/10
                           transition-all duration-300"
              >
                <Icon
                  size={18}
                  className="text-gray-300 hover:text-blue-400 transition-colors"
                />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t border-white/10 py-4 text-center text-xs text-gray-400 backdrop-blur-md bg-black/40">
        <span>
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold text-blue-400">SnapFix</span>
        </span>
        <span className="mx-2 hidden sm:inline">·</span>
        <span>
          Built with <span className="text-red-500">❤️</span> during Hackathon
          Hours
        </span>
      </div>
    </footer>
  );
};

export default Footer;

