import React from "react";
import { FiGithub, FiLinkedin, FiTwitter } from "react-icons/fi";

const socialLinks = [
  { Icon: FiGithub, href: "https://github.com/", label: "GitHub" },
  { Icon: FiLinkedin, href: "https://linkedin.com/", label: "LinkedIn" },
  { Icon: FiTwitter, href: "https://twitter.com/", label: "Twitter" },
];

const Footer = () => {
  return (
    <footer className="relative bg-linear-to-b from-gray-900 via-gray-950 to-black text-gray-300 overflow-hidden border-t border-gray-800">
      {/* Subtle Floating Glow */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.08),transparent_70%)]"></div>

      <div className="relative container mx-auto px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Brand Section */}
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold mb-1 bg-linear-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent tracking-wide animate-gradient-x">
            SnapFix
          </h2>
          <p className="text-xs text-gray-400 max-w-md leading-snug">
            Report. Resolve. Evolve.<br />
            A space that helps you report, resolve, and make the change.
          </p>
        </div>

        {/* Social Section */}
        <div className="flex flex-col items-start md:items-end">
          <h3 className="text-xs font-semibold mb-1 text-white">Connect With Us</h3>
          <div className="flex items-center gap-2">
            {socialLinks.map(({ Icon, href, label }, idx) => (
              <a
                key={idx}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="p-1.5 rounded-full bg-gray-800/30 border border-gray-700 hover:border-indigo-500 hover:bg-indigo-500/20 hover:scale-110 transition-transform duration-300 flex items-center justify-center"
              >
                <Icon size={18} className="text-gray-300 hover:text-indigo-400 transition-colors duration-300" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t border-gray-800 py-2 text-center text-xs text-gray-400 backdrop-blur-sm bg-gray-900/60 flex flex-col md:flex-row justify-center items-center gap-1 md:gap-2">
        <span>
          © {new Date().getFullYear()} <span className="font-semibold text-indigo-400">SnapFix</span>
        </span>
        <span className="hidden md:inline">·</span>
        <span>Built with <span className="text-red-500">❤️</span> during Hackathon Hours</span>
      </div>
    </footer>
  );
};

export default Footer;
