import { MessageSquare, Github } from 'lucide-react';
import { ModeToggle } from './mode-toggle';

export function Footer() {
  return (
    <footer className="border-t bg-muted/30 flex-shrink-0">
      <div className="mx-auto px-6 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left section */}
          <div className="flex flex-col md:flex-row items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Made with ❤️ in Queensland, Australia 🦘🇦🇺</span>
            </div>
            <div className="hidden md:block text-muted-foreground">•</div>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/qvirtualofficial/flight-tracking-configuration"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="https://github.com/qvirtualofficial/flight-tracking-configuration/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Feedback"
              >
                <MessageSquare className="h-4 w-4" />
              </a>
              <a
                href="https://x.com/xi2066"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="X (Twitter)"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Partnered with</span>
              <a
                href="https://qvirtual.com.au"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-opacity hover:opacity-80"
              >
                <img 
                  src="https://crew.qvirtual.com.au/assets/images/logos/logo-dark-new.png" 
                  alt="QVirtual" 
                  className="h-6 dark:hidden"
                />
                <img 
                  src="https://crew.qvirtual.com.au/assets/images/logos/logo-lite-new.png" 
                  alt="QVirtual" 
                  className="h-6 hidden dark:block"
                />
              </a>
            </div>
            <ModeToggle />
          </div>
        </div>
      </div>
    </footer>
  );
}