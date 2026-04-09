import { renderHook, waitFor } from '@testing-library/react';
import { useLandlordStats } from '../useLandlordStats';
import { apiGet, ApiError } from '@/services/api-client';

// Mock the API client
jest.mock('@/services/api-client');
const mockedApiGet = apiGet as jest.MockedFunction<typeof apiGet>;

describe('useLandlordStats', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return initial loading state', () => {
    mockedApiGet.mockImplementation(() => new Promise(() => {})); // Never resolves

    const { result } = renderHook(() => useLandlordStats());

    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBe('');
    expect(result.current.stats).toEqual({
      propertiesCount: 0,
      tenantsCount: 0,
      pendingPayments: 0,
      totalCollected: 0,
    });
  });

  it('should fetch and display stats successfully', async () => {
    const mockStats = {
      propertiesCount: 5,
      tenantsCount: 12,
      pendingPayments: 3,
      totalCollected: 150000,
    };

    mockedApiGet.mockResolvedValue(mockStats);

    const { result } = renderHook(() => useLandlordStats());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.stats).toEqual(mockStats);
    expect(result.current.error).toBe('');
    expect(mockedApiGet).toHaveBeenCalledWith('/api/dashboard/summary');
  });

  it('should handle API errors', async () => {
    const apiError = new ApiError('Failed to fetch', 500);
    mockedApiGet.mockRejectedValue(apiError);

    const { result } = renderHook(() => useLandlordStats());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Server error. Please try again later.');
    expect(result.current.stats).toEqual({
      propertiesCount: 0,
      tenantsCount: 0,
      pendingPayments: 0,
      totalCollected: 0,
    });
  });

  it('should handle 401 errors', async () => {
    const apiError = new ApiError('Unauthorized', 401);
    mockedApiGet.mockRejectedValue(apiError);

    const { result } = renderHook(() => useLandlordStats());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Please log in to view your dashboard.');
  });

  it('should handle 403 errors', async () => {
    const apiError = new ApiError('Forbidden', 403);
    mockedApiGet.mockRejectedValue(apiError);

    const { result } = renderHook(() => useLandlordStats());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('You don\'t have permission to view this data.');
  });

  it('should handle 429 errors', async () => {
    const apiError = new ApiError('Too many requests', 429);
    mockedApiGet.mockRejectedValue(apiError);

    const { result } = renderHook(() => useLandlordStats());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Too many requests. Please wait a moment.');
  });

  it('should retry on server errors', async () => {
    // First call fails with 500
    mockedApiGet
      .mockRejectedValueOnce(new ApiError('Server error', 500))
      .mockRejectedValueOnce(new ApiError('Server error', 500))
      .mockResolvedValueOnce({
        propertiesCount: 1,
        tenantsCount: 2,
        pendingPayments: 0,
        totalCollected: 50000,
      });

    const { result } = renderHook(() => useLandlordStats());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    }, { timeout: 5000 });

    expect(result.current.stats.propertiesCount).toBe(1);
    expect(mockedApiGet).toHaveBeenCalledTimes(3);
  });

  it('should provide retry function', async () => {
    mockedApiGet.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useLandlordStats());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.retry).toBeDefined();
    expect(typeof result.current.retry).toBe('function');
  });

  it('should track retry count', async () => {
    mockedApiGet.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useLandlordStats());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.retryCount).toBe(0);

    result.current.retry();

    expect(result.current.retryCount).toBe(1);
  });
});
