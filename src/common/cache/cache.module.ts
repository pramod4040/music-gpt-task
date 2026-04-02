import { Global, Module } from '@nestjs/common';
import { CacheService } from './cache.service';

@Global() // available in every module, no imports needed
@Module({
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {}