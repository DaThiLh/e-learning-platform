import { PartialType } from '@nestjs/swagger';
import { CreateModulecourseDto } from './create-modulecourse.dto';

export class UpdateModulecourseDto extends PartialType(CreateModulecourseDto) {}
