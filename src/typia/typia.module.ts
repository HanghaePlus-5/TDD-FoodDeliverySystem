import { Module } from '@nestjs/common';
import { TypiaService } from './typia.service';
import { TypiaController } from './typia.controller';

@Module({
  controllers: [TypiaController],
  providers: [TypiaService]
})
export class TypiaModule {}
