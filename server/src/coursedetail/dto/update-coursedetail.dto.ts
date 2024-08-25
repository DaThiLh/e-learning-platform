import { PartialType } from '@nestjs/swagger';
import { CreateCoursedetailDto } from './create-coursedetail.dto';

export class UpdateCoursedetailDto extends PartialType(CreateCoursedetailDto) {}
