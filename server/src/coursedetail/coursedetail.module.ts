import { Module } from '@nestjs/common';
import { CoursedetailService } from './coursedetail.service';
import { CoursedetailController } from './coursedetail.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [CoursedetailController],
  providers: [CoursedetailService],
  imports: [PrismaModule],
})
export class CoursedetailModule {}
