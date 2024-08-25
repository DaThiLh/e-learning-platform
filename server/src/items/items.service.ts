import { Injectable } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ItemsService {
  constructor(private prismaService: PrismaService) {}

  async create(createItemDto: CreateItemDto) {
    try {
      let itemId: number;
      const res = await this.prismaService.$transaction([
        this.prismaService.$executeRaw`CALL create_course_item(
          ${createItemDto.courseId},
          ${createItemDto.sectionId},
          ${createItemDto.title},
          ${createItemDto.description},
          ${createItemDto.itemType},
          @itemId);`,
        this.prismaService.$queryRaw`Select @itemId as id;`,
      ])
      itemId = res[1][0].id;
      return itemId;
    } catch (error) {
      console.error('Error executing stored procedure:', error);
      return 'Error: An error occurred while creating the item.';
    }
  }

  // findAll() {
  //   return `This action returns all items`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} item`;
  // }

  // update(id: number, updateItemDto: UpdateItemDto) {
  //   return `This action updates a #${id} item`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} item`;
  // }
}
