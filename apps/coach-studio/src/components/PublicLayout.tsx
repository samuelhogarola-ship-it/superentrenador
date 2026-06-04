import type { PropsWithChildren } from 'react';
import { CookieBanner } from './CookieBanner';
import { PublicFooter } from './PublicFooter';

export function PublicLayout({ children }: PropsWithChildren) {
  return (
    <div className="public-layout">
      <main className="public-main">{children}</main>
      <PublicFooter />
      <CookieBanner />
    </div>
  );
}
