import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CourseobjectivesService } from './courseobjectives.service';
import { CreateCourseobjectiveDto } from './dto/create-courseobjective.dto';
import { UpdateCourseobjectiveDto } from './dto/update-courseobjective.dto';

@Controller('courseobjectives')
export class CourseobjectivesController {
  constructor(private readonly courseobjectivesService: CourseobjectivesService) {}

@Post()
create(@Body() createCourseobjectiveDto: CreateCourseobjectiveDto) {
  return this.courseobjectivesService.create(createCourseobjectiveDto);
}

  // @Get()
  // findAll() {
  //   return this.courseobjectivesService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.courseobjectivesService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateCourseobjectiveDto: UpdateCourseobjectiveDto) {
  //   return this.courseobjectivesService.update(+id, updateCourseobjectiveDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.courseobjectivesService.remove(+id);
  // }
}
