import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ModulecoursesService } from './modulecourses.service';
import { CreateModulecourseDto } from './dto/create-modulecourse.dto';
import { UpdateModulecourseDto } from './dto/update-modulecourse.dto';

@Controller('modulecourses')
export class ModulecoursesController {
  constructor(private readonly modulecoursesService: ModulecoursesService) {}

  @Post()
  create(@Body() createModulecourseDto: CreateModulecourseDto) {
    return this.modulecoursesService.create(createModulecourseDto);
  }

  // @Get()
  // findAll() {
  //   return this.modulecoursesService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.modulecoursesService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateModulecourseDto: UpdateModulecourseDto) {
  //   return this.modulecoursesService.update(+id, updateModulecourseDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.modulecoursesService.remove(+id);
  // }
}
