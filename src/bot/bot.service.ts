import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/dto/bot/createUser.dto';
import { UpdateCakeAmountDto } from 'src/dto/bot/updateCakeAmount.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class BotService {
  constructor(private prisma: PrismaService) {}

  async findUserByIdx(idx: number) {
    return await this.prisma.findUserByIdx(idx);
  }

  async findUserByUUID(uuid: string) {
    return await this.prisma.findUserByDiscordUUID(uuid);
  }

  async createUser(createUserDto: CreateUserDto) {
    return await this.prisma.insertUser(createUserDto);
  }

  async updateCakeToken(updateCakeAmountDto: UpdateCakeAmountDto) {
    return await this.prisma.updateCakeToken(updateCakeAmountDto);
  }
}
