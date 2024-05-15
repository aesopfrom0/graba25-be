import { ShutdownService } from '@graba25-be/providers/shutdown/shutdown.service';
import { Module } from '@nestjs/common';

@Module({
  providers: [ShutdownService],
  exports: [ShutdownService],
})
export class ShutdownModule {}
