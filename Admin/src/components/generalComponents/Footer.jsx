import React from "react";
import { FiGithub, FiLinkedin, FiTwitter } from "react-icons/fi";
import FooterBG from "../../assets/B-g.jpg"; // <-- import background image

const socialLinks = [
  { Icon: FiGithub, href: "https://github.com/", label: "GitHub" },
  { Icon: FiLinkedin, href: "https://linkedin.com/", label: "LinkedIn" },
  { Icon: FiTwitter, href: "https://twitter.com/", label: "Twitter" },
];

const Footer = () => {
  return (
    <footer
      className="relative text-gray-300 overflow-hidden border-t border-white/10"
      style={{
        backgroundImage: `url(${FooterBG})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60 pointer-events-none"></div>

      {/* Subtle Glow */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.08),transparent_70%)]"></div>

      <div className="relative container mx-auto px-6 py-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Brand Section */}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-2 text-gray-100 tracking-tight">
            SnapFix
          </h2>
          <p className="text-sm text-gray-400 max-w-md leading-snug">
            Report. Resolve. Evolve. <br />
            A space that helps you report, resolve, and make the change.
          </p>
        </div>

        {/* Social Section */}
        <div className="flex flex-col items-start md:items-end">
          <h3 className="text-xs font-semibold mb-2 text-gray-200 uppercase tracking-wide">
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
                className="p-2 rounded-full bg-white/5 border border-white/10 hover:border-blue-500 hover:bg-blue-600/10 hover:scale-110 transition-all duration-300 flex items-center justify-center"
              >
                <Icon
                  size={18}
                  className="text-gray-300 hover:text-blue-400 transition-colors duration-300"
                />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t border-white/10 py-3 text-center text-xs text-gray-400 bg-[#0B1C2E]/80 backdrop-blur-sm flex flex-col md:flex-row justify-center items-center gap-1 md:gap-2">
        <span>
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold text-blue-400">SnapFix</span>
        </span>
        <span className="hidden md:inline">·</span>
        <span>
          Built with <span className="text-red-500">❤️</span> during Hackathon
          Hours
        </span>
      </div>
    </footer>
  );
};

export default Footer;
