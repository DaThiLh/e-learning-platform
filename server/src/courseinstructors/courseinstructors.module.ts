import { Module } from '@nestjs/common';
import { CourseinstructorsService } from './courseinstructors.service';
import { CourseinstructorsController } from './courseinstructors.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [CourseinstructorsController],
  providers: [CourseinstructorsService],
  imports: [PrismaModule],
})
export class CourseinstructorsModule {}
