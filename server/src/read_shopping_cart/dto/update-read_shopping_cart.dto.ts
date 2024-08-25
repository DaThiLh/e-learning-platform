import { PartialType } from '@nestjs/swagger';
import { CreateReadShoppingCartDto } from './create-read_shopping_cart.dto';

export class UpdateReadShoppingCartDto extends PartialType(CreateReadShoppingCartDto) {}
