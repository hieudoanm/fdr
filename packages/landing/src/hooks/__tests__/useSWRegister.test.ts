import { renderHook, waitFor } from '@testing-library/react';
import { useSWRegister } from '../useSWRegister';

describe('useSWRegister', () => {
  const unregister = vi.fn().mockResolvedValue(undefined);
  const register = vi.fn().mockResolvedValue({ scope: '/' });
  const serviceWorker = {
    getRegistrations: vi.fn().mockResolvedValue([{ unregister }]),
    register,
  };
  const cachesMock = {
    keys: vi.fn().mockResolvedValue(['old']),
    delete: vi.fn().mockResolvedValue(true),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(navigator, 'serviceWorker', {
      configurable: true,
      value: serviceWorker,
    });
    Object.defineProperty(global, 'caches', {
      configurable: true,
      value: cachesMock,
    });
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('unregisters workers and clears caches in development', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    renderHook(() => useSWRegister());

    await waitFor(() => {
      expect(unregister).toHaveBeenCalled();
      expect(cachesMock.delete).toHaveBeenCalledWith('old');
      expect(register).not.toHaveBeenCalled();
    });
  });

  it('registers the worker outside development', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    renderHook(() => useSWRegister());

    await waitFor(() => {
      expect(register).toHaveBeenCalledWith('/sw.js');
    });
    expect(unregister).not.toHaveBeenCalled();
  });
});
