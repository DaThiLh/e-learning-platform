import { Injectable } from '@nestjs/common';
import { CreateCourseinstructorDto } from './dto/create-courseinstructor.dto';
import { UpdateCourseinstructorDto } from './dto/update-courseinstructor.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CourseinstructorsService {
  constructor(private prismaService: PrismaService) {}

  async create(
    createCourseinstructorDto: CreateCourseinstructorDto,
  ): Promise<string> {
    try {
      const result = await this.prismaService.$queryRaw<{ result: string }>`
        CALL create_course_instructor(
          ${createCourseinstructorDto.courseId},
          ${createCourseinstructorDto.instructorId},
          ${createCourseinstructorDto.profitPercent}
        );
      `;

      // Return the result message from the stored procedure
      if (result) {
        return 'Error: An error occurred while creating the course.';
      }
      return result[0].result;
    } catch (error) {
      console.error('Error executing stored procedure:', error);
      return 'Error: An error occurred while creating the course.';
    }
  }
  // findAll() {
  //   return `This action returns all courseinstructors`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} courseinstructor`;
  // }

  // update(id: number, updateCourseinstructorDto: UpdateCourseinstructorDto) {
  //   return `This action updates a #${id} courseinstructor`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} courseinstructor`;
  // }
}
