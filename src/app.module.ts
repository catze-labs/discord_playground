import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BotModule } from './bot/bot.module';
import { ApiModule } from './api/api.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [AuthModule, BotModule, ApiModule, ScheduleModule.forRoot()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
