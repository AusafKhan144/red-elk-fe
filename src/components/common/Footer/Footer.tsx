import logo from "../../../assets/logo.svg";

const links = [
  { label: "Terms", href: "#" },
  { label: "Privacy", href: "#" },
  { label: "Contact", href: "#" },
];

export default function Footer() {
  return (
    <footer className="bg-elk-maroon">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl p-2 shrink-0">
              <img src={logo} alt="Red Elk" className="h-6 w-auto" />
            </div>
            <div>
              <p className="text-white text-sm font-bold">Red Elk</p>
              <p className="text-white/35 text-xs">AI Maturity Assessment Platform</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-sm">
            {links.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="text-white/40 hover:text-white/80 transition-colors"
              >
                {label}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/25 text-xs">
            © {new Date().getFullYear()} Red Elk. All rights reserved.
          </p>
          <p className="text-white/20 text-xs">Powered by Supabase &amp; Railway</p>
        </div>
      </div>
    </footer>
  );
}
