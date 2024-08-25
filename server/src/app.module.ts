import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { CoursesModule } from './courses/courses.module';
import { CourseobjectivesModule } from './courseobjectives/courseobjectives.module';
import { CoursehighlightModule } from './coursehighlight/coursehighlight.module';
import { CourseinstructorsModule } from './courseinstructors/courseinstructors.module';
import { SectionsModule } from './sections/sections.module';
import { ItemsModule } from './items/items.module';
import { LecturesModule } from './lectures/lectures.module';
import { LecturesubtitlesModule } from './lecturesubtitles/lecturesubtitles.module';

@Module({
  imports: [ConfigModule.forRoot({}), PrismaModule, CoursesModule, CourseobjectivesModule, CoursehighlightModule, CourseinstructorsModule, SectionsModule, ItemsModule, LecturesModule, LecturesubtitlesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
