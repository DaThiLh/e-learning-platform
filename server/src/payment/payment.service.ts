import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PaymentService {
  constructor(private prismaService: PrismaService) {}

  async create(createPaymentDto: CreatePaymentDto) {
    const res = await this.prismaService
      .$queryRaw`CALL create_payment_and_enrollment(
      60099,
      1
    );`;
    return res;
  }
}
