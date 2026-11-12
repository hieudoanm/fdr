import type { FC } from 'react';
import { PiGithubLogo } from 'react-icons/pi';

const GITHUB_URL = 'https://github.com/hieudoanm/fdr';

const Footer: FC = () => (
  <footer className="border-base-content/10 border-t">
    <div className="text-base-content/50 mx-auto flex w-full max-w-6xl flex-wrap items-center gap-3 px-5 py-6 text-xs">
      <span>© {new Date().getFullYear()} fdr</span>
      <span>Food &amp; Drink · Static site · MIT licensed</span>
      <nav aria-label="Footer" className="ml-auto flex items-center gap-5">
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-primary inline-flex items-center gap-1.5 font-semibold transition-colors">
          <PiGithubLogo className="h-4 w-4" />
          GitHub
        </a>
        <a
          href={`${GITHUB_URL}#readme`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-primary font-semibold transition-colors">
          README
        </a>
      </nav>
    </div>
  </footer>
);

export default Footer;
