import { PartialType } from '@nestjs/swagger';
import { CreateLecturesubtitleDto } from './create-lecturesubtitle.dto';

export class UpdateLecturesubtitleDto extends PartialType(CreateLecturesubtitleDto) {}
