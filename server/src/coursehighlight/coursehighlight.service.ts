import { Injectable } from '@nestjs/common';
import { CreateCoursehighlightDto } from './dto/create-coursehighlight.dto';
import { UpdateCoursehighlightDto } from './dto/update-coursehighlight.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import json, { mapColumnsToKeys } from 'src/utils/helper';

@Injectable()
export class CoursehighlightService {
  constructor(private prismaService: PrismaService) {}

  async create(createCoursehighlightDto: CreateCoursehighlightDto) {
    const res: any = await this.prismaService
      .$queryRaw`CALL create_course_highlight(
      ${createCoursehighlightDto.courseId}
    );`;

    const coursehighlight = JSON.parse(json(res));

    const columns = [
      'id',
      'title',
      'subtitle',
      'description',
      'language',
      'requirement',
      'image',
      'tierId',
      'status',
      'subCategoryId',
    ];

    const newCoursehighlight = mapColumnsToKeys(columns, coursehighlight);

    return { data: newCoursehighlight };
  }

  // findAll() {
  //   return `This action returns all coursehighlight`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} coursehighlight`;
  // }

  // update(id: number, updateCoursehighlightDto: UpdateCoursehighlightDto) {
  //   return `This action updates a #${id} coursehighlight`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} coursehighlight`;
  // }
}
