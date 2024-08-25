import { Controller, Get, Param } from '@nestjs/common';
import { ReadShoppingCartService } from './read_shopping_cart.service';

@Controller('read-shopping-cart')
export class ReadShoppingCartController {
  constructor(
    private readonly readShoppingCartService: ReadShoppingCartService,
  ) {}

  @Get()
  findAll() {
    return this.readShoppingCartService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.readShoppingCartService.findOne(+id);
  }
}
