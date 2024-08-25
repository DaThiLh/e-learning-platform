import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CoursehighlightService } from './coursehighlight.service';
import { CreateCoursehighlightDto } from './dto/create-coursehighlight.dto';
import { UpdateCoursehighlightDto } from './dto/update-coursehighlight.dto';

@Controller('coursehighlight')
export class CoursehighlightController {
  constructor(private readonly coursehighlightService: CoursehighlightService) {}

  @Post()
  create(@Body() createCoursehighlightDto: CreateCoursehighlightDto) {
    return this.coursehighlightService.create(createCoursehighlightDto);
  }

  // @Get()
  // findAll() {
  //   return this.coursehighlightService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.coursehighlightService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateCoursehighlightDto: UpdateCoursehighlightDto) {
  //   return this.coursehighlightService.update(+id, updateCoursehighlightDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.coursehighlightService.remove(+id);
  // }
}
