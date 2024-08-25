import { Injectable } from '@nestjs/common';
import { CreateLecturesubtitleDto } from './dto/create-lecturesubtitle.dto';
import { UpdateLecturesubtitleDto } from './dto/update-lecturesubtitle.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LecturesubtitlesService {
  constructor(private prismaService: PrismaService) {}
  async create(createLecturesubtitleDto: CreateLecturesubtitleDto) {
    const res = await this.prismaService
      .$executeRaw`CALL create_course_lecture_subtitle(
      ${createLecturesubtitleDto.courseId},
      ${createLecturesubtitleDto.sectionId},
      ${createLecturesubtitleDto.lectureId},
      ${createLecturesubtitleDto.subtitleLanguage},
      ${createLecturesubtitleDto.subtitle}
      );`;

    return true;
  }

  // findAll() {
  //   return `This action returns all lecturesubtitles`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} lecturesubtitle`;
  // }

  // update(id: number, updateLecturesubtitleDto: UpdateLecturesubtitleDto) {
  //   return `This action updates a #${id} lecturesubtitle`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} lecturesubtitle`;
  // }
}
