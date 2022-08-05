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
import { UpdateCakeAmountDto } from 'src/dto/bot/updateCakeAmount.dto';
import { PrismaService } from 'src/prisma.service';
import { BotService } from './bot.service';

@Controller('bot')
@ApiTags('For Discord Bot')
export class BotController {
  constructor(private prisma: PrismaService, private botService: BotService) {}

  @Get('/getUser')
  async getUser(@Query('idx') idx: string) {
    return await this.botService.findUserByIdx(Number(idx));
  }

  @Get('/getUserByUUID')
  async getUserByUUID(@Query('uuid') uuid: string) {
    return await this.botService.findUserByUUID(uuid);
  }

  @Post('/newUser')
  async newUser(@Body() createUserDto: CreateUserDto) {
    return await this.botService.createUser(createUserDto);
  }

  @Patch('/patchUser')
  async patchUser(@Body() patchUserDto: PatchUserDto) {
    return await this.botService.patchUser(patchUserDto);
  }

  @Post('/updateCakeAmount')
  async changeCakeAmount(@Body() updateCakeDto: UpdateCakeAmountDto) {
    console.log(updateCakeDto);
    return await this.botService.updateCake(updateCakeDto);
  }

  @Get('/getCakeRank')
  async getCakeRank(@Query('skip') skip: number, @Query('take') take: number) {
    return await this.botService.getCakeRank(skip, take);
  }

  @Get('/getMyCake')
  async getMyCake(@Query('uuid') uuid: string) {
    console.log(uuid);
    return await this.botService.getMyCake(uuid);
  }
}
