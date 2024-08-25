import { Module } from '@nestjs/common';
import { ModulecoursesService } from './modulecourses.service';
import { ModulecoursesController } from './modulecourses.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CoursesModule } from 'src/courses/courses.module';

@Module({
  controllers: [ModulecoursesController],
  providers: [ModulecoursesService],
  imports: [PrismaModule, CoursesModule],
})
export class ModulecoursesModule {}
