import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LecturesubtitlesService } from './lecturesubtitles.service';
import { CreateLecturesubtitleDto } from './dto/create-lecturesubtitle.dto';
import { UpdateLecturesubtitleDto } from './dto/update-lecturesubtitle.dto';

@Controller('lecturesubtitles')
export class LecturesubtitlesController {
  constructor(private readonly lecturesubtitlesService: LecturesubtitlesService) {}

  @Post()
  create(@Body() createLecturesubtitleDto: CreateLecturesubtitleDto) {
    return this.lecturesubtitlesService.create(createLecturesubtitleDto);
  }

  // @Get()
  // findAll() {
  //   return this.lecturesubtitlesService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.lecturesubtitlesService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateLecturesubtitleDto: UpdateLecturesubtitleDto) {
  //   return this.lecturesubtitlesService.update(+id, updateLecturesubtitleDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.lecturesubtitlesService.remove(+id);
  // }
}
