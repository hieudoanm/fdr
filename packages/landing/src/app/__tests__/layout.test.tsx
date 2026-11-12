import { render, screen } from '@testing-library/react';

jest.mock('@/styles/globals.css', () => ({}));
jest.mock('@/components/atoms/ServiceWorker', () => ({
  ServiceWorker: () => null,
}));

import RootLayout, { metadata, viewport } from '../layout';

describe('RootLayout', () => {
  it('renders children', () => {
    render(
      <RootLayout>
        <div>child</div>
      </RootLayout>
    );
    expect(screen.getByText('child')).toBeInTheDocument();
  });

  it('sets html data-theme', () => {
    render(
      <RootLayout>
        <div />
      </RootLayout>
    );
    expect(document.documentElement).toHaveAttribute('data-theme', 'fdr');
  });
});

describe('metadata', () => {
  it('has correct title', () => {
    expect(metadata.title).toBe('FDR');
  });
});
