export function Cacheable(keyPrefix: string, ttl = 60) {
  return (
    _target: any,
    _propertyKey: string,
    descriptor: PropertyDescriptor,
  ) => {
    const original = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      // Expects `this.cacheService: CacheService` on the class
      const cache = this.cacheService;

      if (!cache) {
        // Fallback: if no cacheService, just call original
        console.warn('Please import cache service to use cacheable!');
        return original.apply(this, args);
      }
      const key = `${keyPrefix}:${JSON.stringify(args)}`;
      console.log(`redis cache key ${key}`);
      return cache.getOrSet(key, () => original.apply(this, args), ttl);
    };

    return descriptor;
  };
}