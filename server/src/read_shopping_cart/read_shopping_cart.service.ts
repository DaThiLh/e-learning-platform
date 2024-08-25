import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import json, { mapColumnsToKeys } from 'src/utils/helper';

@Injectable()
export class ReadShoppingCartService {
  constructor(private prismaService: PrismaService) {}

  async findOne(id: number) {
    const res: any[] = await this.prismaService
      .$queryRaw`CALL get_courses_in_cart(
      ${id});`;
    const shoppingCart = JSON.parse(json(res));
    console.log('Shopping cart:', JSON.stringify(shoppingCart, null, 2));

    const columns = [
      'id',
      'title',
      'subcategory_name',
      'instructor_name',
      'students_enrolled',
      'average_rating',
      'sale_price',
      'original_price',
    ];

    const newShoppingCart = mapColumnsToKeys(columns, shoppingCart);
    return newShoppingCart;
  }
}
