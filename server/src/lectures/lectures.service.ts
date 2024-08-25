import { Injectable } from '@nestjs/common';
import { CreateLectureDto } from './dto/create-lecture.dto';
import { UpdateLectureDto } from './dto/update-lecture.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { mapColumnsToKeys } from 'src/utils/helper';

@Injectable()
export class LecturesService {
  constructor(private prismaService: PrismaService) {}

  async create(createLectureDto: CreateLectureDto) {
    try {
      const res = await this.prismaService.$queryRaw`CALL create_course_lecture(
        ${createLectureDto.courseId},
        ${createLectureDto.sectionId},
        ${createLectureDto.itemId},
        ${createLectureDto.resource},
        ${createLectureDto.url},
        ${createLectureDto.duration});`;

      return true;
    } catch (error) {
      console.error('Error executing stored procedure:', error);
      return 'Error: An error occurred while creating the lecture';
    }
  }

  // findAll() {
  //   return `This action returns all lectures`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} lecture`;
  // }

  // update(id: number, updateLectureDto: UpdateLectureDto) {
  //   return `This action updates a #${id} lecture`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} lecture`;
  // }
}
