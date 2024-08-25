import { Injectable } from '@nestjs/common';
import { CreateModulecourseDto } from './dto/create-modulecourse.dto';
import { UpdateModulecourseDto } from './dto/update-modulecourse.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CoursesService } from 'src/courses/courses.service';
import { CreateCourseDto } from 'src/courses/dto/create-course.dto';

@Injectable()
export class ModulecoursesService {
  constructor(
    private prismaService: PrismaService,
    private readonly coursesService: CoursesService,
  ) {}
  async create(createModulecourseDto: CreateModulecourseDto) {
    console.log(createModulecourseDto);
    const createCourseDto: CreateCourseDto = {
      title: createModulecourseDto.basicInformation.title,
      subtitle: createModulecourseDto.basicInformation.subtitle,
      description: createModulecourseDto.basicInformation.description,
      language: createModulecourseDto.basicInformation.language,
      requirement: createModulecourseDto.advanceInformation.requirements.join(', '), // Convert array to comma-separated string
      image: 'https://picsum.photos/300/200', // You can set a default value or derive it from the DTO if available
      tierId: 1, // Set default value or extract from DTO if available
      subcategoryId: 1, // Set default value or extract from DTO if available
    };
    const courseId = await this.coursesService.createCourse(createCourseDto);

    console.log(`Created course with ID: ${courseId}`);
    return 'This action adds a new modulecourse';
  }

  // findAll() {
  //   return `This action returns all modulecourses`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} modulecourse`;
  // }

  // update(id: number, updateModulecourseDto: UpdateModulecourseDto) {
  //   return `This action updates a #${id} modulecourse`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} modulecourse`;
  // }
}
