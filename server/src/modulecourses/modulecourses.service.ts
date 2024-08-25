import { Injectable } from '@nestjs/common';
import { CreateModulecourseDto } from './dto/create-modulecourse.dto';
import { UpdateModulecourseDto } from './dto/update-modulecourse.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CoursesService } from 'src/courses/courses.service';
import { CreateCourseDto } from 'src/courses/dto/create-course.dto';
import { CourseobjectivesService } from 'src/courseobjectives/courseobjectives.service';
import { CreateCourseobjectiveDto } from 'src/courseobjectives/dto/create-courseobjective.dto';
import { CoursehighlightService } from 'src/coursehighlight/coursehighlight.service';
import { CourseinstructorsService } from 'src/courseinstructors/courseinstructors.service';

@Injectable()
export class ModulecoursesService {
  constructor(
    private prismaService: PrismaService,
    private readonly coursesService: CoursesService,
    private readonly courseobjectivesService: CourseobjectivesService,
    private readonly coursehighlightService: CoursehighlightService,
    private readonly courseinstructorsService: CourseinstructorsService,
  ) {}
  async create(createModulecourseDto: CreateModulecourseDto) {
    console.log(createModulecourseDto);
    const createCourseDto: CreateCourseDto = {
      title: createModulecourseDto.basicInformation.title,
      subtitle: createModulecourseDto.basicInformation.subtitle,
      description: createModulecourseDto.basicInformation.description,
      language: createModulecourseDto.basicInformation.language,
      requirement: createModulecourseDto.advanceInformation.requirements
        ? createModulecourseDto.advanceInformation.requirements.join(', ')
        : 'No requirements available',
      image: 'https://picsum.photos/300/200', // You can set a default value or derive it from the DTO if available
      tierId: 1, // Set default value or extract from DTO if available
      subcategoryId: 1, // Set default value or extract from DTO if available
    };
    console.log(createCourseDto);
    var courseId = await this.coursesService.createCourse(createCourseDto);
    courseId = Number(String(courseId).replace(/"/g, ''));

    console.log(`Created course with ID: ${courseId}`);

    const createCourseObjectiveDto: CreateCourseobjectiveDto[] =
      createModulecourseDto.advanceInformation.objectifs.map((objective) => ({
        courseId: courseId,
        objective: objective,
      }));

    const saveObjectives = async () => {
      for (const dto of createCourseObjectiveDto) {
        try {
          const res = await this.courseobjectivesService.create(dto);
          console.log('a', res);
        } catch (error) {
          console.error('Error creating course objective:', error);
        }
      }
    };

    await saveObjectives();

    const createCourseHighlightDto = {
      courseId: courseId,
    };

    const res = await this.coursehighlightService.create(
      createCourseHighlightDto,
    );

    console.log('b', res);

    const createCourseInstructorDto = {
      courseId: courseId,
      instructorId: 1,
      profitPercent: 100,
    };

    const res2 = await this.courseinstructorsService.create(
      createCourseInstructorDto,
    );

    console.log('c', res2);

    console.log('This action adds a new modulecourse');
    return 'This action adds a new modulecourse';
  }
}
