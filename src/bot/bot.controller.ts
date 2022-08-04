import { Controller, Get, Param, Query, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from 'src/dto/bot/createUser.dto';
import { UpdateCakeAmountDto } from 'src/dto/bot/updateCakeAmount.dto';
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
  async newUser(@Body() createuserDto: CreateUserDto) {
    return await this.prisma.insertUser(createuserDto);
  }

  @Post('/updateCakeAmount')
  async changeCakeAmount(@Body() updateCakeDto: UpdateCakeAmountDto) {
    console.log(updateCakeDto);
    return await this.prisma.updateCakeToken(updateCakeDto);
  }
}
