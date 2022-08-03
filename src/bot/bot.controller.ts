import { Controller, Get, Param, Query, Post, Body } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Controller('bot')
export class BotController {
  constructor(private prisma: PrismaService) {}

  @Get('/getUser')
  async getUser(@Query('idx') idx: string) {
    return await this.prisma.findUserByIdx(Number(idx));
  }

  @Get('/getUserByUUID')
  async getUserByUUID(@Query('uuid') uuid: string) {
    return await this.prisma.findUserByDiscordUUID(uuid);
  }

  @Post('/newUser')
  async newUser(@Body('uuid') uuid: string) {
    return await this.prisma.insertUser(uuid);
  }
}
