import { Link } from "react-router-dom";
import Logo from "@/components/ui/Logo";

const footerLinks = {
  Product: [
    { label: "Features", href: "/features" },
    { label: "Pricing", href: "/pricing" },
    { label: "Changelog", href: "#" },
    { label: "Roadmap", href: "#" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Contact", href: "#" },
  ],
  Resources: [
    { label: "Documentation", href: "#" },
    { label: "API", href: "#" },
    { label: "Community", href: "#" },
    { label: "Support", href: "#" },
  ],
  Legal: [
    { label: "Privacy", href: "#" },
    { label: "Terms", href: "#" },
    { label: "Cookies", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[#0A0A0A] text-white">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-8 lg:px-12">
        <div className="pt-24 pb-16">
          <div className="grid grid-cols-2 md:grid-cols-12 gap-10 lg:gap-16">
            <div className="col-span-2 md:col-span-4">
              <Logo textClassName="text-white" size={32} />
              <p className="mt-8 text-[#737373] text-sm leading-relaxed max-w-[280px]">
                AI-powered exam preparation. Upload your materials, generate personalized quizzes, and track your progress.
              </p>
              <div className="flex gap-3 mt-8">
                {[
                  <svg key="x" width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
                  <svg key="li" width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
                  <svg key="gh" width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .319.192.694.801.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>,
                ].map((icon, i) => (
                  <a key={i} href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#737373] hover:bg-white/10 hover:text-white transition-all">
                    {icon}
                  </a>
                ))}
              </div>
            </div>

            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title} className="col-span-1 md:col-span-2">
                <h4 className="text-sm font-semibold text-white mb-6">{title}</h4>
                <ul className="space-y-4">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link to={link.href} className="text-sm text-[#737373] hover:text-white transition-colors duration-200">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="h-px bg-[#1A1A1A]" />

        <div className="py-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-[#525252]">&copy; {new Date().getFullYear()} Excel. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="text-xs text-[#525252] hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="text-xs text-[#525252] hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="text-xs text-[#525252] hover:text-white transition-colors">Cookie Settings</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
