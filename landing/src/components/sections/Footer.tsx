import { SITE_META } from "@/constants/content";

export function Footer() {
  return (
    <footer className="relative border-t border-white/5 px-6 py-10">
      <div className="mx-auto max-w-5xl flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl font-black gradient-text">PEDAL</span>
          <span className="text-white/20">|</span>
          <span className="text-sm text-white/30">{SITE_META.license}</span>
        </div>

        <div className="flex items-center gap-6 text-sm text-white/30">
          <a
            href={SITE_META.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white/70 transition-colors duration-200"
          >
            GitHub
          </a>
          <a
            href={`${SITE_META.githubUrl}/blob/main/.pedal/PEDAL.md`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white/70 transition-colors duration-200"
          >
            Docs
          </a>
          <a
            href={`${SITE_META.githubUrl}/blob/main/README.md`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white/70 transition-colors duration-200"
          >
            README
          </a>
        </div>
      </div>
    </footer>
  );
}
