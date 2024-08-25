import { Module } from '@nestjs/common';
import { CoursehighlightModule } from 'src/coursehighlight/coursehighlight.module';
import { CourseobjectivesModule } from 'src/courseobjectives/courseobjectives.module';
import { CoursesModule } from 'src/courses/courses.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ModulecoursesController } from './modulecourses.controller';
import { ModulecoursesService } from './modulecourses.service';
import { CourseinstructorsModule } from 'src/courseinstructors/courseinstructors.module';

@Module({
  controllers: [ModulecoursesController],
  providers: [ModulecoursesService],
  imports: [PrismaModule, CoursesModule, CourseobjectivesModule, CoursehighlightModule, CourseinstructorsModule],
})
export class ModulecoursesModule {}
