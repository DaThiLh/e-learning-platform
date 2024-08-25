import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CourseinstructorsService } from './courseinstructors.service';
import { CreateCourseinstructorDto } from './dto/create-courseinstructor.dto';
import { UpdateCourseinstructorDto } from './dto/update-courseinstructor.dto';

@Controller('courseinstructors')
export class CourseinstructorsController {
  constructor(private readonly courseinstructorsService: CourseinstructorsService) {}

  @Post()
  create(@Body() createCourseinstructorDto: CreateCourseinstructorDto) {
    return this.courseinstructorsService.create(createCourseinstructorDto);
  }

  // @Get()
  // findAll() {
  //   return this.courseinstructorsService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.courseinstructorsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateCourseinstructorDto: UpdateCourseinstructorDto) {
  //   return this.courseinstructorsService.update(+id, updateCourseinstructorDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.courseinstructorsService.remove(+id);
  // }
}
