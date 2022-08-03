import { Controller, Get, Param, Query } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Controller('bot')
export class BotController {
  constructor(private prisma: PrismaService) {}

  @Get('/getUser')
  async getUser(@Query('id') id: string) {
    console.log('getUser Controller Called');
    let idx: number = Number(id);
    return await this.prisma.findUserByIdx(idx);
  }
}
