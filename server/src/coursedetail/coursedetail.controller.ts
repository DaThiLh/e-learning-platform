import { Controller, Get, Param } from '@nestjs/common';
import { CoursedetailService } from './coursedetail.service';


@Controller('coursedetail')
export class CoursedetailController {
  constructor(private readonly coursedetailService: CoursedetailService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coursedetailService.findOne(+id);
  }
}
