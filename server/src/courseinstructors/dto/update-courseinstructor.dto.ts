import { PartialType } from '@nestjs/swagger';
import { CreateCourseinstructorDto } from './create-courseinstructor.dto';

export class UpdateCourseinstructorDto extends PartialType(CreateCourseinstructorDto) {}
