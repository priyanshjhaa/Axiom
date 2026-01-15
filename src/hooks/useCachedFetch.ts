'use client';

import { useState, useEffect, useRef } from 'react';

// Simple in-memory cache
const memoryCache = new Map<string, { data: any; timestamp: number }>();

interface CachedFetchOptions {
  cacheKey: string;
  cacheTime?: number; // Time in milliseconds (default: 5 minutes)
  enabled?: boolean;
}

export function useCachedFetch<T = any>(
  fetcher: () => Promise<T>,
  options: CachedFetchOptions
) {
  const { cacheKey, cacheTime = 5 * 60 * 1000, enabled = true } = options;

  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefetching, setIsRefetching] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const isInitialMount = useRef(true);

  useEffect(() => {
    if (!enabled) {
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const now = Date.now();
        const cached = memoryCache.get(cacheKey);

        // Check if we have valid cached data
        if (cached && now - cached.timestamp < cacheTime) {
          setData(cached.data);
          setIsLoading(false);

          // Refetch in background for fresh data
          setIsRefetching(true);
          const freshData = await fetcher();
          memoryCache.set(cacheKey, { data: freshData, timestamp: now });
          setData(freshData);
          setIsRefetching(false);
        } else {
          // No valid cache, fetch fresh
          setIsLoading(true);
          const freshData = await fetcher();
          memoryCache.set(cacheKey, { data: freshData, timestamp: now });
          setData(freshData);
          setIsLoading(false);
        }
      } catch (err) {
        setError(err as Error);
        setIsLoading(false);
        setIsRefetching(false);
      }
    };

    fetchData();
  }, [cacheKey, cacheTime, enabled, fetcher]);

  // Function to manually invalidate and refetch
  const invalidate = () => {
    memoryCache.delete(cacheKey);
  };

  // Function to manually refetch
  const refetch = async () => {
    setIsRefetching(true);
    try {
      const freshData = await fetcher();
      memoryCache.set(cacheKey, { data: freshData, timestamp: Date.now() });
      setData(freshData);
      setIsRefetching(false);
    } catch (err) {
      setError(err as Error);
      setIsRefetching(false);
    }
  };

  return { data, isLoading, isRefetching, error, invalidate, refetch };
}

// Hook to clear all cache (useful after logout)
export function useClearCache() {
  return () => {
    memoryCache.clear();
  };
}
