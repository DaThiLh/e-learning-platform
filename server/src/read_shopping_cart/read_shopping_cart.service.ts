import { Injectable } from '@nestjs/common';
import { CreateReadShoppingCartDto } from './dto/create-read_shopping_cart.dto';
import { UpdateReadShoppingCartDto } from './dto/update-read_shopping_cart.dto';

@Injectable()
export class ReadShoppingCartService {
  create(createReadShoppingCartDto: CreateReadShoppingCartDto) {
    return 'This action adds a new readShoppingCart';
  }

  findAll() {
    return `This action returns all readShoppingCart`;
  }

  findOne(id: number) {
    return `This action returns a #${id} readShoppingCart`;
  }

  update(id: number, updateReadShoppingCartDto: UpdateReadShoppingCartDto) {
    return `This action updates a #${id} readShoppingCart`;
  }

  remove(id: number) {
    return `This action removes a #${id} readShoppingCart`;
  }
}
