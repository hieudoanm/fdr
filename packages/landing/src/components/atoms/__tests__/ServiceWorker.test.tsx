import { render } from '@testing-library/react';
import { ServiceWorker } from '../ServiceWorker';
import { useSWRegister } from '@/hooks/useSWRegister';

vi.mock('@/hooks/useSWRegister', () => ({ useSWRegister: vi.fn() }));

describe('ServiceWorker', () => {
  it('registers the service worker and renders nothing', () => {
    const { container } = render(<ServiceWorker />);
    expect(useSWRegister).toHaveBeenCalled();
    expect(container).toBeEmptyDOMElement();
  });
});
