import { Injectable } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Course } from '@prisma/client';
import json, { mapColumnsToKeys } from 'src/utils/helper';

@Injectable()
export class CoursesService {
  constructor(private prismaService: PrismaService) {}

  create(createCourseDto: CreateCourseDto) {
    return 'This action adds a new course';
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
      'subcategory_name',
      'students_enrolled',
      'average_rating',
      'sale_price',
      'intructor_name',
    ];
    const newCourses = mapColumnsToKeys(columns, courses);

    return newCourses;
  }

  findOne(id: number) {
    return `This action returns a #${id} course`;
  }

  update(id: number, updateCourseDto: UpdateCourseDto) {
    return `This action updates a #${id} course`;
  }

  remove(id: number) {
    return `This action removes a #${id} course`;
  }
}
