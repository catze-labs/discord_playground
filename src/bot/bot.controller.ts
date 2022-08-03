import { Controller, Get, Param, Query, Post, Body } from '@nestjs/common';
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

  @Get('/getUserByUUID')
  async getUserByUUID(@Query('uuid') uuid: string) {
    return await this.prisma.findUserByDiscordUUID(uuid);
  }

  @Post('/newUser')
  async newUser(@Body('uuid') uuid: string) {
    return await this.prisma.insertUser(uuid);
  }
}
