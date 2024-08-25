import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import json, { mapColumnsToKeys } from 'src/utils/helper';

@Injectable()
export class CoursedetailService {
  constructor(private prismaService: PrismaService) {}

  async findOne(id: number) {
    const res: any[] = await this.prismaService
      .$queryRaw`CALL view_course_details(
      ${id});`;
    const coursesdetail = JSON.parse(json(res));
    console.log(res);

    const columns = [
      'course_id',
      'course_title',
      'course_subtitle',
      'course_description',
      'course_language',
      'course_requirement',
      'course_image',
      'course_tier_id',
      'course_status',
      'course_subcategory_id',
      'course_objectives',
      'subcategory_name',
      'tier_price',
      'instructor_name',
      'course_downloadable_documents',
      'course_students_enrolled',
      'course_average_rating',
      'course_sale_price',
      'course_no_sections',
      'course_duration',
      'promotional_program_names',
      'promotional_program_contents',
      'promotional_program_day_starts',
      'promotional_program_day_ends',
      'promotional_program_tier_differences',
      'section',
    ];
    const newCoursesDetail = mapColumnsToKeys(columns, coursesdetail);
    return newCoursesDetail[0];
  }
}
