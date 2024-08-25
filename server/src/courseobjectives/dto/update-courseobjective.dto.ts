import { PartialType } from '@nestjs/swagger';
import { CreateCourseobjectiveDto } from './create-courseobjective.dto';

export class UpdateCourseobjectiveDto extends PartialType(CreateCourseobjectiveDto) {}
