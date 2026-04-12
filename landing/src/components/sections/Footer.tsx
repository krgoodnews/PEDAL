import { SITE_META, SECTION_COPY } from "@/constants/content";

export function Footer() {
  const links = SECTION_COPY.footer.links.map((link) => ({
    label: link.label,
    href: link.path ? `${SITE_META.githubUrl}${link.path}` : SITE_META.githubUrl,
  }));

  return (
    <footer className="relative border-t border-white/5 px-6 py-10">
      <div className="mx-auto max-w-5xl flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl font-black gradient-text">PEDAL</span>
          <span className="text-white/20">|</span>
          <span className="text-sm text-white/30">{SITE_META.license}</span>
        </div>

        <div className="flex items-center gap-6 text-sm text-white/30">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white/70 transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
