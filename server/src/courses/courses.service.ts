import { Injectable } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Course } from '@prisma/client';
import json, { mapColumnsToKeys } from 'src/utils/helper';

@Injectable()
export class CoursesService {
  constructor(private prismaService: PrismaService) {}

  async createCourse(createCourseDto: CreateCourseDto): Promise<number> {
    let courseId: number;
    // CALL create_course('title', 'subtitle', 'description', 'language', 'requirement', 'image', 1, 1, @course_id);
    const res = await this.prismaService.$queryRaw`CALL create_course(
      ${createCourseDto.title},
      ${createCourseDto.subtitle},
      ${createCourseDto.description},
      ${createCourseDto.language},
      ${createCourseDto.requirement},
      ${createCourseDto.image},
      ${createCourseDto.tierId},
      ${createCourseDto.subcategoryId},
      @course_id
    );`;

    courseId = await this.prismaService.$queryRaw`Select @course_id as id;`;
    courseId = Number(courseId[0].id);
    return courseId;
  }

  findAll() {
    return this.prismaService.course.findMany();
  }

  // Service
  async getCoursesByProcedure() {
    const res: any[] = await this.prismaService
      .$queryRaw`CALL get_courses_for_student()`;
    const courses = JSON.parse(json(res));

    const columns = [
      'id',
      'title',
      'subcategoryName',
      'studentsEnrolled',
      'averageRating',
      'salePrice',
      'intructorName',
    ];
    const newCourses = mapColumnsToKeys(columns, courses);

    return { data: newCourses };
  }

  findOne(id: number) {
    return this.prismaService.course.findUnique({
      where: {
        id,
      },
    });
  }

  update(id: number, updateCourseDto: UpdateCourseDto) {
    return `This action updates a #${id} course`;
  }

  remove(id: number) {
    return `This action removes a #${id} course`;
  }
}
