import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { CoursesModule } from './courses/courses.module';
import { CourseobjectivesModule } from './courseobjectives/courseobjectives.module';
import { CoursehighlightModule } from './coursehighlight/coursehighlight.module';
import { CourseinstructorsModule } from './courseinstructors/courseinstructors.module';
import { SectionsModule } from './sections/sections.module';
import { ItemsModule } from './items/items.module';

@Module({
  imports: [ConfigModule.forRoot({}), PrismaModule, CoursesModule, CourseobjectivesModule, CoursehighlightModule, CourseinstructorsModule, SectionsModule, ItemsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
