import { Module } from '@nestjs/common';
import { ReadShoppingCartService } from './read_shopping_cart.service';
import { ReadShoppingCartController } from './read_shopping_cart.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [ReadShoppingCartController],
  providers: [ReadShoppingCartService],
  imports: [PrismaModule],
})
export class ReadShoppingCartModule {}
