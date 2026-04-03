
export interface CacheInvalidateOptions {
  keys?: string[];           // exact keys  → del('user:["123"]')
  patterns?: string[];       // glob patterns → SCAN 'user:*'
  buildKeys?: (...args: any[]) => string[];  // dynamic keys from method args
}

export function CacheInvalidate(options: CacheInvalidateOptions) {
  return (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) => {
    const original = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      // Run the original method first
      const result = await original.apply(this, args);

      try {
            const cache = this.cacheService;
            if (!cache) {
                console.warn("Cache service is missing unable to use CacheInvalidate!");
                return result;
            }

            const tasks: Promise<void>[] = [];

            // 1. Delete exact keys
            if (options.keys?.length) {
                options.keys.forEach(key => tasks.push(cache.del(key)));
            }

            // 2. Delete by pattern using SCAN
            if (options.patterns?.length) {
                console.log(`deleting some pattern--> ${JSON.stringify(options.patterns)}`);
                options.patterns.forEach(pattern =>
                tasks.push(cache.delByPattern(pattern)),
                );
            }

            // 3. Dynamic keys built from method arguments
            if (options.buildKeys) {
                const dynamicKeys = options.buildKeys(...args);
                console.log(`dyamic keys, ${JSON.stringify(dynamicKeys)}
                    `);
                dynamicKeys.forEach(key => tasks.push(cache.del(key)));
            }

            let promiseRes = await Promise.all(tasks);
            console.log(JSON.stringify(promiseRes));
        } catch(err) {
            console.error("CacheInvalidate failed:", err);
        }
      return result;
    };

    return descriptor;
  };
}