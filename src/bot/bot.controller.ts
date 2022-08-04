import { Controller, Get, Param, Query, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrismaService } from 'src/prisma.service';

@Controller('bot')
@ApiTags('For Discord Bot')
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

  @Post('/changeCakeAmount')
  async changeCakeAmount(
    @Body('uuid') uuid: string,
    @Body('amount') amount: number,
    @Body('reason') reason: string,
  ) {
    return await this.prisma.updateCakeToken(uuid, amount, reason);
  }
}
