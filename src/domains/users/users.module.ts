import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DbServicesModule } from '@graba25-be/providers/databases/db/db-services.module';

@Module({
  imports: [DbServicesModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
