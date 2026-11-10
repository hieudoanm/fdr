import sitemap from '../sitemap';
import { listSchedules } from '@/data';

describe('sitemap', () => {
  it('lists the app routes under the site base', () => {
    const urls = sitemap().map((entry) => entry.url);
    expect(urls).toContain('https://hieudoanm.github.io/fdr/');
    expect(urls).toContain('https://hieudoanm.github.io/fdr/wheel/');
    expect(urls).toContain('https://hieudoanm.github.io/fdr/randomizer/');
    expect(urls).toContain('https://hieudoanm.github.io/fdr/dishes/');
    expect(urls).toContain('https://hieudoanm.github.io/fdr/schedule/');
  });

  it('includes every schedule detail page', () => {
    const urls = sitemap().map((entry) => entry.url);
    listSchedules().forEach((schedule) => {
      expect(urls).toContain(
        `https://hieudoanm.github.io/fdr/schedule/${schedule.slug}/`
      );
    });
  });
});
