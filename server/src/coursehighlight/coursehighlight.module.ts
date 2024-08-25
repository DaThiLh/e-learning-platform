import { Module } from '@nestjs/common';
import { CoursehighlightService } from './coursehighlight.service';
import { CoursehighlightController } from './coursehighlight.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [CoursehighlightController],
  providers: [CoursehighlightService],
  imports: [PrismaModule],
  exports: [CoursehighlightService],
})
export class CoursehighlightModule {}
