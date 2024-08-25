import { Module } from '@nestjs/common';
import { CourseobjectivesService } from './courseobjectives.service';
import { CourseobjectivesController } from './courseobjectives.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [CourseobjectivesController],
  providers: [CourseobjectivesService],
  imports: [PrismaModule],
})
export class CourseobjectivesModule {}
