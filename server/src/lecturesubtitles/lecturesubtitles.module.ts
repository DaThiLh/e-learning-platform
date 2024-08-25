import { Module } from '@nestjs/common';
import { LecturesubtitlesService } from './lecturesubtitles.service';
import { LecturesubtitlesController } from './lecturesubtitles.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [LecturesubtitlesController],
  providers: [LecturesubtitlesService],
  imports: [PrismaModule],
})
export class LecturesubtitlesModule {}
