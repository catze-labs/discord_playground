import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { BotController } from './bot.controller';
import { BotService } from './bot.service';

@Module({
  controllers: [BotController],
  providers: [BotService, PrismaService],
})
export class BotModule {}
