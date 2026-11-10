import manifest from '../manifest';

describe('manifest', () => {
  it('returns a standalone web app manifest', () => {
    const result = manifest();
    expect(result.name).toContain('FDR');
    expect(result.short_name).toBe('FDR');
    expect(result.display).toBe('standalone');
    expect(result.start_url).toBe('./');
    expect(result.scope).toBe('./');
  });

  it('uses base-path-safe relative URLs', () => {
    const result = manifest();
    const urls = [
      result.start_url,
      result.scope,
      ...(result.icons ?? []).map((icon) => icon.src),
      ...(result.shortcuts ?? []).flatMap((shortcut) => [
        shortcut.url,
        ...(shortcut.icons ?? []).map((icon) => icon.src),
      ]),
    ];
    urls.forEach((url) => {
      expect(url).not.toMatch(/^\//);
    });
  });
});
