import { Injectable } from '@nestjs/common';
import { CreateCourseobjectiveDto } from './dto/create-courseobjective.dto';
import { UpdateCourseobjectiveDto } from './dto/update-courseobjective.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import json, { mapColumnsToKeys } from 'src/utils/helper';

@Injectable()
export class CourseobjectivesService {
  constructor(private prismaService: PrismaService) {}

  async create(createCourseobjectiveDto: CreateCourseobjectiveDto) {
    const res : any = await this.prismaService.$queryRaw`CALL create_course_objective(
      ${createCourseobjectiveDto.courseId},
      ${createCourseobjectiveDto.objective}
    );`;

    const courseobjective = JSON.parse(json(res));

    const columns = ['courseId', 'objective'];

    const newCourseObjective = mapColumnsToKeys(columns, courseobjective);

    return {data: newCourseObjective};
  }

  findAll() {
    return `This action returns all courseobjectives`;
  }

  findOne(id: number) {
    return `This action returns a #${id} courseobjective`;
  }

  update(id: number, updateCourseobjectiveDto: UpdateCourseobjectiveDto) {
    return `This action updates a #${id} courseobjective`;
  }

  remove(id: number) {
    return `This action removes a #${id} courseobjective`;
  }
}
