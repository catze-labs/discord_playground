import {
  Controller,
  Get,
  Param,
  Query,
  Post,
  Body,
  Patch,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from 'src/dto/bot/createUser.dto';
import { PatchUserDto } from 'src/dto/bot/patchUser.dto';
import { SendCakeDto } from 'src/dto/bot/SendCake.dto';
import { UpdateCakeDto } from 'src/dto/bot/updateCake.dto';
import { PrismaService } from 'src/prisma.service';
import { BotService } from './bot.service';

@Controller('bot')
@ApiTags('For Discord Bot')
export class BotController {
  constructor(private prisma: PrismaService, private botService: BotService) {}


  @Post('/newUser')
  async newUser(@Body() createUserDto: CreateUserDto) {
    return await this.botService.createUser(createUserDto);
  }

  @Get('/getUser')
  async getUser(@Query('idx') idx: string) {
    return await this.botService.findUserByIdx(Number(idx));
  }

  @Get('/getUserByUUID')
  async getUserByUUID(@Query('uuid') uuid: string) {
    return await this.botService.findUserByUUID(uuid);
  }


  @Patch('/patchUser')
  async patchUser(@Body() patchUserDto: PatchUserDto) {
    return await this.botService.patchUser(patchUserDto);
  }

  @Get('/getCakeRank')
  async getCakeRank(@Query('skip') skip: number, @Query('take') take: number) {
    return await this.botService.getCakeRank(skip, take);
  }

  @Get('/getUserCake')
  async getMyCake(@Query('uuid') uuid: string) {
    return await this.botService.getUserCakeByUUID(uuid);
  }

  @Get('/getUserCakeHistoryList')
  async getUserCakeHistoryList(@Query('uuid') uuid: string, @Query('count') count : number) {
    return await this.botService.getUserCakeUpdateHistoryByUUID(uuid, Number(count))
  }

  @Post('/updateCake')
  async changeCakeAmount(@Body() updateCakeDto: UpdateCakeDto) {
    return await this.botService.updateCake(updateCakeDto);
  }

  @Post('/sendCake')
  async sendCake(@Body() sendCakeDto: SendCakeDto) {
    return await this.botService.sendCake(sendCakeDto)
  }
}
