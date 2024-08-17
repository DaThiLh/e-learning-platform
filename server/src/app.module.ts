import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { CoursesModule } from './courses/courses.module';

@Module({
  imports: [ConfigModule.forRoot({}), PrismaModule, CoursesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
