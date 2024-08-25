import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { CoursesModule } from './courses/courses.module';
import { CourseobjectivesModule } from './courseobjectives/courseobjectives.module';
import { CoursehighlightModule } from './coursehighlight/coursehighlight.module';
import { CourseinstructorsModule } from './courseinstructors/courseinstructors.module';
import { SectionsModule } from './sections/sections.module';
import { ItemsModule } from './items/items.module';
import { CoursedetailModule } from './coursedetail/coursedetail.module';
import { LecturesModule } from './lectures/lectures.module';
import { LecturesubtitlesModule } from './lecturesubtitles/lecturesubtitles.module';
import { ReadShoppingCartModule } from './read_shopping_cart/read_shopping_cart.module';
import { PaymentModule } from './payment/payment.module';
import { ModulecoursesModule } from './modulecourses/modulecourses.module';

@Module({
  imports: [
    ConfigModule.forRoot({}),
    CoursedetailModule,
    PrismaModule,
    CoursesModule,
    CourseobjectivesModule,
    CoursehighlightModule,
    CourseinstructorsModule,
    SectionsModule,
    ItemsModule,
    LecturesModule,
    LecturesubtitlesModule, ReadShoppingCartModule, ModulecoursesModule,
    PaymentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
