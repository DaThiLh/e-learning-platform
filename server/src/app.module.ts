import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { CoursesModule } from './courses/courses.module';
import { CourseobjectivesModule } from './courseobjectives/courseobjectives.module';
import { CoursehighlightModule } from './coursehighlight/coursehighlight.module';
import { CourseinstructorsModule } from './courseinstructors/courseinstructors.module';
import { CreatecourseModule } from './createcourse/createcourse.module';

@Module({
  imports: [ConfigModule.forRoot({}), PrismaModule, CoursesModule, CourseobjectivesModule, CoursehighlightModule, CourseinstructorsModule, CreatecourseModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
