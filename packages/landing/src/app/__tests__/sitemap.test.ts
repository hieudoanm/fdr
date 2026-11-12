import sitemap from '../sitemap';
import { listSchedules } from '@/data';

describe('sitemap', () => {
  it('lists the app routes under the site base', () => {
    const urls = sitemap().map((entry) => entry.url);
    expect(urls).toContain('https://hieudoanm.github.io/fdr/');
    expect(urls).toContain('https://hieudoanm.github.io/fdr/foods/wheel/');
    expect(urls).toContain('https://hieudoanm.github.io/fdr/foods/randomizer/');
    expect(urls).toContain('https://hieudoanm.github.io/fdr/foods/dishes/');
    expect(urls).toContain('https://hieudoanm.github.io/fdr/drinks/wheel/');
    expect(urls).toContain(
      'https://hieudoanm.github.io/fdr/drinks/randomizer/'
    );
    expect(urls).toContain('https://hieudoanm.github.io/fdr/drinks/dishes/');
    expect(urls).toContain('https://hieudoanm.github.io/fdr/snacks/wheel/');
    expect(urls).toContain(
      'https://hieudoanm.github.io/fdr/snacks/randomizer/'
    );
    expect(urls).toContain('https://hieudoanm.github.io/fdr/snacks/dishes/');
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
