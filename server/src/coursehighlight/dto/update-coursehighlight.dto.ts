import { PartialType } from '@nestjs/swagger';
import { CreateCoursehighlightDto } from './create-coursehighlight.dto';

export class UpdateCoursehighlightDto extends PartialType(CreateCoursehighlightDto) {}
