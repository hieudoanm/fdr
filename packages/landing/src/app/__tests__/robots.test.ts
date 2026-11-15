import robots from '../robots';

describe('robots', () => {
  it('returns correct rules', () => {
    const result = robots();
    const rules = result.rules as {
      userAgent: string | string[];
      allow: string;
    }[];
    expect(rules).toHaveLength(2);
    expect(rules[0].userAgent).toBe('*');
    expect(rules[0].allow).toBe('/');
    expect(rules[1].userAgent).toContain('GPTBot');
    expect(rules[1].userAgent).toContain('ClaudeBot');
    expect(rules[1].allow).toBe('/');
  });

  it('returns sitemap URL', () => {
    const result = robots();
    expect(result.sitemap).toBe('https://hieudoanm.github.io/fdr/sitemap.xml');
  });
});
